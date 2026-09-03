#!/usr/bin/env node
// bg gone, from the terminal. Same models as https://bentossell.com/bg-gone/, run locally on your CPU.
import { AutoModel, AutoProcessor, RawImage, env } from '@huggingface/transformers';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { existsSync, mkdirSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';

const { version } = createRequire(import.meta.url)('./package.json');

// transformers.js caches models inside its own node_modules folder by default, which npx
// throws away. Keep them somewhere that survives, and that every install shares.
const CACHE = process.env.BG_GONE_CACHE || join(homedir(), '.cache', 'bg-gone');
env.cacheDir = CACHE;

const HELP = `bg gone ${version} — remove image backgrounds locally. nothing is uploaded.

usage
  bg-gone <input...> [options]
  cat photo.jpg | bg-gone - > cutout.png

inputs
  files, folders (every image inside), http(s) urls, or - for stdin.

options
  -o, --out <path>     output file (one input) or folder (many inputs). - for stdout.
      --bg <colour>    solid background: white, black, any css colour name, or hex.
      --mask           write the matte as a greyscale png instead of a cutout.
      --suffix <text>  added to each output name. default -no-bg (or -mask).
      --model <name>   birefnet (default, best) or rmbg (smaller and faster, rougher edges).
      --dtype <name>   fp32 | fp16 | q8. default fp32 for birefnet, q8 for rmbg.
      --device <name>  cpu (default). cuda or dml if your onnxruntime build has it.
  -q, --quiet          only print errors.
  -h, --help           this.
  -v, --version        print the version.

output is png with alpha unless --bg is set, in which case the extension of -o decides.
the model downloads once (birefnet 224MB, rmbg 44MB) into ${CACHE}. set BG_GONE_CACHE to move it.
`;

// css colour names, for --bg.
const NAMES = Object.fromEntries(`aliceblue:f0f8ff antiquewhite:faebd7 aqua:00ffff aquamarine:7fffd4 azure:f0ffff beige:f5f5dc bisque:ffe4c4 black:000000 blanchedalmond:ffebcd blue:0000ff blueviolet:8a2be2 brown:a52a2a burlywood:deb887 cadetblue:5f9ea0 chartreuse:7fff00 chocolate:d2691e coral:ff7f50 cornflowerblue:6495ed cornsilk:fff8dc crimson:dc143c cyan:00ffff darkblue:00008b darkcyan:008b8b darkgoldenrod:b8860b darkgray:a9a9a9 darkgreen:006400 darkgrey:a9a9a9 darkkhaki:bdb76b darkmagenta:8b008b darkolivegreen:556b2f darkorange:ff8c00 darkorchid:9932cc darkred:8b0000 darksalmon:e9967a darkseagreen:8fbc8f darkslateblue:483d8b darkslategray:2f4f4f darkslategrey:2f4f4f darkturquoise:00ced1 darkviolet:9400d3 deeppink:ff1493 deepskyblue:00bfff dimgray:696969 dimgrey:696969 dodgerblue:1e90ff firebrick:b22222 floralwhite:fffaf0 forestgreen:228b22 fuchsia:ff00ff gainsboro:dcdcdc ghostwhite:f8f8ff gold:ffd700 goldenrod:daa520 gray:808080 green:008000 greenyellow:adff2f grey:808080 honeydew:f0fff0 hotpink:ff69b4 indianred:cd5c5c indigo:4b0082 ivory:fffff0 khaki:f0e68c lavender:e6e6fa lavenderblush:fff0f5 lawngreen:7cfc00 lemonchiffon:fffacd lightblue:add8e6 lightcoral:f08080 lightcyan:e0ffff lightgoldenrodyellow:fafad2 lightgray:d3d3d3 lightgreen:90ee90 lightgrey:d3d3d3 lightpink:ffb6c1 lightsalmon:ffa07a lightseagreen:20b2aa lightskyblue:87cefa lightslategray:778899 lightslategrey:778899 lightsteelblue:b0c4de lightyellow:ffffe0 lime:00ff00 limegreen:32cd32 linen:faf0e6 magenta:ff00ff maroon:800000 mediumaquamarine:66cdaa mediumblue:0000cd mediumorchid:ba55d3 mediumpurple:9370db mediumseagreen:3cb371 mediumslateblue:7b68ee mediumspringgreen:00fa9a mediumturquoise:48d1cc mediumvioletred:c71585 midnightblue:191970 mintcream:f5fffa mistyrose:ffe4e1 moccasin:ffe4b5 navajowhite:ffdead navy:000080 oldlace:fdf5e6 olive:808000 olivedrab:6b8e23 orange:ffa500 orangered:ff4500 orchid:da70d6 palegoldenrod:eee8aa palegreen:98fb98 paleturquoise:afeeee palevioletred:db7093 papayawhip:ffefd5 peachpuff:ffdab9 peru:cd853f pink:ffc0cb plum:dda0dd powderblue:b0e0e6 purple:800080 rebeccapurple:663399 red:ff0000 rosybrown:bc8f8f royalblue:4169e1 saddlebrown:8b4513 salmon:fa8072 sandybrown:f4a460 seagreen:2e8b57 seashell:fff5ee sienna:a0522d silver:c0c0c0 skyblue:87ceeb slateblue:6a5acd slategray:708090 slategrey:708090 snow:fffafa springgreen:00ff7f steelblue:4682b4 tan:d2b48c teal:008080 thistle:d8bfd8 tomato:ff6347 turquoise:40e0d0 violet:ee82ee wheat:f5deb3 white:ffffff whitesmoke:f5f5f5 yellow:ffff00 yellowgreen:9acd32`.split(' ').map(p => p.split(':')));

// ---- args -------------------------------------------------------------------------------------------------------

const args = process.argv.slice(2);
const flags = { out: null, bg: null, mask: false, suffix: null, model: 'birefnet', dtype: null, device: 'cpu', quiet: false };
const inputs = [];
const take = (name) => { if (!args.length) die(`--${name} needs a value`); return args.shift(); };
while (args.length) {
  const a = args.shift();
  if (a === '-') { inputs.push(a); continue; }
  if (a === '--') { inputs.push(...args.splice(0)); break; }
  if (a[0] !== '-') { inputs.push(a); continue; }
  const [k, inlineVal] = a.replace(/^--?/, '').split(/=(.*)/s);
  if (inlineVal !== undefined) args.unshift(inlineVal);
  switch (k) {
    case 'o': case 'out': flags.out = take(k); break;
    case 'bg': flags.bg = take(k); break;
    case 'mask': flags.mask = true; break;
    case 'suffix': flags.suffix = take(k); break;
    case 'model': flags.model = take(k); break;
    case 'dtype': flags.dtype = take(k); break;
    case 'device': flags.device = take(k); break;
    case 'q': case 'quiet': flags.quiet = true; break;
    case 'h': case 'help': process.stdout.write(HELP); process.exit(0);
    case 'v': case 'version': console.log(version); process.exit(0);
    default: die(`unknown option ${a}\n\n${HELP}`);
  }
}
if (!inputs.length) { process.stderr.write(HELP); process.exit(1); }
if (!['birefnet', 'rmbg'].includes(flags.model)) die(`--model must be birefnet or rmbg, not ${flags.model}`);
if (flags.mask && flags.bg) die('--mask and --bg do not make sense together');

const bgRgb = flags.bg ? parseColour(flags.bg) : null;
if (flags.bg && !bgRgb) die(`can't read colour "${flags.bg}". try white, black, a css colour name, or hex like #4f9cff`);
const suffix = flags.suffix ?? (flags.mask ? '-mask' : '-no-bg');

// Log lines go to stderr so `bg-gone - > out.png` stays a clean pipe.
const log = (...m) => { if (!flags.quiet) console.error(...m); };
function die(msg) { console.error(msg); process.exit(1); }

// ---- inputs -----------------------------------------------------------------------------------------------------

const IMG = /\.(jpe?g|png|webp|gif|avif|tiff?|bmp)$/i;
const jobs = [];
for (const raw of inputs) {
  if (raw === '-') { jobs.push({ src: '-', name: 'image' }); continue; }
  if (/^https?:\/\//i.test(raw)) {
    const name = decodeURIComponent(new URL(raw).pathname.split('/').pop() || 'image').replace(/\.[^.]+$/, '') || 'image';
    jobs.push({ src: raw, name, dir: process.cwd() });
    continue;
  }
  if (!existsSync(raw)) die(`no such file: ${raw}`);
  if (statSync(raw).isDirectory()) {
    const files = readdirSync(raw).filter(f => IMG.test(f)).sort();
    if (!files.length) log(`no images in ${raw}`);
    for (const f of files) jobs.push({ src: join(raw, f), name: basename(f, extname(f)), dir: raw });
    continue;
  }
  jobs.push({ src: raw, name: basename(raw, extname(raw)), dir: dirname(raw) });
}
if (!jobs.length) die('nothing to do');

// -o is a file when there is one job and it doesn't look like a folder; otherwise a folder.
const toStdout = flags.out === '-' || (jobs.length === 1 && jobs[0].src === '-' && !flags.out);
let outFile = null, outDir = null;
if (!toStdout && flags.out) {
  const looksLikeDir = flags.out.endsWith('/') || (existsSync(flags.out) && statSync(flags.out).isDirectory()) || !extname(flags.out);
  if (jobs.length === 1 && !looksLikeDir) outFile = flags.out;
  else { outDir = flags.out; mkdirSync(outDir, { recursive: true }); }
}
if (toStdout && jobs.length > 1) die('stdout can only take one image');
const destFor = (job) => outFile ?? join(outDir ?? job.dir ?? process.cwd(), `${job.name}${suffix}.png`);

// ---- model ------------------------------------------------------------------------------------------------------

const MODELS = {
  birefnet: {
    id: 'onnx-community/BiRefNet_lite-ONNX', dtype: 'fp32', size: '224MB',
    processor: {},
    run: async (model, processor, image) => {
      const { pixel_values } = await processor(image);
      const { output_image } = await model({ input_image: pixel_values });
      return output_image[0].sigmoid();
    },
  },
  rmbg: {
    id: 'briaai/RMBG-1.4', dtype: 'q8', size: '44MB',
    model: { config: { model_type: 'custom' } },
    processor: { config: { do_normalize: true, do_pad: false, do_rescale: true, do_resize: true, image_mean: [0.5, 0.5, 0.5], feature_extractor_type: 'ImageFeatureExtractor', image_std: [1, 1, 1], resample: 2, rescale_factor: 1 / 255, size: { width: 1024, height: 1024 } } },
    run: async (model, processor, image) => {
      const { pixel_values } = await processor(image);
      const { output } = await model({ input: pixel_values });
      return output[0];
    },
  },
};
const M = MODELS[flags.model];

let lastPct = -1;
const progress = (p) => {
  if (flags.quiet || p.status !== 'progress' || !p.file.endsWith('.onnx')) return;
  const pct = Math.floor(p.progress);
  if (pct === lastPct || (lastPct < 0 && pct === 100)) return; // a cached model reports 100% straight away
  lastPct = pct;
  process.stderr.write(`\rgetting the model (${M.size}, one time)… ${pct}%${pct === 100 ? '\n' : ''}`);
};

const t0 = Date.now();
const model = await AutoModel.from_pretrained(M.id, { ...M.model, dtype: flags.dtype ?? M.dtype, device: flags.device, progress_callback: progress });
const processor = await AutoProcessor.from_pretrained(M.id, M.processor);
log(`${flags.model} ready in ${secs(t0)}`);

// ---- work -------------------------------------------------------------------------------------------------------

let failed = 0;
for (const job of jobs) {
  const t = Date.now();
  try {
    const image = await (job.src === '-' ? RawImage.fromBlob(new Blob([readFileSync(0)])) : RawImage.read(job.src));
    const matte = await M.run(model, processor, image);
    const mask = await RawImage.fromTensor(matte.mul(255).to('uint8')).resize(image.width, image.height);
    let out = mask;
    if (!flags.mask) {
      out = image.rgba().putAlpha(mask);
      if (bgRgb) flatten(out.data, bgRgb);
    }
    if (toStdout) {
      process.stdout.write(await encode(out).png().toBuffer());
      log(`stdout  ${image.width}x${image.height}  ${secs(t)}`);
    } else {
      const dest = destFor(job);
      mkdirSync(dirname(resolve(dest)), { recursive: true });
      await encode(out).toFile(dest);
      log(`${dest}  ${image.width}x${image.height}  ${secs(t)}`);
    }
  } catch (e) {
    failed++;
    console.error(`failed: ${job.src === '-' ? 'stdin' : job.src}: ${e.message || e}`);
  }
}
process.exit(failed ? 1 : 0);

// ---- helpers ----------------------------------------------------------------------------------------------------

function secs(from) { return ((Date.now() - from) / 1000).toFixed(1) + 's'; }

// A sharp pipeline for the result: greyscale for masks, no alpha channel once flattened on a colour.
function encode(img) {
  const s = img.toSharp();
  return flags.mask ? s.toColourspace('b-w') : bgRgb ? s.removeAlpha() : s;
}

// Composite the rgba buffer over a solid colour, in place. Alpha becomes 255 everywhere.
function flatten(d, [r, g, b]) {
  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3] / 255, ia = 1 - a;
    d[i] = d[i] * a + r * ia; d[i + 1] = d[i + 1] * a + g * ia; d[i + 2] = d[i + 2] * a + b * ia; d[i + 3] = 255;
  }
}

// "#4f9cff", "4f9cff", "fff", "rgb(1,2,3)" or a css colour name → [r, g, b], else null.
function parseColour(str) {
  str = (str || '').trim().toLowerCase();
  if (NAMES[str]) str = NAMES[str];
  const hex = str.replace(/^#/, '');
  if (/^[0-9a-f]{3}$/.test(hex)) return [...hex].map(c => parseInt(c + c, 16));
  if (/^[0-9a-f]{6}$/.test(hex)) return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
  const m = str.match(/^rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/);
  if (m) return m.slice(1, 4).map(n => Math.min(255, +n));
  return null;
}

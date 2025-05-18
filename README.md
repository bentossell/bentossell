- founder & solo-gp ben’s bites
- i invest $100-200k into technical founders building technical tools like; supabase, flutterflow, etched, sf compute, factory, wordware, crewai, pika, solve intelligence, and others
- i write a newsletter where I show what tools im building with, interesting tools and content im seeing. 125k+ others love it
- twin dad (1 of each btw)
- built and sold the biggest no-code community, makerpad, to zapier (in 18 months)
- scouted for a16z and invested in; gamma, cosine, etc
- led the product hunt community & homepage, testing 1000s of products along the way
- lived in china when I was in uni

## Development and Deployment

This repo uses a staging branch to test changes before going live. Work on your feature branches, then merge into `staging` for testing.

### Workflow

1. Open a pull request into `staging` and ensure the **Test** workflow passes.
2. Once validated, open a pull request from `staging` to `main` for production deployment.
3. On merge to `main`, the **Deploy** workflow automatically publishes the site using GitHub Pages.

The test workflow runs `scripts/run_tests.sh`, which performs basic checks on `index.html`.

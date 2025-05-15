# Ben Tossell's Personal Website

This repository contains the code for Ben Tossell's personal website. It's a clean, simple website that showcases Ben's professional background, investments, and contact information.

## 📁 Project Structure

The website follows a simple, organized structure:

```
bentossell.com/
├── index.html                 # Main HTML file
├── assets/                    # All assets
│   ├── css/                   # CSS stylesheets
│   │   └── styles.css         # Main stylesheet
│   ├── images/                # Image files
│   │   ├── card.jpg           # Social media card image
│   │   ├── favicon.png        # Website favicon
│   │   └── apple-touch-icon.png # iOS home screen icon
│   └── js/                    # JavaScript files (if needed in the future)
└── README.md                  # This file
```

## 🔧 Dependencies

The website has minimal dependencies:

- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) from Google Fonts
- **Icons**: SVG icons embedded directly in the HTML

## 🖋️ Making Changes

### Updating Content

To update the website content:

1. Open `index.html` in a text editor
2. Find the section you want to update:
   - Personal information is at the top in the `<header>` section
   - Past experience is in the `<section class="past-experience">` section
   - Investments are in the `<section class="investments">` section
   - Social links are in the `<footer>` section
3. Make your changes
4. Save the file

### Updating Styles

To update the website styles:

1. Open `assets/css/styles.css` in a text editor
2. Find the section you want to update:
   - Colors and variables are at the top in the `:root` section
   - Typography styles are in the "TYPOGRAPHY" section
   - Layout styles are in the "LAYOUT" section
3. Make your changes
4. Save the file

### Adding Images

To add or update images:

1. Place your image files in the `assets/images/` directory
2. Reference them in your HTML using the relative path: `assets/images/your-image.jpg`

## 🚀 Deployment with GitHub Pages

To deploy this website using GitHub Pages:

1. Push your changes to the GitHub repository
2. Go to your repository on GitHub
3. Click on "Settings"
4. Scroll down to the "GitHub Pages" section
5. Under "Source", select the branch you want to deploy (usually `main` or `master`)
6. Select the root folder (`/`)
7. Click "Save"
8. Your site will be published at `https://yourusername.github.io/repository-name/`

### Using a Custom Domain

To use a custom domain (like bentossell.com):

1. In your GitHub repository settings, under GitHub Pages, enter your custom domain
2. Create a CNAME record with your DNS provider pointing to `yourusername.github.io`
3. Create a file named `CNAME` in the root of your repository containing your domain name

## 💻 Local Development

To test changes locally:

1. Clone the repository to your local machine
2. Open the project folder in your code editor
3. Open `index.html` in your web browser to see changes
4. Alternatively, use a local development server:
   - With Python: Run `python -m http.server` in the project directory
   - With Node.js: Install `http-server` with npm and run it

## 🎨 Customization Ideas

Some ideas for further customization:

- Add a dark mode toggle
- Include a blog section
- Add project showcases with images
- Create an interactive portfolio
- Add animations for a more dynamic feel

## 📞 Contact

If you have any questions or need help with the website, please contact Ben at ben.tossell@gmail.com.

## 📝 License

This project is available for personal use. Please contact Ben for any other usage.

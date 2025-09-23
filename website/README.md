# GeoGuesser Hacker Website

A modular, responsive website for GeoGuesser Hacker - the AI-powered Chrome extension for GeoGuessr players.

## 🌐 Live Site
- **Production:** `geoguesserhacker.com`
- **Privacy Policy:** `geoguesserhacker.com/privacy`

## 📁 Project Structure

```
website/
├── index.html          # Homepage with features, pricing preview, FAQ
├── pricing.html        # Detailed pricing page with comparison table
├── privacy.html        # Privacy policy page
├── contact.html        # Contact information and support
├── terms.html          # Terms of service
├── css/
│   └── main.css        # Shared styles and components
├── js/
│   └── main.js         # Interactive functionality (FAQ, install buttons)
├── images/
│   ├── logo.png        # GeoGuesser Hacker logo
│   └── favicon.png     # Site favicon (add this)
└── README.md           # This file
```

## 🎨 Design System

### Colors
- **Primary Green:** `#10b981`
- **Secondary Green:** `#059669`
- **Light Green:** `#d1fae5`
- **Accent Blue:** `#22d3ee`
- **Gray Scale:** `#f9fafb` to `#111827`

### Components
- **Header/Navigation:** Sticky header with logo and nav menu
- **Hero Sections:** Gradient backgrounds with CTAs
- **Feature Cards:** Hover effects and icons
- **Pricing Cards:** Comparison table and feature lists
- **FAQ Accordions:** Collapsible Q&A sections
- **Footer:** Multi-column layout with links

## 🛠 Customization Guide

### Updating Copy
All text content is in HTML files for easy editing:

1. **Headlines & Descriptions:** Edit directly in HTML
2. **Features:** Modify feature cards in `index.html`
3. **Pricing:** Update prices and features in `pricing.html`
4. **FAQ:** Add/edit questions in `index.html` and `pricing.html`

### Adding New Pages
1. Copy `contact.html` as a template
2. Update `<title>`, meta description, and content
3. Add navigation links in all page headers
4. Update footer links if needed

### Styling Changes
- **Colors:** Update CSS variables in `:root` selector in `main.css`
- **Fonts:** Change `font-family` in `body` selector
- **Layout:** Modify grid and flexbox properties
- **Animations:** Adjust transitions and hover effects

### Chrome Extension Integration
Update these elements when publishing:

1. **Extension ID:** Replace `your-extension-id` in `main.js`
2. **Chrome Web Store URL:** Update install button links
3. **Analytics:** Add your tracking code in script sections

## 📱 Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop breakpoints
- Touch-friendly navigation

### Interactive Elements
- FAQ accordion toggles
- Chrome extension install detection
- Smooth scrolling navigation
- Form validation (contact forms)

### SEO Optimized
- Semantic HTML structure
- Meta descriptions and titles
- Open Graph tags
- Fast loading times

## 🚀 Deployment

### Static Hosting Options
- **Netlify:** Connect GitHub repo for auto-deployment
- **Vercel:** Import project and deploy
- **GitHub Pages:** Enable in repository settings
- **Firebase Hosting:** Use Firebase CLI

### Domain Setup
1. Point `geoguesserhacker.com` to hosting provider
2. Set up `www` redirect to main domain
3. Configure SSL certificate
4. Set up privacy policy redirect: `/privacy` → `privacy.html`

### Pre-Launch Checklist
- [ ] Test all links and navigation
- [ ] Verify Chrome extension install buttons
- [ ] Test contact forms
- [ ] Check mobile responsiveness
- [ ] Validate HTML/CSS
- [ ] Test FAQ interactions
- [ ] Verify privacy policy compliance
- [ ] Set up analytics tracking

## 🔧 Technical Notes

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance
- Minimal external dependencies
- Optimized images (use WebP when possible)
- CSS minification recommended for production
- JavaScript is vanilla (no frameworks)

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatible
- High contrast color scheme

## 📞 Support

For website issues:
- **Email:** webmaster@geoguesserhacker.com
- **Repository:** Submit issues via GitHub

For extension support:
- **Email:** support@geoguesserhacker.com

## 📝 License

© 2025 GeoGuesser Hacker. All rights reserved.

#!/bin/bash

# GeoGuesser Hacker Website Deployment Script
# This script helps deploy the website to various hosting platforms

echo "🚀 GeoGuesser Hacker Website Deployment"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the website directory
if [ ! -f "index.html" ]; then
    print_error "This script must be run from the website directory"
    exit 1
fi

# Pre-deployment checks
echo ""
echo "Running pre-deployment checks..."

# Check for required files
required_files=("index.html" "pricing.html" "privacy.html" "contact.html" "terms.html" "css/main.css" "js/main.js")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    print_error "Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

print_status "All required files present"

# Check for images
if [ ! -f "images/logo.png" ]; then
    print_warning "Logo image not found (images/logo.png)"
fi

if [ ! -f "images/favicon.png" ]; then
    print_warning "Favicon not found (images/favicon.png)"
    print_info "Add a favicon.png to improve SEO"
fi

# Validate HTML (if html5validator is installed)
if command -v html5validator &> /dev/null; then
    print_info "Validating HTML..."
    if html5validator --root . --also-check-css; then
        print_status "HTML validation passed"
    else
        print_warning "HTML validation warnings found"
    fi
else
    print_info "Install html5validator for HTML validation: pip install html5validator"
fi

# Check for extension ID in JavaScript
if grep -q "your-extension-id" js/main.js; then
    print_warning "Update Chrome extension ID in js/main.js"
fi

# Deployment options
echo ""
echo "Select deployment method:"
echo "1) Netlify (via Netlify CLI)"
echo "2) Vercel (via Vercel CLI)"
echo "3) Firebase Hosting"
echo "4) GitHub Pages (git push)"
echo "5) Manual FTP upload preparation"
echo "6) Just run checks (no deployment)"

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        print_info "Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir .
            print_status "Deployed to Netlify"
        else
            print_error "Netlify CLI not found. Install with: npm install -g netlify-cli"
        fi
        ;;
    2)
        print_info "Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
            print_status "Deployed to Vercel"
        else
            print_error "Vercel CLI not found. Install with: npm install -g vercel"
        fi
        ;;
    3)
        print_info "Deploying to Firebase Hosting..."
        if command -v firebase &> /dev/null; then
            firebase deploy --only hosting
            print_status "Deployed to Firebase Hosting"
        else
            print_error "Firebase CLI not found. Install with: npm install -g firebase-tools"
        fi
        ;;
    4)
        print_info "Preparing for GitHub Pages..."
        if [ -d ".git" ]; then
            git add .
            git commit -m "Website update - $(date)"
            git push origin main
            print_status "Pushed to GitHub. Enable GitHub Pages in repository settings."
        else
            print_error "Not a git repository. Initialize git first."
        fi
        ;;
    5)
        print_info "Preparing files for manual FTP upload..."
        
        # Create a zip file for easy upload
        zip_name="geoguesserhacker-website-$(date +%Y%m%d-%H%M%S).zip"
        
        # Exclude development files
        zip -r "$zip_name" . -x "*.sh" "README.md" ".git/*" "*.zip"
        
        print_status "Created $zip_name for manual upload"
        print_info "Upload all files to your web server's public directory"
        print_info "Make sure .htaccess is uploaded for URL redirects"
        ;;
    6)
        print_status "Pre-deployment checks completed successfully"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Post-deployment reminders
echo ""
echo "📋 Post-deployment checklist:"
echo "- Test all pages and navigation"
echo "- Verify Chrome extension install buttons work"
echo "- Check privacy policy redirect (/privacy → privacy.html)"
echo "- Test FAQ interactions"
echo "- Verify mobile responsiveness"
echo "- Set up analytics (Google Analytics, etc.)"
echo "- Add favicon.png if missing"
echo "- Update Chrome extension ID in main.js"
echo "- Test contact forms if added"

print_status "Deployment process completed!"
echo ""
echo "🌐 Your website should now be live!"
echo ""

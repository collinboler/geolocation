// Domain Migration Test Script
// Run this in browser console at http://localhost:8080

console.log('🔄 Testing Domain Migration: geoguesserhacker.com → geoguessrhack.com');

// Test 1: Canonical tag
const canonical = document.querySelector('link[rel="canonical"]');
console.log('✅ Canonical:', canonical ? canonical.href : 'NOT FOUND');

// Test 2: Open Graph URL
const ogUrl = document.querySelector('meta[property="og:url"]');
console.log('✅ OG URL:', ogUrl ? ogUrl.content : 'NOT FOUND');

// Test 3: Twitter image
const twitterImage = document.querySelector('meta[name="twitter:image"]');
console.log('✅ Twitter Image:', twitterImage ? twitterImage.content : 'NOT FOUND');

// Test 4: Structured data
const structuredData = document.querySelector('script[type="application/ld+json"]');
if (structuredData) {
    try {
        const data = JSON.parse(structuredData.textContent);
        console.log('✅ Structured Data URL:', data.url);
    } catch (e) {
        console.error('❌ Invalid JSON-LD');
    }
}

// Test 5: Check for old domain references
const allMeta = document.querySelectorAll('meta');
const allLinks = document.querySelectorAll('link');
const allScripts = document.querySelectorAll('script');

let oldDomainFound = false;
const elements = [...allMeta, ...allLinks, ...allScripts];

elements.forEach(el => {
    const content = el.content || el.href || el.textContent || '';
    if (content.includes('geoguesserhacker.com')) {
        console.warn('⚠️ Old domain found:', el.outerHTML);
        oldDomainFound = true;
    }
});

if (!oldDomainFound) {
    console.log('✅ No old domain references found in meta tags!');
}

// Test 6: Check sitemap
fetch('/sitemap.xml')
    .then(response => response.text())
    .then(data => {
        if (data.includes('geoguessrhack.com')) {
            console.log('✅ Sitemap updated to new domain');
        } else {
            console.error('❌ Sitemap still has old domain');
        }
        
        if (data.includes('geoguesserhacker.com')) {
            console.warn('⚠️ Sitemap contains old domain references');
        }
    });

// Test 7: Check robots.txt
fetch('/robots.txt')
    .then(response => response.text())
    .then(data => {
        if (data.includes('geoguessrhack.com')) {
            console.log('✅ Robots.txt updated to new domain');
        } else {
            console.error('❌ Robots.txt still has old domain');
        }
    });

console.log('🎯 Domain migration test complete! Check results above.');



// Quick test script for website functionality
// Run in browser console (F12)

console.log('🧪 Testing GeoGuesser Hacker Website...');

// Test 1: Check all install buttons
const installButtons = document.querySelectorAll('.install-extension-btn');
console.log(`✅ Found ${installButtons.length} install buttons`);

installButtons.forEach((btn, i) => {
    const href = btn.getAttribute('href');
    const location = btn.dataset.location;
    console.log(`Button ${i+1}: ${location} -> ${href}`);
    
    if (!href.includes('chromewebstore.google.com')) {
        console.error(`❌ Button ${i+1} has wrong URL!`);
    }
});

// Test 2: Check meta tags
const title = document.querySelector('title').textContent;
const description = document.querySelector('meta[name="description"]').content;
console.log(`📝 Title: ${title}`);
console.log(`📝 Description: ${description}`);

// Test 3: Check structured data
const structuredData = document.querySelector('script[type="application/ld+json"]');
if (structuredData) {
    console.log('✅ Structured data found');
    try {
        const data = JSON.parse(structuredData.textContent);
        console.log(`📊 Schema type: ${data['@type']}`);
    } catch (e) {
        console.error('❌ Invalid JSON-LD');
    }
} else {
    console.error('❌ No structured data found');
}

// Test 4: Check analytics
if (typeof gtag !== 'undefined') {
    console.log('✅ Google Analytics loaded');
} else {
    console.log('⚠️ Google Analytics not loaded (expected with placeholder ID)');
}

// Test 5: Test button click animation
console.log('🎯 Testing button animations...');
const testButton = installButtons[0];
if (testButton) {
    testButton.click();
    console.log('✅ Button click test completed');
}

console.log('🎉 Website testing complete!');



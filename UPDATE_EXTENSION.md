# Update Chrome Extension for Hierarchical StreetCLIP

## ✅ Fixed: Content Security Policy Issue

The Chrome extension now supports the new **Hierarchical StreetCLIP service** on port 8082!

## 🔄 How to Update the Extension:

### Method 1: Reload Extension (Recommended)
1. Go to `chrome://extensions/`
2. Find "GeoGuesser Hacker" 
3. Click the **🔄 Reload** button
4. The extension will now work with both services!

### Method 2: Reinstall Extension
1. Go to `chrome://extensions/`
2. Remove the old extension
3. Click "Load unpacked"
4. Select the `extension/` folder
5. The updated extension will be installed

## 🎯 What's New in v0.4:

### ✅ **Hierarchical Service Support**
- **Port 8082**: New hierarchical StreetCLIP service (preferred)
- **Port 8081**: Original basic service (fallback)

### ✅ **Smart Service Detection**
- Automatically tries hierarchical service first
- Falls back to basic service if hierarchical unavailable
- No user configuration needed!

### ✅ **Enhanced UI**
- Shows which service is being used in console
- Displays hierarchy breadcrumb: `🏗️ Country → Region → City`
- Enhanced accuracy information

## 🚀 Testing:

1. **Start the Hierarchical Service:**
   ```bash
   cd backend/streetclip-service
   ./start_hierarchical.sh
   ```

2. **Use the Extension** - It should now work without CSP errors!

3. **Check Console Logs** - You'll see:
   ```
   🏗️ Using Hierarchical StreetCLIP - Enhanced accuracy
   ```

## 🐛 Troubleshooting:

**If you still see CSP errors:**
1. Make sure you **reloaded** the extension in Chrome
2. Check that the extension version shows **v0.4**
3. Try a hard refresh of any GeoGuessr tabs

**If connection fails:**
1. Ensure the hierarchical service is running on port 8082
2. Check the service logs for any errors
3. The extension will automatically fallback to port 8081 if needed

## 🎉 Success Indicators:

✅ No more "Refused to connect" errors  
✅ Console shows "Hierarchical StreetCLIP" messages  
✅ Location display includes hierarchy breadcrumb  
✅ Better prediction accuracy  

The extension now uses the **real power of StreetCLIP** with hierarchical prediction!




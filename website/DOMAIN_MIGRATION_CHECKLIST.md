# 🔄 Domain Migration Checklist: geoguesserhacker.com → geoguessrhack.com

## ✅ **COMPLETED** - Website Updates

- [x] **Canonical tags** updated to `geoguessrhack.com`
- [x] **Open Graph URLs** updated to `geoguessrhack.com`
- [x] **Twitter Card URLs** updated to `geoguessrhack.com`
- [x] **Structured data URLs** updated to `geoguessrhack.com`
- [x] **Sitemap.xml** updated with new domain
- [x] **Robots.txt** sitemap URL updated
- [x] **Apache .htaccess** redirects created
- [x] **Nginx config** redirects created

## 🚀 **NEXT STEPS** - Server & DNS Setup

### 1. **DNS Configuration**
```bash
# Add these DNS records for geoguessrhack.com:
A     @              YOUR_SERVER_IP
A     www            YOUR_SERVER_IP
CNAME www            geoguessrhack.com
```

### 2. **SSL Certificate**
```bash
# Get SSL for new domain
sudo certbot --nginx -d geoguessrhack.com -d www.geoguessrhack.com
```

### 3. **Deploy Redirect Rules**

**For Apache servers:**
- Upload `.htaccess` file to your web root
- Ensure `mod_rewrite` is enabled

**For Nginx servers:**
- Add `nginx-redirects.conf` to your Nginx config
- Test with: `sudo nginx -t`
- Reload: `sudo systemctl reload nginx`

### 4. **Google Search Console Setup**

1. **Add new property**: `geoguessrhack.com`
2. **Verify ownership** via DNS TXT record or HTML file
3. **Submit new sitemap**: `https://geoguessrhack.com/sitemap.xml`
4. **Keep old property** active during transition

### 5. **Test Redirects**

```bash
# Test these redirects work:
curl -I http://geoguesserhacker.com
curl -I https://geoguesserhacker.com
curl -I https://www.geoguesserhacker.com

# Should all return: HTTP/1.1 301 Moved Permanently
# Location: https://geoguessrhack.com/
```

### 6. **Analytics Update**

- **Google Analytics**: Add new property for `geoguessrhack.com`
- **Microsoft Clarity**: Update project domain
- **Any other tracking**: Update domain references

## 📊 **Timeline Expectations**

### **Week 1:**
- DNS propagation (24-48 hours)
- SSL certificates issued
- Redirects active and tested
- Search Console verified

### **Week 2-4:**
- Google begins indexing new domain
- Old domain traffic redirects to new domain
- Search rankings transfer gradually

### **Month 2-3:**
- Full SEO authority transferred
- New domain appears in search results
- Old domain references minimized

## 🚨 **Important Notes**

1. **Don't delete old domain** for at least 6 months
2. **Keep redirects active** permanently 
3. **Monitor Search Console** for both domains
4. **Update any external references** (social media, directories, etc.)

## 🔧 **Rollback Plan**

If issues arise:
1. Point DNS back to `geoguesserhacker.com`
2. Temporarily disable redirects
3. Update canonical tags back to original domain
4. Monitor traffic recovery

## ✅ **Success Indicators**

- [ ] All redirects return 301 status
- [ ] New domain loads correctly with HTTPS
- [ ] Search Console shows new domain indexing
- [ ] Analytics tracking works on new domain
- [ ] No broken links or missing resources

---

**🎯 Ready to deploy!** Your website is fully configured for the domain migration.

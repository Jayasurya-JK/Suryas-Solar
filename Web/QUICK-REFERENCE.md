# 🚀 Quick Reference Card - Surya's Solar

## Essential Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build + export
npm run deploy

# Clean build cache
npm run clean
```

## 📂 Important URLs

| Resource | URL |
|----------|-----|
| **Live Site** | https://suryassolar.com |
| **Netlify Site** | https://suryas-solar.netlify.app |
| **CMS Admin** | https://suryassolar.com/admin/ |
| **Netlify Dashboard** | https://app.netlify.com |
| **GitHub Repo** | https://github.com/YOUR_USERNAME/suryas-solar |

## 🎨 Key Files to Edit

| What to Change | File to Edit |
|----------------|--------------|
| **Brand Colors** | `tailwind.config.js` |
| **Contact Info** | `content/settings/general.md` or CMS |
| **Hero Slides** | CMS → Pages → Home Page |
| **Blog Posts** | CMS → Blog Posts |
| **Form Fields** | `src/components/BookingForm.jsx` |
| **Footer Links** | `src/components/Footer.jsx` |

## 🖼️ Image Specifications

| Image Type | Location | Size | Format |
|------------|----------|------|--------|
| **Hero Slides** | `/public/images/hero-slide-[1-3].jpg` | 1920x1080px | JPG/WebP |
| **Partner Logos** | `/public/images/partner-logos/*.png` | 200x100px | PNG |
| **Testimonials** | `/public/images/testimonials/*.jpg` | 200x200px | JPG |
| **OG Image** | `/public/images/og-home.jpg` | 1200x630px | JPG |
| **Installation** | `/public/images/default-installation.jpg` | 800x600px | JPG |

## 🔧 Environment Variables (Netlify)

Add in **Site Settings → Environment Variables**:

```bash
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...
SENDGRID_API_KEY=SG.your_api_key (optional)
ADMIN_EMAIL=info@suryassolar.com (optional)
```

## 📝 Content Editing Workflow

```
1. Login: https://suryassolar.com/admin/
2. Select: Pages → Home Page (or Blog Posts)
3. Edit: Make your changes
4. Save: Click "Publish"
5. Wait: 2-3 minutes for rebuild
6. Done: Changes are live!
```

## 🔍 SEO Checklist

- [ ] Submit sitemap: https://suryassolar.com/sitemap.xml
- [ ] Google Search Console verification
- [ ] Google Business Profile setup
- [ ] Social media Open Graph testing
- [ ] Mobile-friendly test
- [ ] Lighthouse audit (target 90+)

## 📞 Quick Contact Update

To update contact info quickly:

**Option 1 - Via CMS:**
1. Login to `/admin/`
2. Settings → General Settings
3. Update phone, email, address
4. Publish

**Option 2 - Via File:**
Edit: `content/settings/general.md`

## 🐛 Common Issues & Fixes

| Issue | Quick Fix |
|-------|-----------|
| **Build fails** | Run `npm run clean` then `npm run deploy` |
| **CMS won't load** | Enable Identity + Git Gateway in Netlify |
| **Forms not working** | Check `data-netlify="true"` in form tag |
| **Images not showing** | Check file paths start with `/images/` |
| **DNS not working** | Wait 24-48 hours, check nameservers |

## 🚨 Emergency Contacts

| Service | Support |
|---------|---------|
| **Netlify** | https://answers.netlify.com |
| **Hostinger** | https://www.hostinger.com/contact |
| **GitHub** | https://support.github.com |

## 📊 Performance Targets

- Lighthouse Performance: **95+**
- Accessibility: **100**
- Best Practices: **100**
- SEO: **100**
- Page Load Time: **< 3 seconds**

## 🔐 Login Credentials

**Netlify CMS**:
- URL: `https://suryassolar.com/admin/`
- Auth: Netlify Identity (email + password)
- Invited users only

**Netlify Dashboard**:
- URL: `https://app.netlify.com`
- Auth: GitHub login

## 📱 Testing Checklist

- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile (iOS Safari, Android Chrome)
- [ ] Tablet (iPad, Android tablet)
- [ ] Form submission works
- [ ] Hero carousel auto-plays
- [ ] Navigation menu (mobile hamburger)
- [ ] All links work
- [ ] Images load correctly

## 🎯 Next Steps After Deployment

1. **Week 1**:
   - Monitor form submissions
   - Test on real devices
   - Submit to Google Search Console

2. **Week 2**:
   - Publish 2 blog posts
   - Share on social media
   - Collect testimonials

3. **Month 1**:
   - Monitor analytics
   - A/B test CTAs
   - Optimize based on data

## 📚 Documentation Quick Links

| Document | Purpose |
|----------|---------|
| **README.md** | Technical overview & setup |
| **DEPLOYMENT.md** | Step-by-step deployment guide |
| **CHECKLIST.md** | Asset replacement checklist |
| **PROJECT-SUMMARY.md** | Complete project overview |

## 💡 Pro Tips

- **Bulk edits**: Use CMS for content, code for structure
- **Image optimization**: Use TinyPNG before uploading
- **Testing**: Always test form before marking complete
- **Backups**: Netlify auto-backs up; Git = version control
- **Updates**: Edit via CMS = automatic rebuild + deploy

---

**Last Updated**: November 28, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅

For detailed instructions, see README.md or DEPLOYMENT.md

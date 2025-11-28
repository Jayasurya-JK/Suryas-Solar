# 🚀 Complete Deployment Guide - Surya's Solar

This guide provides step-by-step instructions for deploying the Surya's Solar website from development to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Replaced placeholder images (see `CHECKLIST.md`)
- [ ] Updated contact information in `/content/settings/general.md`
- [ ] Customized brand colors in `tailwind.config.js`
- [ ] Tested the site locally with `npm run dev`
- [ ] Created a GitHub account
- [ ] Created a Netlify account
- [ ] Access to Hostinger domain control panel

## Part 1: GitHub Repository Setup

### Step 1: Initialize Git

```bash
cd /Users/jj29/Personal/Web
git init
```

### Step 2: Create `.gitignore` (Already exists)

Verify `.gitignore` includes:
```
/node_modules
/.next
/out
.env*.local
.env
```

### Step 3: Initial Commit

```bash
git add .
git commit -m "Initial commit: Surya's Solar website"
```

### Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `suryas-solar`
3. Description: "Surya's Solar - Static website with Netlify CMS"
4. Visibility: Private or Public (your choice)
5. **Do NOT** initialize with README, .gitignore, or license (already exists)
6. Click "Create repository"

### Step 5: Push to GitHub

Copy the commands from GitHub (replace with your username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/suryas-solar.git
git branch -M main
git push -u origin main
```

✅ **Checkpoint**: Visit your GitHub repository and verify all files are uploaded.

---

## Part 2: Netlify Deployment

### Step 1: Sign Up for Netlify

1. Go to https://app.netlify.com/signup
2. Click "Sign up with GitHub"
3. Authorize Netlify to access your GitHub account

### Step 2: Create New Site

1. Click "Add new site" → "Import an existing project"
2. Click "GitHub" (should already be connected)
3. Search for and select `suryas-solar` repository
4. Click on the repository to proceed

### Step 3: Configure Build Settings

**Owner**: Your team name
**Branch to deploy**: `main`
**Build command**: 
```
npm run build && npm run export
```
**Publish directory**: 
```
out
```

**Advanced build settings** (click "Show advanced"):
- Add environment variable:
  - Key: `NODE_VERSION`
  - Value: `18`

### Step 4: Deploy Site

1. Click "Deploy site"
2. Wait 2-3 minutes for initial build
3. You'll get a random URL like `https://random-name-123456.netlify.app`

✅ **Checkpoint**: Visit the Netlify URL and verify the site loads correctly.

### Step 5: Configure Site Name (Optional)

1. Go to "Site settings" → "General"
2. Under "Site details", click "Change site name"
3. Enter: `suryas-solar` (or available name)
4. Save
5. Your site is now: `https://suryas-solar.netlify.app`

---

## Part 3: Netlify CMS Setup

### Step 1: Enable Netlify Identity

1. In your Netlify site dashboard, click "Identity" in the top menu
2. Click "Enable Identity"
3. Wait for it to activate

### Step 2: Configure Registration Settings

1. In Identity settings, go to "Settings and usage"
2. Under "Registration preferences", select:
   - **Registration**: Invite only (recommended for security)
3. Save

### Step 3: Enable Git Gateway

1. Scroll down to "Services"
2. Click "Enable Git Gateway"
3. This allows CMS to commit changes to GitHub

### Step 4: Invite Users

1. Click "Identity" → "Invite users"
2. Enter email addresses (yours and any editors)
3. Click "Send"
4. Check email and click "Accept invitation"
5. Create a password

### Step 5: Access CMS

1. Go to `https://suryas-solar.netlify.app/admin/`
2. Click "Login with Netlify Identity"
3. Enter your credentials
4. You should see the CMS dashboard!

✅ **Checkpoint**: Try editing the home page content and publish. Site should rebuild automatically.

---

## Part 4: Environment Variables & Webhooks

### Step 1: Get Zapier Webhook URL

1. Sign up at https://zapier.com (free plan available)
2. Click "Create Zap"
3. Trigger: Search "Webhooks by Zapier"
4. Event: "Catch Hook"
5. Click "Continue"
6. **Copy the webhook URL** (e.g., `https://hooks.zapier.com/hooks/catch/123456/abcdef/`)
7. Don't finish the Zap yet (we'll test first)

### Step 2: Add to Netlify

1. In Netlify dashboard, go to "Site settings" → "Environment variables"
2. Click "Add a variable" → "Add a single variable"
3. Key: `ZAPIER_WEBHOOK_URL`
4. Value: Paste the webhook URL from Zapier
5. Click "Create variable"

### Step 3: Optional Email Configuration

If you want email notifications:

1. Sign up for SendGrid: https://signup.sendgrid.com/
2. Create API key: https://app.sendgrid.com/settings/api_keys
3. Add to Netlify environment variables:
   - `SENDGRID_API_KEY`: Your API key
   - `ADMIN_EMAIL`: `info@suryassolar.com`

### Step 4: Redeploy Site

After adding environment variables:

1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait for rebuild

### Step 5: Test Form Submission

1. Visit your site
2. Fill out the booking form
3. Submit
4. Check Netlify dashboard → "Forms" → You should see the submission
5. Check Zapier dashboard → You should see the webhook received

✅ **Checkpoint**: Form submissions working and webhook triggered.

---

## Part 5: Custom Domain Setup (suryassolar.com)

### Method A: Use Netlify DNS (Recommended - Easier)

#### Step 1: Add Domain in Netlify

1. Go to "Domain settings"
2. Click "Add custom domain"
3. Enter: `suryassolar.com`
4. Click "Verify" → "Add domain"
5. Netlify will show: "Check DNS configuration"

#### Step 2: Get Netlify Nameservers

Netlify will display nameservers like:
```
dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net
```
**Copy these** - you'll need them next.

#### Step 3: Update Hostinger Nameservers

1. Login to Hostinger: https://hpanel.hostinger.com/
2. Go to "Domains"
3. Click on `suryassolar.com`
4. Click "DNS / Nameservers" in the sidebar
5. Click "Change Nameservers"
6. Select "Custom Nameservers"
7. Enter the 4 Netlify nameservers (from Step 2)
8. Click "Save changes"

#### Step 4: Wait for DNS Propagation

- **Time**: 2-24 hours (usually 2-4 hours)
- **Check status**: https://dnschecker.org (enter `suryassolar.com`)
- **Expected result**: All locations should point to Netlify

#### Step 5: Enable HTTPS

Once DNS propagates:

1. Netlify will automatically provision SSL certificate
2. Go to "Domain settings" → "HTTPS"
3. Verify "SSL/TLS certificate" is active
4. Enable "Force HTTPS" (redirect HTTP to HTTPS)

---

### Method B: Keep Hostinger DNS (Advanced - Use A/CNAME Records)

If you need to keep Hostinger as DNS provider:

#### Step 1: Get Netlify IP

1. In Netlify "Domain settings"
2. Note the load balancer IP: `75.2.60.5`

#### Step 2: Update Hostinger DNS Records

1. Login to Hostinger
2. Go to "Domains" → `suryassolar.com` → "DNS / Name Server"
3. Keep "Hostinger nameservers"
4. Click "Manage DNS records"

**Add/Update these records:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 75.2.60.5 | 3600 |
| CNAME | www | suryas-solar.netlify.app | 3600 |

**Note**: If Hostinger supports ALIAS or ANAME records, use:
| Type | Name | Value | TTL |
|------|------|-------|-----|
| ALIAS | @ | suryas-solar.netlify.app | 3600 |

5. Save changes

#### Step 3: Configure in Netlify

1. Go to "Domain settings" → "Add custom domain"
2. Add: `suryassolar.com`
3. Add: `www.suryassolar.com`
4. Netlify will verify DNS and enable SSL

---

## Part 6: Final Configuration

### Step 1: Netlify Forms Settings

1. Go to "Forms" tab
2. Enable form notifications:
   - "Notifications" → "Add notification"
   - Email: Enter admin email
   - Save

### Step 2: Complete Zapier Workflow

1. Go back to your Zapier dashboard
2. Continue the Zap from webhook
3. Add Action: Choose "Google Sheets" or "Gmail" or your CRM
4. Map fields from webhook to your action
5. Test and turn on Zap

**Example Google Sheets Mapping:**
- Column A: Name → `formData.name`
- Column B: Mobile → `formData.mobile`
- Column C: Email → `formData.email`
- Column D: Pincode → `formData.pincode`
- Column E: Date → `formData.visitDate`
- Column F: Timestamp → `timestamp`

### Step 3: Set Up Google Search Console

1. Go to https://search.google.com/search-console
2. Add property: `suryassolar.com`
3. Verify ownership (DNS TXT record or Netlify meta tag)
4. Submit sitemap: `https://suryassolar.com/sitemap.xml`

### Step 4: Google Business Profile

1. Visit https://www.google.com/business/
2. Add or claim your business
3. Add website URL: `https://suryassolar.com`
4. Complete profile with photos, hours, etc.

### Step 5: Set Up Analytics (Optional)

**Google Analytics 4:**
1. Create GA4 property: https://analytics.google.com
2. Get Measurement ID (e.g., `G-XXXXXXXXXX`)
3. Add to Netlify env vars: `NEXT_PUBLIC_GA_ID`
4. Rebuild site

---

## Part 7: Post-Launch Checklist

### Functionality Tests

- [ ] Homepage loads on desktop and mobile
- [ ] Hero carousel auto-plays and is swipeable on mobile
- [ ] Navigation menu works (mobile hamburger menu)
- [ ] Booking form validates correctly
- [ ] Form submission shows success modal
- [ ] Form data appears in Netlify Forms dashboard
- [ ] Zapier webhook receives data
- [ ] All internal links work (#booking, #contact, etc.)
- [ ] Social media links are correct

### SEO Tests

- [ ] Open `https://suryassolar.com` and verify:
  - [ ] Page title appears correctly
  - [ ] Meta description is present
  - [ ] Favicon displays
- [ ] Share on Facebook/LinkedIn - verify Open Graph image
- [ ] Test on mobile devices (real devices, not just browser resize)
- [ ] Run Lighthouse audit (Chrome DevTools)
  - Target: 90+ on all metrics
- [ ] Test page speed: https://pagespeed.web.dev/

### CMS Tests

- [ ] Login to `/admin/` successfully
- [ ] Edit a hero slide and publish
- [ ] Create a new blog post and publish
- [ ] Verify changes appear on live site (after rebuild)
- [ ] Test image upload in CMS

### DNS Tests

```bash
# Verify DNS is pointing correctly
dig suryassolar.com
nslookup suryassolar.com

# Test HTTPS
curl -I https://suryassolar.com
```

Expected: Should return 200 OK and redirect HTTP to HTTPS

---

## Part 8: Maintenance & Updates

### Content Updates (Non-Technical)

Editors can update content via CMS:

1. Go to `https://suryassolar.com/admin/`
2. Login
3. Edit content
4. Click "Publish"
5. Netlify auto-rebuilds (2-3 minutes)
6. Changes live!

### Code Updates (Technical)

For developers making code changes:

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push origin main

# Netlify auto-deploys from main branch
```

### Monitoring

- **Uptime**: Netlify has 99.99% uptime SLA
- **Analytics**: Check Netlify Analytics or Google Analytics
- **Forms**: Review submissions in Netlify dashboard weekly
- **Errors**: Check "Deploys" → "Deploy log" if build fails

---

## 🆘 Troubleshooting Common Issues

### Issue: Build Fails

**Solution:**
1. Check "Deploys" → "Deploy log" for errors
2. Verify `package.json` dependencies
3. Ensure Node version is 18+ (check `netlify.toml`)
4. Try rebuilding: "Trigger deploy" → "Clear cache and deploy site"

### Issue: CMS Not Loading

**Solution:**
1. Ensure Identity is enabled
2. Check if logged in at `/admin/`
3. Clear browser cache and cookies
4. Try incognito mode
5. Check browser console for errors

### Issue: Forms Not Working

**Solution:**
1. Verify `data-netlify="true"` in form element
2. Check "Forms" tab in Netlify - are forms detected?
3. Test with simplified form (just name and email)
4. Check environment variables for webhook URL
5. Review function logs in Netlify dashboard

### Issue: Domain Not Working

**Solution:**
1. Wait 24-48 hours for DNS propagation
2. Check DNS: `dig suryassolar.com`
3. Verify nameservers or A records in Hostinger
4. Check Netlify "Domain settings" for errors
5. Contact Netlify support if needed

### Issue: Slow Loading

**Solution:**
1. Optimize images (compress, WebP format)
2. Check Lighthouse report for recommendations
3. Ensure lazy loading is working
4. Verify static export (`out/` folder)

---

## 📊 Success Metrics

After deployment, monitor:

- **Lighthouse Score**: Target 90+ on all metrics
- **Form Submissions**: Track conversion rate
- **Page Load Time**: < 3 seconds on mobile
- **SEO Rankings**: Track keyword positions
- **Uptime**: Should be 99.9%+

---

## 🎉 You're Live!

Congratulations! Your Surya's Solar website is now live at:

**🌐 https://suryassolar.com**

**📝 CMS**: https://suryassolar.com/admin/

**📊 Dashboard**: https://app.netlify.com

### Next Steps:

1. Share the website with your team
2. Train editors on using the CMS
3. Monitor form submissions
4. Start blogging to improve SEO
5. Share on social media
6. Submit to local directories

---

## 📞 Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Support**: https://answers.netlify.com
- **Next.js Docs**: https://nextjs.org/docs
- **Hostinger Support**: https://www.hostinger.com/contact

---

**Last Updated**: November 28, 2025

**Deployed By**: [Your Name]

**Project Version**: 1.0.0

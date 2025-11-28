# 🚀 Local Development Plan - Surya's Solar

**Date**: November 28, 2025  
**Objective**: Run the application locally to view and test the UI

---

## 📋 Pre-Flight Checklist

### System Requirements
- [x] **Node.js**: Version 18+ required (configured in netlify.toml)
- [x] **npm**: Comes with Node.js
- [x] **Git**: For version control
- [x] **Code Editor**: VS Code (already in use)
- [x] **Browser**: Chrome/Firefox/Edge for testing

### Project Status
- [x] **Source Code**: Complete (8 components, 3 pages)
- [x] **Configuration**: All config files present
- [x] **Documentation**: Comprehensive (9 documentation files)
- [x] **Dependencies**: Listed in package.json
- [ ] **node_modules**: Not installed yet (needs `npm install`)

---

## 🎯 Execution Plan

### Phase 1: Environment Setup ✅

**Step 1.1: Verify Node.js Installation**
```bash
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
```

**Expected Output**:
```
v18.x.x (or higher)
9.x.x (or higher)
```

**If Not Installed**:
- Download from [nodejs.org](https://nodejs.org/)
- Install LTS version (18.x or 20.x)
- Restart terminal

---

### Phase 2: Install Dependencies 📦

**Step 2.1: Navigate to Project Directory**
```bash
cd "c:\Website Projects\Suryas-Solar\Web"
```

**Step 2.2: Install NPM Packages**
```bash
npm install
```

**What This Does**:
- Installs all dependencies from `package.json`
- Creates `node_modules/` folder (~200-300 MB)
- Generates `package-lock.json` (if not exists)

**Expected Dependencies** (from package.json):
```json
{
  "dependencies": {
    "next": "^14.0.4",           // Next.js framework
    "react": "^18.2.0",          // React library
    "react-dom": "^18.2.0",      // React DOM renderer
    "swiper": "^11.0.5",         // Carousel library
    "gray-matter": "^4.0.3"      // Markdown parser
  },
  "devDependencies": {
    "@tailwindcss/forms": "^0.5.7",      // Form styling
    "autoprefixer": "^10.4.16",          // CSS vendor prefixes
    "postcss": "^8.4.32",                // CSS processing
    "tailwindcss": "^3.4.0",             // Tailwind CSS
    "eslint": "^8.56.0",                 // Linting
    "eslint-config-next": "^14.0.4"      // Next.js ESLint config
  }
}
```

**Estimated Time**: 2-5 minutes (depending on internet speed)

**Troubleshooting**:
- If `npm install` fails, try: `npm install --legacy-peer-deps`
- If still fails, delete `package-lock.json` and retry

---

### Phase 3: Start Development Server 🚀

**Step 3.1: Run Development Server**
```bash
npm run dev
```

**What This Does**:
- Starts Next.js development server
- Compiles React components
- Watches for file changes (hot reload)
- Serves site at `http://localhost:3000`

**Expected Output**:
```
> suryas-solar@1.0.0 dev
> next dev

- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully in XXX ms
- wait compiling...
- event compiled successfully in XXX ms
```

**Server Status**:
- ✅ Server running on port 3000
- ✅ Hot reload enabled
- ✅ Fast refresh active

---

### Phase 4: View UI in Browser 🌐

**Step 4.1: Open Browser**
```
http://localhost:3000
```

**What You Should See**:

1. **Header**
   - Surya's Solar logo
   - Navigation menu (Home, About, Services, Blog, Contact)
   - "Book Free Home Visit" CTA button
   - Mobile hamburger menu (on small screens)

2. **Hero Carousel**
   - 3 auto-playing slides
   - Navigation arrows
   - Pagination dots
   - Swipe support on mobile

3. **Stats Strip**
   - 100 kW+ Installations
   - 50+ Happy Homes
   - 25 Years Panel Warranty

4. **Booking Form**
   - Name, mobile, email fields
   - Pincode, visit date
   - Roof type dropdown
   - Electricity bill radio buttons
   - Message textarea
   - Consent checkbox
   - Submit button

5. **Timeline Section**
   - 6-step installation process
   - Icons and descriptions

6. **Partners Section**
   - 5 partner logos
   - Hover effects

7. **Testimonials**
   - 4 customer reviews
   - Carousel on mobile, grid on desktop

8. **Footer**
   - Company info
   - Quick links
   - Contact details
   - Social media icons

---

### Phase 5: Testing & Validation ✅

**Step 5.1: Responsive Testing**

**Mobile** (320px - 768px):
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test iPhone SE (375px)
- [ ] Test iPhone 12 Pro (390px)
- [ ] Test Samsung Galaxy S20 (360px)

**Tablet** (768px - 1024px):
- [ ] Test iPad (768px)
- [ ] Test iPad Pro (1024px)

**Desktop** (1024px+):
- [ ] Test 1280px
- [ ] Test 1920px (Full HD)

**Step 5.2: Functionality Testing**

**Navigation**:
- [ ] Click "Home" → Scrolls to top
- [ ] Click "About" → Scrolls to about section
- [ ] Click "Services" → Scrolls to services
- [ ] Click "Contact" → Scrolls to booking form
- [ ] Mobile menu opens/closes

**Hero Carousel**:
- [ ] Auto-plays (5-second intervals)
- [ ] Pauses on hover
- [ ] Previous/Next arrows work
- [ ] Pagination dots work
- [ ] Swipe works on mobile

**Booking Form**:
- [ ] Name validation (required)
- [ ] Mobile validation (10 digits)
- [ ] Email validation (format)
- [ ] Pincode validation (6 digits)
- [ ] Roof type dropdown works
- [ ] Electricity bill radio buttons work
- [ ] Consent checkbox required
- [ ] Submit button disabled until valid
- [ ] Success modal appears (note: actual submission won't work locally without Netlify)

**Testimonials**:
- [ ] Desktop: 4-column grid
- [ ] Mobile: Swipeable carousel

**Step 5.3: Performance Testing**

**Lighthouse Audit**:
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Desktop" or "Mobile"
4. Click "Generate report"

**Expected Scores**:
- Performance: 90+ (may be lower in dev mode)
- Accessibility: 100
- Best Practices: 95+
- SEO: 100

**Step 5.4: Console Errors**

**Check Console**:
- [ ] Open DevTools Console (F12)
- [ ] Look for errors (red text)
- [ ] Warnings are okay (yellow text)

**Expected**:
- ✅ No critical errors
- ⚠️ Some warnings about missing images (placeholders)

---

## 🎨 UI Components to Review

### 1. Header Component
**Location**: Top of page, sticky on scroll

**Elements to Check**:
- [ ] Logo displays correctly
- [ ] Navigation links visible
- [ ] CTA button styled correctly
- [ ] Mobile menu icon appears on small screens
- [ ] Sticky behavior works on scroll

**Styling**:
- Background: White with shadow on scroll
- Text: Dark gray
- CTA: Primary blue with hover effect

---

### 2. Hero Carousel
**Location**: Below header, full-width

**Elements to Check**:
- [ ] 3 slides present
- [ ] Images load (or placeholder if missing)
- [ ] Headlines readable
- [ ] Subheadings visible
- [ ] CTA buttons styled
- [ ] Auto-play works
- [ ] Navigation arrows visible
- [ ] Pagination dots at bottom

**Styling**:
- Height: 500px (mobile) to 600px (desktop)
- Overlay: Dark gradient for text readability
- Text: White, centered

---

### 3. Stats Strip
**Location**: Below hero carousel

**Elements to Check**:
- [ ] 3 stat cards displayed
- [ ] Icons visible
- [ ] Numbers large and bold
- [ ] Labels readable

**Styling**:
- Background: Light gray or white
- Cards: Centered, responsive grid
- Icons: Primary blue

---

### 4. Booking Form
**Location**: Mid-page, prominent section

**Elements to Check**:
- [ ] All 8 fields present
- [ ] Labels clear
- [ ] Input fields styled
- [ ] Dropdown works
- [ ] Radio buttons styled (chip style)
- [ ] Checkbox styled
- [ ] Submit button prominent
- [ ] Validation messages appear on blur
- [ ] Error states (red border)

**Styling**:
- Background: White card with shadow
- Inputs: Rounded borders, focus states
- Button: Accent orange, full-width on mobile
- Errors: Red text below fields

---

### 5. Timeline Steps
**Location**: Below booking form

**Elements to Check**:
- [ ] 6 steps displayed
- [ ] Icons for each step
- [ ] Vertical line connecting steps
- [ ] Descriptions readable
- [ ] Responsive layout

**Styling**:
- Background: Light background
- Icons: Circular, primary blue
- Line: Vertical connector
- Text: Dark gray

---

### 6. Partners Section
**Location**: Below timeline

**Elements to Check**:
- [ ] 5 partner logos displayed
- [ ] Grid layout (5 columns on desktop)
- [ ] Responsive (2-3 columns on mobile)
- [ ] Hover effects work (grayscale to color)

**Styling**:
- Background: White
- Logos: Grayscale by default, color on hover
- Spacing: Even gaps

---

### 7. Testimonials
**Location**: Below partners

**Elements to Check**:
- [ ] 4 testimonials displayed
- [ ] Customer photos (or placeholders)
- [ ] 5-star ratings
- [ ] Review text readable
- [ ] Names and locations visible
- [ ] Desktop: 4-column grid
- [ ] Mobile: Swipeable carousel

**Styling**:
- Background: Light gray
- Cards: White with shadow
- Stars: Yellow/gold
- Photos: Circular, 80px

---

### 8. Footer
**Location**: Bottom of page

**Elements to Check**:
- [ ] 4 columns (desktop) / stacked (mobile)
- [ ] Company info
- [ ] Quick links (clickable)
- [ ] Services list
- [ ] Contact details (phone, email, address)
- [ ] Social media icons
- [ ] Copyright notice

**Styling**:
- Background: Dark (primary blue or dark gray)
- Text: White
- Links: Hover effect (underline or color change)
- Icons: Social media icons styled

---

## 🐛 Common Issues & Solutions

### Issue 1: Port 3000 Already in Use
**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Option 1: Kill process on port 3000
npx kill-port 3000

# Option 2: Use different port
npm run dev -- -p 3001
```

---

### Issue 2: Module Not Found
**Error**: `Cannot find module 'next'` or similar

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Issue 3: Images Not Loading
**Error**: Broken image icons

**Cause**: Placeholder images not replaced yet

**Solution**:
- This is expected (see CHECKLIST.md)
- Images will show as broken until real images are added
- Doesn't affect functionality testing

---

### Issue 4: Tailwind Styles Not Applying
**Error**: Unstyled components

**Solution**:
```bash
# Rebuild Tailwind
npm run dev
# Hard refresh browser (Ctrl+Shift+R)
```

---

### Issue 5: Form Submission Fails
**Error**: Form doesn't submit or shows error

**Cause**: Netlify Forms only work on deployed site

**Solution**:
- This is expected in local development
- Form validation still works
- Test submission after deploying to Netlify

---

## 📊 Development Workflow

### Making Changes

**1. Edit Component**:
```bash
# Example: Edit header
code src/components/Header.jsx
```

**2. Save File**:
- Next.js auto-detects changes
- Browser auto-refreshes (hot reload)
- No need to restart server

**3. View Changes**:
- Refresh browser (or wait for auto-refresh)
- Changes appear instantly

---

### Stopping the Server

**To Stop**:
```bash
# Press Ctrl+C in terminal
# Or close terminal window
```

**To Restart**:
```bash
npm run dev
```

---

## 🎯 Next Steps After Local Testing

### 1. Review UI/UX
- [ ] Check all components render correctly
- [ ] Test responsive behavior
- [ ] Verify animations work
- [ ] Check accessibility (keyboard navigation)

### 2. Identify Issues
- [ ] Note any styling issues
- [ ] Document broken functionality
- [ ] List missing images

### 3. Replace Placeholders
- [ ] Follow CHECKLIST.md
- [ ] Replace hero images (3 slides)
- [ ] Replace partner logos (5 logos)
- [ ] Replace testimonial photos (4 photos)
- [ ] Update contact information

### 4. Customize Content
- [ ] Edit hero headlines
- [ ] Update stats numbers
- [ ] Modify timeline steps
- [ ] Update testimonials
- [ ] Change footer content

### 5. Prepare for Deployment
- [ ] Run production build: `npm run build && npm run export`
- [ ] Test production build: `npx serve out`
- [ ] Run Lighthouse audit
- [ ] Fix any issues
- [ ] Follow DEPLOYMENT.md

---

## 📝 Development Commands Reference

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Start on different port
npm run dev -- -p 3001

# Build for production
npm run build

# Export static site
npm run export

# Build and export (combined)
npm run deploy

# Serve production build locally
npx serve out

# Clean build cache
npm run clean

# Lint code
npm run lint

# Test Netlify functions locally (requires Netlify CLI)
npm run netlify
```

---

## ✅ Success Criteria

You'll know the local setup is successful when:

- [x] `npm install` completes without errors
- [x] `npm run dev` starts server on port 3000
- [x] Browser shows website at `http://localhost:3000`
- [x] All 8 components visible on page
- [x] Hero carousel auto-plays
- [x] Form validation works
- [x] Mobile menu opens/closes
- [x] Responsive layout works on different screen sizes
- [x] No critical console errors
- [x] Hot reload works (changes appear on save)

---

## 🎉 Ready to Run!

Follow the steps in **Phase 2** and **Phase 3** to get started:

1. **Install dependencies**: `npm install`
2. **Start dev server**: `npm run dev`
3. **Open browser**: `http://localhost:3000`
4. **Test and review UI**

---

**Last Updated**: November 28, 2025  
**Status**: Ready to Execute  
**Estimated Time**: 10-15 minutes

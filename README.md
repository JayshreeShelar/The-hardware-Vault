# The Hardware Vault — Website

A four-page luxury hardware showcase (HTML5, CSS3, vanilla JavaScript). No build step and no internet needed — open `index.html` in a browser. Fonts and icons are bundled locally.

## Pages
- `index.html` — Home (full-screen hero slider, collections, signature pieces, story, enquiry banner)
- `about.html` — About
- `products.html` — Products (5 collections, 3 designs each; showcase only, no cart or prices)
- `contact.html` — Contact, enquiry form, map placeholder

## Design
- Layout, shapes (arches, leaf corners, cut-corner cards), hover effects and scroll animations follow the Aurelle Interiors template; colours, logo and content are The Hardware Vault's.
- Palette (top of `assets/css/style.css`): Deep Walnut #30211B, Espresso #493329, Champagne Gold #C6A36A, Antique Gold #A98243, Warm Ivory #F5F0E7, Soft Beige #E7DCCB, Charcoal #282522.
- Fonts: Cormorant Garamond / Manrope / Montserrat (Google Fonts, needs internet); bundled Crimson Pro / Outfit are the offline fallback.
- No libraries: all animation is plain CSS + `assets/js/main.js`.

## Structure
- `assets/css/style.css` — design system and components
- `assets/js/main.js` — sticky header, mobile menu, hero slider, scroll reveal, category tabs
- `assets/js/contact.js` — enquiry form validation
- `assets/images/` — logo, favicons, hero, categories, products, about

## Images
Every image keeps its original file name, so you can swap any photo by replacing the file.
- `hero/home-hero.jpg`, `hero/products-hero.jpg`, `hero/about-hero.jpg` and `about/legacy.jpg` — the four full-screen hero slides on the home page (set each focal point with `--pos` on the slide `<img>`)
- `hero/about-hero.jpg`, `hero/products-hero.jpg`, `hero/contact-hero.jpg` — page banners
- The banner crop is set per page with `--pos` (focal point) on the `<img>` inside `.banner-img`, for example `style="--pos:50% 30%"`. Change the two numbers to move the visible area.
- `categories/` 600 x 1000 (collection arches), `products/` 800 x 1000, `about/` story images.
- A small AI sparkle mark was removed from `products/long-3.jpg`.

## Placeholders to replace
- Phone, email, address and business hours (top bar, footer and `contact.html`)
- Social media links (`href="#"`)
- Map: replace the `.map-box` block in `contact.html` with a Google Maps `<iframe>`
- Product names and descriptions are generic — edit them in `products.html` and `index.html`

## Enquiry form
Validation (required fields, email, phone) runs in the browser. No backend is connected, so nothing is sent yet. To receive enquiries, connect Formspree, EmailJS or your own endpoint in `assets/js/contact.js` (see the comment in the submit handler).

## Banner layout (v3)
Banners now use a premium split layout: text on the left, the photo in an arched / leaf-corner frame on the right with a gold outline, reveal + light-sheen animation, slow zoom and soft pointer parallax. Photos are shown at or below their native size (not stretched full-screen), so they stay sharp. Change a photo's focal point with `--pos` on the `<img>`; the frame shape is `shape-arch` or `shape-leaf` on `.ph-stage`. Styles are in the `v3` block at the end of `assets/css/style.css`.

## Backgrounds (v5)
`assets/images/bg/` holds the supplied damask and leaf artwork: `damask-tile.jpg` (seamless tile for dark sections / footer), `damask-alpha.png` (transparent pattern for light sections), `leaves-wide.jpg` / `leaves-tall.jpg` (hero backgrounds) and `leaf-tl.png` / `leaf-br.png` (transparent corner leaves). Use `sec-damask` for a dark damask section and `sec-alt` for a beige section with leaf corners.

## v6 notes
- Banners: `hero/about-hero.jpg` and `hero/contact-hero.jpg` (and `about/legacy.jpg`) are now the branded showroom/lobby renders. The home slider uses those two; About and Contact use landscape frames (`stage-land`), Products keeps the portrait handle photo (`stage-port`).
- Products page: category list is a left sidebar (stacks as a scrolling chip bar on mobile). Product photos are shown in full (4:5, `object-fit:contain`) with the name underneath.

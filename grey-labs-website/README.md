# Grey Labs website (static front end)

Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Files
- 11 pages + 404.html, css/style.css, js/main.js, assets/, sitemap.xml, robots.txt

## Before launch (edit js/main.js, CONFIG at the top)
- whatsapp, email, phone: used on every page automatically
- maxFileMB and allowed file types for uploads

## Replace placeholders
- Grey boxes labelled "Project photo", "Team / workshop photo", etc.: add real images (WebP, lazy-loaded)
- The "g" logo tile in the header/footer: swap for the client's logo SVG
- Brand lime is #B6F500 (css/style.css, --lime): confirm exact brand colour
- Contact page: address, opening hours, Google Maps embed
- sitemap.xml and robots.txt: replace YOUR-DOMAIN
- Page copy on materials, turnaround, size limits: confirm with the client

## Forms (important)
The Get a Quote and Contact forms are written for Netlify Forms (data-netlify="true").
- Deploy on Netlify (drag and drop this folder) and enable email notifications under Site > Forms.
- On other hosts (cPanel, GitHub Pages, Vercel) forms will NOT send. Point the form to Formspree/Getform or your own backend and update the fetch() in js/main.js.
- Customer confirmation emails need a backend or an email service; Netlify only notifies the team.

## Track Order
Demo only. Reference GL-1042 shows a sample timeline. Replace the DEMO lookup in js/main.js with a real API/database before launch.

## Deploy
- Netlify: drag the folder onto app.netlify.com/drop
- Any static host: upload the folder contents to the web root

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
Both forms deliver without a build step:
- Set `formEndpoint` in `js/main.js` (CONFIG) to a POST endpoint such as Formspree, Getform or your own API.
- Leave `formEndpoint` empty and the form opens WhatsApp with all details prefilled. Files can be attached in the chat.
- Customer confirmation emails need a backend or an email service.

## Track Order
Demo only. Reference GL-1042 shows a sample timeline. Replace the DEMO lookup in js/main.js with a real API/database before launch.

## Deploy
- Vercel: import the GitHub repo, framework preset "Other", no build command. `vercel.json` adds security and cache headers.
- Any static host: upload the repository files to the web root.

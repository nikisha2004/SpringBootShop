# Vietnam Tour Website

A modern, static landing page for Vietnam tour packages with a hero carousel, video/story carousels, pricing, and a compact search panel that opens directly under the navbar search box.

## Features
- Hero image carousel with auto-rotate and arrow/dot controls
- "Travel Vibes" video cards with ratings, duration, pricing, and CTA
- Compact search panel that opens from the navbar search bar with filters:
  - Product Type (Tour / Activity)
  - Trip Duration chips
  - Price range (sliders + inputs) and flights toggle
  - Opens results on Thrillophilia in a new tab
- Clean, modern UI with subtle animations

## Tech Stack
- HTML, CSS
- Vanilla JavaScript (`app.js`)

## Project Structure
```
/ (project root)
├─ index.html          # Main page and most styles (inline for demo)
├─ styles.css          # Extra styles (if needed)
├─ app.js              # Carousels and search panel logic
├─ assets/             # Icons, images, videos
│  ├─ icons/
│  └─ images/
└─ README.md
```

## Getting Started
1) Open `index.html` directly in your browser.
2) Or serve locally (recommended for correct relative paths):
   - Using VS Code: install "Live Server" and click "Go Live".
   - Or Python 3:
     ```bash
     python -m http.server 8080
     ```
     Then open http://localhost:8080 in the browser.

## Search Panel
- Click the navbar search input (top bar) to open the panel.
- The panel anchors under the search bar and repositions on resize/scroll.
- Press `Esc` or click outside to close.
- Submit opens Thrillophilia search in a new tab with the selected filters.

## Configuration
You can tweak sizes/colors in `index.html` (top `<style>` block):
- Navbar logo size: `.navbar .logo img`
- Star size/color: `.rating .star::before` and `.rating-sm .star::before`
- Search panel sizing: `.search-panel`, `.search-top input`
- Animation timing: `@keyframes panelIn` / `panelOut`

JS positions the search panel in `app.js`:
- Function: `navbarSearchModal() -> positionPanel()`
- It calculates the search box bounds and sets `panel.style.left`, `top`, and `width` accordingly.

## Deployment
- Static hosting works anywhere (GitHub Pages, Netlify, Vercel, S3, etc.).
- GitHub Pages (quick start):
  1. Push to a GitHub repo.
  2. In repo settings, enable Pages for the `main` branch `/ (root)`.

## Live Demo
- GitHub Pages: add the published URL here after enabling Pages.
  - Example: `https://<your-username>.github.io/vietnam-tour-website/`

## Screenshots
Add a screenshot (drag-and-drop into GitHub, then reference it):

![Hero and Search Panel](assets/images/README-hero-search.png)

## Development
Install a lightweight local server (optional):

```bash
# Python 3
python -m http.server 8080
# Node (if you prefer)
npx serve .
```

Then open http://localhost:8080

### Project scripts
This is a static site; no build step is required. If you later add tooling (e.g., bundlers), document commands here.

## Responsive Design
- Desktop: baseline layout tailored for 1280–1920px widths.
- Modal: search panel anchors to the navbar search input and repositions on resize/scroll.
- Mobile: pending — planned as a separate pass with dedicated media queries.

## Roadmap / TODO
- Add mobile-first styles and breakpoints (320–480px).
- Persist selected filters in the URL and restore on reload.
- Keyboard navigation for chips and sliders inside the search panel.
- Unit tests for positioning logic in `navbarSearchModal()`.

## Troubleshooting
- Search panel not aligned under the input:
  - Check `positionPanel()` in `app.js`. It reads `.navbar .search-box` bounds using `getBoundingClientRect()` and sets `panel.style.left`, `top`, and `width`.
  - Ensure the overlay has no padding (`.search-modal { padding: 0; }`) and the panel is `position: fixed`.
- Nothing happens on Enter in the search input:
  - Verify the listeners in `navbarSearchModal()` are attached and no JS errors appear in the console.
- GitHub Pages not showing latest changes:
  - Wait 1–2 minutes; then hard refresh (Ctrl+F5). Confirm the Pages branch/folder in repo Settings.

## Author
- shresth-alt (GitHub): https://github.com/shresth-alt

## Acknowledgements
- Icons from the `assets/icons/` set.
- Inspired by travel booking/search UIs for a familiar user experience.

## Contributing
- Fork the repo, create a feature branch, commit changes, and open a PR.
- For design changes, include screenshots or a brief loom showing interactions.

## License
MIT

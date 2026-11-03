# Siming Ye · Academic Homepage

**Live site:** [https://yeschristine.github.io/](https://yeschristine.github.io/)

An English-language academic personal homepage focused on 3D reconstruction, 3D Gaussian
Splatting, SLAM, and spatial intelligence. The site uses plain HTML, CSS, and JavaScript and
requires no framework or build step.

## Preview locally

From this directory, run:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

For a section-by-section guide to updating the homepage, repositories, albums, and contact
details, see [`MAINTENANCE.md`](MAINTENANCE.md).

## Current profile

- Name: Siming Ye
- Nickname: ysm_Christine
- Institution: Beijing Institute of Technology
- Email: yeschristine0429@gmail.com
- Research: 3D reconstruction, 3DGS, SLAM, and spatial intelligence
- Portrait: `assets/ysming-profile.jpg`

The research section presents two ongoing directions rather than fabricated papers. Work includes
one numbered example, while the former Projects area displays two personal-interest panels: vibe
coding repositories and travel photo albums.

## Add a vibe-coding repository

The `Academic Homepage` repo card in `index.html` links to this GitHub repository. To add another
repository, copy the `repo-card` block inside `vibe-panel` and update it with a direct link:

```html
<a class="repo-action" href="https://github.com/username/repository" target="_blank" rel="noreferrer">
  View repository ↗
</a>
```

## Add photos to an album

Each album has a dedicated page in `albums/` and an image folder in `assets/albums/`. Add photos to
the matching folder, optimize them, then replace the `album-empty-state` block with a photo grid.

Large phone and camera images should not be served directly. If `ffmpeg` is installed, create
480, 960, and 1600 pixel WebP versions:

```powershell
.\scripts\optimize-album-images.ps1
```

For another album, pass its folder:

```powershell
.\scripts\optimize-album-images.ps1 -AlbumDirectory .\assets\albums\mountain-days
```

Use responsive `picture` elements so browsers choose an appropriate file:

```html
<div class="album-photo-grid">
  <figure>
    <picture>
      <source
        type="image/webp"
        srcset="
          ../assets/albums/weekend-walks/first-photo-480.webp 480w,
          ../assets/albums/weekend-walks/first-photo-960.webp 960w,
          ../assets/albums/weekend-walks/first-photo-1600.webp 1600w
        "
        sizes="(max-width: 480px) calc(100vw - 28px), (max-width: 760px) calc(50vw - 24px), 360px"
      />
      <img
        src="../assets/albums/weekend-walks/first-photo-960.webp"
        alt="Describe the photo"
        width="1600"
        height="2133"
        loading="lazy"
        decoding="async"
      />
    </picture>
    <figcaption>An optional caption</figcaption>
  </figure>
</div>
```

Keep only the WebP variants in the published site. Retain full-resolution originals in a separate
backup or archive if they may be needed later.

Available album pages:

- `albums/weekend-walks.html`
- `albums/mountain-days.html`
- `albums/city-after-dark.html`

## Files

- `index.html`: page content, profile details, research areas, interests, and contact information
- `styles.css`: visual system, portrait treatment, and responsive layouts
- `script.js`: theme switching, mobile navigation, reveal effects, and email copying
- `assets/ysming-profile.jpg`: personal portrait
- `albums/`: standalone photo album pages
- `assets/albums/`: destination folders for album photographs
- `scripts/optimize-album-images.ps1`: creates responsive WebP album images
- `favicon.svg`: point-cloud-inspired browser icon

## Deploy to GitHub Pages

1. Create a GitHub repository named `<username>.github.io`.
2. Commit the contents of this directory to the default branch.
3. Open **Settings → Pages** and select the default branch as the publishing source.
4. The site will be available at `https://<username>.github.io`.

After deployment, update the version query parameters for `styles.css` and `script.js` in
`index.html` whenever a browser continues to show an older cached version.

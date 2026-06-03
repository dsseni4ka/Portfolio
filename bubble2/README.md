# Holographic Bubble (WebGL2)

A single ray-traced glass bubble on a black background with physically based refraction, reflection, Fresnel mixing, and chromatic dispersion. The environment is a procedural HDR-style gradient (magenta, cyan, yellow, blue) sampled along refracted and reflected rays.

## Run

Serve the folder over HTTP (ES modules + shader fetch):

```bash
npx --yes serve .
```

Open the URL shown (e.g. `http://localhost:3000`). Drag to orbit, scroll to zoom.

## Performance

Defaults target ~4× fewer GPU ops than v1: single refraction trace, resolution scale 70%, 128px cubemap built once, no per-frame CPU cubemap regen. Use **Performance → Resolution** in the panel if you need more speed or sharpness.

## Features

- **Cubemap HDRI** — procedural 128×6 cubemap (magenta / cyan / yellow / blue), or lighter live procedural sampling
- **Thin-film interference** — soap-bubble iridescence from optical path + spectral palette
- **Surface wobble** — animated FBM normal perturbation
- **Settings panel** — IOR, dispersion, film, rim, env, camera auto-orbit

## Files

- `index.html` — page + panel styles
- `main.js` — WebGL2, camera, uniforms, cubemap refresh
- `bubble.frag` — ray tracing, refraction, thin film, wobble
- `env-cubemap.js` — CPU cubemap generator
- `settings.js` — settings UI

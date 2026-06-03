/** Shader sources are loaded at runtime from /public/shaders (Rouser port). */
export const ROUSER_SHADER_URLS = {
  vert: "/shaders/bubble.vert.glsl",
  frag: "/shaders/bubble.frag.glsl",
} as const;

export async function loadRouserShaders() {
  const [vert, frag] = await Promise.all([
    fetch(ROUSER_SHADER_URLS.vert).then((r) => r.text()),
    fetch(ROUSER_SHADER_URLS.frag).then((r) => r.text()),
  ]);
  return { vert, frag };
}

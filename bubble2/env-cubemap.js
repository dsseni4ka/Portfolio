/** Procedural HDR-style cubemap (magenta / cyan / yellow / blue). */

const PI = Math.PI;

function hash3(x, y, z) {
  let p = [
    ((x * 0.3183099 + 0.1) % 1) * 17,
    ((y * 0.3183099 + 0.1) % 1) * 17,
    ((z * 0.3183099 + 0.1) % 1) * 17,
  ];
  return ((p[0] * p[1] * p[2] * (p[0] + p[1] + p[2])) % 1);
}

function noise3(x, y, z) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);
  const sample = (a, b, c) => hash3(ix + a, iy + b, iz + c);
  const c000 = sample(0, 0, 0);
  const c100 = sample(1, 0, 0);
  const c010 = sample(0, 1, 0);
  const c110 = sample(1, 1, 0);
  const c001 = sample(0, 0, 1);
  const c101 = sample(1, 0, 1);
  const c011 = sample(0, 1, 1);
  const c111 = sample(1, 1, 1);
  const nx00 = c000 * (1 - ux) + c100 * ux;
  const nx10 = c010 * (1 - ux) + c110 * ux;
  const nx01 = c001 * (1 - ux) + c101 * ux;
  const nx11 = c011 * (1 - ux) + c111 * ux;
  const nxy0 = nx00 * (1 - uy) + nx10 * uy;
  const nxy1 = nx01 * (1 - uy) + nx11 * uy;
  return nxy0 * (1 - uz) + nxy1 * uz;
}

function fbm3(x, y, z) {
  let v = 0;
  let a = 0.5;
  let px = x;
  let py = y;
  let pz = z;
  for (let i = 0; i < 4; i++) {
    v += a * noise3(px, py, pz);
    px *= 2.1;
    py *= 2.1;
    pz *= 2.1;
    a *= 0.5;
  }
  return v;
}

function spectral(t) {
  t = ((t % 1) + 1) % 1;
  const lerp = (a, b, u) => a.map((v, i) => v + (b[i] - v) * u);
  if (t < 0.25) return lerp([0.05, 0, 0.35], [0, 0.85, 1], t / 0.25);
  if (t < 0.5) return lerp([0, 0.85, 1], [1, 0.95, 0.1], (t - 0.25) / 0.25);
  if (t < 0.75) return lerp([1, 0.95, 0.1], [1, 0.05, 0.75], (t - 0.5) / 0.25);
  return lerp([1, 0.05, 0.75], [0.05, 0, 0.35], (t - 0.75) / 0.25);
}

function normalize3(v) {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

function envColor(dir, time, intensity) {
  const [dx, dy, dz] = normalize3(dir);
  const t = time * 0.15;
  const phi = Math.atan2(dz, dx);
  const theta = Math.acos(Math.max(-1, Math.min(1, dy)));
  const uv = [phi / (2 * PI) + 0.5, theta / PI];

  const band1 = Math.sin(uv[0] * 12 + t * 2 + Math.sin(uv[1] * 8) * 2);
  const band2 = Math.sin(uv[1] * 10 - t * 1.3 + Math.cos(uv[0] * 14) * 1.5);
  const band3 = Math.sin((uv[0] + uv[1]) * 18 + t * 0.7);
  const bands = band1 * 0.4 + band2 * 0.35 + band3 * 0.25;

  let hue = (uv[0] * 2.5 + uv[1] * 1.8 + bands * 0.35 + t * 0.08) % 1;
  let col = spectral(hue);

  const lightCyan = normalize3([Math.sin(t * 0.4), 0.6, Math.cos(t * 0.4)]);
  const lightMagenta = normalize3([
    Math.cos(t * 0.3 + 1.2),
    0.2,
    Math.sin(t * 0.3 + 1.2),
  ]);
  const lightYellow = normalize3([-0.5, -0.7, 0.4]);
  const lightBlue = normalize3([0.3, 0.9, -0.5]);

  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const l1 = Math.pow(Math.max(dot(dir, lightCyan), 0), 48) * 6;
  const l2 = Math.pow(Math.max(dot(dir, lightMagenta), 0), 36) * 5.5;
  const l3 = Math.pow(Math.max(dot(dir, lightYellow), 0), 64) * 7;
  const l4 = Math.pow(Math.max(dot(dir, lightBlue), 0), 42) * 5;

  col[0] += 0 * l1;
  col[1] += 0.9 * l1;
  col[2] += 1.0 * l1;
  col[0] += 1.0 * l2;
  col[1] += 0.1 * l2;
  col[2] += 0.8 * l2;
  col[0] += 1.0 * l3;
  col[1] += 0.95 * l3;
  col[2] += 0.2 * l3;
  col[0] += 0.15 * l4;
  col[1] += 0.25 * l4;
  col[2] += 1.0 * l4;

  const scale = intensity * (1.8 + bands * 0.6);
  return col.map((c) => c * scale);
}

/** Face index 0..5, local uv in [-1,1] -> world direction */
function faceDirection(face, u, v) {
  switch (face) {
    case 0:
      return [1, v, -u];
    case 1:
      return [-1, v, u];
    case 2:
      return [u, 1, -v];
    case 3:
      return [u, -1, v];
    case 4:
      return [u, v, 1];
    default:
      return [-u, v, -1];
  }
}

function encodeHdr(rgb) {
  return rgb.map((c) => {
    const x = 1 - Math.exp(-c * 0.55);
    return Math.round(Math.min(255, Math.max(0, x * 255)));
  });
}

export function createEnvCubemap(gl, { size = 256, time = 0, intensity = 1 } = {}) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);

  const faces = [
    gl.TEXTURE_CUBE_MAP_POSITIVE_X,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
    gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
    gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
  ];

  for (let f = 0; f < 6; f++) {
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = (x / (size - 1)) * 2 - 1;
        const v = (y / (size - 1)) * 2 - 1;
        const dir = faceDirection(f, u, v);
        const rgb = envColor(dir, time, intensity);
        const enc = encodeHdr(rgb);
        const i = (y * size + x) * 4;
        data[i] = enc[0];
        data[i + 1] = enc[1];
        data[i + 2] = enc[2];
        data[i + 3] = 255;
      }
    }
    gl.texImage2D(faces[f], 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  }

  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  return tex;
}

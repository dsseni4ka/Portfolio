import { createEnvCubemap } from './env-cubemap.js';
import { createSettingsPanel } from './settings.js';
import { createBlobs, updateBlobs, packBlobs, MAX_BLOBS } from './blobs.js';

const canvas = document.getElementById('c');
const gl = canvas.getContext('webgl2', {
  antialias: false,
  alpha: false,
  depth: false,
  stencil: false,
  powerPreference: 'high-performance',
});

if (!gl) {
  document.body.innerHTML =
    '<p style="color:#fff;padding:2rem;font-family:sans-serif">WebGL2 is required.</p>';
  throw new Error('WebGL2 unavailable');
}

const vertSrc = `#version 300 es
precision highp float;
const vec2 pos[3] = vec2[3](
  vec2(-1.0, -1.0),
  vec2( 3.0, -1.0),
  vec2(-1.0,  3.0)
);
void main() {
  gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);
}
`;

const fragSrc = await fetch('./bubble.frag?v=9').then((r) => r.text());

function compile(type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
    throw new Error('Shader compile failed');
  }
  return s;
}

const vs = compile(gl.VERTEX_SHADER, vertSrc);
const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
const prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(prog));
  throw new Error('Program link failed');
}
gl.useProgram(prog);

let envCube = null;
let envRotAngle = 0.35;
let blobs = createBlobs(6);
const blobData = packBlobs(blobs);

const u = {
  resolution: gl.getUniformLocation(prog, 'u_resolution'),
  time: gl.getUniformLocation(prog, 'u_time'),
  camPos: gl.getUniformLocation(prog, 'u_camPos'),
  camTarget: gl.getUniformLocation(prog, 'u_camTarget'),
  envCube: gl.getUniformLocation(prog, 'u_envCube'),
  useCubemap: gl.getUniformLocation(prog, 'u_useCubemap'),
  envIntensity: gl.getUniformLocation(prog, 'u_envIntensity'),
  envRot: gl.getUniformLocation(prog, 'u_envRot'),
  settings0: gl.getUniformLocation(prog, 'u_settings0'),
  settings1: gl.getUniformLocation(prog, 'u_settings1'),
  settings2: gl.getUniformLocation(prog, 'u_settings2'),
  settings3: gl.getUniformLocation(prog, 'u_settings3'),
  meta: gl.getUniformLocation(prog, 'u_meta'),
  blobs: gl.getUniformLocation(prog, 'u_blobs[0]'),
};

gl.activeTexture(gl.TEXTURE0);
gl.uniform1i(u.envCube, 0);

let settings = {};

function refreshCubemap(time = 0) {
  if (envCube) gl.deleteTexture(envCube);
  envCube = createEnvCubemap(gl, {
    size: 128,
    time,
    intensity: settings.envIntensity ?? 1,
  });
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, envCube);
}

const { state } = createSettingsPanel((s) => {
  settings = s;
  envRotAngle = s.envRotation;
  const count = Math.min(MAX_BLOBS, Math.max(2, Math.round(s.blobCount ?? 6)));
  if (blobs.length !== count) {
    blobs = createBlobs(count);
    packBlobs(blobs, blobData);
  }
  if (s.useCubemap) refreshCubemap(0);
});

refreshCubemap(0);

function envRotationMatrix(angle, time) {
  const a = angle + (settings.animateEnv ? time * 0.08 : 0);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const cy = Math.cos(a * 0.6);
  const sy = Math.sin(a * 0.6);
  return new Float32Array([
    c, 0, s,
    sy * 0.15, cy, -sy * 0.15,
    -s, 0, c,
  ]);
}

function applySettings() {
  gl.uniform4f(
    u.settings0,
    settings.ior ?? 1.5,
    settings.dispersion ?? 0.018,
    settings.filmStrength ?? 0.55,
    settings.filmThickness ?? 480
  );
  gl.uniform4f(
    u.settings1,
    settings.wobbleAmp ?? 0.035,
    settings.wobbleSpeed ?? 0.85,
    settings.rimStrength ?? 0.35,
    settings.chromaticRim ?? 0.14
  );
  gl.uniform4f(
    u.settings2,
    settings.fresnelBoost ?? 1,
    settings.thinFilm ?? 1,
    settings.wobble ?? 1,
    settings.exposure ?? 0.85
  );
  gl.uniform1f(u.useCubemap, settings.useCubemap ?? 1);
  gl.uniform1f(u.envIntensity, settings.envIntensity ?? 1);
  gl.uniform4f(
    u.settings3,
    settings.filmIOR ?? 1.33,
    settings.shellThick ?? 0.008,
    settings.hollowPower ?? 3.0,
    0
  );
  const count = Math.min(MAX_BLOBS, Math.max(2, Math.round(settings.blobCount ?? 6)));
  gl.uniform4f(
    u.meta,
    settings.metaThreshold ?? 0.92,
    settings.metaBlend ?? 1.0,
    0,
    count
  );
}

let width = 0;
let height = 0;

function resize() {
  const scale = settings.renderScale ?? 0.7;
  const dpr = Math.min(window.devicePixelRatio || 1, settings.maxDpr ?? 1.25);
  width = Math.max(1, Math.floor(canvas.clientWidth * dpr * scale));
  height = Math.max(1, Math.floor(canvas.clientHeight * dpr * scale));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
}

window.addEventListener('resize', resize);
resize();

// Front-on camera: looks down −Z at the XY bubble plane
let panX = 0;
let panY = 0;
let dist = 4.2;
let dragging = false;
let lastX = 0;
let lastY = 0;

function panSensitivity() {
  return dist * 0.0011;
}

canvas.addEventListener('pointerdown', (e) => {
  if (e.target !== canvas) return;
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointerup', () => {
  dragging = false;
});
canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const s = panSensitivity();
  panX -= (e.clientX - lastX) * s;
  panY += (e.clientY - lastY) * s;
  lastX = e.clientX;
  lastY = e.clientY;
  const lim = 1.8;
  panX = Math.max(-lim, Math.min(lim, panX));
  panY = Math.max(-lim, Math.min(lim, panY));
});
canvas.addEventListener(
  'wheel',
  (e) => {
    if (e.target.closest('.panel')) return;
    e.preventDefault();
    dist *= 1 + e.deltaY * 0.001;
    dist = Math.max(2.8, Math.min(7.5, dist));
  },
  { passive: false }
);

function camVectors(t) {
  if (settings.autoRotate) {
    const r = 0.35;
    panX = Math.cos(t * (settings.autoRotateSpeed ?? 0.25)) * r;
    panY = Math.sin(t * (settings.autoRotateSpeed ?? 0.25) * 0.85) * r * 0.6;
  }
  return {
    pos: [panX, panY, dist],
    target: [panX, panY, 0],
  };
}

const t0 = performance.now();
let paused = false;
let lastFrame = t0;

document.addEventListener('visibilitychange', () => {
  paused = document.hidden;
  if (!paused) {
    lastFrame = performance.now();
    requestAnimationFrame(frame);
  }
});

function frame(now) {
  requestAnimationFrame(frame);
  if (paused) return;

  const dt = Math.min((now - lastFrame) * 0.001, 0.033);
  lastFrame = now;

  const speed = settings.driftSpeed ?? 1.0;
  updateBlobs(blobs, dt * speed, { bounds: settings.bounds ?? 2.2 });
  packBlobs(blobs, blobData);

  resize();
  const t = (now - t0) * 0.001;
  const { pos, target } = camVectors(t);

  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(prog);
  applySettings();
  gl.uniformMatrix3fv(u.envRot, false, envRotationMatrix(envRotAngle, t));
  gl.uniform2f(u.resolution, width, height);
  gl.uniform1f(u.time, t);
  gl.uniform3fv(u.camPos, pos);
  gl.uniform3fv(u.camTarget, target);
  gl.uniform4fv(u.blobs, blobData);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

requestAnimationFrame(frame);

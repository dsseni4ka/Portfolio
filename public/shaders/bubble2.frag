#version 300 es
precision highp float;
precision highp samplerCube;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_camPos;
uniform vec3 u_camTarget;

uniform samplerCube u_envCube;
uniform float u_useCubemap;
uniform float u_envIntensity;
uniform mat3 u_envRot;

uniform vec4 u_settings0;
uniform vec4 u_settings1;
uniform vec4 u_settings2;
uniform vec4 u_settings3;
uniform vec4 u_meta; // threshold, drift scale, march steps scale, blob count

uniform vec4 u_blobs[10];

out vec4 fragColor;

const float PI = 3.14159265359;
const int MAX_BLOBS = 10;

#define DISPERSION u_settings0.y
#define FILM_STRENGTH u_settings0.z
#define FILM_THICKNESS u_settings0.w
#define WOBBLE_AMP u_settings1.x
#define WOBBLE_SPEED u_settings1.y
#define RIM_STRENGTH u_settings1.z
#define CHROMATIC_RIM u_settings1.w
#define FRESNEL_BOOST u_settings2.x
#define THIN_FILM u_settings2.y
#define WOBBLE u_settings2.z
#define EXPOSURE u_settings2.w
#define FILM_IOR u_settings3.x
#define SHELL_THICK u_settings3.y
#define HOLLOW_POWER u_settings3.z
#define META_THRESH u_meta.x
#define META_BLEND u_meta.y
#define BLOB_COUNT int(u_meta.w + 0.5)

// sync with lib/site-colors.ts SITE_BACKGROUND (#E7E7E7)
const vec3 BG_COLOR = vec3(0.9059, 0.9059, 0.9059);

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash(i);
  float n100 = hash(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash(i + vec3(1.0, 1.0, 1.0));
  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);
  return mix(mix(nx00, nx10, f.y), mix(nx01, nx11, f.y), f.z);
}

vec3 spectral(float t) {
  t = fract(t);
  if (t < 0.25) return mix(vec3(0.05, 0.0, 0.35), vec3(0.0, 0.85, 1.0), t / 0.25);
  if (t < 0.5) return mix(vec3(0.0, 0.85, 1.0), vec3(1.0, 0.95, 0.1), (t - 0.25) / 0.25);
  if (t < 0.75) return mix(vec3(1.0, 0.95, 0.1), vec3(1.0, 0.05, 0.75), (t - 0.5) / 0.25);
  return mix(vec3(1.0, 0.05, 0.75), vec3(0.05, 0.0, 0.35), (t - 0.75) / 0.25);
}

vec3 envMapProcedural(vec3 dir) {
  dir = normalize(dir);
  float t = u_time * 0.15;
  float phi = atan(dir.z, dir.x);
  float theta = acos(clamp(dir.y, -1.0, 1.0));
  vec2 uv = vec2(phi / (2.0 * PI) + 0.5, theta / PI);
  float bands = sin(uv.x * 12.0 + t * 2.0) * 0.4
              + sin(uv.y * 10.0 - t * 1.3) * 0.35
              + sin((uv.x + uv.y) * 18.0 + t * 0.7) * 0.25;
  float hue = fract(uv.x * 2.5 + uv.y * 1.8 + bands * 0.35 + t * 0.08);
  vec3 col = spectral(hue);
  col += vec3(0.0, 0.9, 1.0) * pow(max(dot(dir, vec3(0.2, 0.9, 0.3)), 0.0), 32.0) * 5.0;
  col += vec3(1.0, 0.1, 0.8) * pow(max(dot(dir, vec3(-0.7, 0.3, 0.5)), 0.0), 28.0) * 4.5;
  col += vec3(1.0, 0.95, 0.2) * pow(max(dot(dir, vec3(-0.4, -0.8, 0.2)), 0.0), 40.0) * 6.0;
  col *= u_envIntensity * (1.7 + bands * 0.5);
  return col;
}

vec3 decodeCube(vec3 rgb) {
  return -log(max(vec3(1.0) - rgb, vec3(0.001))) / 0.55;
}

vec3 envMap(vec3 dir) {
  dir = normalize(u_envRot * dir);
  if (u_useCubemap > 0.5) {
    return decodeCube(texture(u_envCube, dir).rgb) * u_envIntensity;
  }
  return envMapProcedural(dir);
}

// Wyvill metaball field (sum of r²/(r²+d²))
float blobField(vec3 p) {
  float f = 0.0;
  for (int i = 0; i < MAX_BLOBS; i++) {
    float on = step(float(i), float(BLOB_COUNT) - 0.001);
    vec3 c = u_blobs[i].xyz;
    float r = u_blobs[i].w * META_BLEND;
    vec3 d = p - c;
    float d2 = dot(d, d);
    f += on * (r * r) / (r * r + d2);
  }
  return f;
}

vec3 blobGradient(vec3 p) {
  const float e = 0.004;
  float fx = blobField(p + vec3(e, 0.0, 0.0)) - blobField(p - vec3(e, 0.0, 0.0));
  float fy = blobField(p + vec3(0.0, e, 0.0)) - blobField(p - vec3(0.0, e, 0.0));
  float fz = blobField(p + vec3(0.0, 0.0, e)) - blobField(p - vec3(0.0, 0.0, e));
  return normalize(vec3(fx, fy, fz));
}

vec3 wobbleNormal(vec3 p, vec3 n) {
  if (WOBBLE < 0.5) return n;
  vec3 q = p * 3.5 + vec3(u_time * WOBBLE_SPEED);
  float e = 0.05;
  vec3 grad = vec3(
    noise3(q + vec3(e, 0.0, 0.0)) - noise3(q - vec3(e, 0.0, 0.0)),
    noise3(q + vec3(0.0, e, 0.0)) - noise3(q - vec3(0.0, e, 0.0)),
    noise3(q + vec3(0.0, 0.0, e)) - noise3(q - vec3(0.0, 0.0, e))
  );
  return normalize(n - grad * WOBBLE_AMP * 2.5);
}

vec3 thinFilmColor(vec3 V, vec3 N, float hueOff) {
  float cosTheta = clamp(abs(dot(V, N)), 0.04, 1.0);
  float opticalPath = 2.0 * FILM_IOR * FILM_THICKNESS * cosTheta;
  vec3 phase = 6.2831853 * opticalPath / vec3(650.0, 530.0, 450.0);
  vec3 irid = 0.5 + 0.5 * cos(phase + vec3(0.0, 1.8, 3.6));
  vec3 spec = spectral(fract(opticalPath * 0.0025 + hueOff));
  return mix(spec, irid * spec * 2.2, 0.65);
}

float fresnelSchlick(vec3 I, vec3 N, float ior) {
  float cosTheta = abs(dot(I, N));
  float F0 = pow((1.0 - ior) / (1.0 + ior), 2.0);
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

vec3 envDispersion(vec3 dir, vec3 n) {
  vec3 base = envMap(dir);
  if (DISPERSION < 0.0001) return base;
  vec3 axis = normalize(cross(dir, n) + vec3(0.001, 0.0, 0.0));
  float spread = DISPERSION * 0.1;
  return vec3(
    envMap(normalize(dir + axis * spread)).r,
    base.g,
    envMap(normalize(dir - axis * spread)).b
  );
}

// Closest blob for per-bubble hue variation
void dominantBlob(vec3 p, out vec3 center, out float radius, out float hueOff) {
  float best = 1e9;
  center = u_blobs[0].xyz;
  radius = u_blobs[0].w;
  hueOff = 0.0;
  for (int i = 0; i < MAX_BLOBS; i++) {
    float on = step(float(i), float(BLOB_COUNT) - 0.001);
    vec3 c = u_blobs[i].xyz;
    float r = u_blobs[i].w;
    float d = length(p - c) + (1.0 - on) * 1e6;
    if (d < best) {
      best = d;
      center = c;
      radius = r;
      hueOff = float(i) * 0.17;
    }
  }
}

vec3 shadeSoapShell(vec3 p, vec3 n, vec3 rd) {
  vec3 V = -rd;
  float ndv = abs(dot(n, V));

  float F = clamp(fresnelSchlick(V, n, FILM_IOR) * FRESNEL_BOOST, 0.0, 1.0);
  float rim = pow(1.0 - ndv, 2.8);
  float edge = pow(1.0 - ndv, 7.0);

  float hollow = smoothstep(0.38, 0.92, ndv);
  hollow = pow(hollow, max(HOLLOW_POWER * 0.35, 0.4));
  float shell = 1.0 - hollow;

  vec3 center;
  float br;
  float hueOff;
  dominantBlob(p, center, br, hueOff);

  vec3 rdRefl = reflect(rd, n);
  vec3 tint = vec3(0.0);
  tint += envDispersion(rdRefl, n) * shell * (F * 0.5 + rim * 0.65);
  tint += envMap(rdRefl) * rim * RIM_STRENGTH * shell;

  if (THIN_FILM > 0.5) {
    tint += thinFilmColor(V, n, hueOff + dot(n, V) * 0.5) * FILM_STRENGTH * rim * shell;
  }

  tint += vec3(1.0, 0.3, 0.9) * edge * CHROMATIC_RIM * shell;
  tint += vec3(0.2, 0.9, 1.0) * edge * CHROMATIC_RIM * 0.85 * shell;

  return mix(BG_COLOR, tint, clamp(shell, 0.0, 1.0));
}

bool rayMarchMetaball(vec3 ro, vec3 rd, out vec3 hitP, out vec3 hitN) {
  float thresh = META_THRESH;
  float t = 0.05;
  float prevT = t;
  float prevF = blobField(ro + rd * t);

  for (int i = 0; i < 44; i++) {
    vec3 p = ro + rd * t;
    float f = blobField(p);

    if (f >= thresh) {
      float t0 = prevT;
      float t1 = t;
      for (int j = 0; j < 5; j++) {
        float tm = 0.5 * (t0 + t1);
        if (blobField(ro + rd * tm) >= thresh) t1 = tm;
        else t0 = tm;
      }
      hitP = ro + rd * t1;
      hitN = wobbleNormal(hitP, blobGradient(hitP));
      return true;
    }

    float step = clamp((thresh - f) * 0.22, 0.012, 0.18);
    prevT = t;
    prevF = f;
    t += step;
    if (t > 24.0) break;
  }
  return false;
}

vec3 traceScene(vec3 ro, vec3 rd) {
  vec3 p, n;
  if (!rayMarchMetaball(ro, rd, p, n)) return BG_COLOR;
  return shadeSoapShell(p, n, rd);
}

mat3 lookAt(vec3 eye, vec3 target, vec3 up) {
  vec3 f = normalize(target - eye);
  vec3 r = normalize(cross(f, up));
  vec3 u = cross(r, f);
  return mat3(r, u, -f);
}

vec3 acesFilm(vec3 x) {
  float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
  vec3 ro = u_camPos;
  mat3 cam = lookAt(ro, u_camTarget, vec3(0.0, 1.0, 0.0));
  vec3 rd = normalize(cam * vec3(uv, -1.65));

  vec3 col = traceScene(ro, rd);
  col = pow(acesFilm(col * EXPOSURE), vec3(1.0 / 2.2));
  fragColor = vec4(col, 1.0);
}

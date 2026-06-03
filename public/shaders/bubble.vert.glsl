precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform vec2 uOffset;

varying vec2 vUv;
varying vec2 vP;
varying vec2 vFromCentre;

uniform float popProgress;
uniform vec2 popPos;

// float rand(float n){return fract(sin(n) * 43758.5453123);}

// float noise(float p){
// 	float fl = floor(p);
//   float fc = fract(p);
// 	return mix(rand(fl), rand(fl + 1.0), fc);
// }
	
// float noise(vec2 n) {
// 	const vec2 d = vec2(0.0, 1.0);
//   vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
// 	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
// }

void main() {
  vec2 pos = position.xy + uOffset;
  float angle = uv.y;
  float centreDist = uv.x * 0.5;
  vUv = vec2(
    sin(angle) * centreDist + 0.5,
    -cos(angle) * centreDist + 0.5
  );
  vP = pos;
  gl_Position = vec4(pos, 0.0, 1.0);
}
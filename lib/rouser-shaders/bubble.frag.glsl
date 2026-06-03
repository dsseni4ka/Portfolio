precision highp float;
precision highp int;

uniform sampler2D uMap;
uniform sampler2D uReflectionMap;
uniform float uTime;
varying vec2 vUv;
varying vec2 vP;

uniform float chromaticDistance;
uniform float chromaticPower;
uniform float backgroundDistortion;
uniform float edgeDistortion;
uniform float cameraRotation;
uniform float reflectionPower;
uniform float reflectionHighlights;
uniform float aboutToBurst;
uniform float baseRainbow;
uniform float normalRainbow;

uniform float popProgress;
uniform vec2 popPos;

#define PI 					3.14159265359
#define METABALLS 			3

vec2 V;

#define rot(a) mat2( V= sin(vec2(1.57, 0) + a), -V.y, V.x)

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec3 sampleEquirect(vec3 dir) {
  vec2 uv = vec2(
    atan(dir.z, dir.x) / (2.0 * PI) + 0.5,
    acos(clamp(dir.y, -1.0, 1.0)) / PI
  );
  return texture2D(uReflectionMap, uv).rgb;
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

void main() {
  // Calculate normals n stuff
  float ratio = 1.0;
	vec2 uv = vec2(ratio, 1.0) * (2.0 * vUv + vec2(-1.0, -1.0));
  vec3 n = vec3(uv, sqrt(1. - clamp(dot(uv, uv), 0., 1.)));
  float z = 1.0 - dot(n, vec3(0.0, 0.0, 1.0));
  float alpha = 1.0;
  vec3 dir = vec3(uv.x, uv.y, 1.0);
  
  // Calculate reflection colour
  vec3 reflected = normalize(reflect(dir, n));
  // reflected.xy *= rot(reflectionHighlights);
  reflected.yz *= rot(cameraRotation);
  reflected.xy *= rot(-PI * 0.5);
  // reflected.xy *= rot(0.5);
  vec3 reflection = sampleEquirect(reflected);
  // reflection.r = pow(reflection.r, 4.0);
  // reflection.g = pow(reflection.g, 4.0);
  // reflection.b = pow(reflection.b, 4.0);

  // Calculate pop stuff
  float popDistortion = 0.0;
  if (popProgress > 0.0) {
    float dist = distance(vP + vec2(noise(vP * 5.0 + uTime * 3.0), noise(vP * 5.0 + 5.5346454 + uTime * 3.0)) * 0.1, popPos - vec2(0.5, 0.5)) / 2.0;
    float threshold = 0.1;
    if (dist < popProgress) {
      alpha = 0.0;
    } else if (dist < popProgress + threshold) {
      popDistortion = 1.0 - (dist - popProgress) / threshold;
      // alpha = 1.0 - pow(popDistortion, 20.0);
    }
  }

  vec3 rainbowColor = sin((vec3(0.,.33,.66) + sin(noise(vec2(uv.y, uv.x)) * 5.2 + uTime * 0.3 + n.x) + cos(noise(vec2(uv.y, uv.x + 2.523523)) * 6.0 - uTime * 0.3 + n.z)) * 6.28) * .5+.5;

  // Calculate total distortion
  float distortion = backgroundDistortion * pow(z, edgeDistortion * (1.0 - aboutToBurst)) * (1.0 + aboutToBurst * 4.0) + popDistortion * 0.05 + popProgress * 0.05;

  distortion = clamp(mix(distortion, 0.0, popProgress / 0.5), 0.0, 1.0);

  // Get background position based on distortion
  vec2 distortionDir = vec2(0.0, n.y > 0.0 ? -1.0 : 1.0);
  vec2 bgPos = vP / 2.0 + n.xy * -distortion * distortionDir + vec2(0.5, 0.5);
  if (bgPos.y < 0.0) {
    bgPos.y = -bgPos.y;
  } else if (bgPos.y > 1.0) {
    bgPos.y = 1.0 - (bgPos.y - 1.0);
  }

  // Split distortion into channels for chromatic aberation
  float wobble = pow(distortion, chromaticPower);
  vec2 wobbleR = normalize(vec2(-1, -1)) * wobble * chromaticDistance;
  vec2 wobbleG = normalize(vec2(1, 1)) * wobble * chromaticDistance;
  vec2 wobbleB = normalize(vec2(-1, 1)) * wobble * chromaticDistance;

  // Calculate final colour by combining warped background and reflection color
  vec3 color = vec3(
    texture2D(uMap, bgPos + wobbleR).r,
    texture2D(uMap, bgPos + wobbleG).g,
    texture2D(uMap, bgPos + wobbleB).b
  );
  // Add reflection
  color += reflection * (pow(z, reflectionHighlights) * (reflectionPower + popProgress));// + popDistortion * 1.1);
  // color += reflection * 1.4 * reflectionPower + popDistortion * 2.0;

  // color += vec3(1.0) * popDistortion;

  // Add rainbow
  float rainbow = pow(popDistortion * 0.4, 2.0) + (z * normalRainbow + baseRainbow);
  color += rainbowColor * rainbow;

  // color += rainbowColor * popDistortion * 0.05;

  if (popDistortion > 0.0) {
    // color = mix(color, rainbowColor, pow(popDistortion, 0.5) * 0.3);
    color = mix(color, vec3(1.0), pow(popDistortion, 20.0) * 0.5);
  }

  gl_FragColor = vec4(color, alpha);
}
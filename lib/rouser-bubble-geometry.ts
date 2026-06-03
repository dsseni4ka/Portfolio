import * as THREE from "three";

/** Triangle fan disc — ported from Rouser OGL bubble mesh (200 segments). */
export function createRouserBubbleGeometry(
  segments = 200,
  radius = 0.36,
): THREE.BufferGeometry {
  const ringCount = segments;
  const positions = new Float32Array(ringCount * 3 + 3);
  const uvs = new Float32Array(ringCount * 2 + 2);
  const indices = new Uint16Array(ringCount * 3);

  for (let c = 0; c < ringCount; c++) {
    const u = (c / ringCount) * Math.PI * 2;
    const x = radius * Math.cos(u);
    const y = -radius * Math.sin(u);
    positions[c * 3] = x;
    positions[c * 3 + 1] = y;
    positions[c * 3 + 2] = 0;
    uvs[c * 2] = 1;
    uvs[c * 2 + 1] = u;
    indices[c * 3] = (c + 1) % ringCount;
    indices[c * 3 + 1] = c;
    indices[c * 3 + 2] = ringCount;
  }

  const center = ringCount * 3;
  positions[center] = 0;
  positions[center + 1] = 0;
  positions[center + 2] = 0;
  uvs[ringCount * 2] = 0;
  uvs[ringCount * 2 + 1] = 0;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  return geometry;
}

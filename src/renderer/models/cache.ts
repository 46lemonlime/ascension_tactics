import * as THREE from 'three';

// Cache maps for reusable Three.js resources
const cylinderGeos = new Map<string, THREE.CylinderGeometry>();
const sphereGeos = new Map<string, THREE.SphereGeometry>();
const boxGeos = new Map<string, THREE.BoxGeometry>();
const coneGeos = new Map<string, THREE.ConeGeometry>();
const torusGeos = new Map<string, THREE.TorusGeometry>();
const ringGeos = new Map<string, THREE.RingGeometry>();
const octahedronGeos = new Map<string, THREE.OctahedronGeometry>();
const dodecahedronGeos = new Map<string, THREE.DodecahedronGeometry>();

const stdMaterials = new Map<string, THREE.MeshStandardMaterial>();
const basicMaterials = new Map<string, THREE.MeshBasicMaterial>();

export function getCachedCylinder(
  radiusTop: number,
  radiusBottom: number,
  height: number,
  radialSegments: number = 14,
  heightSegments: number = 1,
  openEnded: boolean = false
): THREE.CylinderGeometry {
  const key = `${radiusTop}_${radiusBottom}_${height}_${radialSegments}_${heightSegments}_${openEnded}`;
  let geo = cylinderGeos.get(key);
  if (!geo) {
    geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded);
    cylinderGeos.set(key, geo);
  }
  return geo;
}

export function getCachedSphere(
  radius: number,
  widthSegments: number = 14,
  heightSegments: number = 14
): THREE.SphereGeometry {
  const key = `${radius}_${widthSegments}_${heightSegments}`;
  let geo = sphereGeos.get(key);
  if (!geo) {
    geo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    sphereGeos.set(key, geo);
  }
  return geo;
}

export function getCachedBox(
  width: number,
  height: number,
  depth: number
): THREE.BoxGeometry {
  const key = `${width}_${height}_${depth}`;
  let geo = boxGeos.get(key);
  if (!geo) {
    geo = new THREE.BoxGeometry(width, height, depth);
    boxGeos.set(key, geo);
  }
  return geo;
}

export function getCachedCone(
  radius: number,
  height: number,
  radialSegments: number = 12
): THREE.ConeGeometry {
  const key = `${radius}_${height}_${radialSegments}`;
  let geo = coneGeos.get(key);
  if (!geo) {
    geo = new THREE.ConeGeometry(radius, height, radialSegments);
    coneGeos.set(key, geo);
  }
  return geo;
}

export function getCachedTorus(
  radius: number,
  tube: number,
  radialSegments: number = 10,
  tubularSegments: number = 20,
  arc: number = Math.PI * 2
): THREE.TorusGeometry {
  const key = `${radius}_${tube}_${radialSegments}_${tubularSegments}_${arc}`;
  let geo = torusGeos.get(key);
  if (!geo) {
    geo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
    torusGeos.set(key, geo);
  }
  return geo;
}

export function getCachedRing(
  innerRadius: number,
  outerRadius: number,
  thetaSegments: number = 24
): THREE.RingGeometry {
  const key = `${innerRadius}_${outerRadius}_${thetaSegments}`;
  let geo = ringGeos.get(key);
  if (!geo) {
    geo = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
    geo.rotateX(-Math.PI / 2);
    ringGeos.set(key, geo);
  }
  return geo;
}

export function getCachedOctahedron(radius: number = 1): THREE.OctahedronGeometry {
  const key = `${radius}`;
  let geo = octahedronGeos.get(key);
  if (!geo) {
    geo = new THREE.OctahedronGeometry(radius, 0);
    octahedronGeos.set(key, geo);
  }
  return geo;
}

export function getCachedDodecahedron(radius: number = 1): THREE.DodecahedronGeometry {
  const key = `${radius}`;
  let geo = dodecahedronGeos.get(key);
  if (!geo) {
    geo = new THREE.DodecahedronGeometry(radius, 0);
    dodecahedronGeos.set(key, geo);
  }
  return geo;
}

export function getCachedStandardMaterial(params: THREE.MeshStandardMaterialParameters): THREE.MeshStandardMaterial {
  const key = `${params.color ?? ''}_${params.roughness ?? ''}_${params.metalness ?? ''}_${params.emissive ?? ''}_${params.emissiveIntensity ?? ''}_${params.transparent ?? ''}_${params.opacity ?? ''}`;
  let mat = stdMaterials.get(key);
  if (!mat) {
    mat = new THREE.MeshStandardMaterial(params);
    stdMaterials.set(key, mat);
  }
  return mat;
}

export function getCachedBasicMaterial(params: THREE.MeshBasicMaterialParameters): THREE.MeshBasicMaterial {
  const key = `${params.color ?? ''}_${params.transparent ?? ''}_${params.opacity ?? ''}_${params.depthWrite ?? ''}_${params.side ?? ''}`;
  let mat = basicMaterials.get(key);
  if (!mat) {
    mat = new THREE.MeshBasicMaterial(params);
    basicMaterials.set(key, mat);
  }
  return mat;
}

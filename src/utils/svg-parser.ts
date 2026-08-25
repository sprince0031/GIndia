import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

export interface StateMeshInfo {
  id: string;
  name: string;
  group: THREE.Group;
  mesh: THREE.Mesh;
  boundaryLine: THREE.LineSegments;
  centroid: THREE.Vector3;
  basePosition: THREE.Vector3;
  isHovered: boolean;
  isSelected: boolean;
}

export interface MapParseResult {
  mapGroup: THREE.Group;
  interactiveMeshes: THREE.Mesh[];
  stateInfoMap: Map<string, StateMeshInfo>;
}

export class SvgMapParser {
  // Materials
  private static stonewareMaterial = new THREE.MeshStandardMaterial({
    color: 0xE6DFD5,
    roughness: 0.72,
    metalness: 0.08,
    flatShading: false
  });

  private static boundaryLineMaterial = new THREE.LineBasicMaterial({
    color: 0xA49688,
    linewidth: 1.5,
    transparent: true,
    opacity: 0.85
  });

  public static async loadAndParse(svgUrl: string): Promise<MapParseResult> {
    const response = await fetch(svgUrl);
    const svgText = await response.text();
    return this.parseSvgString(svgText);
  }

  public static parseSvgString(svgText: string): MapParseResult {
    const loader = new SVGLoader();
    const svgData = loader.parse(svgText);

    const mapGroup = new THREE.Group();
    const interactiveMeshes: THREE.Mesh[] = [];
    const stateInfoMap = new Map<string, StateMeshInfo>();

    // 1. Process all SVG Paths
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 14,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 1.2,
      bevelThickness: 1.5
    };

    const tempBox = new THREE.Box3();

    for (const path of svgData.paths) {
      // Path element attributes from SVG
      const userData = path.userData?.node as SVGElement | undefined;
      const stateId = (userData?.getAttribute('id') || '').toUpperCase().trim();
      const stateName = userData?.getAttribute('name') || stateId;

      if (!stateId) continue;

      const shapes = SVGLoader.createShapes(path);
      if (!shapes || shapes.length === 0) continue;

      const stateGroup = new THREE.Group();
      stateGroup.name = `state-group-${stateId}`;

      // Combine subpaths for multi-polygon states/islands
      const geometries: THREE.ExtrudeGeometry[] = shapes.map(shape => new THREE.ExtrudeGeometry(shape, extrudeSettings));
      
      // Merge geometries or group them
      for (const geo of geometries) {
        geo.computeVertexNormals();

        // Unique material clone per state to allow independent color transitions
        const stateMaterial = this.stonewareMaterial.clone();

        const mesh = new THREE.Mesh(geo, stateMaterial);
        mesh.name = `state-mesh-${stateId}`;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = {
          stateId,
          stateName,
          originalColor: stateMaterial.color.getHex()
        };

        // Edge boundary line segments
        const edges = new THREE.EdgesGeometry(geo, 28);
        const boundaryLine = new THREE.LineSegments(edges, this.boundaryLineMaterial.clone());
        boundaryLine.position.z = 0.2; // Slightly above mesh surface

        stateGroup.add(mesh);
        stateGroup.add(boundaryLine);
        interactiveMeshes.push(mesh);

        // Compute Bounding Box
        geo.computeBoundingBox();
        if (geo.boundingBox) {
          tempBox.union(geo.boundingBox);
        }
      }

      mapGroup.add(stateGroup);

      // Compute geometric centroid
      const stateBox = new THREE.Box3().setFromObject(stateGroup);
      const centroid = new THREE.Vector3();
      stateBox.getCenter(centroid);

      stateInfoMap.set(stateId, {
        id: stateId,
        name: stateName,
        group: stateGroup,
        mesh: stateGroup.children[0] as THREE.Mesh,
        boundaryLine: stateGroup.children[1] as THREE.LineSegments,
        centroid,
        basePosition: stateGroup.position.clone(),
        isHovered: false,
        isSelected: false
      });
    }

    // 2. Center and Flip Y (SVG coordinates have Y down; 3D scene has Y up)
    const compositeBox = new THREE.Box3().setFromObject(mapGroup);
    const center = new THREE.Vector3();
    compositeBox.getCenter(center);
    const size = new THREE.Vector3();
    compositeBox.getSize(size);

    // Scale to fit nicely in ~520 units wide bounding box
    const maxDim = Math.max(size.x, size.y);
    const targetScale = 520 / maxDim;

    mapGroup.scale.set(targetScale, -targetScale, targetScale); // Note negative Y to flip SVG orientation correctly
    mapGroup.position.set(-center.x * targetScale, center.y * targetScale, 0);

    // Recompute centroids in world coordinates after parent scale & offset
    mapGroup.updateMatrixWorld(true);
    for (const info of stateInfoMap.values()) {
      const worldBox = new THREE.Box3().setFromObject(info.group);
      worldBox.getCenter(info.centroid);
      info.basePosition = info.group.position.clone();
    }

    return {
      mapGroup,
      interactiveMeshes,
      stateInfoMap
    };
  }
}
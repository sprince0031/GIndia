import * as THREE from 'three';
import gsap from 'gsap';
import { StateMeshInfo } from '../utils/svg-parser';
import { CategoryFilterManager } from './category-filter';

export interface InteractionManagerOptions {
  camera: THREE.PerspectiveCamera;
  domElement: HTMLElement;
  interactiveMeshes: THREE.Mesh[];
  stateInfoMap: Map<string, StateMeshInfo>;
  categoryFilterManager?: CategoryFilterManager;
  onStateHover?: (stateId: string | null, stateName: string | null) => void;
  onStateSelect?: (stateId: string, stateName: string, centroid: THREE.Vector3) => void;
  onStateDeselect?: () => void;
}

export class InteractionManager {
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;
  private interactiveMeshes: THREE.Mesh[];
  private stateInfoMap: Map<string, StateMeshInfo>;
  private categoryFilterManager?: CategoryFilterManager;

  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private pointer: THREE.Vector2 = new THREE.Vector2(-9999, -9999);
  
  private hoveredStateId: string | null = null;
  private selectedStateId: string | null = null;

  private onStateHover?: (stateId: string | null, stateName: string | null) => void;
  private onStateSelect?: (stateId: string, stateName: string, centroid: THREE.Vector3) => void;
  private onStateDeselect?: () => void;

  private pointerDownPos = { x: 0, y: 0 };

  // Color constants
  private readonly STONE_COLOR = 0xE6DFD5;
  private readonly TERRACOTTA_COLOR = 0xD9531E;
  private readonly TERRACOTTA_EMISSIVE = 0x381206;
  private readonly DIMMED_COLOR = 0xEBE6DE;
  private readonly HOVER_ELEVATION = 10;
  private readonly SELECT_ELEVATION = 14;

  constructor(options: InteractionManagerOptions) {
    this.camera = options.camera;
    this.domElement = options.domElement;
    this.interactiveMeshes = options.interactiveMeshes;
    this.stateInfoMap = options.stateInfoMap;
    this.categoryFilterManager = options.categoryFilterManager;
    this.onStateHover = options.onStateHover;
    this.onStateSelect = options.onStateSelect;
    this.onStateDeselect = options.onStateDeselect;

    this.attachEventListeners();
  }

  public setCategoryFilterManager(mgr: CategoryFilterManager): void {
    this.categoryFilterManager = mgr;
  }

  private attachEventListeners(): void {
    this.domElement.addEventListener('pointermove', this.onPointerMove);
    this.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.domElement.addEventListener('pointerup', this.onPointerUp);
    this.domElement.addEventListener('pointerleave', this.onPointerLeave);
  }

  private onPointerMove = (e: PointerEvent): void => {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.performRaycast();
  };

  private onPointerDown = (e: PointerEvent): void => {
    this.pointerDownPos = { x: e.clientX, y: e.clientY };
  };

  private onPointerUp = (e: PointerEvent): void => {
    const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
    if (dist < 10) {
      const rect = this.domElement.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveMeshes, true);
      
      if (intersects.length === 0) {
        // Clicked outside in the ocean: deselect active card
        this.deselectState();
        this.onStateDeselect?.();
        return;
      }

      let obj: THREE.Object3D | null = intersects[0].object;
      while (obj && !obj.userData?.stateId) {
        obj = obj.parent;
      }
      if (obj?.userData?.stateId) {
        this.selectState(obj.userData.stateId, true);
        return;
      }

      if (this.hoveredStateId) {
        this.selectState(this.hoveredStateId, true);
      }
    }
  };

  private onPointerLeave = (): void => {
    this.pointer.set(-9999, -9999);
    if (this.hoveredStateId && this.hoveredStateId !== this.selectedStateId) {
      this.animateStateHover(this.hoveredStateId, false);
      this.hoveredStateId = null;
      this.domElement.style.cursor = 'grab';
      this.onStateHover?.(null, null);
    }
  };

  private performRaycast(): void {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveMeshes, true);

    if (intersects.length > 0) {
      let obj: THREE.Object3D | null = intersects[0].object;
      while (obj && !obj.userData?.stateId) {
        obj = obj.parent;
      }

      const stateId = obj?.userData?.stateId as string | undefined;
      const stateName = obj?.userData?.stateName as string | undefined;

      if (stateId && stateId !== this.hoveredStateId) {
        if (this.hoveredStateId && this.hoveredStateId !== this.selectedStateId) {
          this.animateStateHover(this.hoveredStateId, false);
        }

        this.hoveredStateId = stateId;
        this.domElement.style.cursor = 'pointer';
        if (this.hoveredStateId !== this.selectedStateId) {
          this.animateStateHover(stateId, true);
        }
        this.onStateHover?.(stateId, stateName || stateId);
      }
    } else {
      if (this.hoveredStateId) {
        if (this.hoveredStateId !== this.selectedStateId) {
          this.animateStateHover(this.hoveredStateId, false);
        }
        this.hoveredStateId = null;
        this.domElement.style.cursor = 'grab';
        this.onStateHover?.(null, null);
      }
    }
  }

  public selectState(stateId: string, emitEvent = true): void {
    const cleanId = stateId.replace('-', '').toUpperCase();
    const info = this.stateInfoMap.get(cleanId);
    if (!info) return;

    // Reset ALL other states to their resting filter/default style
    for (const [id, otherInfo] of this.stateInfoMap.entries()) {
      if (id !== cleanId) {
        otherInfo.isSelected = false;
        otherInfo.isHovered = false;
        this.restoreStateToResting(id);
      }
    }

    const wasAlreadySelected = this.selectedStateId === cleanId;
    this.selectedStateId = cleanId;
    this.animateStateSelect(cleanId, true);

    if (emitEvent && !wasAlreadySelected) {
      this.onStateSelect?.(cleanId, info.name, info.centroid);
    }
  }

  public deselectState(): void {
    for (const [id, info] of this.stateInfoMap.entries()) {
      info.isSelected = false;
      info.isHovered = false;
      this.restoreStateToResting(id);
    }
    this.selectedStateId = null;
    this.hoveredStateId = null;
  }

  private getRestingStateStyle(stateId: string): { color: number; emissive: number; z: number; opacity: number; transparent: boolean } {
    const isFilterActive = this.categoryFilterManager?.isFilterActive() ?? false;
    if (isFilterActive) {
      const isMatch = this.categoryFilterManager?.isStateMatching(stateId) ?? false;
      if (isMatch) {
        return { color: this.TERRACOTTA_COLOR, emissive: 0x240A04, z: 5, opacity: 1.0, transparent: false };
      } else {
        return { color: this.DIMMED_COLOR, emissive: 0x000000, z: 0, opacity: 0.32, transparent: true };
      }
    }
    return { color: this.STONE_COLOR, emissive: 0x000000, z: 0, opacity: 1.0, transparent: false };
  }

  private restoreStateToResting(stateId: string): void {
    const info = this.stateInfoMap.get(stateId);
    if (!info) return;

    const style = this.getRestingStateStyle(stateId);

    gsap.to(info.group.position, {
      z: style.z,
      duration: 0.35,
      ease: 'power2.out'
    });

    info.group.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.color.setHex(style.color);
        child.material.emissive.setHex(style.emissive);
        child.material.opacity = style.opacity;
        child.material.transparent = style.transparent;
      }
    });
  }

  private animateStateHover(stateId: string, isHovered: boolean): void {
    const info = this.stateInfoMap.get(stateId);
    if (!info) return;

    info.isHovered = isHovered;

    if (isHovered) {
      gsap.to(info.group.position, {
        z: this.HOVER_ELEVATION,
        duration: 0.28,
        ease: 'power2.out'
      });

      info.group.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color.setHex(this.TERRACOTTA_COLOR);
          child.material.emissive.setHex(this.TERRACOTTA_EMISSIVE);
          child.material.opacity = 1.0;
          child.material.transparent = false;
        }
      });
    } else {
      // Revert to resting state style (preserving active category filter shading)
      if (!info.isSelected) {
        this.restoreStateToResting(stateId);
      }
    }
  }

  private animateStateSelect(stateId: string, isSelected: boolean): void {
    const info = this.stateInfoMap.get(stateId);
    if (!info) return;

    info.isSelected = isSelected;

    if (isSelected) {
      gsap.to(info.group.position, {
        z: this.SELECT_ELEVATION,
        duration: 0.35,
        ease: 'elastic.out(1, 0.75)'
      });

      info.group.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color.setHex(this.TERRACOTTA_COLOR);
          child.material.emissive.setHex(0x4A1808);
          child.material.opacity = 1.0;
          child.material.transparent = false;
        }
      });
    } else {
      this.restoreStateToResting(stateId);
    }
  }

  public toScreenPosition(worldPosition: THREE.Vector3): { x: number; y: number; isVisible: boolean } {
    const vector = worldPosition.clone();
    vector.project(this.camera);

    const rect = this.domElement.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;

    const x = vector.x * halfWidth + halfWidth + rect.left;
    const y = -vector.y * halfHeight + halfHeight + rect.top;
    const isVisible = vector.z < 1.0;

    return { x, y, isVisible };
  }

  public getSelectedStateId(): string | null {
    return this.selectedStateId;
  }

  public getStateInfo(stateId: string): StateMeshInfo | undefined {
    const cleanId = stateId.replace('-', '').toUpperCase();
    return this.stateInfoMap.get(cleanId);
  }

  public dispose(): void {
    this.domElement.removeEventListener('pointermove', this.onPointerMove);
    this.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.domElement.removeEventListener('pointerup', this.onPointerUp);
    this.domElement.removeEventListener('pointerleave', this.onPointerLeave);
  }
}
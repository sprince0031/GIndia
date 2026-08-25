import * as THREE from 'three';
import gsap from 'gsap';
import { GICategory } from '../types/gi-data';
import { StateMeshInfo } from '../utils/svg-parser';
import { db } from '../utils/database';

export interface CategoryFilterOptions {
  stateInfoMap: Map<string, StateMeshInfo>;
  onFilterChange?: (category: GICategory | 'All') => void;
}

export class CategoryFilterManager {
  private stateInfoMap: Map<string, StateMeshInfo>;
  private currentFilter: GICategory | 'All' = 'All';
  private onFilterChange?: (category: GICategory | 'All') => void;

  private readonly STONE_COLOR = 0xE6DFD5;
  private readonly TERRACOTTA_COLOR = 0xD9531E;
  private readonly DIMMED_COLOR = 0xEBE6DE;

  constructor(options: CategoryFilterOptions) {
    this.stateInfoMap = options.stateInfoMap;
    this.onFilterChange = options.onFilterChange;
  }

  public setFilter(category: GICategory | 'All'): void {
    this.currentFilter = category;

    if (category === 'All') {
      this.resetFilter();
    } else {
      this.applyCategoryFilter(category);
    }

    this.onFilterChange?.(category);
  }

  private applyCategoryFilter(category: GICategory): void {
    const products = db.filterProductsByCategory(category);
    const matchingStateIds = new Set(products.map(p => p.stateId.replace('-', '').toUpperCase()));

    for (const [stateId, info] of this.stateInfoMap.entries()) {
      const isMatch = matchingStateIds.has(stateId);
      const mesh = info.mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;

      if (isMatch) {
        // Highlight matching state
        gsap.to(info.group.position, {
          z: 5,
          duration: 0.35,
          ease: 'power2.out'
        });

        material.color.setHex(this.TERRACOTTA_COLOR);
        material.opacity = 1.0;
        material.transparent = false;
      } else {
        // Dim non-matching state
        gsap.to(info.group.position, {
          z: 0,
          duration: 0.35,
          ease: 'power2.out'
        });

        material.color.setHex(this.DIMMED_COLOR);
        material.opacity = 0.32;
        material.transparent = true;
      }
    }
  }

  public resetFilter(): void {
    for (const info of this.stateInfoMap.values()) {
      const mesh = info.mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;

      if (!info.isSelected && !info.isHovered) {
        gsap.to(info.group.position, {
          z: 0,
          duration: 0.35,
          ease: 'power2.out'
        });

        material.color.setHex(this.STONE_COLOR);
      }

      material.opacity = 1.0;
      material.transparent = false;
    }
  }

  public getCurrentFilter(): GICategory | 'All' {
    return this.currentFilter;
  }
}
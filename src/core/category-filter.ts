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
  private matchingStateIds: Set<string> = new Set();
  private onFilterChange?: (category: GICategory | 'All') => void;

  public readonly STONE_COLOR = 0xE6DFD5;
  public readonly TERRACOTTA_COLOR = 0xD9531E;
  public readonly TERRACOTTA_EMISSIVE = 0x240A04;
  public readonly DIMMED_COLOR = 0xEBE6DE;

  constructor(options: CategoryFilterOptions) {
    this.stateInfoMap = options.stateInfoMap;
    this.onFilterChange = options.onFilterChange;
  }

  public setFilter(category: GICategory | 'All'): void {
    this.currentFilter = category;

    if (category === 'All') {
      this.matchingStateIds.clear();
      this.resetFilter();
    } else {
      this.applyCategoryFilter(category);
    }

    this.onFilterChange?.(category);
  }

  private applyCategoryFilter(category: GICategory): void {
    const products = db.filterProductsByCategory(category);
    this.matchingStateIds = new Set(products.map(p => p.stateId.replace('-', '').toUpperCase()));

    for (const [stateId, info] of this.stateInfoMap.entries()) {
      const cleanId = stateId.replace('-', '').toUpperCase();
      const isMatch = this.matchingStateIds.has(cleanId);
      const isSelected = info.isSelected;

      const targetZ = isSelected ? 14 : (isMatch ? 5 : 0);
      const targetColor = (isSelected || isMatch) ? this.TERRACOTTA_COLOR : this.DIMMED_COLOR;
      const targetEmissive = isSelected ? 0x4A1808 : (isMatch ? this.TERRACOTTA_EMISSIVE : 0x000000);
      const targetOpacity = (isSelected || isMatch) ? 1.0 : 0.32;
      const isTransparent = !(isSelected || isMatch);

      gsap.to(info.group.position, {
        z: targetZ,
        duration: 0.35,
        ease: 'power2.out'
      });

      info.group.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color.setHex(targetColor);
          child.material.emissive.setHex(targetEmissive);
          child.material.opacity = targetOpacity;
          child.material.transparent = isTransparent;
        }
      });
    }
  }

  public resetFilter(): void {
    this.matchingStateIds.clear();

    for (const info of this.stateInfoMap.values()) {
      const isSelected = info.isSelected;
      const targetZ = isSelected ? 14 : 0;
      const targetColor = isSelected ? this.TERRACOTTA_COLOR : this.STONE_COLOR;
      const targetEmissive = isSelected ? 0x4A1808 : 0x000000;

      gsap.to(info.group.position, {
        z: targetZ,
        duration: 0.35,
        ease: 'power2.out'
      });

      info.group.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color.setHex(targetColor);
          child.material.emissive.setHex(targetEmissive);
          child.material.opacity = 1.0;
          child.material.transparent = false;
        }
      });
    }
  }

  public isFilterActive(): boolean {
    return this.currentFilter !== 'All';
  }

  public isStateMatching(stateId: string): boolean {
    if (!this.isFilterActive()) return false;
    const cleanId = stateId.replace('-', '').toUpperCase();
    return this.matchingStateIds.has(cleanId);
  }

  public getCurrentFilter(): GICategory | 'All' {
    return this.currentFilter;
  }
}
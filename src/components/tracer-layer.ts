import * as THREE from 'three';
import { InteractionManager } from '../core/interaction-manager';
import { InfoCardManager } from './info-card';

export interface TracerLayerOptions {
  svgElement: SVGSVGElement;
  interactionManager: InteractionManager;
  infoCardManager: InfoCardManager;
}

export class TracerLayer {
  private svg: SVGSVGElement;
  private interactionManager: InteractionManager;
  private infoCardManager: InfoCardManager;
  private isVisible = false;
  private activeCentroid3D: THREE.Vector3 | null = null;

  constructor(options: TracerLayerOptions) {
    this.svg = options.svgElement;
    this.interactionManager = options.interactionManager;
    this.infoCardManager = options.infoCardManager;
  }

  public setTargetCentroid(centroid3D: THREE.Vector3 | null): void {
    this.activeCentroid3D = centroid3D;
    this.isVisible = !!centroid3D;
    if (!this.isVisible) {
      this.clear();
    }
  }

  public update(): void {
    if (!this.isVisible || !this.activeCentroid3D) {
      this.clear();
      return;
    }

    const cardAnchor = this.infoCardManager.getActiveCardAnchor();
    if (!cardAnchor) {
      this.clear();
      return;
    }

    const startPos = this.interactionManager.toScreenPosition(this.activeCentroid3D);
    if (!startPos.isVisible) {
      this.clear();
      return;
    }

    const x1 = startPos.x;
    const y1 = startPos.y;
    const x2 = cardAnchor.x;
    const y2 = cardAnchor.y;

    // Cubic Bezier curve control points
    const dx = Math.abs(x2 - x1);
    const cx1 = cardAnchor.isEast ? x1 + dx * 0.45 : x1 - dx * 0.45;
    const cy1 = y1;
    const cx2 = cardAnchor.isEast ? x2 - dx * 0.45 : x2 + dx * 0.45;
    const cy2 = y2;

    const pathD = `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${cx1.toFixed(1)} ${cy1.toFixed(1)}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;

    this.svg.innerHTML = `
      <defs>
        <linearGradient id="tracerGrad" x1="${x1 < x2 ? '0%' : '100%'}" y1="0%" x2="${x1 < x2 ? '100%' : '0%'}" y2="0%">
          <stop offset="0%" stop-color="#0284C7" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#0284C7" stop-opacity="0.25" />
        </linearGradient>
      </defs>

      <!-- Glow Background Ray -->
      <path d="${pathD}" fill="none" stroke="rgba(2, 132, 199, 0.2)" stroke-width="6" stroke-linecap="round" />

      <!-- Animated Traveling Dashed Ray -->
      <path d="${pathD}" fill="none" stroke="url(#tracerGrad)" stroke-width="2.2" stroke-linecap="round" class="tracer-line" />

      <!-- 3D State Origin Anchor Pin (Pulsing) -->
      <g transform="translate(${x1.toFixed(1)}, ${y1.toFixed(1)})">
        <circle r="10" fill="rgba(2, 132, 199, 0.25)" class="pin-pulse" />
        <circle r="5.5" fill="#0284C7" stroke="#FFFFFF" stroke-width="2" />
        <circle r="2" fill="#FFFFFF" />
      </g>

      <!-- Target Info Card Terminal Dot -->
      <g transform="translate(${x2.toFixed(1)}, ${y2.toFixed(1)})">
        <circle r="4" fill="#0284C7" stroke="#FFFFFF" stroke-width="1.5" />
      </g>
    `;
  }

  public clear(): void {
    if (this.svg.innerHTML !== '') {
      this.svg.innerHTML = '';
    }
  }

  public hide(): void {
    this.isVisible = false;
    this.activeCentroid3D = null;
    this.clear();
  }
}
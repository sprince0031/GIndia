import gsap from 'gsap';
import { GICategory } from '../types/gi-data';
import { db } from '../utils/database';

export interface SvgMapEngineOptions {
  container: HTMLElement;
  onStateHover?: (stateId: string, stateName: string | null) => void;
  onStateSelect?: (stateId: string, stateName: string, centroid: { x: number; y: number; screenX: number; screenY: number }) => void;
  onStateDeselect?: () => void;
}

interface StatePathInfo {
  id: string;
  name: string;
  paths: SVGPathElement[];
  bbox: { x: number; y: number; width: number; height: number };
  centroid: { x: number; y: number };
}

export class SvgMapEngine {
  private container: HTMLElement;
  private svgElement: SVGSVGElement | null = null;
  private statePathMap = new Map<string, StatePathInfo>();
  
  // ViewBox pan and zoom state
  private defaultViewBox = { x: 0, y: 0, w: 1000, h: 1000 };
  private currentViewBox = { x: 0, y: 0, w: 1000, h: 1000 };
  private minZoom = 250; // Maximum zoom in
  private maxZoom = 1300; // Maximum zoom out
  
  // Selection and filter state
  private selectedStateId: string | null = null;
  private hoveredStateId: string | null = null;
  private activeCategoryFilter: GICategory | 'All' = 'All';

  // Interaction tracking
  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private viewBoxStart = { x: 0, y: 0 };
  private initialPinchDist = 0;
  private initialPinchViewW = 1000;

  // Callbacks
  private onStateHover?: (stateId: string, stateName: string | null) => void;
  private onStateSelect?: (stateId: string, stateName: string, centroid: { x: number; y: number; screenX: number; screenY: number }) => void;
  private onStateDeselect?: () => void;

  constructor(options: SvgMapEngineOptions) {
    this.container = options.container;
    this.onStateHover = options.onStateHover;
    this.onStateSelect = options.onStateSelect;
    this.onStateDeselect = options.onStateDeselect;
  }

  public async loadMap(svgUrl = 'assets/in.svg'): Promise<void> {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const cleanPath = svgUrl.startsWith('/') ? svgUrl.slice(1) : svgUrl;
    const finalUrl = `${cleanBase}${cleanPath}`;

    const res = await fetch(finalUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch 2D SVG map: ${res.statusText}`);
    }

    const svgText = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const parsedSvg = doc.querySelector('svg');

    if (!parsedSvg) {
      throw new Error('Invalid SVG content parsed');
    }

    this.container.innerHTML = '';
    this.svgElement = parsedSvg;
    this.svgElement.setAttribute('id', 'interactive-2d-svg-map');
    this.svgElement.setAttribute('class', 'w-full h-full cursor-grab active:cursor-grabbing select-none transition-opacity duration-300');
    this.svgElement.setAttribute('viewBox', '0 0 1000 1000');
    this.svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    this.container.appendChild(this.svgElement);

    this.parseAndIndexPaths();
    this.setupInteractions();
    this.resetView(false);

    console.info(`🗺️ 2D Interactive SVG Map Engine Loaded with ${this.statePathMap.size} regions.`);
  }

  private parseAndIndexPaths(): void {
    if (!this.svgElement) return;

    const paths = Array.from(this.svgElement.querySelectorAll('path'));
    const tempGroupMap = new Map<string, { id: string; name: string; paths: SVGPathElement[] }>();

    for (const path of paths) {
      const rawId = path.getAttribute('id') || '';
      const cleanId = rawId.replace('-', '').toUpperCase();
      if (!cleanId) continue;

      const name = path.getAttribute('name') || cleanId;
      
      // Apply clean museum vector styling
      path.setAttribute('vector-effect', 'non-scaling-stroke');
      path.setAttribute('stroke', '#FAF7F2');
      path.setAttribute('stroke-width', '1');
      path.setAttribute('fill', '#E6DFD5');
      path.style.transition = 'fill 0.2s ease, opacity 0.2s ease, stroke-width 0.2s ease';
      path.style.cursor = 'pointer';

      if (!tempGroupMap.has(cleanId)) {
        tempGroupMap.set(cleanId, { id: cleanId, name, paths: [] });
      }
      tempGroupMap.get(cleanId)!.paths.push(path);
    }

    // Compute bounding boxes and centroids
    tempGroupMap.forEach((entry, id) => {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      for (const p of entry.paths) {
        try {
          const bbox = p.getBBox();
          if (bbox.width > 0 && bbox.height > 0) {
            minX = Math.min(minX, bbox.x);
            minY = Math.min(minY, bbox.y);
            maxX = Math.max(maxX, bbox.x + bbox.width);
            maxY = Math.max(maxY, bbox.y + bbox.height);
          }
        } catch {
          // Fallback if getBBox is not available
        }
      }

      if (minX === Infinity) {
        minX = 0; minY = 0; maxX = 1000; maxY = 1000;
      }

      const width = maxX - minX;
      const height = maxY - minY;
      const centroid = { x: minX + width / 2, y: minY + height / 2 };

      this.statePathMap.set(id, {
        id,
        name: entry.name,
        paths: entry.paths,
        bbox: { x: minX, y: minY, width, height },
        centroid
      });
    });
  }

  private setupInteractions(): void {
    if (!this.svgElement) return;

    // Path Hover & Click Listeners
    this.statePathMap.forEach((info) => {
      info.paths.forEach((p) => {
        p.addEventListener('mouseenter', () => this.handleStateHover(info.id, true));
        p.addEventListener('mouseleave', () => this.handleStateHover(info.id, false));
        p.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectState(info.id, true);
        });
      });
    });

    // Deselect on background click
    this.svgElement.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).tagName.toLowerCase() === 'svg') {
        this.deselectState();
      }
    });

    // Mouse Drag Pan
    this.svgElement.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Left button only
      this.isDragging = true;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.viewBoxStart = { x: this.currentViewBox.x, y: this.currentViewBox.y };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging || !this.svgElement) return;
      const dx = (e.clientX - this.dragStart.x) * (this.currentViewBox.w / this.svgElement.clientWidth);
      const dy = (e.clientY - this.dragStart.y) * (this.currentViewBox.h / this.svgElement.clientHeight);

      this.currentViewBox.x = this.viewBoxStart.x - dx;
      this.currentViewBox.y = this.viewBoxStart.y - dy;
      this.applyViewBox();
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Mouse Wheel Zoom
    this.svgElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.88 : 1.14;
      this.zoomAtClientPoint(e.clientX, e.clientY, zoomFactor);
    }, { passive: false });

    // Touch Support (Single touch pan, pinch zoom)
    this.svgElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.viewBoxStart = { x: this.currentViewBox.x, y: this.currentViewBox.y };
      } else if (e.touches.length === 2) {
        this.isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        this.initialPinchDist = Math.hypot(dx, dy);
        this.initialPinchViewW = this.currentViewBox.w;
      }
    }, { passive: true });

    this.svgElement.addEventListener('touchmove', (e) => {
      if (!this.svgElement) return;

      if (e.touches.length === 1 && this.isDragging) {
        const dx = (e.touches[0].clientX - this.dragStart.x) * (this.currentViewBox.w / this.svgElement.clientWidth);
        const dy = (e.touches[0].clientY - this.dragStart.y) * (this.currentViewBox.h / this.svgElement.clientHeight);
        this.currentViewBox.x = this.viewBoxStart.x - dx;
        this.currentViewBox.y = this.viewBoxStart.y - dy;
        this.applyViewBox();
      } else if (e.touches.length === 2 && this.initialPinchDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        const scale = this.initialPinchDist / currentDist;
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        const newW = Math.max(this.minZoom, Math.min(this.maxZoom, this.initialPinchViewW * scale));
        const factor = newW / this.currentViewBox.w;
        this.zoomAtClientPoint(midX, midY, factor);
      }
    }, { passive: true });

    this.svgElement.addEventListener('touchend', () => {
      this.isDragging = false;
      this.initialPinchDist = 0;
    });

    // Double Click / Double Tap to Focus
    this.svgElement.addEventListener('dblclick', (e) => {
      const target = e.target as SVGElement;
      if (target.tagName.toLowerCase() === 'path') {
        const rawId = target.getAttribute('id') || '';
        const cleanId = rawId.replace('-', '').toUpperCase();
        if (cleanId) {
          this.focusOnState(cleanId);
        }
      }
    });
  }

  private zoomAtClientPoint(clientX: number, clientY: number, factor: number): void {
    if (!this.svgElement) return;

    const rect = this.svgElement.getBoundingClientRect();
    const svgPointX = this.currentViewBox.x + ((clientX - rect.left) / rect.width) * this.currentViewBox.w;
    const svgPointY = this.currentViewBox.y + ((clientY - rect.top) / rect.height) * this.currentViewBox.h;

    const newW = Math.max(this.minZoom, Math.min(this.maxZoom, this.currentViewBox.w * factor));
    const newH = newW * (this.defaultViewBox.h / this.defaultViewBox.w);

    const newX = svgPointX - ((clientX - rect.left) / rect.width) * newW;
    const newY = svgPointY - ((clientY - rect.top) / rect.height) * newH;

    this.currentViewBox = { x: newX, y: newY, w: newW, h: newH };
    this.applyViewBox();
  }

  private applyViewBox(): void {
    if (!this.svgElement) return;
    this.svgElement.setAttribute('viewBox', `${this.currentViewBox.x} ${this.currentViewBox.y} ${this.currentViewBox.w} ${this.currentViewBox.h}`);
  }

  public focusOnState(stateId: string): void {
    const cleanId = stateId.replace('-', '').toUpperCase();
    const info = this.statePathMap.get(cleanId);
    if (!info || !this.svgElement) return;

    const targetW = Math.max(380, Math.min(650, info.bbox.width * 2.8));
    const targetH = targetW;
    const targetX = info.centroid.x - targetW / 2;
    const targetY = info.centroid.y - targetH / 2;

    gsap.to(this.currentViewBox, {
      x: targetX,
      y: targetY,
      w: targetW,
      h: targetH,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => this.applyViewBox()
    });
  }

  public resetView(animate = true): void {
    if (!this.svgElement) return;

    if (animate) {
      gsap.to(this.currentViewBox, {
        x: this.defaultViewBox.x,
        y: this.defaultViewBox.y,
        w: this.defaultViewBox.w,
        h: this.defaultViewBox.h,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => this.applyViewBox()
      });
    } else {
      this.currentViewBox = { ...this.defaultViewBox };
      this.applyViewBox();
    }
  }

  private handleStateHover(stateId: string, isHovered: boolean): void {
    if (isHovered) {
      this.hoveredStateId = stateId;
      const info = this.statePathMap.get(stateId);
      this.onStateHover?.(stateId, info ? info.name : null);
    } else {
      if (this.hoveredStateId === stateId) {
        this.hoveredStateId = null;
        this.onStateHover?.(stateId, null);
      }
    }
    this.updateStateStyling(stateId);
  }

  public selectState(stateId: string, notify = true): void {
    const cleanId = stateId.replace('-', '').toUpperCase();
    const prevSelected = this.selectedStateId;
    this.selectedStateId = cleanId;

    if (prevSelected && prevSelected !== cleanId) {
      this.updateStateStyling(prevSelected);
    }
    this.updateStateStyling(cleanId);

    const info = this.statePathMap.get(cleanId);
    if (info && notify) {
      const screenCoord = this.getScreenCoordinates(info.centroid.x, info.centroid.y);
      this.onStateSelect?.(cleanId, info.name, {
        x: info.centroid.x,
        y: info.centroid.y,
        screenX: screenCoord.x,
        screenY: screenCoord.y
      });
      this.focusOnState(cleanId);
    }
  }

  public deselectState(): void {
    const prev = this.selectedStateId;
    this.selectedStateId = null;
    if (prev) {
      this.updateStateStyling(prev);
    }
    this.onStateDeselect?.();
  }

  public setCategoryFilter(category: GICategory | 'All'): void {
    this.activeCategoryFilter = category;
    this.statePathMap.forEach((_, id) => {
      this.updateStateStyling(id);
    });
  }

  private updateStateStyling(stateId: string): void {
    const info = this.statePathMap.get(stateId);
    if (!info) return;

    const isSelected = this.selectedStateId === stateId;
    const isHovered = this.hoveredStateId === stateId;
    const isFilterActive = this.activeCategoryFilter !== 'All';
    const cleanCat = this.activeCategoryFilter.toLowerCase();
    const matchesFilter = isFilterActive 
      ? db.getProductsByState(stateId).some(p => {
          const pCat = p.category.toLowerCase();
          return pCat === cleanCat || 
                 (cleanCat.startsWith('handicraft') && pCat.startsWith('handicraft'));
        })
      : true;

    for (const path of info.paths) {
      if (isSelected) {
        path.setAttribute('fill', '#0284C7'); // Vibrant terracotta
        path.setAttribute('stroke', '#FFFFFF');
        path.setAttribute('stroke-width', '2');
        path.style.opacity = '1.0';
      } else if (isHovered) {
        path.setAttribute('fill', '#0284C7');
        path.setAttribute('stroke', '#FAF7F2');
        path.setAttribute('stroke-width', '1.5');
        path.style.opacity = '1.0';
      } else if (isFilterActive && matchesFilter) {
        path.setAttribute('fill', '#0284C7');
        path.setAttribute('stroke', '#FAF7F2');
        path.setAttribute('stroke-width', '1.2');
        path.style.opacity = '1.0';
      } else if (isFilterActive && !matchesFilter) {
        path.setAttribute('fill', '#E6DFD5');
        path.setAttribute('stroke', '#FAF7F2');
        path.setAttribute('stroke-width', '0.8');
        path.style.opacity = '0.28';
      } else {
        // Resting Default
        path.setAttribute('fill', '#E6DFD5');
        path.setAttribute('stroke', '#FAF7F2');
        path.setAttribute('stroke-width', '1');
        path.style.opacity = '1.0';
      }
    }
  }

  public getScreenCoordinates(svgX: number, svgY: number): { x: number; y: number } {
    if (!this.svgElement) return { x: 0, y: 0 };
    const rect = this.svgElement.getBoundingClientRect();
    const screenX = rect.left + ((svgX - this.currentViewBox.x) / this.currentViewBox.w) * rect.width;
    const screenY = rect.top + ((svgY - this.currentViewBox.y) / this.currentViewBox.h) * rect.height;
    return { x: screenX, y: screenY };
  }

  public getStateCentroid(stateId: string): { x: number; y: number } | null {
    const cleanId = stateId.replace('-', '').toUpperCase();
    const info = this.statePathMap.get(cleanId);
    return info ? info.centroid : null;
  }
}

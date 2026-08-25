import * as THREE from 'three';

export interface SceneManagerOptions {
  container: HTMLElement;
  enableShadows?: boolean;
}

export class SceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public container: HTMLElement;
  
  private keyLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;
  private groundShadow!: THREE.Mesh;
  
  private animationCallbacks: Set<(delta: number, elapsed: number) => void> = new Set();
  private clock: THREE.Clock = new THREE.Clock();
  private animationFrameId: number | null = null;
  private isRendering = false;

  constructor(options: SceneManagerOptions) {
    this.container = options.container;

    // 1. Create Scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent to allow CSS canvas background

    // 2. Create Camera
    const aspect = this.container.clientWidth / this.container.clientHeight || 1;
    this.camera = new THREE.PerspectiveCamera(42, aspect, 1, 3000);
    // Position camera for an elevated 3D angled gallery perspective
    this.camera.position.set(0, -420, 680);
    this.camera.up.set(0, 0, 1); // Z is up in geographic relief models
    this.camera.lookAt(0, 0, 0);

    // 3. Create WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = options.enableShadows !== false;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // Attach to DOM
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Setup Lighting and Shadow Plane
    this.setupLighting();
    this.setupGroundShadow();

    // 5. Handle Resize
    window.addEventListener('resize', this.onWindowResize);

    // 6. Start Loop
    this.start();
  }

  private setupLighting(): void {
    // Warm Directional Sunlight (Primary Key Light)
    this.keyLight = new THREE.DirectionalLight(0xFFF9F0, 2.4);
    this.keyLight.position.set(180, -250, 480);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 50;
    this.keyLight.shadow.camera.far = 1000;
    this.keyLight.shadow.camera.left = -400;
    this.keyLight.shadow.camera.right = 400;
    this.keyLight.shadow.camera.top = 400;
    this.keyLight.shadow.camera.bottom = -400;
    this.keyLight.shadow.bias = -0.0005;
    this.keyLight.shadow.radius = 3.5; // Soft diffused shadows
    this.scene.add(this.keyLight);

    // Cool Ambient Fill Light
    this.fillLight = new THREE.DirectionalLight(0xE0E7FF, 0.7);
    this.fillLight.position.set(-200, 200, 250);
    this.scene.add(this.fillLight);

    // Sky / Ground Hemisphere Light (Natural bounce)
    this.hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xDCD5C6, 0.9);
    this.hemiLight.position.set(0, 0, 400);
    this.scene.add(this.hemiLight);

    // Subtle Ambient Base
    const ambientLight = new THREE.AmbientLight(0xFDFBF7, 0.4);
    this.scene.add(ambientLight);
  }

  private setupGroundShadow(): void {
    // Generate soft radial shadow texture via offscreen Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(256, 256, 10, 256, 256, 250);
      gradient.addColorStop(0, 'rgba(40, 32, 24, 0.28)');
      gradient.addColorStop(0.35, 'rgba(40, 32, 24, 0.16)');
      gradient.addColorStop(0.7, 'rgba(40, 32, 24, 0.04)');
      gradient.addColorStop(1, 'rgba(40, 32, 24, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
    }

    const shadowTexture = new THREE.CanvasTexture(canvas);
    const shadowGeo = new THREE.PlaneGeometry(750, 750);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });

    this.groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.groundShadow.position.set(0, -10, -6);
    this.scene.add(this.groundShadow);
  }

  private onWindowResize = (): void => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height || 1;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  public registerAnimationCallback(cb: (delta: number, elapsed: number) => void): () => void {
    this.animationCallbacks.add(cb);
    return () => this.animationCallbacks.delete(cb);
  }

  public start(): void {
    if (this.isRendering) return;
    this.isRendering = true;
    this.clock.start();

    const loop = () => {
      if (!this.isRendering) return;
      this.animationFrameId = requestAnimationFrame(loop);
      
      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      // Execute all registered animation hooks
      for (const cb of this.animationCallbacks) {
        cb(delta, elapsed);
      }

      this.renderer.render(this.scene, this.camera);
    };

    loop();
  }

  public stop(): void {
    this.isRendering = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public dispose(): void {
    this.stop();
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.dispose();
    this.container.innerHTML = '';
  }
}
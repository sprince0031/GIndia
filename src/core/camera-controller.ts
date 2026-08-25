import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

export interface CameraControllerOptions {
  camera: THREE.PerspectiveCamera;
  domElement: HTMLElement;
}

export class CameraController {
  public controls: OrbitControls;
  private camera: THREE.PerspectiveCamera;
  
  public defaultPosition = new THREE.Vector3(0, -380, 620);
  public readonly defaultTarget = new THREE.Vector3(0, 0, 0);

  constructor(options: CameraControllerOptions) {
    this.camera = options.camera;
    this.controls = new OrbitControls(this.camera, options.domElement);

    // Configure Constrained Exhibition Gallery Controls
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = true;
    this.controls.panSpeed = 0.8;
    this.controls.rotateSpeed = 0.6;
    this.controls.zoomSpeed = 0.8;

    // Calculate responsive camera framing based on initial aspect ratio
    this.updateDefaultPosition();

    // Constrain Zoom Bounds
    this.controls.minDistance = 250;
    this.controls.maxDistance = 1100;

    // Constrain Polar (Elevation) Angles: Prevent looking under ground plane
    this.controls.minPolarAngle = Math.PI * 0.18; // ~32 degrees
    this.controls.maxPolarAngle = Math.PI * 0.44; // ~79 degrees

    // Constrain Azimuth (Rotation) Bounds: Maintain facing orientation
    this.controls.minAzimuthAngle = -Math.PI * 0.40;
    this.controls.maxAzimuthAngle = Math.PI * 0.40;

    // Set initial target and position
    this.controls.target.copy(this.defaultTarget);
    this.camera.position.copy(this.defaultPosition);
    this.controls.update();
  }

  public updateDefaultPosition(): void {
    const aspect = this.camera.aspect || 1.6;
    // For narrower screens (mobile/tablet portrait), step back further
    if (aspect < 1.0) {
      this.defaultPosition.set(0, -560, 920);
    } else if (aspect < 1.4) {
      this.defaultPosition.set(0, -460, 750);
    } else {
      this.defaultPosition.set(0, -360, 600);
    }
  }

  public update(): void {
    this.controls.update();
  }

  /**
   * Smoothly reset camera to default exhibition overview perspective
   */
  public resetView(duration = 1.0): Promise<void> {
    this.updateDefaultPosition();

    return new Promise((resolve) => {
      gsap.to(this.camera.position, {
        x: this.defaultPosition.x,
        y: this.defaultPosition.y,
        z: this.defaultPosition.z,
        duration,
        ease: 'power3.inOut'
      });

      gsap.to(this.controls.target, {
        x: this.defaultTarget.x,
        y: this.defaultTarget.y,
        z: this.defaultTarget.z,
        duration,
        ease: 'power3.inOut',
        onUpdate: () => this.controls.update(),
        onComplete: () => {
          this.controls.update();
          resolve();
        }
      });
    });
  }

  /**
   * Gently pan and focus towards a state centroid
   */
  public focusOnTarget(target: THREE.Vector3, duration = 0.9): Promise<void> {
    return new Promise((resolve) => {
      const isNarrow = (this.camera.aspect || 1.6) < 1.2;
      const targetPos = new THREE.Vector3(
        target.x * 0.45,
        target.y * 0.45 - (isNarrow ? 480 : 320),
        isNarrow ? 720 : 520
      );

      gsap.to(this.camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration,
        ease: 'power2.out'
      });

      gsap.to(this.controls.target, {
        x: target.x * 0.5,
        y: target.y * 0.5,
        z: target.z,
        duration,
        ease: 'power2.out',
        onUpdate: () => this.controls.update(),
        onComplete: () => {
          this.controls.update();
          resolve();
        }
      });
    });
  }

  public dispose(): void {
    this.controls.dispose();
  }
}
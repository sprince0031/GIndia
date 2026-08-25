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
  
  // Default Exhibition Perspectives
  public readonly defaultPosition = new THREE.Vector3(0, -380, 640);
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

    // Constrain Zoom Bounds
    this.controls.minDistance = 280;
    this.controls.maxDistance = 880;

    // Constrain Polar (Elevation) Angles: Prevent looking under ground plane
    this.controls.minPolarAngle = Math.PI * 0.18; // ~32 degrees
    this.controls.maxPolarAngle = Math.PI * 0.44; // ~79 degrees

    // Constrain Azimuth (Rotation) Bounds: Maintain facing orientation
    this.controls.minAzimuthAngle = -Math.PI * 0.38;
    this.controls.maxAzimuthAngle = Math.PI * 0.38;

    // Set initial target
    this.controls.target.copy(this.defaultTarget);
    this.camera.position.copy(this.defaultPosition);
    this.controls.update();
  }

  public update(): void {
    this.controls.update();
  }

  /**
   * Smoothly reset camera to default exhibition overview perspective
   */
  public resetView(duration = 1.0): Promise<void> {
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
      // Calculate gentle offset keeping overview composition
      const targetPos = new THREE.Vector3(
        target.x * 0.45,
        target.y * 0.45 - 340,
        560
      );

      gsap.to(this.camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration,
        ease: 'power2.out'
      });

      gsap.to(this.controls.target, {
        x: target.x * 0.6,
        y: target.y * 0.6,
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
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playUiClick, playGoalCheer } from '../utils/soundEffects';
import { Sparkles, RotateCw, Play } from 'lucide-react';

export const ThreeSoccerBallHero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteractive, setIsInteractive] = useState(true);
  const [bouncedCount, setBouncedCount] = useState(0);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene setup
    const scene = new THREE.Scene();

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // Group for the ball & cyber rings
    const ballGroup = new THREE.Group();
    scene.add(ballGroup);

    // Soccer ball geometry (Icosahedron with truncation simulation or textured sphere)
    const sphereGeo = new THREE.SphereGeometry(1.25, 48, 48);

    // Canvas procedural soccer ball pattern (Red & Black Cyber Hexagons)
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 1024;
    textureCanvas.height = 512;
    const ctx = textureCanvas.getContext('2d');
    if (ctx) {
      // Base dark carbon
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, 1024, 512);

      // Draw stylized sports hexagon seams
      ctx.strokeStyle = '#E6002B';
      ctx.lineWidth = 6;

      const hexRadius = 48;
      for (let y = 0; y < 512 + hexRadius; y += hexRadius * 1.5) {
        for (let x = 0; x < 1024 + hexRadius; x += hexRadius * 1.732) {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = x + hexRadius * Math.cos(angle);
            const hy = y + hexRadius * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();

          // Alternate fill between red and carbon
          if ((Math.floor(x / hexRadius) + Math.floor(y / hexRadius)) % 3 === 0) {
            ctx.fillStyle = '#E6002B';
            ctx.fill();
            ctx.stroke();
          } else if ((Math.floor(x / hexRadius) + Math.floor(y / hexRadius)) % 2 === 0) {
            ctx.fillStyle = '#141418';
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.stroke();
          }
        }
      }

      // Add "MC" gold text insignia in texture
      ctx.font = 'bold 54px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('MC PRO', 460, 260);
    }

    const ballTexture = new THREE.CanvasTexture(textureCanvas);
    ballTexture.wrapS = THREE.RepeatWrapping;
    ballTexture.wrapT = THREE.RepeatWrapping;

    const ballMat = new THREE.MeshStandardMaterial({
      map: ballTexture,
      roughness: 0.28,
      metalness: 0.45,
    });

    const ballMesh = new THREE.Mesh(sphereGeo, ballMat);
    ballMesh.castShadow = true;
    ballMesh.receiveShadow = true;
    ballGroup.add(ballMesh);

    // Glowing Cyber Rings surrounding the ball
    const ringGeo = new THREE.TorusGeometry(1.65, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xe6002b, transparent: true, opacity: 0.65 });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    ballGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.015, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0xff1a40, transparent: true, opacity: 0.4 })
    );
    ringMesh2.rotation.y = Math.PI / 4;
    ringMesh2.rotation.z = Math.PI / 6;
    ballGroup.add(ringMesh2);

    // Stadium Floating Sparkles / Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      // Red and white sparks
      const isRed = Math.random() > 0.4;
      colors[i * 3] = isRed ? 0.9 : 1.0;
      colors[i * 3 + 1] = isRed ? 0.0 : 1.0;
      colors[i * 3 + 2] = isRed ? 0.15 : 1.0;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting (Stadium Floodlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const floodLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    floodLight1.position.set(4, 5, 4);
    scene.add(floodLight1);

    const redRimLight = new THREE.PointLight(0xe6002b, 4.5, 8);
    redRimLight.position.set(-3, -2, 2);
    scene.add(redRimLight);

    const cyanRimLight = new THREE.PointLight(0xffffff, 1.5, 6);
    cyanRimLight.position.set(2, -3, -2);
    scene.add(cyanRimLight);

    // Mouse Interaction handling
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let bounceOffset = 0;
    let bounceVelocity = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isMouseDown) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.015;
        targetRotationX += deltaY * 0.015;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      // Kick bounce impulse
      bounceVelocity = 0.07;
      setBouncedCount((c) => c + 1);
      playGoalCheer();
    };

    const onPointerUp = () => {
      isMouseDown = false;
    };

    currentMount.addEventListener('mousemove', onPointerMove);
    currentMount.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle smooth rotation + mouse lag
      if (!isMouseDown) {
        targetRotationY += 0.008;
        targetRotationX = THREE.MathUtils.lerp(targetRotationX, mouseY * 0.4, 0.05);
      }

      ballMesh.rotation.y = THREE.MathUtils.lerp(ballMesh.rotation.y, targetRotationY, 0.1);
      ballMesh.rotation.x = THREE.MathUtils.lerp(ballMesh.rotation.x, targetRotationX, 0.1);

      // Rings spin counter-wise
      ringMesh1.rotation.z += 0.012;
      ringMesh2.rotation.z -= 0.009;

      // Particle float & spin
      particles.rotation.y = elapsedTime * 0.05;

      // Bouncing physics simulation
      if (bounceVelocity !== 0 || bounceOffset !== 0) {
        bounceOffset += bounceVelocity;
        bounceVelocity -= 0.005; // gravity
        if (bounceOffset <= 0) {
          bounceOffset = 0;
          bounceVelocity = 0;
        }
      }

      ballGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.08 + bounceOffset;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener('mousemove', onPointerMove);
      currentMount.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      ballMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto flex items-center justify-center">
      {/* Three.js canvas container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        title="Arrastra para rotar o haz clic para patear el balón 3D"
      />

      {/* Floating 3D Interactive Badge */}
      <div className="absolute bottom-2 inset-x-0 flex items-center justify-center pointer-events-none">
        <div className="px-3 py-1 rounded-full bg-white/90 dark:bg-neutral-900/85 border border-slate-200 dark:border-neutral-700/80 backdrop-blur-md text-[11px] font-semibold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5 shadow-sm dark:shadow-lg">
          <RotateCw className="w-3 h-3 text-[#E6002B] animate-spin" style={{ animationDuration: '6s' }} />
          <span>Balón 3D WebGL: Arrastra o Haz Clic</span>
          {bouncedCount > 0 && (
            <span className="text-[#E6002B] font-mono-numbers font-bold">
              · {bouncedCount} {bouncedCount === 1 ? 'toque' : 'toques'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

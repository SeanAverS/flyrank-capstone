'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Pedal3DView() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isEngaged, setIsEngaged] = useState(true);
  const ledRef = useRef<THREE.MeshBasicMaterial | null>(null);

  // Toggle footswitch LED
  useEffect(() => {
    if (ledRef.current) {
      ledRef.current.color.set(isEngaged ? '#f87171' : '#27272a');
    }
  }, [isEngaged]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#09090b');

    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
      camera.position.set(0, 2, 4);
      camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(4, 7, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Pedal Parts
    const pedalGroup = new THREE.Group();
    scene.add(pedalGroup);

    // Box
    const chassisGeo = new THREE.BoxGeometry(2.4, 0.9, 3.4);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: '#b45309',
      metalness: 0.85,
      roughness: 0.2,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.4;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    pedalGroup.add(chassis);

    // Knobs
    const knobGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.35, 32);
    const knobMat = new THREE.MeshStandardMaterial({
      color: '#18181b',
      metalness: 0.9,
      roughness: 0.1,
    });

    const knob1 = new THREE.Mesh(knobGeo, knobMat);
    knob1.position.set(-0.7, 0.95, -0.8);
    pedalGroup.add(knob1);

    const knob2 = new THREE.Mesh(knobGeo, knobMat);
    knob2.position.set(0.7, 0.95, -0.8);
    pedalGroup.add(knob2);

    // Footswitch Button
    const baseSwitchGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.2, 32);
    const baseSwitchMat = new THREE.MeshStandardMaterial({
      color: '#a1a1aa',
      metalness: 0.95,
      roughness: 0.15,
    });
    const baseSwitch = new THREE.Mesh(baseSwitchGeo, baseSwitchMat);
    baseSwitch.position.set(0, 0.95, 0.9);
    pedalGroup.add(baseSwitch);

    const capGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.1, 32);
    const capMat = new THREE.MeshStandardMaterial({
      color: '#52525b',
      roughness: 0.4,
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 1.07, 0.9);
    pedalGroup.add(cap);

    // LED 
    const ledGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: '#f87171' });
    ledRef.current = ledMat;
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0, 0.9, -1.4);
    pedalGroup.add(led);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      pedalGroup.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      currentMount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <div 
        ref={mountRef} 
        style={{ width: '100%', height: '450px', position: 'relative' }}
        className="bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl" 
      />

      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
        <div>
          <h2 className="text-sm font-bold text-zinc-200"> Footswitch Toggles Light</h2>
        </div>
        <button
          onClick={() => setIsEngaged(!isEngaged)}
          className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
            isEngaged ? 'bg-red-500 text-white' : 'bg-zinc-700 text-zinc-300'
          }`}
        >
          {isEngaged ? 'ENGAGED (ON)' : 'BYPASSED (OFF)'}
        </button>
      </div>
    </div>
  );
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Text, Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- Components ---

const Plant = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#4d7c0f" />
      </mesh>
      {/* Leaves */}
      {[0.3, 0.6, 0.9].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh rotation={[0.5, 0, 0]} position={[0, 0, 0.2]}>
            <coneGeometry args={[0.1, 0.4, 4]} />
            <meshStandardMaterial color="#65a30d" />
          </mesh>
          <mesh rotation={[-0.5, 0, 0]} position={[0, 0, -0.2]}>
            <coneGeometry args={[0.1, 0.4, 4]} />
            <meshStandardMaterial color="#65a30d" />
          </mesh>
        </group>
      ))}
      {/* Top flower/corn */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
    </group>
  );
};

const WaterTank = () => {
  return (
    <group position={[4, 1.5, 0]}>
      {/* Tank Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 2.5, 32]} />
        <meshStandardMaterial color="#0ea5e9" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Tank Ridges */}
      {[0.8, 0.4, 0, -0.4, -0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.01, 0.02, 8, 32]} />
          <meshStandardMaterial color="#0c4a6e" />
        </mesh>
      ))}
      {/* Solar Panel */}
      <group position={[0, 1.4, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[1.2, 0.05, 0.8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.1, 0.7]} />
          <meshStandardMaterial color="#334155" emissive="#1e293b" />
        </mesh>
        {/* Panel Support */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>
    </group>
  );
};

const UndergroundSystem = () => {
  const dropletsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (dropletsRef.current) {
      dropletsRef.current.children.forEach((child, i) => {
        child.position.y -= 0.02;
        if (child.position.y < -3) {
          child.position.y = -0.5;
        }
      });
    }
  });

  return (
    <group>
      {/* Soil Layers */}
      {/* Top Soil */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[12, 1, 6]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Drainage Layer (Gravel) */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[12, 1, 6]} />
        <meshStandardMaterial color="#a8a29e" />
      </mesh>
      {/* Water Accumulation Layer */}
      <mesh position={[0, -3, 0]}>
        <boxGeometry args={[12, 2, 6]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.6} />
      </mesh>

      {/* Perforated Pipe */}
      <mesh position={[0, -0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 8, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Droplets */}
      <group ref={dropletsRef}>
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 6, -0.5 - Math.random() * 2, (Math.random() - 0.5) * 2]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#60a5fa" />
          </mesh>
        ))}
      </group>

      {/* Vertical Pipe to Tank */}
      <mesh position={[4, -0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 4, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Horizontal Pipe to Tank */}
      <mesh position={[4, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};

const Labels = () => {
  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text position={[-4, 0.5, 3]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
          Crops (Corn)
        </Text>
      </Float>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text position={[4, 3.5, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
          Solar Water Tank
        </Text>
      </Float>
      <Text position={[6.5, -0.5, 0]} fontSize={0.3} color="#78350f" rotation={[0, -Math.PI / 2, 0]}>
        Soil (Torpaq)
      </Text>
      <Text position={[6.5, -1.5, 0]} fontSize={0.3} color="#a8a29e" rotation={[0, -Math.PI / 2, 0]}>
        Drainage (Drenaj)
      </Text>
      <Text position={[6.5, -3, 0]} fontSize={0.3} color="#0ea5e9" rotation={[0, -Math.PI / 2, 0]}>
        Water (Su)
      </Text>
    </group>
  );
};

export default function App() {
  return (
    <div className="w-full h-screen bg-[#0f172a] relative overflow-hidden font-sans">
      {/* Header UI */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <h1 className="text-4xl font-bold text-white tracking-tighter uppercase italic">
          Irrigation <span className="text-sky-400">3D</span>
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xs uppercase tracking-widest font-mono">
          Underground Drainage & Water Management System Reconstruction
        </p>
      </div>

      {/* Legend UI */}
      <div className="absolute bottom-8 left-8 z-10 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-sky-500" />
            <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Water Storage</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-800" />
            <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Top Soil Layer</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-stone-400" />
            <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Drainage Layer</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-slate-700" />
            <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Perforated Piping</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[10, 5, 15]} fov={40} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          minDistance={5} 
          maxDistance={30}
          maxPolarAngle={Math.PI / 1.8}
        />
        
        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <directionalLight position={[-10, 10, 5]} intensity={0.5} />

        {/* Scene Components */}
        <group position={[0, 0, 0]}>
          {/* Plants */}
          <Plant position={[-3, 0, 0]} />
          <Plant position={[-1, 0, 0]} />
          <Plant position={[1, 0, 0]} />
          
          <WaterTank />
          <UndergroundSystem />
          <Labels />
        </group>

        {/* Ground Plane for context */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
      </Canvas>

      {/* Interaction Hint */}
      <div className="absolute bottom-8 right-8 text-right z-10">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">
          Drag to Rotate • Scroll to Zoom
        </p>
      </div>
    </div>
  );
}

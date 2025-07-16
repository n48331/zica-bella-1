// To use this component, install the following dependencies with pnpm:
// pnpm add @react-three/fiber @react-three/drei three

"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function LogoModel(props: any) {
  // The path is relative to the public directory in Next.js
  const gltf = useGLTF("/3d/logo.glb");
  return <primitive object={gltf.scene} {...props} />;
}

export default function Test3DPage() {
  return (
    <div style={{ width: 400, height: 400, background: "transparent", margin: "0 auto" }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        {/* Lighting for shiny/metallic look */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color="#ffffff"
        />
        <directionalLight
          position={[-5, -5, 5]}
          intensity={0.7}
          color="#b0c4de"
        />
        <pointLight position={[0, 2, 2]} intensity={1.5} color="#e0e0e0" />
        <Suspense fallback={null}>
          <LogoModel
            scale={0.25}
            // @ts-ignore
            onUpdate={(obj: any) => {
              obj.traverse((child: any) => {
                if (child.isMesh && child.material) {
                  child.material.metalness = 1;
                  child.material.roughness = 0.15;
                  // Set to a silver color
                  child.material.color.set("#C0C0C0");
                  child.material.envMapIntensity = 1.5;
                }
              });
            }}
          />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}


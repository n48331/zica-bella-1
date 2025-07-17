// To use this component, ensure the following dependencies are installed:
// pnpm add @react-three/fiber @react-three/drei three

"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Preload the model to prevent conflicts
useGLTF.preload("/3d/logo.glb");

function AnimatedLogoModel(props: any) {
  // The path is relative to the public directory in Next.js
  const gltf = useGLTF("/3d/logo.glb");
  const ref = React.useRef<THREE.Group>(null);

  // Animate rotation
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 0.6 * delta; // Rotate smoothly
    }
  });

  // Set material properties on mount
  React.useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          // Silver color: #C0C0C0, but also ensure the material is physically correct
          child.material.metalness = 1.0;
          child.material.roughness = 0.4; // Lower roughness for more shine
        //   child.material.color.set("#fff");
          child.material.envMapIntensity = 1; // Boost reflections
          child.material.specular = new THREE.Color("#C0C0C0");
          child.material.needsUpdate = true;
        }
      });
    }
  }, [gltf.scene]);

  return <primitive ref={ref} object={gltf.scene} {...props} />;
}

export default function Logo3D({
  width = 200,
  height = 200,
  style = {},
  camera = { position: [0, 0, 3], fov: 50 },
  ...canvasProps
}: {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  camera?: { position: [number, number, number]; fov: number };
  [key: string]: any;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use Intersection Observer to only render when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Delay rendering to prevent multiple contexts
          setTimeout(() => setShouldRender(true), 100);
        } else {
          setIsVisible(false);
          setShouldRender(false);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{ width, height, background: "transparent", margin: "0 auto", ...style }}
    >
      {shouldRender ? (
        <Canvas camera={camera} {...canvasProps}>
          {/* Add an environment for realistic reflections */}
          <ambientLight intensity={2.0} color="#7c7c7c" />
          <directionalLight
            position={[10, 10, 10]}
            intensity={2.2}
            color="#ffffff"
          />
          <directionalLight
            position={[-10, -10, 10]}
            intensity={1.2}
            color="#ffffff"
          />
          <pointLight position={[0.32, 0.39, 0.7]} intensity={2.5} color="#ffffff" />
          {/* Add a subtle backlight for rim lighting */}
          {/* <pointLight position={[0, -3, -3]} intensity={1.2} color="#b0c4de" /> */}
          {/* Optionally, add a simple environment cube */}
          <Suspense fallback={null}>
            <AnimatedLogoModel scale={0.25} />
          </Suspense>
          <OrbitControls enablePan={true} enableZoom={false} enableRotate={true} />
        </Canvas>
      ) : (
        <div 
          style={{ 
            width: "100%", 
            height: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: "#C0C0C0",
            fontSize: "14px"
          }}
        >
          {isVisible ? "Loading..." : ""}
        </div>
      )}
    </div>
  );
} 
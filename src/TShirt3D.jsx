import React, { useRef } from "react";
import { useGLTF, useTexture, Decal } from "@react-three/drei";

export default function TShirt3D({ image }) {
  const { nodes } = useGLTF("/tshirt.glb");
  const texture = useTexture(image || "/default.png");
  const meshRef = useRef();

  return (
    <group scale={1.5} position={[0, 0.5, 0]}>
      <mesh ref={meshRef} geometry={nodes.T_Shirt_male.geometry}>
        <meshStandardMaterial color="white" />
        {texture && (
          <Decal
            map={texture}
            position={[0, 0.05, 0.1]} // ✅ moved lower to sit on chest
            rotation={[0, 0, 0]}
            scale={[0.30, 0.30, 0.30]} // ✅ slightly reduced size
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
}

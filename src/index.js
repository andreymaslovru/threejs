import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import { TextureLoader, MeshLambertMaterial } from "three";
import "./styles.css";
import { useEffect } from "react";
import { useState } from "react";
import dice1 from "./assets/grass/textures/dice1.png";
import dice2 from "./assets/grass/textures/dice2.png";
import dice3 from "./assets/grass/textures/dice3.png";
import dice4 from "./assets/grass/textures/dice4.png";
import dice5 from "./assets/grass/textures/dice5.png";
import dice6 from "./assets/grass/textures/dice6.png";
import { useMemo } from "react";

function Box({ position, render }) {
  const getRndAngVel = () => Math.random() * 10;

  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    velocity: [5, 5, 5],
    angularVelocity: [getRndAngVel(), getRndAngVel(), getRndAngVel()],
  }));

  const textures = useMemo(() => [dice1, dice2, dice3, dice4, dice5, dice6], []);

  useEffect(() => {
    render !== 0 && api.position.set(...position);

    const newMaterials = textures.map(
      (texture, index) =>
        new MeshLambertMaterial({ map: new TextureLoader().load(texture) })
    );
    ref.current.material = newMaterials;
  }, [api.material, api.position, position, ref, render, textures]);

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <boxBufferGeometry attach="geometry" args={[0.5, 0.5, 0.5]} />
    </mesh>
  );
}

const TexturedPlane = ({ color, position, rotation }) => {
  const [ref] = usePlane(() => ({
    rotation: rotation || [-Math.PI / 2, 0, 0],
    position: position || [0, 0, 0],
  }));

  return (
    <mesh
      ref={ref}
      rotation={rotation || [-Math.PI / 2, 0, 0]}
      position={position || [0, 0, 0]}
    >
      <planeBufferGeometry attach="geometry" args={[20, 20]} />
      <meshStandardMaterial attach="material" color={color} side={2} />
    </mesh>
  );
};

const App = () => {
  let [count, setCount] = useState(0);

  const handleSetCount = () => {
    console.log(count);
    setCount(count++);
  };

  return (
    <>
      <button
        style={{ position: "absolute", zIndex: 999999, top: 0 }}
        onClick={handleSetCount}
      >
        rolle
      </button>
      <Canvas shadows>
        <OrbitControls />
        <Stars />
        <ambientLight intensity={0.5} />
        <spotLight position={[20, 15, 10]} angle={0.3} castShadow />
        <Physics>
          <Box render={count} position={[0, 0, 0]} />
          <Box render={count} position={[0.8, 0, 0.8]} />

          <TexturedPlane
            color={"grey"}
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          />
        </Physics>
      </Canvas>
    </>
  );
};

createRoot(document.getElementById("root")).render(<App />);

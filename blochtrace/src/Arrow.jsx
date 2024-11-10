import {useEffect, useRef} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

function Arrow({ origin, direction, length, color }) {
  // Create a ref to hold the arrow helper
  const arrowRef = useRef();

  // Update the arrow direction if props change
  useEffect(() => {
    if (arrowRef.current) {
      arrowRef.current.setDirection(direction);
      arrowRef.current.setLength(length);
    }
  }, [direction, length]);

  return (
    <arrowHelper
      ref={arrowRef}
      args={[direction, origin, length, color]}
    />
  );
}

const ArrowScene = ({data}) => {
  const newData = data && data.length ? data : [];
  const colors = [0xff0000, 0xffff00, 0xffffff]
  console.log(newData);

  return (
    <>
    {
      newData.map((qubit, qi) => {
        return (
          <>
          <br/>
          <div>Visualizing Qubit {qi}:</div>
          <Canvas key={qi} camera={{ position: [0, 0, 10], fov: 5 }}>
            <OrbitControls enableZoom={true} />
            <ambientLight intensity={0.5} />
            {qubit.map( (edge, ei) => {
              if (ei === 0 ) {
                return null;
              }
              let start = new THREE.Vector3(newData[qi][ei-1][0], newData[qi][ei-1][1], newData[qi][ei-1][2]);
              let end = new THREE.Vector3(newData[qi][ei][0], newData[qi][ei][1], newData[qi][ei][2]);
              const direction = new THREE.Vector3().subVectors(end, start);
              let offset = new THREE.Vector3(0, 0, 0);
              const color = colors[qi%colors.length];
              // // Check if this.prev->prev is same which means reverse operation
              // if (ei > 1) {
              //   let prev2 = qubit[ei-2];
              //   if (
              //     (prev2[0] === edge[0]) && 
              //     (prev2[1] === edge[1]) && 
              //     (prev2[2] === edge[2])
              //   ) {
              //     //
              //   }
              // }
              const origin = start.clone().add(offset);
              return ei !== 0 ? (
                <>
                  <Arrow
                    key={ei}
                    origin={start}
                    direction={direction}
                    length={1}
                    color={color}
                  />
                  <Text
                    position={origin.clone().add(end.clone().multiplyScalar(1 / 2))}//.add(new THREE.Vector3(0, 0.1, 0))}
                    fontSize={0.1}
                    color={color}
                    anchorX="center"
                    anchorY="middle"
                  >
                    {ei}
                  </Text>
                </>
            ): null
  
            })
            }
          </Canvas>
          </>
        );
        })
      }
    </>

  );
};

export default ArrowScene;

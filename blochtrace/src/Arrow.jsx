/* eslint-disable react/prop-types */
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

const MAX_AXIS_VALUE = 800;

const axesNames = ["x", "y", "z"];
const getAxesData = () => {
  const origin = new THREE.Vector3(0,0,0);
  let i = 0;
  let axis = [];
  let a = [0,0,0];
  while(i<3) {
    axis.push({
      "origin": origin,
      "direction": new THREE.Vector3(...a.map((x,j) => (j == i) ? MAX_AXIS_VALUE : 0)),
      "text": axesNames[i]
    })
    axis.push({
      "origin": origin,
      "direction": new THREE.Vector3(...a.map((x,j) => (j == i) ? -MAX_AXIS_VALUE : 0)),
      "text": `-${axesNames[i]}`,
    })
    i+=1;
  }
  return axis;
};

const ArrowScene = ({data}) => {
  const newData = data && data.length ? data : [];
  const colors = [0xff0000, 0xffff00, 0xffffff]
  const axesData = getAxesData();


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
            {
              axesData.map(data => (
                <>
                  <Arrow
                    origin={data["origin"]}
                    direction={data["direction"]}
                    length={MAX_AXIS_VALUE}
                    color={0xf1f1f1}
                  />
                  <Text
                    position={data["origin"].clone().add(data["direction"].clone().multiplyScalar(1 / (MAX_AXIS_VALUE*2)))}
                    fontSize={0.1}
                    color={0xf1f1f1}
                    anchorX="left"
                    anchorY="bottom"
                  >
                    {data["text"]}
                  </Text>
                </>
              ))
            }
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

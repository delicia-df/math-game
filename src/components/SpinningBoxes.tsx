import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import fontData from 'three/examples/fonts/helvetiker_bold.typeface.json';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
interface BoxProps {
    position: [number, number, number];
    text: string;
    font: any;
    speed: number;
}

const getTextWidth = (text: string, font) =>{
    const textGeometry = new TextGeometry(text, {
        font,
        size: 1,
        height: 0.01,
        curveSegments: 12,
    });
    textGeometry.computeBoundingBox();
    const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    return textWidth;
}


  function sumBelowIndex(arr: number[]) {
    const result:number[] = [];
    let sum = 0.0;
  
    for (let i = 0; i < arr.length; i++) {
      result.push(sum);
      let next = 1;
      if(i<arr.length-1){
        next = arr[i+1];
      }
      sum = sum+arr[i]+((next+4)/2);
    }
    result[0]=0;
    return result;
  }

const Box: React.FC<BoxProps> = ({ position, text, font, speed }) => {
    const meshRef = useRef<any>(null);
    useFrame(() => {
        const rotationSpeed= speed*0.0005
        meshRef.current.rotation.x += rotationSpeed;
        meshRef.current.rotation.y += rotationSpeed;
        meshRef.current.rotation.y += rotationSpeed;
    });
    const textGeometry = new TextGeometry(text, {
        font,
        size: 1,
        height: 0.01,
        curveSegments: 12,
    });
    textGeometry.computeBoundingBox();
    const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    console.log(textGeometry.parameters.options, textWidth)
    const boxWidth = textWidth + 1; // Add 1 unit of padding
    return (
        <mesh ref={meshRef} position={position}>
            <boxGeometry args={[boxWidth, 2, 0.5]} />
            <meshPhongMaterial color={'white'} />
            <mesh position={[-textWidth / 2, -0.3, 0.25]}>
                <primitive object={textGeometry} />
                <meshPhongMaterial color={'black'} />
            </mesh>
        </mesh>
    );
};

const SpinningBoxes = ({textArray,speed}:{textArray:string[],speed:number}) => {
    const font = new FontLoader().parse(fontData);
    const xOffsets = sumBelowIndex(textArray.map(text => getTextWidth(text, font)))
    return (
        <div style={{ background: "gray" }}>
            <Canvas style={{width: xOffsets[xOffsets.length-1]*40, height: 100}} camera={{ position: [0, 0, 4] }}>
                <ambientLight intensity={10} />
                <pointLight position={[0, 0, 5]} intensity={0.5} />
                <group position={[-3, 0, 0]}>
                    {textArray.map((text, index) => {

                        return (
                            <Box key={index}
                            speed={speed}
                                position={[xOffsets[index], 0, 0]} text={text} font={font} />
                        )
                    })}
                </group>
                <OrbitControls />
            </Canvas>
        </div>
    );
};

export default SpinningBoxes;
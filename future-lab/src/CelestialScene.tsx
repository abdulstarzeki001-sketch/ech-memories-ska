import { useRef, useMemo } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
function CelestialObject(){
 const group=useRef<THREE.Group>(null);
 const orbit=useRef<THREE.Group>(null);
 const pointer=useRef({x:0,y:0});
 const particles=useMemo(()=>{const out=new Float32Array(270*3);for(let i=0;i<270;i++){const theta=i*2.399963229728653,rad=2.1+((i*37)%100)/80;out[i*3]=Math.cos(theta)*rad;out[i*3+1]=Math.sin(theta)*rad;out[i*3+2]=Math.sin(i*2.1)*1.2}return out},[]);
 useFrame((_,delta)=>{if(group.current){group.current.rotation.y+=delta*.065;group.current.rotation.x=THREE.MathUtils.damp(group.current.rotation.x,pointer.current.y*.22,2,delta);group.current.rotation.z=THREE.MathUtils.damp(group.current.rotation.z,pointer.current.x*.12,2,delta)}if(orbit.current)orbit.current.rotation.z+=delta*.025});
 const track=(e:ThreeEvent<PointerEvent>)=>{pointer.current.x=e.point.x/2.5;pointer.current.y=e.point.y/2.5};
 return <group onPointerMove={track}>
  <group ref={group} rotation={[.13,0,-.17]}>
   <mesh><icosahedronGeometry args={[1.32,5]}/><meshPhysicalMaterial color="#443b75" roughness={.21} metalness={.76} clearcoat={1} clearcoatRoughness={.08} envMapIntensity={.6}/></mesh>
   <mesh rotation={[.62,.2,.22]}><torusGeometry args={[1.88,.009,7,160]}/><meshBasicMaterial color="#eedab6" transparent opacity={.7}/></mesh>
   <mesh rotation={[1.24,.7,.1]}><torusGeometry args={[1.76,.007,7,160]}/><meshBasicMaterial color="#79d4e7" transparent opacity={.52}/></mesh>
   <mesh rotation={[-.22,.3,.7]}><torusGeometry args={[1.69,.006,7,160]}/><meshBasicMaterial color="#c18add" transparent opacity={.5}/></mesh>
  </group>
  <group ref={orbit}><points><bufferGeometry><bufferAttribute attach="attributes-position" args={[particles,3]} /></bufferGeometry><pointsMaterial size={.018} color="#f2dfbb" sizeAttenuation transparent opacity={.85} depthWrite={false}/></points></group>
 </group>;
}
export default function CelestialScene(){return <Canvas camera={{position:[0,0,6.4],fov:39}} dpr={[1,1.5]} gl={{alpha:true,antialias:false,powerPreference:'low-power'}} frameloop="always" aria-label="مجسم كوني تفاعلي">
  <ambientLight intensity={1.15}/><pointLight position={[3,4,4]} color="#98dcff" intensity={34} distance={14}/><pointLight position={[-4,-2,1]} color="#ba81cf" intensity={25} distance={12}/><pointLight position={[0,0,-4]} color="#ffe2a6" intensity={18} distance={12}/><CelestialObject/>
 </Canvas>}
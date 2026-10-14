import {Canvas,useFrame} from '@react-three/fiber';
import {Stars,Float} from '@react-three/drei';
import {useRef} from 'react';
import type {Group} from 'three';
function CelestialCore(){
 const ref=useRef<Group>(null);
 useFrame((s,d)=>{if(ref.current){ref.current.rotation.y+=d*.075;ref.current.rotation.z=Math.sin(s.clock.elapsedTime*.16)*.11;}});
 return <group ref={ref}>
  <Float speed={1.05} rotationIntensity={.15} floatIntensity={.21}>
   <mesh><icosahedronGeometry args={[1.23,5]}/><meshStandardMaterial color="#102e51" roughness={.32} metalness={.65} emissive="#17509b" emissiveIntensity={.34}/></mesh>
   <mesh scale={1.17}><icosahedronGeometry args={[1.24,2]}/><meshBasicMaterial color="#00b9d7" wireframe transparent opacity={.075}/></mesh>
  </Float>
  <mesh rotation={[1.2,.32,.5]}><torusGeometry args={[2.05,.008,4,180]}/><meshBasicMaterial color="#69d8ff" transparent opacity={.54}/></mesh>
  <mesh rotation={[.22,1.35,.4]}><torusGeometry args={[2.37,.009,4,180]}/><meshBasicMaterial color="#a47ffa" transparent opacity={.35}/></mesh>
  <mesh rotation={[.4,.35,1.45]}><torusGeometry args={[1.75,.006,4,180]}/><meshBasicMaterial color="#d6b47c" transparent opacity={.4}/></mesh>
 </group>;
}
export default function OrbitalScene(){
 return <Canvas dpr={[1,1.35]} camera={{position:[0,0,6.7],fov:48}} gl={{alpha:true,antialias:false,powerPreference:'low-power'}} aria-label="نواة ذاكرة ثلاثية الأبعاد متحركة" role="img">
 <ambientLight intensity={.6}/><pointLight position={[3,2,4]} intensity={24} color="#7ccdfa"/><pointLight position={[-3,-2,1]} intensity={12} color="#9167ec"/>
 <Stars radius={70} depth={38} count={360} factor={2} saturation={0} fade speed={.15}/>
 <CelestialCore/>
 </Canvas>;
}

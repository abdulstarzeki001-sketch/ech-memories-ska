import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Group } from 'three';
function Orb() {
 const group = useRef<Group>(null);
 useFrame((_, delta) => { if (group.current) { group.current.rotation.y += delta * .1; group.current.rotation.z += delta * .035; } });
 return <group ref={group} rotation={[.1,.2,.25]}>
   <mesh><icosahedronGeometry args={[1.28,4]}/><meshPhysicalMaterial color="#6b6cdd" metalness={.52} roughness={.27} clearcoat={.8} clearcoatRoughness={.18} flatShading={false}/></mesh>
   <mesh rotation={[.4,.1,1.1]}><torusGeometry args={[1.72,.009,7,160]}/><meshBasicMaterial color="#a5eaff" transparent opacity={.65}/></mesh>
   <mesh rotation={[1.1,0,.3]}><torusGeometry args={[1.89,.008,7,160]}/><meshBasicMaterial color="#d4b7ff" transparent opacity={.45}/></mesh>
   <mesh position={[1.72,.12,.55]}><sphereGeometry args={[.055,12,12]}/><meshBasicMaterial color="#fbe0ae"/></mesh>
 </group>;
}
export default function OrbScene() {
 return <Canvas dpr={[1,1.4]} camera={{position:[0,0,5.8],fov:38}} gl={{alpha:true,antialias:false,powerPreference:'low-power'}} aria-label="مجسم كوني زخرفي">
   <ambientLight intensity={1.1}/><pointLight position={[2,3,4]} intensity={26} color="#a8d2ff" distance={13}/>
   <pointLight position={[-3,-2,-1]} intensity={12} color="#a167ff" distance={10}/>
   <Orb/>
 </Canvas>;
}
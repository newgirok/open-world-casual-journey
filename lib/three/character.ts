import * as THREE from 'three'

/**
 * 절차적 로우폴리 캐릭터 메시 (GLB 로드 전 플레이스홀더)
 * 단위: 미터. Mercator scale은 context.addAt()이 처리.
 */
export function createCharacterMesh(color = 0x4f8ef7): THREE.Group {
  const group = new THREE.Group()

  const mat = new THREE.MeshToonMaterial({ color })

  // 몸통
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.9, 4, 8), mat)
  body.position.y = 0.7
  group.add(body)

  // 머리
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), mat)
  head.position.y = 1.45
  group.add(head)

  // Three.js Y-up → Mapbox Mercator Z-up 변환
  group.rotation.x = Math.PI / 2

  return group
}

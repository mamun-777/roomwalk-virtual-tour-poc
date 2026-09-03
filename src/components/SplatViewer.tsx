import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { SparkRenderer, SplatMesh } from '@sparkjsdev/spark'

type Props = {
  splatUrl: string
  onReady?: () => void
  onProgress?: (ratio: number) => void
  onError?: (message: string) => void
}

export function SplatViewer({ splatUrl, onReady, onProgress, onError }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let disposed = false
    let frameId = 0
    const keys = new Set<string>()

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0c0f12)

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.01,
      1000,
    )
    camera.position.set(0, 1.4, 3.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    const spark = new SparkRenderer({ renderer })
    scene.add(spark)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.target.set(0, 1.2, 0)
    controls.maxPolarAngle = Math.PI * 0.92
    controls.minDistance = 0.4
    controls.maxDistance = 18

    const splat = new SplatMesh({
      url: splatUrl,
      onProgress: (event) => {
        if (event.lengthComputable && event.total > 0) {
          onProgress?.(event.loaded / event.total)
        }
      },
      onLoad: () => {
        if (!disposed) onReady?.()
      },
    })

    // Many captures are Z-up; flip into Three.js Y-up viewing space.
    splat.quaternion.set(1, 0, 0, 0)
    scene.add(splat)

    splat.initialized.catch((err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to load splat'
      onError?.(message)
    })

    const onKeyDown = (e: KeyboardEvent) => keys.add(e.code)
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    const clock = new THREE.Clock()
    const forward = new THREE.Vector3()
    const right = new THREE.Vector3()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      const speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? 4.5 : 2.2

      forward.set(0, 0, -1).applyQuaternion(camera.quaternion)
      forward.y = 0
      forward.normalize()
      right.set(1, 0, 0).applyQuaternion(camera.quaternion)
      right.y = 0
      right.normalize()

      const move = new THREE.Vector3()
      if (keys.has('KeyW')) move.add(forward)
      if (keys.has('KeyS')) move.sub(forward)
      if (keys.has('KeyD')) move.add(right)
      if (keys.has('KeyA')) move.sub(right)
      if (keys.has('KeyE') || keys.has('Space')) move.y += 1
      if (keys.has('KeyQ') || keys.has('ControlLeft')) move.y -= 1

      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(speed * dt)
        camera.position.add(move)
        controls.target.add(move)
      }

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = Math.max(mount.clientHeight, 1)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(mount)

    return () => {
      disposed = true
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      controls.dispose()
      splat.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [splatUrl, onReady, onProgress, onError])

  return <div className="splat-viewer" ref={mountRef} />
}

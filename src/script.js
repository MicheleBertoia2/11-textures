import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

THREE.ColorManagement.enabled = false

//Texture

// loading with native js
// const image = new Image()
// const texture = new THREE.Texture(image)

// image.onload = () =>{
//     texture.needsUpdate = true
// }
// image.src = '/textures/door/color.jpg'

//loading with texture loader

//loading manager to mutualize all events of loading
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
    console.log('start');
}

loadingManager.onLoad = () => {
    console.log('loaded');
}

loadingManager.onProgress = () => {
    console.log('progress');
}

loadingManager.onError = () => {
    console.log('error');
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load(
    '/textures/door/color.jpg',
    //functions for control the loading process
    // () => {
    //     console.log('load');
    // },
    // () => {
    //     console.log('progress');
    // },
    // () => {
    //     console.log('errors');
    // }
    )
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')

colorTexture.repeat.x = 2
colorTexture.repeat.y = 3
colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping

colorTexture.offset.x = 0.5

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
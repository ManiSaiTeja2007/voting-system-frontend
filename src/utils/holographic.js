export const initHolographicCanvas = (polls) => {
  const canvas = document.getElementById('holographic-canvas');
  if (!canvas) {
    console.error('Holographic canvas not found');
    return;
  }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  polls.forEach((poll, index) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x4f46e5, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(index * 2 - polls.length, 0, -5);
    scene.add(cube);
  });

  camera.position.z = 5;
  function animate() {
    requestAnimationFrame(animate);
    scene.children.forEach((child) => (child.rotation.y += 0.01));
    renderer.render(scene, camera);
  }
  animate();
};
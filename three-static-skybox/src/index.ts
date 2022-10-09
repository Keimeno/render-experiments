import * as THREE from "three";

import rightImageFace from "./assets/park_parking_4k.right.png";
import leftImageFace from "./assets/park_parking_4k.left.png";
import upImageFace from "./assets/park_parking_4k.up.png";
import downImageFace from "./assets/park_parking_4k.down.png";
import frontImageFace from "./assets/park_parking_4k.front.png";
import backImageFace from "./assets/park_parking_4k.back.png";

const renderController = (() => {
  const imageFaces = [
    rightImageFace,
    leftImageFace,
    upImageFace,
    downImageFace,
    frontImageFace,
    backImageFace,
  ];
  const materialArray = imageFaces.map(
    (image) =>
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(image),
        side: THREE.BackSide,
      })
  );

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    45,
    30000
  );
  const skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
  const skybox = new THREE.Mesh(skyboxGeometry, materialArray);
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  const animate = () => {
    skybox.rotation.x += -0.001;
    skybox.rotation.y += 0.0005;

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  };

  return {
    init: () => {
      camera.position.set(0, 0, 0);

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.id = "canvas";
      document.body.appendChild(renderer.domElement);

      scene.add(skybox);

      animate();
    },
  };
})();

renderController.init();

import React, { Component } from 'react';
import './App.css';
const THREE = window.THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

const onSubmit = (event) => {
  event.preventDefault();
  const fields = event.target.elements;
  const {
    shape: { value: shape },
    scale: { value: scale }
  } = fields;
  console.dir(shape);
  console.dir(scale);
}

class App extends Component {
  componentDidMount() {
    var camera, scene, renderer, controls;
			var cube;
      init();
      animate();
			function init() {

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 400;
        scene = new THREE.Scene();

        // LIGHT
        var light = new THREE.PointLight(0xffffff);
        light.position.set(0,100,0);
        scene.add(light);

        var geometry = new THREE.BoxGeometry( 100, 100, 100 );
        var material = new THREE.MeshBasicMaterial( {color: 0x000055} );
        cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
				renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        const app = document.body.querySelector('.app');
				renderer.setSize( window.innerWidth, window.innerHeight - app.offsetHeight );
        controls = new OrbitControls( camera, renderer.domElement );
        app.appendChild( renderer.domElement );
        window.addEventListener( 'resize', onWindowResize, false );
        renderer.render( scene, camera );
        controls.update();
			}
			function onWindowResize() {
        const app = document.body.querySelector('.app'); 
				camera.aspect = window.innerWidth / window.innerHeight - app.offsetHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight - app.offsetHeight );
      }
      
      
      function animate() {
				requestAnimationFrame( animate );
				cube.rotation.x += 0.005;
				cube.rotation.y += 0.01;
				renderer.render( scene, camera );
				controls.update();
			}
  }

  render() {
    return (
      <div className="app">
        <form className="form" onSubmit={onSubmit}>
          <select name="shape" required>
            <option>Cube</option>
            <option>Sphere</option>
            <option>Pyramid</option>
            <option>Cone</option>
            <option>Cylinder</option>
          </select>
          <input name="scale" type="number" min="1" max="10" required />
          <button>Create</button>
        </form>
      </div>
    );
  }
}

export default App;

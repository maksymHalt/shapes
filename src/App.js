import React, { Component } from 'react';
import './App.css';
const THREE = window.THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: []
    }
  }

  componentDidMount() {
    let formHeight = this.form.offsetHeight;

    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 400;
    const scene = this.scene = new THREE.Scene();



    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    const width = window.innerWidth;
    const height = window.innerHeight - formHeight;
    renderer.setSize( width, height );
    this.canvasSizes = { width, height };

    // LIGHTS
    const light1 = new THREE.PointLight(0xffffff, 10);
    light1.position.set(width / 2, height / 2, width / 2);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 10);
    light2.position.set(-width / 2, -height / 2, -width / 2);
    scene.add(light2);

    
    const controls = new OrbitControls( camera, renderer.domElement );
    this.app.appendChild( renderer.domElement );

    const onWindowResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight - formHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize( width, height );
      this.canvasSizes = { width, height }
    }
    window.addEventListener( 'resize', onWindowResize, false );

    const animate = () => {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
      
      controls.update();
    }
    animate();
  }

  createShape = (event) => {
    event.preventDefault();
    const fields = event.target.elements;
    const {
      shape: { value: shape },
      scale: { value: scale }
    } = fields;
  
    const size = scale * 10;
    let geometry;
    switch (shape) {
      case 'Cube':
        geometry = new THREE.BoxGeometry( size, size, size );
        break;
      case 'Sphere':
        geometry = new THREE.SphereGeometry( size, size, size );
        break;
      case 'Pyramid':
        geometry = new THREE.CylinderGeometry( 1, size * 3, size * 3, 4 );
        break;
      case 'Cone':
        geometry = new THREE.ConeGeometry( size, size * 2, size );
        break;
      case 'Cylinder':
        geometry = new THREE.CylinderGeometry( size, size, size * 2, size );
        break;
      default:
        break;
    }

    const material = new THREE.MeshPhongMaterial( { color: 0x000055 } );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(
      (Math.random() - 0.5) * this.canvasSizes.width,
      (Math.random() - 0.5) * this.canvasSizes.height,
      (Math.random() - 0.5) * this.canvasSizes.width
    );
    this.scene.add( mesh );
    this.setState(({ list }) => ({ list: [...list, mesh] }))
  }

  deleteShape = (mesh) => () => {
    this.scene.remove(mesh);
    this.setState(({ list }) => ({ list: list.filter(item => item !== mesh) }))
  }

  render() {
    const { list } = this.state;
    return (
      <div className="app" ref={app => this.app = app}>
        <form className="form" ref={form => this.form = form} onSubmit={this.createShape}>
          <select name="shape" required>
            <option>Cube</option>
            <option>Sphere</option>
            <option>Pyramid</option>
            <option>Cone</option>
            <option>Cylinder</option>
          </select>
          <input name="scale" type="number" min="1" max="10" defaultValue="7" required />
          <button>Create</button>
        </form>
        {list.length !== 0 && <div className="panel-list">
          {list.map(mesh => (
            <div className="panel-item">
              {mesh.uuid}
              <button onClick={this.deleteShape(mesh)}>X</button>
            </div>
          ))}
        </div>
        }
      </div>
    );
  }
}

export default App;

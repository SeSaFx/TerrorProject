import * as THREE from 'https://cdn.skypack.dev/three';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/PointerLockControls.js';
import { FontLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.skypack.dev/three/examples/jsm/geometries/TextGeometry.js';

/* const controls = new OrbitControls(camera, renderer.domElement); */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

//Carga de GTFL//
const renderer = new THREE.WebGLRenderer();
let loader = new GLTFLoader();
const textLoader = new FontLoader();

//VariablesUniversales
let objects = [];
let controls;
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

//Carga al iniciar//
document.body.onload = () => {
  main();
};

//adaptar la ventana//
window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
};


//MAIN//
function main() {
  // Configurracion inicial
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(0x000000);
  //Niebla
  scene.fog = new THREE.Fog( 0x3B3C40, 0, 140 );
  document.body.appendChild(renderer.domElement);

  //CAMARA
  camera.position.z = 35;
  camera.position.y = 27;
  camera.position.x = 0;

  //Background
  SkyBox();

  //MovimientoCamara
  controles();

  //Musica
  bgMusic();

  // Lights
  setupLights();

  //Escenario
  estructura();

  //ANIMACION
  animate();

  //Texto
  textos();

  //Modelos
  modelos();

}

//Sky
function SkyBox(){
  const Sky = new THREE.TextureLoader() ;
  const texture = Sky.load(
  './assets/Imagenes/SkyBox.png',
  () => {
  const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
  rt.fromEquirectangularTexture(renderer,texture);
  scene.background=rt.texture;
  });
}

//Texto//
function textos(){

  textLoader.load( 'https://cdn.skypack.dev/three/examples/fonts/gentilis_bold.typeface.json', function ( font ) {

    const geometrytext = new TextGeometry( 'Pennywise', {
      font: font,
      size: 2,
      height: 0.5,
      curveSegments: 1,
      bevelThickness: 0.5,
      bevelSize: 0.2,
      bevelEnabled: true
    } );

    var textMaterial = new THREE.MeshPhongMaterial({ color: 0x510D0B, specular: 0xffffff });

    var texto1 = new THREE.Mesh( geometrytext, textMaterial );
    texto1.position.y=33.5
    texto1.position.x=-50
    texto1.position.z=-6
    texto1.rotation.y = 20.42;
    texto1.receiveShadow = false;

    scene.add(texto1);


    const geometrytext2 = new TextGeometry( 'Alien', {
      font: font,
      size: 2,
      height: 0.5,
      curveSegments: 4,
      bevelThickness: 0.5,
      bevelSize: 0.2,
      bevelEnabled: true
    } );

    var textMaterial2 = new THREE.MeshPhongMaterial({ color: 0x001F5B, specular: 0xffffff });

    var texto2 = new THREE.Mesh( geometrytext2, textMaterial2 );
    texto2.position.y=33.5
    texto2.position.x=50
    texto2.position.z=-4
    texto2.rotation.y =-20.42 ;

    scene.add(texto2);

    const geometrytext3 = new TextGeometry( 'Five Nights At Freddy', {
      font: font,
      size: 1.5,
      height: 0.5,
      curveSegments: 3,
      bevelThickness: 0.5,
      bevelSize: 0.2,
      bevelEnabled: true
    } );

    var textMaterial3 = new THREE.MeshPhongMaterial({ color: 0x141414, specular: 0xff0000 });

    var texto3 = new THREE.Mesh( geometrytext3, textMaterial3 );
    texto3.position.y=13
    texto3.position.x= -10
    texto3.position.z= -50
    texto3.rotation.y = -12.57 ;

    scene.add(texto3);

  } );

}

//Musica de fondo//
function bgMusic(){

  var listener = new THREE.AudioListener();
  camera.add( listener );
  
  var sound = new THREE.Audio( listener );
  
  var audioLoader = new THREE.AudioLoader();
  
  audioLoader.load( 'assets/Musica/TensionMusic.mp3', function( buffer ) {
      sound.setBuffer( buffer );
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
  });

}

//Modelos//
function modelos(){

  //ModeloAlien
  let alien;
  loader.load(
    './assets/Modelos/Personajes/Alien/scene.gltf',
    function (gltf) {
      alien = gltf.scene.children[0];
      alien.scale.set(0.064,0.064,0.064);
      alien.position.z = -0.5;
      alien.position.y = 20;
      alien.position.x = 30;
      alien.rotation.z = -20.42;
      scene.add(alien);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloPenny
  let penny;
  loader.load(
    './assets/Modelos/Personajes/Pennywise/scene.gltf',
    function (gltf) {
      penny = gltf.scene.children[0];
      penny.scale.set(0.009,0.009,0.009);
      penny.position.z = 21.5;
      penny.position.y = 26.21;
      penny.position.x = -33.3;
      penny.rotation.z = -15.73;
      scene.add(penny);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloCama
  let estructuraCama;
  loader.load(
    './assets/Modelos/Estructura/Bed/scene.gltf',
    function (gltf) {
      estructuraCama = gltf.scene.children[0];
      estructuraCama.scale.set(14,14,14);
      estructuraCama.position.z = -16;
      estructuraCama.position.y = 20;
      estructuraCama.position.x = -35.8;
      scene.add(estructuraCama);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloGabinete
  let estructuraGabinete;
  loader.load(
    './assets/Modelos/Estructura/Gabinete/scene.gltf',
    function (gltf) {
      estructuraGabinete = gltf.scene.children[0];
      estructuraGabinete.scale.set(4,4,4);
      estructuraGabinete.position.z = 8;
      estructuraGabinete.position.y = 20;
      estructuraGabinete.position.x = -48;
      estructuraGabinete.rotation.z = -15.73;
      scene.add(estructuraGabinete);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloAlfombraPieza
  let estructuraAlfombraPieza;
  loader.load(
    './assets/Modelos/Estructura/RoomCarpet/scene.gltf',
    function (gltf) {
      estructuraAlfombraPieza = gltf.scene.children[0];
      estructuraAlfombraPieza.scale.set(14,14,14);
      estructuraAlfombraPieza.position.z = -4;
      estructuraAlfombraPieza.position.y = 20;
      estructuraAlfombraPieza.position.x = -34;
      estructuraAlfombraPieza.rotation.z = -20.42;
      scene.add(estructuraAlfombraPieza);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloAlfombra
  let estructuraAlfombra;
  loader.load(
    './assets/Modelos/Estructura/MainCarpet/scene.gltf',
    function (gltf) {
      estructuraAlfombra = gltf.scene.children[0];
      estructuraAlfombra.scale.set(11,11,11);
      estructuraAlfombra.position.z = 13;
      estructuraAlfombra.position.y = 21;
      estructuraAlfombra.position.x = 0;
      estructuraAlfombra.rotation.z = -20.42;
      scene.add(estructuraAlfombra);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloVentana
  let estructuraVentana;
  loader.load(
    './assets/Modelos/Estructura/Window/scene.gltf',
    function (gltf) {
      estructuraVentana = gltf.scene.children[0];
      estructuraVentana.scale.set(16,7,6);
      estructuraVentana.position.z = -50;
      estructuraVentana.position.y = 28.5;
      estructuraVentana.position.x = 0;
      estructuraVentana.rotation.z = -12.57;
      scene.add(estructuraVentana);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloSotano
  let estructuraSotano;
  loader.load(
    './assets/Modelos/Estructura/Basement/scene.gltf',
    function (gltf) {
      estructuraSotano = gltf.scene.children[0];
      estructuraSotano.scale.set(0.05,0.05,0.05);
      estructuraSotano.position.z = -34;
      estructuraSotano.position.y = 28;
      estructuraSotano.position.x = 44;
      estructuraSotano.rotation.z = -20.42;
      scene.add(estructuraSotano);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloComedor
  let estructuraComedor;
  loader.load(
    './assets/Modelos/Estructura/Dining/scene.gltf',
    function (gltf) {
      estructuraComedor = gltf.scene.children[0];
      estructuraComedor.scale.set(6,6,6);
      estructuraComedor.position.z = -15;
      estructuraComedor.position.y = 2;
      estructuraComedor.position.x = 28;
      estructuraComedor.rotation.z = -20.42;
      scene.add(estructuraComedor);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloLibreria
  let estructuraLibreria;
  loader.load(
    './assets/Modelos/Estructura/Libreria/scene.gltf',
    function (gltf) {
      estructuraLibreria = gltf.scene.children[0];
      estructuraLibreria.scale.set(0.1,0.2,0.18);
      estructuraLibreria.position.z = 43;
      estructuraLibreria.position.y = 20;
      estructuraLibreria.position.x = 5;
      estructuraLibreria.rotation.z = 26.74; 
      scene.add(estructuraLibreria);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloPlantaIzquierda
  let estructuraPlantaI;
  loader.load(
    './assets/Modelos/Estructura/Planta/scene.gltf',
    function (gltf) {
      estructuraPlantaI = gltf.scene.children[0];
      estructuraPlantaI.scale.set(0.3,0.3,0.3);
      estructuraPlantaI.position.z = 43;
      estructuraPlantaI.position.y = 20;
      estructuraPlantaI.position.x = -12.6;
      estructuraPlantaI.rotation.z = 26.74; 
      scene.add(estructuraPlantaI);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloPlantaDerecha
  let estructuraPlantaD;
  loader.load(
    './assets/Modelos/Estructura/Planta/scene.gltf',
    function (gltf) {
      estructuraPlantaD = gltf.scene.children[0];
      estructuraPlantaD.scale.set(0.3,0.3,0.3);
      estructuraPlantaD.position.z = 43;
      estructuraPlantaD.position.y = 20;
      estructuraPlantaD.position.x = 12.;
      estructuraPlantaD.rotation.z = 26.74; 
      scene.add(estructuraPlantaD);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloSillon
  let estructuraSala;
  loader.load(
    './assets/Modelos/Estructura/Sofa/scene.gltf',
    function (gltf) {
      estructuraSala = gltf.scene.children[0];
      estructuraSala.scale.set(2,2,2);
      estructuraSala.position.z = 19.5;
      estructuraSala.position.y = 24;
      estructuraSala.position.x = 40.5;
      estructuraSala.rotation.z = -15.728;
      scene.add(estructuraSala);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloPuertaSala
  let estructuraPuertaSala;
  loader.load(
    './assets/Modelos/Estructura/LivingRoomDoor/scene.gltf',
    function (gltf) {
      estructuraPuertaSala = gltf.scene.children[0];
      estructuraPuertaSala.scale.set(0.1,0.1,0.06);
      estructuraPuertaSala.position.z = -2;
      estructuraPuertaSala.position.y = 26;
      estructuraPuertaSala.position.x = 16.9;
      estructuraPuertaSala.rotation.z = -20.42;
      scene.add(estructuraPuertaSala);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloPuertaPieza
  let estructuraPuertaPieza;
  loader.load(
    './assets/Modelos/Estructura/MainRoomDoor/scene.gltf',
    function (gltf) {
      estructuraPuertaPieza = gltf.scene.children[0];
      estructuraPuertaPieza.scale.set(0.046,0.06,0.058);
      estructuraPuertaPieza.position.z = -2.3;
      estructuraPuertaPieza.position.y = 19.9;
      estructuraPuertaPieza.position.x = -17.01;
      estructuraPuertaPieza.rotation.z = -20.42;
      scene.add(estructuraPuertaPieza);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloChica
  let modeloChica;
  loader.load(
    './assets/Modelos/Personajes/Chica/scene.gltf',
    function (gltf) {
      modeloChica = gltf.scene.children[0];
      modeloChica.scale.set(6,6,6);
      modeloChica.position.z = -27;
      modeloChica.position.y = 2;
      modeloChica.position.x = -40;
      modeloChica.rotation.z = 20.42;
      scene.add(modeloChica);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloFreddy
  let modeloFreddy;
  loader.load(
    './assets/Modelos/Personajes/Freddy/scene.gltf',
    function (gltf) {
      modeloFreddy = gltf.scene.children[0];
      modeloFreddy.scale.set(6,6,6);
      modeloFreddy.position.z = -42;
      modeloFreddy.position.y = 2;
      modeloFreddy.position.x = -32;
      modeloFreddy.rotation.z = 20.42;
      scene.add(modeloFreddy);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloBonnie
  let modeloBonnie;
  loader.load(
    './assets/Modelos/Personajes/Bonnie/scene.gltf',
    function (gltf) {
      modeloBonnie = gltf.scene.children[0];
      modeloBonnie.scale.set(10,10,10);
      modeloBonnie.position.z = -14;
      modeloBonnie.position.y = 2;
      modeloBonnie.position.x = -32;
      modeloBonnie.rotation.z = 20.42;
      scene.add(modeloBonnie);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloFoxy
  let modeloFoxy;
  loader.load(
    './assets/Modelos/Personajes/Foxy/scene.gltf',
    function (gltf) {
      modeloFoxy = gltf.scene.children[0];
      modeloFoxy.scale.set(6,6,6);
      modeloFoxy.position.z = -35;
      modeloFoxy.position.y = 2;
      modeloFoxy.position.x = 30;
      modeloFoxy.rotation.z = -20.42;
      scene.add(modeloFoxy);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

  //ModeloMarionete
  let modeloMarionete;
  loader.load(
    './assets/Modelos/Personajes/Marionete/scene.gltf',
    function (gltf) {
      modeloMarionete = gltf.scene.children[0];
      modeloMarionete.scale.set(0.0039,0.0039,0.0039);
      modeloMarionete.position.z = -18;
      modeloMarionete.position.y = 2;
      modeloMarionete.position.x = 40;
      modeloMarionete.rotation.z = -20.42;
      scene.add(modeloMarionete);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
    },
    function (error) {
      console.log('Un error ocurrio');
    },
  );

}

//Escenario
function estructura(){

  //VIDEOPENNY
  let VP = videoPenny(0x5E6F73, false);
  VP.position.z = 24.2;
  VP.position.y = 29.7;
  VP.position.x = -33.1;
  VP.rotation.y = -15.728;
  scene.add(VP);
  objects.push(VP);

  //VIDEOTELE
  let VT = videoTele(0x5E6F73, false);
  VT.position.z = -0.8;
  VT.position.y = 27.1;
  VT.position.x = 46.22;
  VT.rotation.y = 20.404;
  scene.add(VT);
  objects.push(VT);

  //VIDEOFNAF
  let VM = videoFNAF(0x5E6F73, false);
  VM.position.z = -25.5;
  VM.position.y = 9.4;
  VM.position.x = -49;
  VM.rotation.y = 20.42;
  scene.add(VM);
  objects.push(VM);

  //TECHO PUERTA DERECHA
  let TD1 = drawCubePI(0x0B2666, false);
  TD1.position.z = -1;
  TD1.position.y = 43;
  TD1.position.x = 16.9;
  TD1.rotation.y = 4.711;
  scene.add(TD1);
  objects.push(TD1);

  //TECHO PUERTA IZQUIERDA
  let TD2 = drawCubePI(0x0B2666, false);
  TD2.position.z = -1;
  TD2.position.y = 43;
  TD2.position.x = -16.9;
  TD2.rotation.y = 4.711;
  scene.add(TD2);
  objects.push(TD2);

  //TECHO
  let T = drawCubeF(0x5E6F73, false);
  T.position.z = -1.5;
  T.position.y = 40;
  T.rotation.x = 20.42;
  scene.add(T);
  objects.push(T);

  //PARED PRINCIPAL DERECHA
  let PWR = drawCubePE(0x8F150D, false);
  PWR.position.z = -2;
  PWR.position.y = 30;
  PWR.position.x = 50.5;
  PWR.rotation.y = 4.711;
  scene.add(PWR);
  objects.push(PWR);
  
  //PARED PRINCIPAL IZQUIERDA
  let PWL = drawCubePE(0x8F150D, false);
  PWL.position.z = -2;
  PWL.position.y = 30;
  PWL.position.x = -50.9;
  PWL.rotation.y = 4.7111;
  scene.add(PWL);
  objects.push(PWL);
  
  //PAREDES VENTANA
  let PVB = drawCubePVI(0x697C8A, false);
  PVB.position.z = -51;
  PVB.position.y = 36.5;
  PVB.position.x = 0;
  scene.add(PVB);
  objects.push(PVB);

  let PVT = drawCubePVI(0x697C8A, false);
  PVT.position.z = -51;
  PVT.position.y = 21;
  PVT.position.x = 0;
  scene.add(PVT);
  objects.push(PVT);

  let PVL = drawCubePVL(0x697C8A, false);
  PVL.position.z = -51;
  PVL.position.y = 29;
  PVL.position.x = 30;
  scene.add(PVL);
  objects.push(PVL);

  let PVR = drawCubePVL(0x697C8A, false);
  PVR.position.z = -51;
  PVR.position.y = 29;
  PVR.position.x = -30;
  scene.add(PVR);
  objects.push(PVR);

  //PARED PRINCIPAL ATRAS
  let PWB = drawCubePE(0x8F150D, false);
  PWB.position.z = 47;
  PWB.position.y = 30;
  PWB.position.x = 0;
  PWB.rotation.y = 0;
  scene.add(PWB);
  objects.push(PWB);

  //PISO PRINCIPAL
  let PFR = drawCubePF(0x402116, false);
  PFR.position.z = -1.5;
  PFR.position.x = 30;
  PFR.position.y = 19;
  PFR.rotation.x = 20.42;
  scene.add(PFR);
  objects.push(PFR);

  let PFL = drawCubePF(0x402116, false);
  PFL.position.z = -1.5;
  PFL.position.x = -30;
  PFL.position.y = 19;
  PFL.rotation.x = 20.42;
  scene.add(PFL);
  objects.push(PFL);

  let PFB = drawCubePFM(0x402116, false);
  PFB.position.z = 16;
  PFB.position.x = 0;
  PFB.position.y = 19;
  PFB.rotation.x = 20.42;
  scene.add(PFB);
  objects.push(PFB);


  //HABITACION DERECHA
  let PDIT = drawCubePI(0x0B2666, false);
  PDIT.position.z = 26;
  PDIT.position.y = 30;
  PDIT.position.x = 17;
  PDIT.rotation.y = 4.711;
  scene.add(PDIT);
  objects.push(PDIT);

  let PDIF = drawCubePI(0x0B2666, false);
  PDIF.position.z = -30;
  PDIF.position.y = 30;
  PDIF.position.x = 17;
  PDIF.rotation.y = 4.711;
  scene.add(PDIF);
  objects.push(PDIF);

  let PDID = drawCubePI(0x0B2666, false);
  PDID.position.z = 25;
  PDID.position.y = 30;
  PDID.position.x = 38;
  PDID.rotation.y = 0;
  scene.add(PDID);
  objects.push(PDID);

  let PDII = drawCubePI(0x0B2666, false);
  PDII.position.z = -30;
  PDII.position.y = 30;
  PDII.position.x = 38;
  PDII.rotation.y = 0;
  scene.add(PDII);
  objects.push(PDII);


  //HABITACION IZQUIERDA
  let PIIT = drawCubePI(0x0B2666, false);
  PIIT.position.z = 26;
  PIIT.position.y = 30;
  PIIT.position.x = -17;
  PIIT.rotation.y = 4.711;
  scene.add(PIIT);
  objects.push(PIIT);

  let PIIF = drawCubePI(0x0B2666, false);
  PIIF.position.z = -30;
  PIIF.position.y = 30;
  PIIF.position.x = -17;
  PIIF.rotation.y = 4.711;
  scene.add(PIIF);
  objects.push(PIIF);

  let PIID = drawCubePI(0x0B2666, false);
  PIID.position.z = 25;
  PIID.position.y = 30;
  PIID.position.x = -38;
  PIID.rotation.y = 0;
  scene.add(PIID);
  objects.push(PIID);

  let PIII = drawCubePI(0x0B2666, false);
  PIII.position.z = -30;
  PIII.position.y = 30;
  PIII.position.x = -38;
  PIII.rotation.y = 0;
  scene.add(PIII);
  objects.push(PIII);

  
  //SOTANO
  //PARED SOTANO IZQUIERDA
  let SWL = drawCubePE(0x697C8A, false);
  SWL.position.z = -2;
  SWL.position.y = 10;
  SWL.position.x = 50.5;
  SWL.rotation.y = 4.711;
  scene.add(SWL);
  objects.push(SWL);

  //PARED SOTANO ATRAS
  let SWB = drawCubePE(0x697C8A, false);
  SWB.position.z = 0;
  SWB.position.y = 9.9;
  SWB.position.x = 0;
  SWB.rotation.y = 0;
  scene.add(SWB);
  objects.push(SWB);

  //PARED SOTANO DERECHA
  let SWR = drawCubePE(0x697C8A, false);
  SWR.position.z = -2;
  SWR.position.y = 10;
  SWR.position.x = -50.9;
  SWR.rotation.y = 4.7111;
  scene.add(SWR);
  objects.push(SWR);

  //PARED SOTANO FRENTE
  let SWF = drawCubePE(0x697C8A, false);
  SWF.position.z = -51;
  SWF.position.y = 10;
  SWF.position.x = 0;
  scene.add(SWF);
  objects.push(SWF);

  //PISO SOTANO
  let SF = drawCubeF(0x5E6F73, false);
  SF.position.z = -1.5;
  SF.position.y = 1;
  SF.rotation.x = 20.42;
  scene.add(SF);
  objects.push(SF);

  //ESCALERAS
  let E = drawCubeE(0x402116, false);
  E.position.z = -32.5;
  E.position.x = 0;
  E.position.y = -2.1;
  E.rotation.y = 3.14;
  E.rotation.x = 0.78;
  scene.add(E);
  objects.push(E);

  let E1 = drawCubeES(0x402116, false);
  E1.position.z = -13;
  E1.position.x = 0;
  E1.position.y = 19;
  scene.add(E1);
  objects.push(E1);

  let E2 = drawCubeES(0x402116, false);
  E2.position.z = -15;
  E2.position.x = 0;
  E2.position.y = 17;
  scene.add(E2);
  objects.push(E2);

  let E3 = drawCubeES(0x402116, false);
  E3.position.z = -17;
  E3.position.x = 0;
  E3.position.y = 15;
  scene.add(E3);
  objects.push(E3);

  let E4 = drawCubeES(0x402116, false);
  E4.position.z = -19;
  E4.position.x = 0;
  E4.position.y = 13;
  scene.add(E4);
  objects.push(E4);

  let E5 = drawCubeES(0x402116, false);
  E5.position.z = -21;
  E5.position.x = 0;
  E5.position.y = 11;
  scene.add(E5);
  objects.push(E5);

  let E6 = drawCubeES(0x402116, false);
  E6.position.z = -23;
  E6.position.x = 0;
  E6.position.y = 9;
  scene.add(E6);
  objects.push(E6);

  let E7 = drawCubeES(0x402116, false);
  E7.position.z = -25;
  E7.position.x = 0;
  E7.position.y = 7;
  scene.add(E7);
  objects.push(E7);

  let E8 = drawCubeES(0x402116, false);
  E8.position.z = -27;
  E8.position.x = 0;
  E8.position.y = 5;
  scene.add(E8);
  objects.push(E8);

  let E9 = drawCubeES(0x402116, false);
  E9.position.z = -29;
  E9.position.x = 0;
  E9.position.y = 3;
  scene.add(E9);
  objects.push(E9);

  let E10 = drawCubeES(0x402116, false);
  E10.position.z = -30;
  E10.position.x = 0;
  E10.position.y = 1;
  scene.add(E10);
  objects.push(E10);

}


//DIBUJAR CUBOS//
//Paredes externas//
function drawCubePE(color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(100,20,2);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    wireframe: wireframe,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube; 
}  

//Paredes internas//
function drawCubePI(color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(40,21,2);
  const material = new THREE.MeshLambertMaterial({
    color: color,
    wireframe: wireframe,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
}

//Piso y techo//
function drawCubeF(color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(100,98,2);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    wireframe: wireframe,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
}

//piso principal//
function drawCubePF(color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(40,98,2);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    wireframe: wireframe,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
}

//piso principal mini//
function drawCubePFM(color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(25,60,2);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    wireframe: wireframe,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
}

//Escaleras//
function drawCubeE(color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(20,60,2);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    wireframe: wireframe,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
}

//Escalones//
function drawCubeES(color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(20,2,2);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    wireframe: wireframe,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
}

//Parte inferior ventana//
function drawCubePVI(color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(100,7,2);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    wireframe: wireframe,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
}

//Parte lateral ventana//
function drawCubePVL(color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(40,10,2);
  const material = new THREE.MeshPhongMaterial({
    color: color,
    wireframe: wireframe,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
}

//VideoFondoPennywise//
function videoPenny(color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(34,26,1);
  var video = document.querySelector("#PennyWise");

  var texture = new THREE.VideoTexture(video);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.MeshBasicMaterial( { map: texture } );
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
}

//VideoTelevision//
function videoTele(color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(9.5,4,0.1);
  var video = document.querySelector("#videoTele");
  
  var texture = new THREE.VideoTexture(video);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.MeshBasicMaterial( { map: texture } );
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
}

//VideoAmbiente//
function videoFNAF(color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(66,21,0.1);
  var video = document.querySelector("#videoFNAF");
  
  var texture = new THREE.VideoTexture(video);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.MeshBasicMaterial( { map: texture } );
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
}


//LUCES//
function setupLights() {
  //Quitar para ambientación de miedo
  /* let ambient;
   ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient); */

  let lightRoom1;
  lightRoom1 = new THREE.SpotLight(0x0B2666, 3);
  lightRoom1.position.set(32, 30, 0);
  lightRoom1.angle = Math.PI / 1;
  lightRoom1.penumbra = 10;
  lightRoom1.decay = 6;
  lightRoom1.distance = 150;
  lightRoom1.castShadow = true;
  scene.add(lightRoom1);

  let lightRoom2;
  lightRoom2 = new THREE.SpotLight(0x8F150D, 2);
  lightRoom2.position.set(-32, 30, 0);
  lightRoom2.angle = Math.PI / 1;
  lightRoom2.penumbra = 10;
  lightRoom2.decay = 6;
  lightRoom2.distance = 150;
  lightRoom2.castShadow = true;
  scene.add(lightRoom2);

}

//CAMARA
function controles(){

  controls = new PointerLockControls( camera, document.body );

  const blocker = document.getElementById( 'blocker' );
  const instructions = document.getElementById( 'instructions' );

  instructions.addEventListener( 'click', function () {

    controls.lock();
  } );

  controls.addEventListener( 'lock', function () {
    
    instructions.style.display = 'none';
    blocker.style.display = 'none';

  } );

  controls.addEventListener( 'unlock', function () {

    blocker.style.display = 'block';
    instructions.style.display = '';

  } );

  scene.add( controls.getObject() );

  const onKeyDown = function ( event ) {

    switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;

      case 'Space':
        if ( canJump === true ) velocity.y += 200;
        canJump = false;
        break;

    }

  };

  const onKeyUp = function ( event ) {

    switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;

    }

  };

  document.addEventListener( 'keydown', onKeyDown );
  document.addEventListener( 'keyup', onKeyUp );  

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
}

//ANIMATE//
function animate() {
  requestAnimationFrame(animate);
  const time = performance.now();
  /* renderer.render(scene, camera); */

  if ( controls.isLocked === true ) {

    raycaster.ray.origin.copy( controls.getObject().position );
    raycaster.ray.origin.y -= 20;

    const intersections = raycaster.intersectObjects( objects, false );

    const onObject = intersections.length > 0;

    const delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize(); 

    if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

    if ( onObject === true ) {

      velocity.y = Math.max( 0, velocity.y );
      canJump = true;

    }

    controls.moveRight( - velocity.x * delta );
    controls.moveForward( - velocity.z * delta );

    controls.getObject().position.y += ( velocity.y * delta ); 

    if ( controls.getObject().position.y < 10 ) {

      velocity.y = 0;
      controls.getObject().position.y = 10;
      canJump = true;

    }

  }

  prevTime = time;
  renderer.render( scene, camera );

}



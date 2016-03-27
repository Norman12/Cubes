var container, scene, camera, renderer, bouncer;
var geometry, material, mesh, light, plane;

const meshes = [];
const colors = [[0x8A4FFF, 0xC3BEF7], [0x231651, 0xFF8484], [0x1C3041, 0x18F2B2], [0xFF1654, 0xF3FFBD], [0xE71D36, 0xFF9F1C], [0x2274A5, 0xE83F6F], [0xBF3100, 0xEC9F05], [0x2AB7CA, 0xFED766]];

const CUBES = 3;
const OFFSET = -10;
const RENDERER_HEIGHT = window.innerHeight;
const DELTA = 0.035;
const THRESHOLD = 0.017;
const MULTIPLIER = 0.5;

var time = 0;
var bounces = 0;
var colorIndex = 1;
var nextColorIndex = 2;
var currentColor = new THREE.Color(colors[0][1]);
var currentAccentColor = new THREE.Color(colors[0][0]);
var nextColor = new THREE.Color(colors[1][1]);
var nextAccentColor = new THREE.Color(colors[1][0]);

init();
animate();

function init() {

  container = document.getElementById( 'container' );
  bouncer = document.getElementById( 'bouncer' );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / RENDERER_HEIGHT, 1, 1000 );
  camera.position.z = 82;
  camera.position.x = -28;
  camera.position.y = -28;
  camera.rotation.set(0.7, -0.4, -0.5);

  plane = new THREE.Mesh( new THREE.PlaneGeometry( 1200, 1200 ), new THREE.MeshBasicMaterial( {color: 0xFBFBF2, side: THREE.DoubleSide} ));
  scene.add( plane );

  material = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading, vertexColors: THREE.VertexColors, shininess: 0 } );

  for (i = 1; i <= CUBES; i++) {
    for(j = 1; j <= CUBES; j++){
      var height = (i+j)*20 - 20;
      geometry = new THREE.BoxGeometry( 10, 10, height );
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x = i*10 + OFFSET;
      mesh.position.y = j*10 - OFFSET;

      scene.add( mesh );
      meshes.push( mesh );
    }
  }

  light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
  light.color.setHex(currentColor);
  light.groundColor.setHex(currentAccentColor);

  light.position.x = 0;
  light.position.y = 0;
  light.position.z = 200;
  scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: true } );
  renderer.setSize( window.innerWidth, RENDERER_HEIGHT );
  renderer.setClearColor( 0xFBFBF2, 1 );

  container.appendChild( renderer.domElement );

}

function animate() {

  time += DELTA;
  requestAnimationFrame( animate );

  var sine = Math.abs(Math.sin(time));
  if(sine < THRESHOLD){
    if(colorIndex == colors.length-1){ colorIndex = 0 };
    if(nextColorIndex == colors.length-1) {  nextColorIndex = 0 };

    currentColor = new THREE.Color(colors[colorIndex][1]);
    currentAccentColor = new THREE.Color(colors[colorIndex][0]);

    nextColor = new THREE.Color(colors[nextColorIndex][1]);
    nextAccentColor = new THREE.Color(colors[nextColorIndex][0]);

    light.color.setHex(currentColor);
    light.groundColor.setHex(currentAccentColor);

    bounces += 1;
    bouncer.innerHTML = '// Bounces: ' + bounces;

    colorIndex += 1;
    nextColorIndex += 1;
  }

  light.color.set(currentColor.lerp(nextColor, sine/5));
  light.groundColor.set(currentAccentColor.lerp(nextAccentColor, sine/5));

  for(i = 0; i < meshes.length; i++){
    meshes[i].scale.z = Math.sqrt(Math.abs(Math.sin(time + Math.sin(i/meshes.length)))) * MULTIPLIER;
  }

  render();

}

function render() {
  renderer.render( scene, camera );
}

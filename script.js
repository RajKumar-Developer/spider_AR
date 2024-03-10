const scene = new THREE.Scene();
const camera = new THREE.Camera();
scene.add( camera );

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//AR ToolkitSource setup
var arToolkitSource = new THREEx.ArToolkitSource({
    sourceType : 'webcam',
});
arToolkitSource.init(function (){
    setTimeout(() => {
        arToolkitSource.onResizeElement();
        arToolkitSource.copyElementSizeTo(renderer.domElement);
    }, 2000);
});

//AR ToolkitContext setup
var arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'camera_para.dat',
    detectionMode: 'mono',
});
arToolkitContext.init(function (){
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});
//Ar Marker Controls setup
var ArMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
    type : 'pattern',
    patternUrl : 'pattern-artItachi.patt',
    changeMatrixMode : 'cameraTransformMatrix'
});
scene.visible = false;


const geometry = new THREE.BoxGeometry(1, 1, 1);  // Fix typo here
const material = new THREE.MeshNormalMaterial( { 
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
} );
const cube = new THREE.Mesh( geometry, material );
cube.position.y = geometry.parameters.height /2 ;
scene.add( cube );

// Animation Loop
function animate() {
	requestAnimationFrame( animate );
    arToolkitContext.update( arToolkitSource.domElement );
    scene.visible = camera.visible;
    cube.rotation.x += 0.01;
	renderer.render( scene, camera );
}

animate();

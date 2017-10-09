// $(function () {
 
 
	var app = new Vue({
	  el: '#app',
	  data: {
	    message: 'Hello Vue!',
	    seen: true,
	    tracks: null,
	    message: 'Oxxxymiron',
	  },
	  methods: {
	  	getMusic: async function() {
	  		console.log('getMusic')
	  		if (this.message) {
		  		this.tracks = await musicAPI.getTracks(this.message);
	  		} else {
	  			this.tracks = null;
	  		}
	  	},
	  	click: function(element) {
	  		audio.src = element.url;
	  		onMusicSet();
	  	},
	  }
	})

	window.addEventListener('resize', onWindowResize, false);

	var stats = initStats();
	var clock = new THREE.Clock();
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45
		, window.innerWidth / window.innerHeight , 0.1, 1000);
	camera.name = 'camera';
	var renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xEEEEEE, 1.0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	var axes = new THREE.AxisHelper( 30 );
	axes.name = 'axes';
	scene.add(axes);
	
	var cubes = [];
	var cubesCount = 16;
	for (var i = 0; i < cubesCount; i++) {
		var cubeGeometry = new THREE.CubeGeometry(0.5,1,1);
		var cubeMaterial = new THREE.MeshLambertMaterial(
			{color: 0xffffff});
		var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.name = 'cube';
		cube.castShadow = true;
		cube.position.x = i - cubesCount/2 ;
		cube.position.y = 0;
		cube.position.z = 0;
		scene.add(cube);
		cubes.push(cube);
	} 
	
	var spotLight1 = new THREE.SpotLight( 0xffffff );
	spotLight1.name = 'spotLight';
	spotLight1.position.set(0, 25, 25);
	spotLight1.castShadow = true;
	scene.add(spotLight1);

	var spotLight2 = new THREE.SpotLight( 0xfffddd );
	spotLight2.name = 'spotLight';
	spotLight2.position.set(-25, -25, -25);
	spotLight2.castShadow = true;
	scene.add(spotLight2);

	var spotLight3 = new THREE.SpotLight( 0xfffddd );
	spotLight3.name = 'spotLight';
	spotLight3.position.set(25, 0, 25);
	spotLight3.castShadow = true;
	scene.add(spotLight3);
	
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 32;
	camera.lookAt(scene.position);
	
    // var flyControls = new THREE.FlyControls(camera);
    // flyControls.movementSpeed = 25;
    // flyControls.domElement = document.querySelector("#WebGL-output");
    // flyControls.rollSpeed = Math.PI / 5;
    // flyControls.autoForward = false;
    // flyControls.dragToLook = true;


	var file = document.getElementById("thefile");
	var audio = document.getElementById("audio");
	audio.crossOrigin = "anonymous";
	var context = new AudioContext();
	var src;

	onMusicSet = function() {
		audio.load();
		audio.play();
		src = src || context.createMediaElementSource(audio);
		var analyser = context.createAnalyser();

		src.connect(analyser);
		analyser.connect(context.destination);

		analyser.fftSize = cubesCount * 2;

		var bufferLength = analyser.frequencyBinCount;
		console.log(bufferLength);

		var dataArray = new Uint8Array(bufferLength);

		var WIDTH = window.innerWidth;
		var HEIGHT = window.innerHeight;

		var DIFF = HEIGHT / 256;

		var lineHeight = 10;

		function renderFrame() {
		  requestAnimationFrame(renderFrame);

		  var barHeight;

		  analyser.getByteFrequencyData(dataArray);

		  for (var i = 0; i < bufferLength; i++) {
		    barHeight = dataArray[i];
		    
		    var r = Math.round(barHeight + (25 * (i / bufferLength)));
		    var g = Math.round(255 * (i / bufferLength));
		    var b = 150;

	    	cubes[i].scale.y = barHeight / (DIFF*4) > 1 ? barHeight / (DIFF*4) : 1
	    	cubes[i].material.color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);
		  }

		}

		renderFrame();
	};


	$("#WebGL-output").append(renderer.domElement);
	render();

	window.scene = scene;

	var step = 0;
	function render() {
		stats.update();
		var delta = clock.getDelta();
		// flyControls.update(delta);

		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function initStats() {
		var stats = new Stats();
		stats.setMode(0);
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		$("#Stats-output").append(stats.domElement );
		return stats;
	}

	function onWindowResize(){
	    camera.aspect = window.innerWidth / window.innerHeight;
	    camera.updateProjectionMatrix();
	    renderer.setSize(window.innerWidth, window.innerHeight);
	}

	// $(window).keypress(function (e) {
	//   if (e.keyCode === 0 || e.keyCode === 32) {
	//     e.preventDefault()
	// 	camera.position.x = 0;
	// 	camera.position.y = 0;
	// 	camera.position.z = 32;
	// 	camera.rotation = new THREE.Vector3(0, 0, 0);
	// 	camera.lookAt(scene.position);
	// 	app.$data.seen = !app.$data.seen
	//   } else if (e.keyCode === 49) {
	// 	camera.position.x = 25;
	// 	camera.position.y = 25;
	// 	camera.position.z = 25;
	// 	camera.rotation = new THREE.Vector3(0, 0, 0);
	// 	camera.lookAt(scene.position);
	//   } else if (e.keyCode === 50) {
	// 	camera.position.x = -25;
	// 	camera.position.y = 25;
	// 	camera.position.z = 25;
	// 	camera.rotation = new THREE.Vector3(0, 0, 0);
	// 	camera.lookAt(scene.position);
	//   } else if (e.keyCode === 51) {
	// 	camera.position.x = 25;
	// 	camera.position.y = -25;
	// 	camera.position.z = 25;
	// 	camera.rotation = new THREE.Vector3(0, 0, 0);
	// 	camera.lookAt(scene.position);
	//   } else if (e.keyCode === 52) {
	// 	camera.position.x = 25;
	// 	camera.position.y = 25;
	// 	camera.position.z = -25;
	// 	camera.rotation = new THREE.Vector3(0, 0, 0);
	// 	camera.lookAt(scene.position);
	//   } else if (e.keyCode === 53) {
	//   	for (i = 0; i < cubes.length; i++) {
	//   		var v = (360 / cubes.length) * i;
	//   		var distanceFromCenter = 5;
	// 		var angleInDegrees = v;
	// 		var angleAsRadians = (angleInDegrees* Math.PI) / 180.0;
	// 		var centerX = 0;
	// 		var centerY = 0;

	// 		var x = centerX +  Math.cos(angleAsRadians) * distanceFromCenter;
	// 		var y = centerY + Math.sin(angleAsRadians) * distanceFromCenter;
	// 		cubes[i].position.x = x;
	// 		cubes[i].position.z = y;
	//   	}
	//   } else if (e.keyCode === 54) {
	//   	for (i = 0; i < cubes.length; i++) {
	// 		cubes[i].position.x = i - cubes.length / 2;
	// 		cubes[i].position.z = 0;
	//   	}
	//   }
	// })
// });
window.addEventListener('load', function() {
	
	// webcam

	window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	var video = document.createElement( 'video' );
	video.autoplay = true;

	video.addEventListener( 'loadedmetadata', function ( event ) {

		video.style.width = video.videoWidth + 'px';
		video.style.height = video.videoHeight + 'px';

		init();

	} );

	navigator.getUserMedia( { video: true }, function ( stream ) {

		video.src = window.URL.createObjectURL( stream );

	}, function ( error ) {

		console.log( error );

	} );

	// 3d

	var camera, scene, renderer;

	var init = function () {

		camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.z = 500;

		scene = new THREE.Scene();

		texture = new THREE.Texture( video );
		texture.minFilter = THREE.NearestFilter;
		texture.magFilter = THREE.NearestFilter;
		texture.format = THREE.RGBFormat;
		texture.generateMipmaps = false;
		texture.needsUpdate = true;

		var geometry = new THREE.PlaneGeometry( video.videoWidth, video.videoHeight );

		var material = new THREE.ShaderMaterial( {

			uniforms: {

				"map": { value: texture }

			},
			vertexShader: document.getElementById( 'vs' ).textContent,
			fragmentShader: document.getElementById( 'fs' ).textContent

		} );

		var mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		renderer = new THREE.WebGLRenderer( );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		renderer.domElement.style.width = window.innerWidth + 'px';
		renderer.domElement.style.height = window.innerHeight + 'px';

		animate();

	};

	var animate = function () {

		requestAnimationFrame( animate );

		if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

			texture.needsUpdate = true;

		}

		renderer.render( scene, camera );

	};


});

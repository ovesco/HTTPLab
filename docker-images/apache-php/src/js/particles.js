
var SEPARATION = 80, AMOUNT = 25, AMOUNTX = 60, AMOUNTY = 10;

var container;
var camera, scene, renderer;

var particles, groundParticles, groundParticle, particle, count = 0;

var mouseX = 0, mouseY = 0;

var lastLoop = new Date();

var windowHalfX = getWidth();
var windowHalfY = getHeight();

init();
animate();

function getWidth() {

    return window.innerWidth - (window.outerWidth - window.innerWidth) - 15;
}

function getHeight() {

    return window.innerHeight/2;
}

function init() {

    container = document.getElementById('landing');
    camera = new THREE.PerspectiveCamera( 75, getWidth() / getHeight(), 10, 10000 );
    //camera.position.x   = -1100;
    camera.position.y   = 50;
    camera.position.z   = 800;

    scene = new THREE.Scene();

    particles       = [];
    groundParticles = [];

    var PI2 = Math.PI * 2;
    var material = new THREE.SpriteCanvasMaterial( {

        color: 0xffffff,
        program: function ( context ) {

            context.beginPath();
            context.arc( 0, 0, 0.5, 0, PI2, true );
            context.fill();

        }

    });

    var i = 0, points = [], x, z;
    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

        points = [];
        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

            x   = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
            z   = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );

            i++;

            particle = new THREE.Sprite( material );
            groundParticle = new THREE.Sprite();

            particle.position.x = x;
            particle.position.z = z;

            groundParticle.position.x = x;
            groundParticle.position.z = z;

            //scene.add(groundParticle);

            scene.add(particle);
            points.push(groundParticle.position);
            particles[i] = particle;
            groundParticles[i] = groundParticle;

        }

        //drawLine(points);
    }

    points = [];
    for(i = 0; i < AMOUNTX*AMOUNTY; i++) {

        if(!Array.isArray(points[i%AMOUNTY]))
            points[i] = [];

        if(particles[i] !== undefined)
            points[i%AMOUNTY].push(particles[i].position);
    }

    for(i = 0; i < AMOUNTY; i++);
        //drawLine(points[i]);

    renderer = new THREE.CanvasRenderer({
        canvas: document.getElementById('canvas'),
        alpha: true
    });

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( getWidth(), getHeight() );
    //container.appendChild( renderer.domElement );

    //document.addEventListener( 'mousemove', onDocumentMouseMove, false );


    window.addEventListener( 'resize', onWindowResize, false );

}

function drawLine(points) {

    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x0e0f31 } ) );
    scene.add( line );
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 4;

    camera.aspect = getWidth() / getHeight();
    camera.updateProjectionMatrix();

    renderer.setSize( getWidth(), getHeight() );

}

//

function onDocumentMouseMove( event ) {

    mouseX = event.clientX/10 - getWidth()/2;
    mouseY = event.clientY/10 - getHeight();
}

function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {

    var currentLoop = new Date();
    var fps = 1000 / (currentLoop - lastLoop);
    lastLoop = currentLoop;

    //console.log(fps);

    //camera.position.x += ( mouseX - camera.position.x ) * .05;
    //camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt( scene.position );

    var i = 0;

    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

            particle = particles[ i++ ];

            if(particle !== undefined) {

                particle.position.y = ( Math.sin(( ix + count ) * 0.3) * 50 ) +
                    ( Math.sin(( iy + count ) * 0.5) * 50 ) - 150;
                particle.scale.x = particle.scale.y = ( Math.sin(( ix + count ) * 0.3) + 1 ) * 4 +
                    ( Math.sin(( iy + count ) * 0.5) + 1 ) * 3;
            }
        }
    }

    renderer.render( scene, camera );

    count += 0.02;
}
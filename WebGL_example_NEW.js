// Global Variables

let player = 1;
let leftRight = 0;
var selectedCheckerID;
var gl = null; // WebGL context

var shaderProgram = null;

var triangleVertexPositionBuffer = null;
var triangleVertexTextureCoordBuffer;
	
var triangleVertexNormalBuffer = null;	
var triangleVertexColorBuffer = null;

// The GLOBAL transformation parameters
let n = 180;
var globalAngleYY = 0.0;

var globalAngleZZ = 0.0;

var globalTz = 0.0;

// GLOBAL Animation controls
var globalRotation = 0.0;
var globalRotationYY_ON = 0;

var globalRotationYY_DIR = 1;

var globalRotationYY_SPEED = 1;

var globalRotationZZ_ON = 0;

var globalRotationZZ_DIR = 1;

var globalRotationZZ_SPEED = 0.50;

var translationSPEED = 0.1;

var move_units = -1.0;
var index2delete = -1;
// To allow choosing the way of drawing the model triangles

var primitiveType = null;
 
// To allow choosing the projection type

var projectionType = 1;

// NEW --- The viewer position

// It has to be updated according to the projection type

var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];


//----------------------------------------------------------------------------
//
// NEW - To count the number of frames per second (fps)
//

var elapsedTime = 0;

var frameCount = 0;

var lastfpsTime = new Date().getTime();




function countFrames() {
	
   var now = new Date().getTime();

   frameCount++;
   
   elapsedTime += (now - lastfpsTime);

   lastfpsTime = now;

   if(elapsedTime >= 1000) {
	   
       fps = frameCount;
       
       frameCount = 0;
       
       elapsedTime -= 1000;
	   
	   document.getElementById('fps').innerHTML = 'fps:' + fps;
   }
}


//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex Coordinates and the Vertex Normal Vectors

function initBuffers( model ) {	
	
	// Vertex Coordinates
		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems =  model.vertices.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors
		
	triangleVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( model.normals), gl.STATIC_DRAW);
	triangleVertexNormalBuffer.itemSize = 3;
	triangleVertexNormalBuffer.numItems = model.normals.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
	 		triangleVertexNormalBuffer.itemSize, 
	 		gl.FLOAT, false, 0, 0);	


	// colors
	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = model.colors.length / 3;	

	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
		triangleVertexColorBuffer.itemSize,
		gl.FLOAT, false, 0, 0);  

	/* Textures
    triangleVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexTextureCoordBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.texture), gl.STATIC_DRAW);
    triangleVertexTextureCoordBuffer.itemSize = 2;
	triangleVertexTextureCoordBuffer.numItems = 24;
}

function handleLoadedTexture(texture) {
	
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);
}


var webGLTexture;
var webGLTextureWood;

function initTexture() {

	images = ["checkers_board2.gif","wood2.gif"]
	
	webGLTexture = gl.createTexture();
	webGLTexture.image = new Image();
	webGLTexture.image.onload = function () {
		handleLoadedTexture(webGLTexture)
	}

	webGLTexture.image.src = "checkers_board2.gif";

	webGLTextureWood = gl.createTexture();
	webGLTextureWood.image = new Image();
	webGLTextureWood.image.onload = function () {
		handleLoadedTexture(webGLTextureWood)
	}

	webGLTextureWood.image.src = "wood2.gif";

	*/
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel( model,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input
	
	// Concatenate with the particular model transformations
	
    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader
	
	// This can be done in a better way !!

	// Vertex Coordinates and Vertex Normal Vectors
	
	initBuffers(model);
	
	// Material properties
	
	gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_ambient"), 
		flatten(model.kAmbi) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(model.kDiff) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(model.kSpec) );

	gl.uniform1f( gl.getUniformLocation(shaderProgram, "shininess"), 
		model.nPhong );

    // Light Sources
	
	var numLights = lightSources.length;
	
	gl.uniform1i( gl.getUniformLocation(shaderProgram, "numLights"), 
		numLights );

	//Light Sources
	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl.uniform1i( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );
    
		gl.uniform4fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );
    
		gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	// Drawing 
	
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	
	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
		
	}	
/*
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, triangleVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
        
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
	
	

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, webGLTextureWood);
        
    gl.uniform1i(shaderProgram.samplerUniform, 1);
    
    

	// Drawing the triangles --- NEW --- DRAWING ELEMENTS 
	
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
*/
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix
	
	if( projectionType == 0 ) {
		
		// For now, the default orthogonal view volume
		
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
		
		// Global transformation !!
		
		globalTz = 0.0;
		
		// NEW --- The viewer is on the ZZ axis at an indefinite distance
		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;
		
		pos_Viewer[2] = 1.0;  
		
		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	else {	

		// A standard view volume.
		
		// Viewer is at (0,0,0)
		
		// Ensure that the model is "inside" the view volume
		
		pMatrix = perspective( 45, 1, 0.05, 15 );
		
		// Global transformation !!
		
		globalTz = -3;

		// NEW --- The viewer is on (0,0,0)
		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
		
		pos_Viewer[3] = 1.0;  
		
		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// NEW --- Passing the viewer position to the vertex shader
	
	gl.uniform4fv( gl.getUniformLocation(shaderProgram, "viewerPosition"),
        flatten(pos_Viewer) );
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	
	mvMatrix = mult(mvMatrix, translationMatrix( 0, 0, globalTz ));
	mvMatrix = mult(mvMatrix, rotationXXMatrix(-55));
	mvMatrix = mult(mvMatrix, rotationZZMatrix(globalAngleZZ));

	
	// NEW - Updating the position of the light sources, if required
	
	// FOR EACH LIGHT SOURCE
	    
	for(var i = 0; i < lightSources.length; i++ )
	{
		// Animating the light source, if defined
		    
		var lightSourceMatrix = mat4();

		if( !lightSources[i].isOff() ) {
				
			// COMPLETE THE CODE FOR THE OTHER ROTATION AXES

			if( lightSources[i].isRotYYOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleYY() ) );
			}
		}
		
		// NEW Passing the Light Souree Matrix to apply
	
		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");
	
		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
			
	// Instantianting all scene models
	for(var i = 0; i < sceneModels.length; i++ )
	{ 
		drawModel( sceneModels[i],
			   mvMatrix,
	           primitiveType );
	}
	           
	// NEW - Counting the frames
	
	countFrames();
}

//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;

function animate() {
	
	var timeNow = new Date().getTime();

	if( lastTime != 0 ) {

		var elapsed = timeNow - lastTime;

		// Global rotation

		if( globalRotationYY_ON ) {

			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }


		if( globalRotationZZ_ON ) {

			// nao para exatamente no angulo 180 ??
			if(globalAngleZZ > n-2 && globalAngleZZ < n+2) {
				globalAngleZZ = n;
				globalRotationZZ_ON = 0;
				n += 180;
			}
			else{
				globalAngleZZ += globalRotationZZ_DIR * globalRotationZZ_SPEED * (90 * elapsed) / 1000.0;
			}

		}

		// For every model --- Local rotations

		for(let i = 1; i < sceneModels.length; i++ )
	    {
			if(sceneModels[i].translation_ON){
				if(sceneModels[i].translation.toFixed(1)  === move_units.toFixed(1) && move_units.toFixed(1) > 0.0){
					sceneModels[i].translation_ON = 0;
					sceneModels[i].translation = 0.0;
					leftRight = 0;
					move_units = -1.0;
					if(index2delete > 0) {
						console.log(index2delete);
						sceneModels.splice(index2delete, 1);
					}
					index2delete = -1;
					changePlayer();
				}
				else{
					// discover how much units should it move and witch index to delete
					if(Math.abs(leftRight)){
						if(move_units === -1.0) {
							let tmp = typeOfMove(sceneModels[i], 0.2 * leftRight, 0.2 * sceneModels[i].player);
							console.log(tmp);
							move_units = 0.2 * tmp[0];
							index2delete = tmp[1];
							const can_move = insideLimits(sceneModels[i], move_units * leftRight, move_units * sceneModels[i].player);
							if (move_units === 0.0 || !can_move) {
								sceneModels[i].translation_ON = 0;
								sceneModels[i].translation = 0.0;
								move_units = -1.0;
								index2delete = -1;
								continue;
							}
						}
						moveAnimation(sceneModels[i]);
					}

				}
			}
		}

		// Rotating the light sources

		for(let i = 0; i < lightSources.length; i++ )
	    {
			if( lightSources[i].isRotYYOn() ) {

				let angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;

				lightSources[i].setRotAngleYY( angle );
			}
		}
}
	
	lastTime = timeNow;
}


//----------------------------------------------------------------------------

// Timer

function tick() {
	
	requestAnimFrame(tick);
	
	drawScene();
	
	animate();
}


//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos(){
    
}
function changePlayer(){
	if(player === 1){
		player = -1;
	}else{
		player = 1;
	}
	globalRotationZZ_ON=1;
}

function insideLimits(model, dx, dy){
	return -0.8 < model.tx + dx && model.tx + dx < 0.8 && -0.8 < model.ty + dy && model.ty + dy < 0.8;
}

function moveAnimation(model){
	console.log("chega aqui");
	model.ty += translationSPEED * model.player;
	model.tx += translationSPEED * leftRight;
	model.translation += translationSPEED;
	model.tz = 0.02 + 0.8 * Math.sin(model.translation/move_units*Math.PI);
}

function typeOfMove(model, dx, dy){
	let tx = model.tx;
	let ty = model.ty;
	// verify if there is a dama at the proposed position
	for(let i = 1; i<sceneModels.length; i++){
		//there is a dama at the position
		/*console.log(tx + dx);
		console.log(sceneModels[i].tx);
		console.log(ty + dy);
		console.log(sceneModels[i].ty);
		console.log("separaador");*/
		if((tx + dx).toFixed(1) === sceneModels[i].tx.toFixed(1) && (ty + dy).toFixed(1) === sceneModels[i].ty.toFixed(1)){
			console.log("peça seguinte pode ser comida");
			// dama is from another player
			if(player !== sceneModels[i].player){
				console.log("peça de player diferente");
				for(let j=1; j<sceneModels.length; j++){
					// can't eat
					if((tx + 2*dx).toFixed(1) === sceneModels[j].tx.toFixed(1) && (ty + 2*dy).toFixed(1) === sceneModels[j].ty.toFixed(1)){
						console.log("sem peça em duas unidades");
						return [0.0, -1];
					}
				}
				// can eat and move 2 times the proposed position
				return [2.0, i];
			}
			// a player dama can't move
			else{
				return [0.0, -1];
			}
		}
	}
	// no dama at the proposed position
	return [1.0, -1];
}

// Handling keyboard events

var currentlyPressedKeys = {};

function handleKeys() {

	if (currentlyPressedKeys[33]) {
	}
}


//----------------------------------------------------------------------------

function setEventListeners(){
	
    // Dropdown list
	function handleKeyDown(event) {
		currentlyPressedKeys[event.code] = true;
	}

	function handleKeyUp(event) {
		currentlyPressedKeys[event.code] = false;
	}

	document.onkeydown = handleKeyDown;

	document.onkeyup = handleKeyUp;


	// Dropdown list
	
	var list = document.getElementById("rendering-mode-selection");
	
	list.addEventListener("click", function(){
				
		// Getting the selection
		
		var mode = list.selectedIndex;
				
		switch(mode){
			
			case 0 : primitiveType = gl.TRIANGLES;
				break;
			
			case 1 : primitiveType = gl.LINE_LOOP;
				break;
			
			case 2 : primitiveType = gl.POINTS;
				break;
		}
	});      

	// Button events

	document.getElementById("move-left").onclick = function(){
		leftRight = -1 * player;
		console.log("leftRight:"+leftRight);
	};    
	
	document.getElementById("move-right").onclick = function(){
		leftRight = player;
		console.log("leftRight:"+leftRight);
	};

	var checker = document.getElementById("select-checker");
	
	checker.addEventListener("click", function(){
				
		// Getting the selection
		var Checkercolor =[];
		for(var i= 0; i < dama_vertices.length;i++){
			Checkercolor[i] = 0.4;	
		}
		var Checkercolor1 =[];
		for(var i= 0; i < dama_vertices.length;i++){
			Checkercolor1[i] = 0.1;	
		}

		var select = [];

		for(var j= 0; j < dama_vertices.length;j++){
			select[j++] = 0.1;
			select[j++] = 0.0;
			select[j] = 0.0;

		}
		var id = checker.selectedIndex;
		
		
		if(player == -1){
			
			id += 12;
		}
		selectedCheckerID = id;
		for(var k=1; k < sceneModels.length; k++ )
	    {
			if((k == id)) {
				sceneModels[k].kAmbi = [0,0,0];
				sceneModels[k].kDiff = [1.0,0.00,0.00];
				sceneModels[k].kSpec = [0.7,0.6,0.6];

				sceneModels[k].colors = select;
				sceneModels[k].translation_ON = 1;
			}else{
				sceneModels[k].kAmbi = [0,0,0];
				sceneModels[k].kDiff = [0.4,0.4,0.4];
				sceneModels[k].kSpec = [0.5,0.5,0.5];
				sceneModels[k].translation_ON = 0;
				if (k < 13){
					sceneModels[k].colors = Checkercolor;


				} else{

					sceneModels[k].colors = Checkercolor1;

				}
			}
		}	
	});


}

//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// NEW - Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: Face culling is DISABLED
		
		// Enable FACE CULLING
		
		gl.enable( gl.CULL_FACE );
		
		// DEFAULT: The BACK FACE is culled!!
		
		// The next instruction is not needed...
		
		gl.cullFace( gl.BACK );
		
		// Enable DEPTH-TEST
		
		gl.enable( gl.DEPTH_TEST );
        
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");
	canvas.width = 1920;
	canvas.height = 1920;
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners();
	
	tick();		// A timer controls the rendering / animation    

	outputInfos();
}



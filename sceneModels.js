//  Constructors

function emptyModelFeatures() {

	// EMPTY MODEL

	this.vertices = [];

	this.colors = [];

	this.normals = [];

	this.texture = [];

	// Transformation parameters

	// Displacement vector
	
	this.tx = 0.0;
	
	this.ty = 0.0;
	
	this.tz = 0.0;	
	
	// Rotation angles	
	
	this.rotAngleXX = 0.0;
	
	this.rotAngleYY = 0.0;
	
	this.rotAngleZZ = 0.0;	

	// Scaling factors
	
	this.sx = 1.0;
	
	this.sy = 1.0;
	
	this.sz = 1.0;		
	
	// Animation controls

	this.rotXXOn = false;

	this.rotYYOn = false;

	this.rotZZOn = false;

	this.rotXXSpeed = 1.0;
	
	this.rotYYSpeed = 1.0;
	
	this.rotZZSpeed = 1.0;
	
	this.rotXXDir = 1;
	
	this.rotYYDir = 1;
	
	this.rotZZDir = 1;

	this.translation_ON = 0;
	this.leftRightTranslation = 0;
	this.translation = 0;

	// Material features
	
	this.kAmbi = [ 0.2, 0.2, 0.2 ];
	
	this.kDiff = [ 0.7, 0.7, 0.7 ];

	this.kSpec = [ 0.7, 0.7, 0.7 ];

	this.nPhong = 100;
}

function singleCheckersModel(player) {

	var dama = new emptyModelFeatures();
	dama.vertices = dama_vertices;
	var i;
	dama.player = player;
	var color;
	if(dama.player === -1){
		color = 0.10;
	}
	else{
		color = 0.40;
	}
	for(i= 0; i <= dama.vertices.length;i++){
		dama.colors[i] = color;
	}
	dama.texture = [

		// Front face
		1.0, 1.0,
		1.0, 0.0,
		0.0, 0.0,
		0.0, 1.0,
		// Back face
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		// Top face
		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,

		// Bottom face
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,

		// Right face
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		// Left face
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
	];
	 dama.kAmbi = [0,0,0];
	 dama.kDiff = [0.4,0.4,0.4];
	 dama.kSpec = [0.50,0.50,0.50];
	 dama.nPhong = 25;
	computeVertexNormals(dama.vertices, dama.normals);
	return dama;
}

function singleTriangleModel() {

	var triangle = new emptyModelFeatures();
	
	// Default model has just ONE TRIANGLE

	triangle.vertices = [

		// FRONTAL TRIANGLE
		 
		-0.5, -0.5,  0.5,
		 
		 0.5, -0.5,  0.5,
		 
		 0.5,  0.5,  0.5,
	];

	triangle.normals = [

		// FRONTAL TRIANGLE
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
	];

	return triangle;
}


function simpleCubeModel( ) {
	
	var cube = new emptyModelFeatures();
	
	cube.vertices = [

		-1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
         1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000,  1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000,  1.000000,  1.000000, 
        -1.000000, -1.000000, -1.000000, 
        -1.000000,  1.000000, -1.000000,
         1.000000,  1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000, -1.000000, -1.000000,
		 1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000, -1.000000,  1.000000, 	 
	];

	computeVertexNormals( cube.vertices, cube.normals );

	return cube;
}


function cubeModel( subdivisionDepth = 0 ) {
	
	var cube = new simpleCubeModel();
	
	midPointRefinement( cube.vertices, cube.colors, subdivisionDepth );
	
	var j, k,cindex;
	cindex = 0;
	for(j=0; j < (5); j++){
		if(j > 0){
			for(k=0; k < board_color.length; k++){

				
				cube.colors[cindex] = 0.396;
				cindex++;		
				cube.colors[cindex] = 0.263;
				cindex++;
				cube.colors[cindex] = 0.129;
				cindex++;
			}
			
			
		}else{
			for(k=0; k < board_color.length; k++){

				cube.colors[cindex] = board_color[k];
				cindex++;
			}
		}


	}
	
	computeVertexNormals( cube.vertices, cube.normals );
	
	return cube;
}


function simpleTetrahedronModel( ) {
	
	var tetra = new emptyModelFeatures();
	
	tetra.vertices = [

		-1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         0.000000, -1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000, 
         0.000000,  1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000,
	];

	computeVertexNormals( tetra.vertices, tetra.normals );

	return tetra;
}


function tetrahedronModel( subdivisionDepth = 0 ) {
	
	var tetra = new simpleTetrahedronModel();
	
	midPointRefinement( tetra.vertices, tetra.colors, subdivisionDepth );
	
	computeVertexNormals( tetra.vertices, tetra.normals );
	
	return tetra;
}


function sphereModel( subdivisionDepth = 2 ) {
	
	var sphere = new simpleCubeModel();
	
	midPointRefinement( sphere.vertices,sphere.colors, subdivisionDepth );
	
	moveToSphericalSurface( sphere.vertices )
	
	computeVertexNormals( sphere.vertices, sphere.normals );
	
	return sphere;
}


//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

var sceneModels = [];

// Changing Cube to Board
sceneModels.push(cubeModel(3));


sceneModels[0].ty = 0;
sceneModels[0].tz = -0.1;
sceneModels[0].sx = 0.80;
sceneModels[0].sy = 0.80;
sceneModels[0].sz = 0.1;

let column, row;
for(row=0; row<8; row++){
	for(column=0; column<4; column++){
		if(row % 2 == 0){
			if(row==3 || row==4){
				continue;
			}
			else{
				if(row < 3){sceneModels.push(new singleCheckersModel(1));}
				else{sceneModels.push(new singleCheckersModel(-1));}
				sceneModels[sceneModels.length -1].tz = 0.02;
				sceneModels[sceneModels.length -1].sz = 0.02;
				sceneModels[sceneModels.length -1].sx = sceneModels[sceneModels.length -1].sy = 0.06;
				sceneModels[sceneModels.length -1].tx = -0.7 + 0.4 * column;
				sceneModels[sceneModels.length -1].ty = -0.7 + 0.2 * row;
			}

		}
		else if(row % 2 != 0){
			if(row==3 || row==4){
				continue;
			}
			else{
				if(row < 3){sceneModels.push(new singleCheckersModel(1));}
				else{sceneModels.push(new singleCheckersModel(-1));}
				sceneModels[sceneModels.length -1].tz = 0.02;
				sceneModels[sceneModels.length -1].sz = 0.02;
				sceneModels[sceneModels.length -1].sx = sceneModels[sceneModels.length -1].sy = 0.06;
				sceneModels[sceneModels.length -1].tx = -0.7 + 0.2 + 0.4 * column;
				sceneModels[sceneModels.length -1].ty = -0.7 + 0.2 * row;
			}

		}

	}
}


/* classes */ 

// Color constructor
class Color {
    constructor(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
} // end color class


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(imagedata, x, y, color)
        console.log(e);
    }
} // end drawPixel
    
// draw random pixels
function drawRandPixels(context) {
    var c = new Color(0,0,0,0); // the color at the pixel: black
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    const PIXEL_DENSITY = 0.01;
    var numPixels = (w*h)*PIXEL_DENSITY; 
    
    // Loop over 1% of the pixels in the image
    for (var x=0; x<numPixels; x++) {
        c.change(Math.random()*255,Math.random()*255,
            Math.random()*255,255); // rand color
        drawPixel(imagedata,
            Math.floor(Math.random()*w),
            Math.floor(Math.random()*h),
                c);
    } // end for x
    context.putImageData(imagedata, 0, 0);
} // end draw random pixels

// get the input ellipsoids from the standard class URL
function getInputEllipsoids() {
    const INPUT_ELLIPSOIDS_URL = 
        "https://ncsucgclass.github.io/prog1/ellipsoids.json";
        
    // load the ellipsoids file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_ELLIPSOIDS_URL,false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log*("Unable to open input ellipses file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response); 
} // end get input ellipsoids

//get the input triangles from the standard class URL
function getInputTriangles() {
    const INPUT_TRIANGLES_URL = 
        "https://ncsucgclass.github.io/prog1/triangles.json";
        
    // load the triangles file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_TRIANGLES_URL,false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log*("Unable to open input triangles file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response); 
} // end get input triangles

// put random points in the ellipsoids from the class github
function drawRandPixelsInInputEllipsoids(context) {
    var inputEllipsoids = getInputEllipsoids();
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    const PIXEL_DENSITY = 0.1;
    var numCanvasPixels = (w*h)*PIXEL_DENSITY; 
    
    if (inputEllipsoids != String.null) { 
        var x = 0; var y = 0; // pixel coord init
        var cx = 0; var cy = 0; // init center x and y coord
        var ellipsoidXRadius = 0; // init ellipsoid x radius
        var ellipsoidYRadius = 0; // init ellipsoid y radius
        var numEllipsoidPixels = 0; // init num pixels in ellipsoid
        var c = new Color(0,0,0,0); // init the ellipsoid color
        var n = inputEllipsoids.length; // the number of input ellipsoids
        //console.log("number of ellipses: " + n);

        // Loop over the ellipsoids, draw rand pixels in each
        for (var e=0; e<n; e++) {
            cx = w*inputEllipsoids[e].x; // ellipsoid center x
            cy = h*inputEllipsoids[e].y; // ellipsoid center y
            ellipsoidXRadius = Math.round(w*inputEllipsoids[e].a); // x radius
            ellipsoidYRadius = Math.round(h*inputEllipsoids[e].b); // y radius
            numEllipsoidPixels = ellipsoidXRadius*ellipsoidYRadius*Math.PI; // projected ellipsoid area
            numEllipsoidPixels *= PIXEL_DENSITY; // percentage of ellipsoid area to render to pixels
            numEllipsoidPixels = Math.round(numEllipsoidPixels);
            //console.log("ellipsoid x radius: "+ellipsoidXRadius);
            //console.log("ellipsoid y radius: "+ellipsoidYRadius);
            //console.log("num ellipsoid pixels: "+numEllipsoidPixels);
            c.change(
                inputEllipsoids[e].diffuse[0]*255,
                inputEllipsoids[e].diffuse[1]*255,
                inputEllipsoids[e].diffuse[2]*255,
                255); // ellipsoid diffuse color
            for (var p=0; p<numEllipsoidPixels; p++) {
                do {
                    x = Math.random()*2 - 1; // in unit square 
                    y = Math.random()*2 - 1; // in unit square
                } while (Math.sqrt(x*x + y*y) > 1) // a circle is also an ellipse
                drawPixel(imagedata,
                    cx+Math.round(x*ellipsoidXRadius),
                    cy+Math.round(y*ellipsoidYRadius),c);
                //console.log("color: ("+c.r+","+c.g+","+c.b+")");
                //console.log("x: "+Math.round(w*inputEllipsoids[e].x));
                //console.log("y: "+Math.round(h*inputEllipsoids[e].y));
            } // end for pixels in ellipsoid
        } // end for ellipsoids
        context.putImageData(imagedata, 0, 0);
    } // end if ellipsoids found
} // end draw rand pixels in input ellipsoids

// draw 2d projections read from the JSON file at class github
function drawInputEllipsoidsUsingArcs(context) {
    var inputEllipsoids = getInputEllipsoids();
    
    
    if (inputEllipsoids != String.null) { 
        var c = new Color(0,0,0,0); // the color at the pixel: black
        var w = context.canvas.width;
        var h = context.canvas.height;
        var n = inputEllipsoids.length; 
        //console.log("number of ellipsoids: " + n);

        // Loop over the ellipsoids, draw each in 2d
        for (var e=0; e<n; e++) {
            context.fillStyle = 
                "rgb(" + Math.floor(inputEllipsoids[e].diffuse[0]*255)
                +","+ Math.floor(inputEllipsoids[e].diffuse[1]*255)
                +","+ Math.floor(inputEllipsoids[e].diffuse[2]*255) +")"; // diffuse color
            context.save(); // remember previous (non-) scale
            context.scale(1, inputEllipsoids[e].b/inputEllipsoids[e].a); // scale by ellipsoid ratio 
            context.beginPath();
            context.arc(
                Math.round(w*inputEllipsoids[e].x),
                Math.round(h*inputEllipsoids[e].y),
                Math.round(w*inputEllipsoids[e].a),
                0,2*Math.PI);
            context.restore(); // undo scale before fill so stroke width unscaled
            context.fill();
            //console.log(context.fillStyle);
            //console.log("x: "+Math.round(w*inputEllipsoids[e].x));
            //console.log("y: "+Math.round(h*inputEllipsoids[e].y));
            //console.log("a: "+Math.round(w*inputEllipsoids[e].a));
            //console.log("b: "+Math.round(h*inputEllipsoids[e].b));
        } // end for ellipsoids
    } // end if ellipsoids found
} // end draw input ellipsoids

function getTriangles(triangle_files){
    var n = triangle_files.length;
    //console.log(triangle_files) 
    var triangles = new Array();
    var materials = new Array();
    for (var f=0; f<n; f++) {
        file_triangles = triangle_files[f]
        var tn = file_triangles.triangles.length;
        // var tn = inputTriangles[f].triangles.length;
        // Loop over the triangles, draw each in 2d 
        for(var t=0; t<tn; t++){
            var vertex1 = file_triangles.triangles[t][0];
            var vertex2 = file_triangles.triangles[t][1];
            var vertex3 = file_triangles.triangles[t][2];

            var vertexPos1 = file_triangles.vertices[vertex1];
            var vertexPos2 = file_triangles.vertices[vertex2];
            var vertexPos3 = file_triangles.vertices[vertex3];
            
            var v1 = {x:vertexPos1[0], y:vertexPos1[1], z:vertexPos1[2]};
            var v2 = {x:vertexPos2[0], y:vertexPos2[1], z:vertexPos2[2]};
            var v3 = {x:vertexPos3[0], y:vertexPos3[1], z:vertexPos3[2]};

            // triangle position on canvas
            //var v1 = [w*vertexPos1[0], h*vertexPos1[1]];
            //var v2 = [w*vertexPos2[0], h*vertexPos2[1]];
            //var v3 = [w*vertexPos3[0], h*vertexPos3[1]];
            triangles.push({x: v1, y: v2, z: v3})
            materials.push(file_triangles.material)
        }
    }
    return new Array(triangles, materials)
}

//put random points in the triangles from the class github
function drawRandPixelsInInputTriangles(context, phong_flag) {
    var inputTriangles = getInputTriangles();
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    // const PIXEL_DENSITY = 10;
    // var numCanvasPixels = (w*h)*PIXEL_DENSITY;

    //var light_intensity = [1, 1, 1]; // white light 
    //var light_loc = { x: -2*eye.z, y: 4*eye.z, z: -0.5+6*eye.z}; // light location
    var corners = [{x:0, y:0, z:0}, 
                    {x:1, y:0, z:0},
                    {x:0, y:1, z:0},
                    {x:1, y:1, z:0}]
    if (inputTriangles != null) {
        var summary_triangles = getTriangles(inputTriangles);
        var triangles = summary_triangles[0];
        var materials = summary_triangles[1]; 
        console.log(materials)
        var Ray = function(origin, direction) {
            this.origin = origin;
            this.direction = direction;
        }
        
        // var x = 0; var y = 0; // pixel coord init
        // var cx = 0; var cy = 0; // init center x and y coord
        //var test = new Array()
        for(var i = 0; i < w; i++){
            // Go through the pixels on the row
            for(var j = 0; j < h; j++){
                var c;
                var ss = j/h;
                var tt = i/w;
                var pixel = add(add(corners[2], multiply_constant(subtract(corners[3], corners[2]), tt)), 
                                multiply_constant(subtract(corners[0], corners[2]), ss));
                var direction = subtract(pixel, eye);
                ray = new Ray(eye, direction);
                var result = triangle_intersection(triangles, ray);
                //console.log("result:" + result[0] + " , " + result[1]);
                //test.push(result[0]);
                if (result[0] == -1){
                    c = new Color(0, 0, 0, 255)
                }
                else{
                    var point = add(ray.origin, multiply_constant(ray.direction, result[1]));
                    if (phong_flag){
                        var v1 = subtract(triangles[result[0]].y, triangles[result[0]].x);
                        var v2 = subtract(triangles[result[0]].z, triangles[result[0]].x);
                        var N = normalize(cross_product(v1, v2));
                        c = blinnPhong(point, N, materials[result[0]]);
                    }
                    else{                     
                        c = new Color(materials[result[0]].diffuse[0]*255,
                            materials[result[0]].diffuse[1]*255,
                            materials[result[0]].diffuse[2]*255, 
                            255); // triangle diffuse color
                    }
                }
                drawPixel(imagedata, i, j, c);
            }
        }
    } // end for files
    context.putImageData(imagedata, 0, 0);
} // end if triangle file found


// Determines if the ray intersects given the radius and center of the sphere,
// and returns -1.0 if there are no intersections,
function triangle_intersection(triangles, ray)
{
    var t_values = [-1, Number.MAX_VALUE];
    for(var i = 0; i < triangles.length; i++){
        var v1 = subtract(triangles[i].y, triangles[i].x);
        var v2 = subtract(triangles[i].z, triangles[i].x);
        //var cross_v1v2 = cross_product(v1, v2);
        //var N = multiply_constant(cross_v1v2, 1/Math.sqrt(dot(cross_v1v2, cross_v1v2)));
        //var N = multiply_constant(cross_v1v2, 1/Math.sqrt(dot(cross_v1v2, cross_v1v2)));
        var N = normalize(cross_product(v1, v2));
        var w = dot(N, subtract(triangles[i].x, ray.origin)) / dot(N, ray.direction);
        var p = add(ray.origin, multiply_constant(ray.direction, w));
        var v3 = subtract(p, triangles[i].x);

        var n1 = (dot(v1, v2)*dot(v3, v2)) - (dot(v2, v2)*dot(v1, v3));
        var n2 = (dot(v1, v2)*dot(v1, v3)) - (dot(v1, v1)*dot(v3, v2));
        var d = (dot(v1, v2)*dot(v1, v2)) - (dot(v1, v1)*dot(v2, v2));

        var beta = n1/d;
        var gamma = n2/d;

        var t = null;
        if (beta >= 0 && gamma >= 0 && (beta + gamma) <= 1) {
            t = w;
        }
        else {
            t = -1;
        }

        if (t != -1){
            if (t < t_values[1]){
                t_values[1] = t;
                t_values[0] = i;
            }
        }
    }
    return t_values 
}

function blinnPhong(point, N, material){
    var V = normalize(subtract(ray.origin, point));  
    var L = normalize(subtract(light.position, point));  
    var H = normalize(add(V, L));  
    var NdotL = dot(N, L);                                           
    var NdotHeN = Math.pow(dot(N, H), material.n);

    var Red = Math.max(0, material.ambient[0]*light.ambient) + Math.max(0, material.diffuse[0]*light.diffuse*NdotL) + 
                Math.max(0, material.specular[0]*light.specular*NdotHeN);
    var Green = Math.max(0, material.ambient[1]*light.ambient) + Math.max(0, material.diffuse[1]*light.diffuse*NdotL) + 
                Math.max(0, material.specular[1]*light.specular*NdotHeN);
    var Blue = Math.max(0, material.ambient[2]*light.ambient) + Math.max(0, material.diffuse[2]*light.diffuse*NdotL) + 
                Math.max(0, material.specular[2]*light.specular*NdotHeN);
    return new Color(Red*255, Green*255, Blue*255, 255);   
}

function multiply_constant(a, c) {
    return {x: a.x*c, y: a.y*c, z: a.z*c};
}

function cross_product(a, b){
    return {x:(a.y*b.z)-(a.z*b.y), 
            y:(a.z*b.x) - (a.x*b.z), 
            z:(a.x*b.y) - (a.y*b.x)};
}

// Normalizes an xyz vector
function normalize(a)
{
  var magnitude = Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z);
  return multiply_constant(a, 1/magnitude);
  //return {x: a.x/magnitude, y: a.y/magnitude, z: a.z/magnitude};
}

// dot product
function dot(a, b) {
    return a.x*b.x + a.y*b.y + a.z*b.z;
}

// substract
function subtract(a, b) {
    return {x: a.x-b.x, y: a.y-b.y, z: a.z-b.z };
}

// add
function add(a, b) {
    return {x: a.x+b.x, y: a.y+b.y, z: a.z+b.z };
}


/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas and context
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    var canvas_phong = document.getElementById("blinnPhong");
    var context_phong = canvas_phong.getContext("2d");

    light = {position: {x: -3, y: 1, z: -0.5}, 
            ambient: 1, 
            diffuse: 1, 
            specular: 1};
    eye = {x: 0.5, y: 0.5, z: -0.5};
    view_up = {x: 0, y: 1, z: 0};
    lookat = {x: 0, y: 0, z: 1};
    
    // Create the image
    //drawRandPixels(context);
      // shows how to draw pixels
    
    //drawRandPixelsInInputEllipsoids(context);
      // shows how to draw pixels and read input file
      
    //drawInputEllipsoidsUsingArcs(context);
      // shows how to read input file, but not how to draw pixels
    
    drawRandPixelsInInputTriangles(context, false);
    drawRandPixelsInInputTriangles(context_phong, true);
    // shows how to draw pixels and read input file
    
    //drawInputTrainglesUsingPaths(context);
    // shows how to read input file, but not how to draw pixels
}
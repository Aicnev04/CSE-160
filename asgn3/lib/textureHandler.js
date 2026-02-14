function initTextures(){
    var image0 = new Image(); // Create an image object
    if(!image0){
        console.log("failed to create the image object");
        return 0;
    }

    // Register the event handler to be called on loading an image
    image0.onload = function(){ sendTexture0ToGLSL(image0); };
    // Tell the browser to load an image
    image0.src = "mario64night.jpg";

    var image1 = new Image(); // Create an image object
    if(!image1){
        console.log("failed to create the image object");
        return 0;
    }
    // Register the event handler to be called on loading an image
    image1.onload = function(){ sendTexture1ToGLSL(image1); };
    // Tell the browser to load an image
    image1.src = "grass_block_top.png";

    var image2 = new Image(); // Create an image object
    if(!image2){
        console.log("failed to create the image object");
        return 0;
    }
    // Register the event handler to be called on loading an image
    image2.onload = function(){ sendTexture2ToGLSL(image2); };
    // Tell the browser to load an imag
    image2.src = "dirt.png";

    var image3 = new Image(); // Create an image object
    if(!image3){
        console.log("failed to create the image object");
        return 0;
    }
    // Register the event handler to be called on loading an image
    image3.onload = function(){ sendTexture3ToGLSL(image3); };
    // Tell the browser to load an image
    image3.src = "spruce_log.png";

    var image4 = new Image(); // Create an image object
    if(!image4){
        console.log("failed to create the image object");
        return 0;
    }
    // Register the event handler to be called on loading an image
    image4.onload = function(){ sendTexture4ToGLSL(image4); };
    // Tell the browser to load an image
    image4.src = "spruce_planks.png";

    var image5 = new Image(); // Create an image object
    if(!image5){
        console.log("failed to create the image object");
        return 0;
    }
    // Register the event handler to be called on loading an image
    image5.onload = function(){ sendTexture5ToGLSL(image5); };
    // Tell the browser to load an image
    image5.src = "cobblestone.png";

    var image6 = new Image(); // Create an image object
    if(!image6){
        console.log("failed to create the image object");
        return 0;
    }
    // Register the event handler to be called on loading an image
    image6.onload = function(){ sendTexture6ToGLSL(image6); };
    // Tell the browser to load an image
    image6.src = "bricks.png";

    return true;
}

function sendTexture0ToGLSL(image){
    var texture = gl.createTexture(); // Create a texture object
    if(!texture){
        console.log("failed to create the texture object");
        return 0;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable the texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);

    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
    console.log('finished loadTexture0');
}

function sendTexture1ToGLSL(image){
    var texture = gl.createTexture(); // Create a texture object
    if(!texture){
        console.log("failed to create the texture object");
        return 0;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable the texture unit 1
    gl.activeTexture(gl.TEXTURE1);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 1 to the sampler
    gl.uniform1i(u_Sampler1, 1);

    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
    console.log('finished loadTexture1');
}

function sendTexture2ToGLSL(image){
    var texture = gl.createTexture(); // Create a texture object
    if(!texture){
        console.log("failed to create the texture object");
        return 0;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable the texture unit 1
    gl.activeTexture(gl.TEXTURE2);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 1 to the sampler
    gl.uniform1i(u_Sampler2, 2);

    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
    console.log('finished loadTexture2');
}

function sendTexture3ToGLSL(image){
    var texture = gl.createTexture(); // Create a texture object
    if(!texture){
        console.log("failed to create the texture object");
        return 0;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable the texture unit 1
    gl.activeTexture(gl.TEXTURE3);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 1 to the sampler
    gl.uniform1i(u_Sampler3, 3);

    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
    console.log('finished loadTexture3');
}

function sendTexture4ToGLSL(image){
    var texture = gl.createTexture(); // Create a texture object
    if(!texture){
        console.log("failed to create the texture object");
        return 0;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable the texture unit 1
    gl.activeTexture(gl.TEXTURE4);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 1 to the sampler
    gl.uniform1i(u_Sampler4, 4);

    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
    console.log('finished loadTexture4');
}

function sendTexture5ToGLSL(image){
    var texture = gl.createTexture(); // Create a texture object
    if(!texture){
        console.log("failed to create the texture object");
        return 0;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable the texture unit 1
    gl.activeTexture(gl.TEXTURE5);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 1 to the sampler
    gl.uniform1i(u_Sampler5, 5);

    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
    console.log('finished loadTexture5');
}

function sendTexture6ToGLSL(image){
    var texture = gl.createTexture(); // Create a texture object
    if(!texture){
        console.log("failed to create the texture object");
        return 0;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable the texture unit 1
    gl.activeTexture(gl.TEXTURE6);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 1 to the sampler
    gl.uniform1i(u_Sampler6, 6);

    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
    console.log('finished loadTexture6');
}
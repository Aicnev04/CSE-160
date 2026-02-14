class Cube{
    constructor(){
        this.type="cube";
        this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;
        
        this.vertices = new Float32Array([
            //Face
            0,0,0, 1,1,0, 1,0,0, 
            0,0,0, 0,1,0, 1,1,0,
            //Top
            0,1,0, 0,1,1, 1,1,1,
            0,1,0, 1,1,1, 1,1,0,
            //Sides
            1,1,1, 1,1,0, 1,0,0,
            1,1,1, 1,0,1, 1,0,0,
            0,1,1, 0,1,0, 0,0,0,
            0,1,1, 0,0,1, 0,0,0,
            //Bottom
            0,0,1, 1,0,1, 1,0,0,
            0,0,1, 0,0,0, 1,0,0,
            //Back
            0,0,1, 1,1,1, 1,0,1,
            0,0,1, 0,1,1, 1,1,1
        ]);

        
        this.uvs = new Float32Array([
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,1, 1,1, 1,0,
            0,1, 0,0, 1,0,
            1,1, 0,1, 0,0,
            1,1, 1,0, 0,0,
            0,0, 1,0, 1,1,
            0,0, 0,1, 1,1,
            1,0, 0,1, 0,0,
            1,0, 1,1, 0,1
        ]);
    }

    render(){
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        
        gl.uniform1i(u_whichTexture, this.textureNum);

        //Front
        drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

        //Top
        drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);
        drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0]);

        //Side1
        drawTriangle3DUV([1,1,1, 1,1,0, 1,0,0], [0,1, 1,1, 1,0]);
        drawTriangle3DUV([1,1,1, 1,0,1, 1,0,0], [0,1, 0,0, 1,0]);
        
        //Side2
        drawTriangle3DUV([0,1,1, 0,1,0, 0,0,0], [1,1, 0,1, 0,0]);
        drawTriangle3DUV([0,1,1, 0,0,1, 0,0,0], [1,1, 1,0, 0,0]);

        //Bottom
        drawTriangle3DUV([0,0,1, 1,0,1, 1,0,0], [0,0, 1,0, 1,1]);
        drawTriangle3DUV([0,0,1, 0,0,0, 1,0,0], [0,0, 0,1, 1,1]);

        //Back
        drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [1,0, 0,1, 0,0]);
        drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [1,0, 1,1, 0,1]);
    }

    renderfast(){
        var rgba = this.color;
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        drawTriangle3DUV(this.vertices, this.uvs);
    }
}
 
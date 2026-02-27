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

        this.normals = new Float32Array([
            0,0,-1, 0,0,-1, 0,0,-1,
            0,0,-1, 0,0,-1, 0,0,-1,
            0,1,0, 0,1,0, 0,1,0,
            0,1,0, 0,1,0, 0,1,0,
            1,0,0, 1,0,0, 1,0,0,
            1,0,0, 1,0,0, 1,0,0,
            -1,0,0, -1,0,0, -1,0,0,
            -1,0,0, -1,0,0, -1,0,0,
            0,-1,0, 0,-1,0, 0,-1,0,
            0,-1,0, 0,-1,0, 0,-1,0,
            0,0,1, 0,0,1, 0,0,1,
            0,0,1, 0,0,1, 0,0,1
        ]);
    }

    renderfast(){
        var rgba = this.color;
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        drawTriangle3DUVNormal(this.vertices, this.uvs, this.normals);
    }
}
 
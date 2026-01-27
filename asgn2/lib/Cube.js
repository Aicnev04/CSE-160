class Cube{
    constructor(){
        this.type="cube";
        //this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
    }

    render(){
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var vertices = [
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
        ]

        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] *0.8, rgba[3]);
        gl.drawArrays(gl.TRIANGLES, 6, 6);

        gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] *0.6, rgba[3]);
        gl.drawArrays(gl.TRIANGLES, 12, 12);

        gl.uniform4f(u_FragColor, rgba[0] * 0.4, rgba[1] * 0.4, rgba[2] *0.4, rgba[3]);
        gl.drawArrays(gl.TRIANGLES, 24, 6);

        gl.uniform4f(u_FragColor, rgba[0] * 0.2, rgba[1] * 0.2, rgba[2] *0.2, rgba[3]);
        gl.drawArrays(gl.TRIANGLES, 30, 6);

    }
}
 
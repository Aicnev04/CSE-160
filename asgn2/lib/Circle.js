class Circle{
    constructor(){
        this.type="circle";
        //this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.segments = 100;
        this.matrix = new Matrix4();
    }

    render(){
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        let angleStep = 360/this.segments;

        for(var angle = 0; angle < 360; angle += angleStep){
            let angle1 = angle;
            let angle2 = angle + angleStep;

            let vec1 = [Math.cos(angle1*Math.PI/180)/200, Math.sin(angle1*Math.PI/180)/200, 0];
            let vec2 = [Math.cos(angle2*Math.PI/180)/200, Math.sin(angle2*Math.PI/180)/200, 0];

            let pt1 = [vec1[0], vec1[1], vec1[2]];
            let pt2 = [vec2[0], vec2[1], vec2[2]];

            drawTriangle3D([0, 0, 0, pt1[0], pt1[1], pt1[2], pt2[0], pt2[1], pt2[2]]);
        }
    }
}

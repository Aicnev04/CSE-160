//asg0.js
/*
Richard Valencia
rivalenc@ucsc.edu

Notes to Grader:
N/A
*/
function main(){
    //Retrieve the <canvas> element
    var canvas = document.getElementById('example');
    if(!canvas){
        console.log("Failed to retrieve the <canvas> element");
        return false;
    }

    //Get the rendering context for 2DCG
    var ctx = canvas.getContext('2d');

    //Draw a black canvas
    ctx.fillStyle = 'rgba(0,0,0,1.0)';
    ctx.fillRect(0,0,400,400);

    drawVector(new Vector3([2.25,2.25,0]), "red");
}

function drawVector(v, color){
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    var scale = 20;
    
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);       
    ctx.lineTo(canvas.width/2 + v.elements[0] * scale, canvas.height/2 - v.elements[1] * scale);      
    ctx.strokeStyle = color; 
    ctx.stroke();             
}

function getInputVectors() {
    const v1xElement = document.getElementById("v1x");
    const v1yElement = document.getElementById("v1y");
    const v2xElement = document.getElementById("v2x");
    const v2yElement = document.getElementById("v2y");

    var v1 = new Vector3([v1xElement.value, v1yElement.value, 0]);
    var v2 = new Vector3([v2xElement.value, v2yElement.value, 0]);

    return {v1: v1, v2: v2};
}

function handleDrawEvent(){
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,1.0)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    var {v1, v2} = getInputVectors();
    drawVector(v1, "red");
    drawVector(v2, "blue");
}

function handleDrawOperationEvent(){
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,1.0)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const operationEvent = document.getElementById("operation");
    const scalarElement = document.getElementById("scalar");

    var {v1, v2} = getInputVectors();

    drawVector(v1, "red");
    drawVector(v2, "blue");

    if(operationEvent.value == "add"){
        var {v1, v2} = getInputVectors();
        var v3 = v1.add(v2);
        drawVector(v3, "green");
    }
    else if(operationEvent.value == "sub"){
        var {v1, v2} = getInputVectors();
        var v3 = v1.sub(v2);
        drawVector(v3, "green");
    }
    else if(operationEvent.value == "mul"){
        var {v1, v2} = getInputVectors();
        v1.mul(scalarElement.value);
        v2.mul(scalarElement.value);
        drawVector(v1, "green");
        drawVector(v2, "green");
    }
    else if(operationEvent.value == "div"){
        var {v1, v2} = getInputVectors();
        v1.div(scalarElement.value);
        v2.div(scalarElement.value);
        drawVector(v1, "green");
        drawVector(v2, "green");
    }
    else if(operationEvent.value == "mag"){
        var {v1, v2} = getInputVectors();
        console.log("Magnitude v1: " + v1.magnitude());
        console.log("Magnitude v2: " + v2.magnitude());
    }
    else if(operationEvent.value == "norm"){
        var {v1, v2} = getInputVectors();
        var v3 = v1.normalize();
        var v4 = v2.normalize();
        drawVector(v3, "green");
        drawVector(v4, "green");
    }
    else if(operationEvent.value == "dot"){
        var {v1, v2} = getInputVectors();
        var theta = Math.acos(Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude()));
        var d = theta * (180 / Math.PI);
        console.log("Angle: " + d);
    }
    else if(operationEvent.value == "cross"){
        var {v1, v2} = getInputVectors();
        var v3 = Vector3.cross(v1,v2);
        console.log("Area of the triangle: " + v3.magnitude()/2);
    }
}
class Camera{
    constructor(){
        this.eye = new Vector3([0,0.5,0]);
        this.at = new Vector3([0,0.5,1]);
        this.up = new Vector3([0,1,0]);
        this.speed = 0.05;
        this.alpha = 5.0;
    }

    forward() {
        var f = new Vector3;
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(this.speed);
        this.at = this.at.add(f);
        this.eye = this.eye.add(f);
    }

    back(){
        var f = new Vector3;
        f.set(this.eye);
        f.sub(this.at);
        f.normalize();
        f.mul(this.speed);
        this.at = this.at.add(f);
        this.eye = this.eye.add(f);
    }

    left(){
        var f = new Vector3;
        f.set(this.at);
        f.sub(this.eye);
        var s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(this.speed);
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    right(){
        var f = new Vector3;
        f.set(this.at);
        f.sub(this.eye);
        var s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(this.speed);
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    panLeft(){
        var f = new Vector3;
        f.set(this.at);
        f.sub(this.eye);
        var rotationMatrix = new Matrix4().setRotate(this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);
        this.at = new Vector3(this.eye.elements).add(f_prime);
    }

    panRight(){
        var f = new Vector3;
        f.set(this.at);
        f.sub(this.eye);
        var rotationMatrix = new Matrix4().setRotate(-this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);
        this.at = new Vector3(this.eye.elements).add(f_prime);
    }
    
    pan(yaw, pitch){
        var f = new Vector3;
        f.set(this.at);
        f.sub(this.eye);
        var yawMatrix = new Matrix4().setRotate(yaw, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = yawMatrix.multiplyVector3(f);
        var right = Vector3.cross(f_prime, this.up);
        right.normalize();
        var pitchMatrix = new Matrix4().setRotate(pitch, right.elements[0], right.elements[1], right.elements[2]);
        f_prime = pitchMatrix.multiplyVector3(f_prime);
        this.at = new Vector3(this.eye.elements).add(f_prime);
    }
}
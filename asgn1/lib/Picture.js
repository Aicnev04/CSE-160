function createImage(){
    grassBackground = new Triangle();
    grassBackground.renderImage([0.1,0.6,0.3,1.0], -1.0, -0.2, 1.0, -0.2, -1.0, -1.0);
    grassBackground.renderImage([0.1,0.5,0.2,1.0], 1.0, -0.2, 1.0, -1.0, -1.0, -1.0);

    skyBackground = new Triangle();
    skyBackground.renderImage([0.4,0.7,0.9,1.0], -1.0, 1.0, 1.0, 1.0, -1.0, -0.2);
    skyBackground.renderImage([0.5,0.8,0.9,1.0], 1.0, 1.0, 1.0, -0.2, -1.0, -0.2);

    sun = new Circle();
    sun.renderImage([1.0,0.9], [1.0,1.0,0.0,1.0], 30.0, 5);

    cloudInitialR = new Triangle();
    cloudInitialR.renderImage([1.0,1.0,1.0,1.0], -0.9, 0.8, -0.9, 0.6, -0.72,0.7);
    cloudInitialR.renderImage([1.0,1.0,1.0,1.0], -0.9, 0.7, -0.8, 0.7, -0.9,0.5);
    cloudInitialR.renderImage([1.0,1.0,1.0,1.0], -0.85, 0.65, -0.7, 0.5, -0.8,0.75);

    cloudeInitialV = new Triangle();
    cloudeInitialV.renderImage([1.0,1.0,1.0,1.0], -0.6, 0.5, -0.7, 0.8, -0.65, 0.8);
    cloudeInitialV.renderImage([1.0,1.0,1.0,1.0], -0.6, 0.5, -0.5, 0.8, -0.55, 0.8);

    upperBody = new Triangle();
    upperBody.renderImage([1.0,0.95,0.9,1.0], -0.2, -0.4, 0.2, -0.4, 0.0,-0.1);

    midBody1 = new Triangle();
    midBody1.renderImage([1.0,0.95,0.9,1.0], -0.2, -0.4, 0.2, -0.4, -0.2,-0.8);

    midBody2 = new Triangle();
    midBody2.renderImage([1.0,0.95,0.9,1.0], 0.2, -0.4, 0.2, -0.8, -0.2,-0.8);

    lowerBody = new Triangle();
    lowerBody.renderImage([1.0,0.95,0.9,1.0], -0.2, -0.8, 0.2, -0.8, 0.0,-0.95);

    leftFoot = new Triangle();
    leftFoot.renderImage([1.0,0.95,0.9,1.0], -0.3, -0.95, -0.1, -0.95, -0.1,-0.85);

    rightFoot = new Triangle();
    rightFoot.renderImage([1.0,0.95,0.9,1.0], 0.3, -0.95, 0.1, -0.95, 0.1,-0.85);

    leftArm = new Triangle();
    leftArm.renderImage([1.0,0.95,0.9,1.0], -0.3, -0.6, -0.2, -0.4, -0.2,-0.55);

    rightArm = new Triangle();
    rightArm.renderImage([1.0,0.95,0.9,1.0], 0.3, -0.6, 0.2, -0.4, 0.2,-0.55);

    inUpperBody = new Triangle();
    inUpperBody.renderImage([1.0,0.85,0.9,1.0], -0.15, -0.45, 0.15, -0.45, 0.0,-0.2);

    inMidBody1 = new Triangle();
    inMidBody1.renderImage([1.0,0.85,0.9,1.0], -0.15, -0.45, 0.15, -0.45, -0.15,-0.75);

    inMidBody2 = new Triangle();
    inMidBody2.renderImage([1.0,0.85,0.9,1.0], 0.15, -0.45, 0.15, -0.75, -0.15,-0.75);

    inLowerBody = new Triangle();
    inLowerBody.renderImage([1.0,0.85,0.9,1.0], -0.15, -0.75, 0.15, -0.75, 0.0,-0.9);

    head = new Circle();
    head.renderImage([0,0], [1.0,0.95,0.9,1.0], 50.0, 8);

    leftEarBase = new Triangle();
    leftEarBase.renderImage([1.0,0.95,0.9,1.0], -0.1, 0.2, -0.3, 0.4, -0.1,0.5);

    rightEarBase = new Triangle();
    rightEarBase.renderImage([1.0,0.95,0.9,1.0], 0.1, 0.2, 0.3, 0.4, 0.1,0.5);

    leftEarTip = new Triangle();
    leftEarTip.renderImage([1.0,0.95,0.9,1.0], -0.3, 0.7, -0.3, 0.4, -0.1,0.5);

    rightEarTip = new Triangle();
    rightEarTip.renderImage([1.0,0.95,0.9,1.0], 0.3, 0.7, 0.3, 0.4, 0.1,0.5);

    inleftEarBase = new Triangle();
    inleftEarBase.renderImage([1.0,0.5,0.8,1.0], -0.12, 0.25, -0.28, 0.4, -0.12,0.5);

    inrightEarBase = new Triangle();
    inrightEarBase.renderImage([1.0,0.5,0.8,1.0], 0.12, 0.25, 0.28, 0.4, 0.12,0.5);

    inleftEarTip = new Triangle();
    inleftEarTip.renderImage([1.0,0.5,0.8,1.0], -0.28, 0.65, -0.28, 0.4, -0.12,0.5);

    rightEarTip = new Triangle();
    rightEarTip.renderImage([1.0,0.5,0.8,1.0], 0.28, 0.65, 0.28, 0.4, 0.12,0.5);

    leftEye = new Triangle();
    leftEye.renderImage([0.0,0.0,0.0,1.0], -0.15, 0.05, -0.05, 0.05, -0.1,0.0);

    rightEye = new Triangle();
    rightEye.renderImage([0.0,0.0,0.0,1.0], 0.15, 0.05, 0.05, 0.05, 0.1,0.0);

    nose = new Triangle();
    nose.renderImage([1.0,0.7,0.8,1.0], 0.0, -0.1, -0.05, -0.05, 0.05,-0.05);

    leftNose = new Triangle();
    leftNose.renderImage([1.0,0.7,0.8,1.0], 0.0, -0.1, -0.05, -0.15, 0.0,-0.05);

    rightNose = new Triangle();
    rightNose.renderImage([1.0,0.7,0.8,1.0], 0.0, -0.1, 0.05, -0.15, 0.0,-0.05);

    leftWhisker1 = new Triangle();
    leftWhisker1.renderImage([0.8,0.8,0.8,1.0], -0.05, -0.05, -0.4, -0.04, -0.4,-0.05);

    leftWhisker2 = new Triangle();
    leftWhisker2.renderImage([0.8,0.8,0.8,1.0], -0.05, -0.06, -0.38, -0.09, -0.38,-0.1);

    leftWhisker3 = new Triangle();
    leftWhisker3.renderImage([0.8,0.8,0.8,1.0], -0.05, -0.04, -0.36, -0.01, -0.36,0.0);

    rightWhisker1 = new Triangle();
    rightWhisker1.renderImage([0.8,0.8,0.8,1.0], 0.05, -0.05, 0.4, -0.04, 0.4,-0.05);

    rightWhisker2 = new Triangle();
    rightWhisker2.renderImage([0.8,0.8,0.8,1.0], 0.05, -0.06, 0.38, -0.09, 0.38,-0.1);

    rightWhisker3 = new Triangle();
    rightWhisker3.renderImage([0.8,0.8,0.8,1.0], 0.05, -0.04, 0.36, -0.01, 0.36,0.0);

}

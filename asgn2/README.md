I've carried over some features from the previous assignment, such as the color picker and zoom in/out feature. 

For the zoom in/out feature, I took inspiration from how the u_GlobalRotateMatrix worked and created a new u_GlobalScaleMatrix. Given my previous code in asgn1 to get the mouse wheel input, I simply copied that over and applied that value to the u_GlobalScaleMatrix. Thus, you'll be able to zoom in/out of the model from the origin. It also works well with the mouse rotations.

The basic animation and shift animation are there but I've added an "attack mode" animation that will have the head track the "camera" if you are in it's line of sight. It will emit a red laser beam and will stop attacking if you are out of sight or turn off "attack mode". It will persist in the other animations if you keep it on.

Because I've chosen the basic animation to be a walk animation, you can adjust the walk speed and strut value, allowing you to create varied walk animation.

The non-cube primitive I used was the circle for the eye. In the Circle.js file I've hardcoded a 100 segment circle to form in the space.

The third level joints are hands. The most complex joint sequence is the torso, upper arms, lower arms/elbows, and hands. Each can be individual tweaked from -180 to 180 degrees. (Anything past 45 will likely create some crazy/broken looking rotations).

For performance, instead of calling drawTriangle3D for each cube face, I've instead created one buffer for each cube.

Aside from Github Copilot to help format stuff with style.css and autofill elements for the HTML sliders this assignment really only required the Youtube Tutorials and Performance Lab to complete. The actual modeling was mostly just tedious trial and error to get the look I wanted.
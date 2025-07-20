function extension(img, x, y)
{
    img.loadPixels();
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    
    // push();
    laserRay(x, y, img.width, img.height);
    // pop();

    imgOut.updatePixels();
    return imgOut;
}

function laserRay(gridX, gridY, gridWidth, gridHeight)
{
    if(faceTypes.length > 0)
    {
        var rightEye = faceTypes[0].keypoints[386];
        var leftEye = faceTypes[0].keypoints[159];
        var nose = faceTypes[0].keypoints[6];

        // To calculate head center
        var headCenter = createVector((leftEye.x + rightEye.x) / 2, (leftEye.y + rightEye.y) / 2);

        // To determine head orientation
        var headOrientation = createVector(nose.x - headCenter.x, nose.y - headCenter.y);
        headOrientation.normalize();

        var laserDirection = createVector(headOrientation.x, headOrientation.y);
        var laserLength = Math.min(gridWidth / 2, gridHeight / 2);

        var leftLaserEnd = createVector(
            constrain(leftEye.x + laserDirection.x * laserLength, 0, gridWidth),
            constrain(leftEye.y + laserDirection.y * laserLength, 0, gridHeight)
        );
        var rightLaserEnd = createVector(
            constrain(rightEye.x + laserDirection.x * laserLength, 0, gridWidth),
            constrain(rightEye.y + laserDirection.y * laserLength, 0, gridHeight)
        );

        fill(255,0,0, 125);
        beginShape();
        // Left eye
        vertex(leftEye.x, leftEye.y + 600); //top left
        vertex(leftLaserEnd.x, leftLaserEnd.y + 600); //end left
        vertex(leftLaserEnd.x - 60, leftLaserEnd.y + 600); //end right
        vertex(leftEye.x, leftEye.y + 600); //end right
        // Right eye
        vertex(rightEye.x, rightEye.y + 600); //top left
        vertex(rightLaserEnd.x, rightLaserEnd.y + 600); //end left
        vertex(rightLaserEnd.x - 60, rightLaserEnd.y + 600); //end right
        vertex(rightEye.x, rightEye.y + 600); //end right
        endShape();
    }
}
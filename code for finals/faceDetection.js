function faceDetectionFilter(video, detector)
{
    var faces = detector.detect(video.canvas);
    for(i = 0; i < faces.length; i++)
    {
        var face = faces[i];
        if(face[4] > 4)
        {
            push();
            strokeWeight(2);
            stroke(0, 255, 0);
            noFill();
            rect(face[0] + 320, face[1], face[2], face[3]);
            pop();
        }
    }
}

function greyscaleFaceDetectionFilter(video, detector)
{
    var faces = detector.detect(video.canvas);
    for(i = 0; i < faces.length; i++)
    {
        var face = faces[i];
        if(face[4] > 4)
        {
            var x = face[0];
            var y = face[1];
            var w = face[2];
            var h = face[3];

            var fd = video.get(x, y, w, h);
            var fdGreyscale = greyscaleNBrightnessFilter(fd);

            push();
            image(fdGreyscale, x, y + 480, w, h);
            pop();
        }
    }
}

function blurFaceDetectionFilter(video, detector)
{
    var faces = detector.detect(video.canvas);
    for(i = 0; i < faces.length; i++)
    {
        var face = faces[i];
        if(face[4] > 4)
        {
            var x = face[0];
            var y = face[1];
            var w = face[2];
            var h = face[3];

            var fd = video.get(x, y, w, h);
            var fdblur = blur(fd);

            push();
            image(fdblur, x, y + 480, w, h);
            pop();
        }
    }
}

function colourConvertFaceDetectionFilter(video, detector)
{
    var faces = detector.detect(video.canvas);
    for(i = 0; i < faces.length; i++)
    {
        var face = faces[i];
        if(face[4] > 4)
        {
            var x = face[0];
            var y = face[1];
            var w = face[2];
            var h = face[3];

            var fd = video.get(x, y, w, h);
            var colourConvert = colourSpace1Filter(fd);

            push();
            image(colourConvert, x, y + 480, w, h);
            pop();
        }
    }
}

function pixelateFaceDetectionFilter(video, detector)
{
    var faces = detector.detect(video.canvas);
    for(i = 0; i < faces.length; i++)
    {
        var face = faces[i];
        if(face[4] > 4)
        {
            var x = face[0];
            var y = face[1];
            var w = face[2];
            var h = face[3];

            var fd = video.get(x, y, w, h);
            var pixelate = pixelated(fd);

            push();
            image(pixelate, x, y + 480, w, h);
            pop();
        }
    }
}
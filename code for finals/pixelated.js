// The Pixelated Filter
function pixelated(img)
{
    var pixelSize = 5;
    img.loadPixels();
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();

    // To calculate the sum of RGB values of pixels in the block
    for(i = 0; i < img.pixels.length; i += 4 * pixelSize)
    {
        var rSum = 0;
        var gSum = 0;
        var bSum = 0;
        var count = 0;

        for(j = 0; j < pixelSize; j += 4)
        {
            if(i + j < img.pixels.length)
            {
                rSum += img.pixels[i + j + 0];
                gSum += img.pixels[i + j + 1];
                bSum += img.pixels[i + j + 2];
                count++;
            }
        }
        
        // To calculate the average RGB values of the block
        var rAverage = rSum / count;
        var gAverage = gSum / count;
        var bAverage = bSum / count;

        // Paint the block with the average RGB values
        for(j = 0; j < pixelSize * 4; j += 4)
        {
            if(i + j < img.pixels.length)
            {
                imgOut.pixels[i + j + 0] = rAverage; // Red 
                imgOut.pixels[i + j + 1] = gAverage; // Green
                imgOut.pixels[i + j + 2] = bAverage; // Blue
                imgOut.pixels[i + j + 3] = 255;
            }
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

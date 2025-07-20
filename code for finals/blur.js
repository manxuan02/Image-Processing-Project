// The Blur Filter
function blur(img)
{
    var matrix = generateMatrix(20);
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();
    
    // To read every pixel
    for (i = 0; i < img.pixels.length; i+=4)
    {
        // To pass the Position of the Pixel(wanted to be examined)
        var c = convolution(x, y, matrix, img);

        imgOut.pixels[i + 0] = c[0]; // For R channel
        imgOut.pixels[i + 1] = c[1]; // For G channel
        imgOut.pixels[i + 2] = c[2]; // For B channel
        imgOut.pixels[i + 3] = 255; // For A channel
    }
    imgOut.updatePixels();
    return imgOut;
}

// To generate matrix >> to allow to multiply the pixels
function generateMatrix(size)
{
    var m = [];
    for(i = 0; i < size; i++)
    {
        var n = [];
        for(j = 0; j < size; j++)
        {
            n.push(1.5 / (size * size));
        }
        m.push(n);
    }
    return m;
}

// To do convolution
function convolution(x, y, matrix, img)
{
    var matrixSize = matrix.length;
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    var offset = floor(matrixSize / 2); //offset = 1

    // convolution matrix loop
    for (var i = 0; i < matrixSize; i++) // To loop tru ROW
    {
        for (var j = 0; j < matrixSize; j++) // To loop tru COLUMN
        {
            // Get pixel loc within convolution matrix
            var xloc = x + i - offset;
            var yloc = y + j - offset;
            var index = (xloc + img.width * yloc) * 4;
            
            // ensure we don't address a pixel that doesn't exist
            index = constrain(index, 0, img.pixels.length - 1);

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }

    // Return the New Color
    return [totalRed, totalGreen, totalBlue];
}

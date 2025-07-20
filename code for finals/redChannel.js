function redChannelFilter(img)
{
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    for (x = 0; x < imgOut.width; x++)
    {
        for (y = 0; y < imgOut.height; y++)
        {
            var index = (x + y * imgOut.width) * 4;

            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            var gray = (r + g + b) / 3;

            imgOut.pixels[index + 0] = gray; // For the R channel
            imgOut.pixels[index + 1] = 0; // For the G channel
            imgOut.pixels[index + 2] = 0; // For the B channel
            imgOut.pixels[index + 3] = 255; // For the A channel
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

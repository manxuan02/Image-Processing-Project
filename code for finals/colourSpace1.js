function colourSpace1Filter(img)
{
    img.loadPixels();
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();

    for (i = 0; i < img.pixels.length; i += 4)
    {
        var r = img.pixels[i];
        var g = img.pixels[i + 1];
        var b = img.pixels[i + 2];

        // YCbCr
        Y = r * 0.299 + g * 0.587 + b * 0.114;
        Cb = (r * -0.169 - g * 0.331 + b * 0.5) + 128;
        Cr = (r * 0.5 - g * 0.41 - b * 0.081) + 128;

        imgOut.pixels[i + 0] = Y; // For the R channel
        imgOut.pixels[i + 1] = Cb; // For the G channel
        imgOut.pixels[i + 2] = Cr; // For the B channel
        imgOut.pixels[i + 3] = 255; // For the A channel
    }
    imgOut.updatePixels();
    return imgOut;
}
function greyscaleNBrightnessFilter(img)
{
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();
    
    for(i = 0; i < img.pixels.length; i += 4)
    {
        var r = img.pixels[i];
        var g = img.pixels[i + 1];
        var b = img.pixels[i + 2];

        // Convert to grayscale
        var gray = (r + g + b) / 3;

        // To increase brightness by 20%
        var brighten = min(gray * 1.2, 255);  // To ensure max is 255

        imgOut.pixels[i] = brighten;
        imgOut.pixels[i + 1] = brighten;
        imgOut.pixels[i + 2] = brighten;
        imgOut.pixels[i + 3] = 255;
    }

    imgOut.updatePixels();
    return imgOut;
}
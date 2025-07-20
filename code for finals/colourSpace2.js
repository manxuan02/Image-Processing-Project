function colourSpace2Filter(img)
{
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    for (x = 0; x < imgOut.width; x++)
    {
        for (y = 0; y < imgOut.height; y++)
        {
            var index = (x + y * imgOut.width) * 4;

            // To normalise to 0-1
            var g = img.pixels[index + 1] / 255;
            var r = img.pixels[index + 0] / 255;
            var b = img.pixels[index + 2] / 255;

            // To compute: min, max, delta
            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);
            var delta = max - min; //is the DIFF between the highest & lowest colour values in a pixel

            // To calculate Hue
            H = 0;
            if(delta !== 0)
            {
                if(max === r)
                {
                    H = ((g - b) / delta) % 6;
                }
                else if(max === g)
                {
                    H = ((b - r) / delta) + 2;
                }
                else
                {
                    H = ((r - g) / delta) + 4;
                }

                // To convert to degrees >> because "hue" is measured in degrees in colour wheel
                H *= 60
                if(H < 0) H += 360;
            }

            // To scale Hue to [0, 255] >> measures the "type" of colour
            // convert degrees(0o - 360o) to pixel_values(0 - 255) >> because "hue" is measured in degrees in colour wheel
            H = (H / 360) * 255;

            // To compute Saturation >> measures how "pure" the colour is
            // 0: no colour,,, 255: fully saturated, vivid colour
            if(max === 0)
            {
                // If max=0 >> saturation is 0(BLACK)
                S = 0;
            }
            else
            {
                // Normalised saturation calculation
                S = (delta / max) * 255;
            }

            // To compute Value >> measures how "bright" the colour is
            V = max * 255;

            // To ensure a valid pixel range (0-255)
            H = constrain(H, 0, 255);
            S = constrain(S, 0, 255);
            V = constrain(V, 0, 255);

            imgOut.pixels[index + 0] = H; // For the R channel
            imgOut.pixels[index + 1] = S; // For the G channel
            imgOut.pixels[index + 2] = V; // For the B channel
            imgOut.pixels[index + 3] = 255; // For the A channel
        }
    }
    imgOut.updatePixels();
    return imgOut;
}
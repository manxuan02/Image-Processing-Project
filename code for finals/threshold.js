function thresholdFilter(img, channel, threshold)
{
    // To create a NEW_filtered_image
    var imgOut = createImage(img.width, img.height);

    // To load the pixels of NEW_filtered_image 
    imgOut.loadPixels();

    // To load the pixels of Existing_image
    img.loadPixels();

    for (x = 0; x < imgOut.width; x++)
    {
        for (y = 0; y < imgOut.height; y++)
        {
            var index = (x + y * imgOut.width) * 4;

            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            var value = 0;
            if(channel === 'red') value = r;
            if(channel === 'green') value = g;
            if(channel === 'blue') value = b;
            if(channel === 'cs1') value = g; // Cb's component
            if(channel === 'cs2') value = r; // Hue's component

            if(channel === 'red' && r > threshold)
            {
                imgOut.pixels[index + 0] = 255;
                imgOut.pixels[index + 1] = 0;
                imgOut.pixels[index + 2] = 0;
                imgOut.pixels[index + 3] = 255;
            } 
            else if(channel === 'green' && g > threshold)
            {
                imgOut.pixels[index + 0] = 0;
                imgOut.pixels[index + 1] = 255;
                imgOut.pixels[index + 2] = 0;
                imgOut.pixels[index + 3] = 255;
            } 
            else if(channel === 'blue' && b > threshold)
            {
                imgOut.pixels[index + 0] = 0;
                imgOut.pixels[index + 1] = 0;
                imgOut.pixels[index + 2] = 255;
                imgOut.pixels[index + 3] = 255;
            }
            else if(channel === 'cs1' && value > threshold)
            {
                Y = r * 0.299 + g * 0.587 + b * 0.114;
                Cb = (r * -0.169 - g * 0.331 + b * 0.5) + 128;
                Cr = (r * 0.5 - g * 0.41 - b * 0.081) + 128;

                var scaledCb;
                var scaledCr;
                if(Cr <= threshold)
                {
                    scaledCd = map(Cb, 0, threshold, 0, 100);
                    scaledCr = map(Cr, 0, threshold, 0, 100);
                }
                else
                {
                    scaledCd = map(Cb, threshold, 255, 100, 200);
                    scaledCr = map(Cr, threshold, 255, 100, 200);
                }

                imgOut.pixels[index + 0] = Y;
                imgOut.pixels[index + 1] = scaledCb * 2;
                imgOut.pixels[index + 2] = scaledCr * 2;
                imgOut.pixels[index + 3] = 255;
            }
            else if(channel === 'cs2' && value > threshold)
            {
                var rgbColor = color(r, g, b);
                var brightnessValue = brightness(rgbColor); // To Extract brightness

                // Apply threshold based on the Brightness value
                var scaledBrightness;
                if(scaledBrightness <= threshold)
                {
                    // Scale Brightness based on the threshold
                    scaledBrightness = map(brightnessValue, 0, threshold, 0, 100);
                }
                else
                {
                    // Apply color, as threshold INCreases
                    scaledBrightness = map(brightnessValue, threshold, 100, 100, 200);
                }

                imgOut.pixels[index + 0] = r * 1.5; // the Hue
                imgOut.pixels[index + 1] = g * 1.5; // the Saturation
                imgOut.pixels[index + 2] = scaledBrightness * 2; // the brightness Value
                imgOut.pixels[index + 3] = 255;
            }
            else
            {
                imgOut.pixels[index + 0] = 0;
                imgOut.pixels[index + 1] = 0;
                imgOut.pixels[index + 2] = 0;
                imgOut.pixels[index + 3] = 255;
            }
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

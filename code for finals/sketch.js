var canvas;
var video; // For webcam LIVE

var webcamImg; // Webcam IMAGE
var webcamImgTaken = false;

// Empty array for filters
var filters = [];

// Array to Store filters Label
var filterLabel = ["Webcam Image", "Grayscale and 20% brightness", "",
			   "Red channel", "Green channel", "Blue channel",
			   "Red Threshold image", "Green Threshold image", "Blue Threshold image",
			   "Webcam image (repeat)", "Colour space 1 (YCbCr)", "Colour space 2 (HSV)",
			   "Face detection", "Colour space 1 (YCbCr) Threshold image", "Colour space 2 (HSV)Threshold image",
			   "Extension"];

// Threshold Slider
var imgIn;
var redChannelThresholdSlider;
var greenChannelThresholdSlider;
var blueChannelThresholdSlider;
var colourSpace1ThresholdSlider;
var colourSpace2ThresholdSlider;

// Colour Space (YCbCr)
var Y;
var Cr;
var Cb;
// Colour Space (HSV)
var H = 0;
var S;
var V;

// Face detection
var detector;
var faces;
var scaleFactor = 1.2;
var classifier = objectdetect.frontalface;
var fdStyle = null;

// Extension
var faceOptions = {maxFaces: 1, 
			   refineLandmarks: false, 
			   flipHorizontal: false};
var facemesh;
var handpose;
var faceTypes = [];
var handTypes = [];
var modelsLoaded = 0;
var gridPos = [];

// For extension >> to Load both faceMesh & handPose
function preload()
{
	facemesh = ml5.faceMesh(faceOptions, modelReady);
	handpose = ml5.handPose(modelReady);
}

// For extension >> to ensure that both faceMesh & handPose are Loaded
function modelReady()
{
	modelsLoaded++;
	if (modelsLoaded === 2)
	{
		console.log("All models loaded");
		facemesh.detectStart(video, results => {faceTypes = results;});
		handpose.detectStart(video, results => {handTypes = results;});
	}
}

function setup()
{
	canvas = createCanvas(480, 720);
	// canvas = createCanvas(1000, 1000);
	pixelDensity(1);

	video = createCapture(VIDEO);
	video.size(160,120); // resolutions

	// To position the canvas in the Middle of the screen
	var centerX = (windowWidth - width)/2;
	var centerY = (windowHeight - height)/2;
	canvas.position(centerX, centerY);

	// For filter images
	webcamImg = createImage(160,120);
	filters = new Array(filterLabel.length).fill(null);

	// Red channel Threshold Slider
	redChannelThresholdSlider = createSlider(0, 255, 110);
	redChannelThresholdSlider.position(100, 200);

	// Green channel Threshold Slider
	greenChannelThresholdSlider = createSlider(0, 255, 110);
	greenChannelThresholdSlider.position(100, 300);

	// Blue channel Threshold Slider
	blueChannelThresholdSlider = createSlider(0, 255, 110);
	blueChannelThresholdSlider.position(100, 400);

	// ColourSpace 1 Threshold Slider (YCbCr)
	colourSpace1ThresholdSlider = createSlider(0, 255, 110);
	colourSpace1ThresholdSlider.position(100, 500);

	// ColourSpace 2 Threshold Slider (HSV)
	colourSpace2ThresholdSlider = createSlider(0, 255, 30);
	colourSpace2ThresholdSlider.position(100, 600);

	detector = new objectdetect.detector(160, 120, scaleFactor, classifier);
	console.log("Detector initialized:", detector);
}

function draw()
{
	background(125);

	drawGrid();
	drawText();
	
	if(webcamImgTaken)
	{
		captureImage();
		if(fdStyle === 1)
		{
			faceDetectionFilter(video, detector);
		}
		else if(fdStyle === 2)
		{
			greyscaleFaceDetectionFilter(video, detector);
		}
		else if(fdStyle === 3)
		{
			blurFaceDetectionFilter(video, detector);
		}
		else if(fdStyle === 4)
		{
			colourConvertFaceDetectionFilter(video, detector);
		}
		else if(fdStyle === 5)
		{
			pixelateFaceDetectionFilter(video, detector);
		}
	}

	image(video, 320, 0, 160, 120);
	video.hide();
	// image(video, 0, 480, 160, 120);
	faceDetectionFilter(video, detector);
}

// Function to capture the current frame from the webcam
function captureImage()
{
	filters[0] = webcamImg; // Store original snap shot
	filters[1] = greyscaleNBrightnessFilter(webcamImg);
	filters[3] = redChannelFilter(webcamImg);
	filters[4] = greenChannelFilter(webcamImg);
	filters[5] = blueChannelFilter(webcamImg);
	filters[6] = thresholdFilter(filters[3], 'red', redChannelThresholdSlider.value());
	filters[7] = thresholdFilter(filters[4], 'green', greenChannelThresholdSlider.value());
	filters[8] = thresholdFilter(filters[5], 'blue', blueChannelThresholdSlider.value());
	filters[9] = webcamImg;
	filters[10] = colourSpace1Filter(webcamImg);
	filters[11] = colourSpace2Filter(webcamImg);
	filters[12] = video;
	filters[13] = thresholdFilter(filters[10], 'cs1',  colourSpace1ThresholdSlider.value());
	filters[14] = thresholdFilter(filters[11], 'cs2', colourSpace2ThresholdSlider.value());
	filters[15] = extension(webcamImg);
}

function drawGrid()
{
	var cols = 3;
	var rows = Math.ceil(filters.length / cols);
	var gridWidth = width / cols;
	var gridHeight = height / rows;

	for(i = 0; i < filters.length; i++)
	{
		var x = (i % cols) * gridWidth;
		var y = Math.floor(i / cols) * gridHeight;

		gridPos[i] = {x: x, y: y, width: gridWidth, height: gridHeight};

		// Draw grid box
		stroke(0,255,0);
		strokeWeight(2);
		noFill();
		rect(x, y, gridWidth, gridHeight);

		// Update & Draw filter image dynamically)
		if (i === 6 && filters[3])
		{
            filters[6] = thresholdFilter(filters[3], 'red', redChannelThresholdSlider.value()); 
        }
        if (i === 7 && filters[4])
		{
            filters[7] = thresholdFilter(filters[4], 'green', greenChannelThresholdSlider.value()); 
        }
        if (i === 8 && filters[5])
		{
            filters[8] = thresholdFilter(filters[5], 'blue', blueChannelThresholdSlider.value()); 
        }
		if (i === 12 && filters[12])
		{  
            push();
            translate(x, y);
            image(video, 0, 0, gridWidth, gridHeight); // To draw live video in grid
            pop();
        }
        if (i === 13 && filters[10])
		{
            filters[13] = thresholdFilter(filters[10], 'cs1', colourSpace1ThresholdSlider.value());
        }
        if (i === 14 && filters[11])
		{
            filters[14] = thresholdFilter(filters[11], 'cs2', colourSpace2ThresholdSlider.value());
        }
        if (i === 15 && filters[15] && gridPos[15])
		{
			push();
            // translate(x, y);
            image(video, x, y, gridWidth, gridHeight); // To draw live video in grid
            // image(video, 0, 0, gridWidth, gridHeight); // To draw live video in grid
            pop();
        }

		// Draw Filter image, IF available
		if(filters[i])
		{
			image(filters[i], x, y, gridWidth, gridHeight);
		}
	
		// Draw filter Label
		noStroke();
		fill(255);
		textSize(12);
		textAlign(CENTER);
		textWrap(WORD);
		text(filterLabel[i], x + gridWidth - 130, y + gridHeight - 35, 100);
	}
}

function keyPressed()
{
	if(key === " ")
	{
		// To take screen shot of webcam
		webcamImg = video.get();
		webcamImgTaken = true;
	}
	else if(key === "g" || key === "G")
	{
		fdStyle = 2;
	}
	else if (key === "b" || key === "B")
	{
		fdStyle = 3;
	}
	else if (key === "c" || key === "C")
	{
		fdStyle = 4;
	}
	else if (key === "p" || key === "P")
	{
		fdStyle = 5;
	}
}

function drawText()
{
	fill(0);
	textAlign(LEFT);
	textSize(13);

	// Red channel Threshold Slider
    text(redChannelThresholdSlider.value(), 80, 260);

	// Green channel Threshold Slider
	text(greenChannelThresholdSlider.value(), 240, 260);

	// Blue channel Threshold Slider
	text(blueChannelThresholdSlider.value(), 400, 260);

	// ColourSpace 1 Threshold Slider (YCbCr)
	text(colourSpace1ThresholdSlider.value(), 240, 380);

	// ColourSpace 2 Threshold Slider (HSV)
	text(colourSpace2ThresholdSlider.value(), 400, 380);

	text("Press SPACE to take snapshot", 170, 620);
	text("Face Detection:", 170, 640);
	text("Press 'g' for Greyscale", 270, 640);
    text("Press 'b' for Blur", 270, 660);
    text("Press 'c' for Colour Conversion", 270, 680);
    text("Press 'p' for Pixelation", 270, 700);
}

/*
## Commentary
### Q8: Image thresholding for each RGB channel
Thresholding each colour channel individually highlights different aspects of an image's structure, as each channel carries distinct intensity variations.
- The red channel accentuates skin tones, making facial features more prominent, likely due to the similarity between red shades and human skin.
- The green channel enhances edge details more effectively than the others, possibly due to its higher weight in luminance calculations.
- The blue channel is the least effective in preserving object clarity, as it tends to have lower luminance and higher noise levels, making features less distinguishable.

### Q11: Image thresholding for the Colour Space
There were notable differences in the thresholding results after converting the image to alternative colour spaces
- colour-space conversions generally improved feature separation but also introduced noise.
- HSV and YCbCr were used. The HSV model, which separates intensity from colour information, provided a clearer thresholded result. The YCbCr model, commonly used in image compression, highlighted differences in chromatic details.
- Alternative colour spaces such as Lab* could potentially improve results by isolating brightness from colour, making thresholding more reliable.

### Problems faced
### Implementing threshold for RGB channel
One of the challenges faced was designing a system that could threshold each channel separately while keeping the code efficient. Initially, I considered creating separate folders for each channel but later optimised the implementation within a single structure.

### Face detection
The biggest challenge was implementing face detection effectively. Initially, I used the library recommended in the course but encountered persistent errors. As an alternative, I tried the ml5.js library, which provided additional functionalities but introduced new errors. After debugging, I reverted to the original library and resolved previous issues. Later, while working on the extension, I realised that ml5.js offered more possibilities. At this point, I switched back to ml5.js and, after extensive troubleshooting, successfully integrated it.

Another issue was ensuring that both the face detection and the extension filter appeared in their intended grid positions. I was able to solve it after many trial-and-error with the adjustments to coordinate mapping and display logic.

### Target to complete the project
Despite all the challenges faced, I managed to resolve most of them, ensuring my image processing application runs smoothly. Something that I can improve on is time management,as allocating more structured debugging time would have helped in addressing issues earlier in development.

### Extension 
For my extension, I implemented a laser-eye filter inspired by social media filters. It uses ml5's faceMesh, to detect the facial landmarks, identify eye positions, and draw animated laser beams extending from the eyes.
This extension is unique because it dynamically tracks facial movements in real time, making it more interactive than a static filter. Future improvements could involve adding colour variations, beam width adjustments, or interactive elements where laser intensity changes based on facial expressions.
### 
*/
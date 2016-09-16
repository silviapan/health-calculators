// Calculate BMI with weight and height
function bodyMassIndex() {
	// Get the user's weight and height input
	var inputWeight = parseInt(document.getElementsByName('weight')[0].value);
	var inputHeight = parseInt(document.getElementsByName('height')[0].value);

	if(document.getElementById('imperial').checked) {
		// Convert lb to kg
  	inputWeight *= 0.45359237;
  	// Convert in to cm
  	inputHeight *= 2.54;
	}

	// Formula for calculating BMI
	// The height is divided by 100 because the input is now in cm but the formula uses m
	var bodyMassIndexResult = (inputWeight / Math.pow(inputHeight/100, 2)).toFixed(1);
	
	// Function for ease of getting a range 
	function between(x, min, max) {
		return x >= min && x <= max;
	}

	//Display the BMI results and suggestions
	var displayBmi = "Your body mass index(BMI) is " + bodyMassIndexResult + ". You are considered ";

	var healthyWeightLow = Math.floor(18.5 * Math.pow(inputHeight/100, 2));
	var healthyWeightHigh = Math.floor(24.9 * Math.pow(inputHeight/100, 2));
	var displayHealthyWeight = " A healthy weight range for your height is between " 
															+ Math.floor((healthyWeightLow / 0.45359237)) + " to " + Math.floor((healthyWeightHigh / 0.45359237)) + " lb ("
															+ Math.floor(healthyWeightLow) + " to " + Math.floor(healthyWeightHigh) + " kg)."; 

	var displayBmiResult = document.getElementById('bmi-result');

	if (bodyMassIndexResult < 18.5) {
		displayBmiResult.innerHTML = displayBmi + "underweight." + displayHealthyWeight;
	}
	else if (between(bodyMassIndexResult, 18.5, 24.9)) {
		displayBmiResult.innerHTML = displayBmi + "normal weight.";
	}
	else if (between(bodyMassIndexResult, 25.0, 29.9)) {
		displayBmiResult.innerHTML = displayBmi + "overweight." + displayHealthyWeight;
	}
	else {
		displayBmiResult.innerHTML = displayBmi + "obese." + displayHealthyWeight;
	}
}


function copyMeasurements(copy) {
  if (copy.checked) {
  	var weightCopy = document.getElementsByName('weight')[0].value;
  	var heightCopy = document.getElementsByName('height')[0].value;

  	document.getElementsByName('weight')[1].value = weightCopy;
  	document.getElementsByName('height')[1].value = heightCopy;
  }
}


// Convert imperial units to metric units for ease of calculation
function poundToKilgram(pound) {
	return pound * 0.45359237;
}

function inchToCentimeter(inch) {
	return inch * 2.54;
}

// Harris-Benedict Equation
function harrisBenedict(sex, weight, height, age) {
	if (sex == 'male') {
		var harrisBenedictBase = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
	}
	else if (sex == 'female') {
		var harrisBenedictBase = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
	}
	return Math.floor(harrisBenedictBase);
}

function mifflinStJeor(sex, weight, height, age) {
	if (sex == 'male') {
		var mifflinStJeorBase = (9.99 * weight) + (6.25 * height) - (4.92 * age) + 5;
	}
	else if (sex == 'female') {
		var mifflinStJeorBase = (9.99 * weight) + (6.25 * height) - (4.92 * age) - 161;
	}
	return Math.floor(mifflinStJeorBase);
}

function katchMcArdle(weight, bodyFat) {
	var leanBodyMass = weight * ((100 - bodyFat)/100);
	var katchMcArdleBase = 370 + (21.6 * leanBodyMass);
	return Math.floor(katchMcArdleBase);
}


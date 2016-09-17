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

function caloricNeed() {
	var inputWeight = parseInt(document.getElementsByName('weight')[1].value);
	var inputHeight = parseInt(document.getElementsByName('height')[1].value);
	var inputAge = parseInt(document.getElementsByName('age')[0].value);
	var inputBodyFat = document.getElementsByName('body-fat')[0].value;

	if(document.getElementById('imperial').checked) {
		// Convert lb to kg
  	inputWeight *= 0.45359237;
  	// Convert in to cm
  	inputHeight *= 2.54;
	}

	var calorieBase;
	if (inputBodyFat == '') {
//Mifflin St Jeor formula for calculating BMR
		function mifflinStJeor() {
			// Formula for male
			if (document.getElementsByName('sex')[0].checked) {
				var mifflinStJeorBase = (9.99 * inputWeight) + (6.25 * inputHeight) - (4.92 * inputAge) + 5;
			}
			// Formula for female
			else if (document.getElementsByName('sex')[1].checked) {
				var mifflinStJeorBase = (9.99 * inputWeight) + (6.25 * inputHeight) - (4.92 * inputAge) - 161;
			}
			calorieBase = Math.floor(mifflinStJeorBase);
		}
		mifflinStJeor();
	}

	else {
		// Katch-McArdle formula for calculating BMR 
		function katchMcArdle() {
			var leanBodyMass = inputWeight * ((100 - parseInt(inputBodyFat))/100);
			var katchMcArdleBase = 370 + (21.6 * leanBodyMass);
			calorieBase = Math.floor(katchMcArdleBase);
		}
		katchMcArdle();
	}

	var totalCalories;

	var activityLevel = document.getElementById('activity-level').options.selectedIndex;
	switch (activityLevel) {
		case 0:
			totalCalories = calorieBase * 1.2;
			break;

		case 1:
			totalCalories = calorieBase * 1.3;
			break;

		case 2: 
			totalCalories = calorieBase * 1.5;
			break;

		case 3:
			totalCalories = calorieBase * 1.7;
			break;

		case 4: 
			totalCalories = calorieBase * 1.9;
			break;
	}

	var calorieDisplay = document.getElementById('calorie-result');
	calorieDisplay.innerHTML = "TDEE: " + Math.floor(totalCalories);
}

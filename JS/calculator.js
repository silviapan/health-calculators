// Toggle appearance of the units based on checked input
function convertUnits() {
	var weightUnits = document.getElementsByClassName('lb-kg');
	var heightImperial = document.getElementById('height-ft-in');
	var heightMetric = document.getElementById('height-cm');

	if(document.getElementById('imperial').checked) {
		heightImperial.style.display = 'unset';
		heightMetric.style.display = 'none';
  	weightUnits[0].innerHTML = "lb";
  	weightUnits[1].innerHTML = "lb";
	}
	else {
		heightImperial.style.display = 'none';
		heightMetric.style.display = 'unset';
		weightUnits[0].innerHTML = "kg";
		weightUnits[1].innerHTML = "kg";
	}
}

// Convert imperial to metric units for ease of calculating
var convertMeasurements = function () {
	var inputWeight = parseInt(document.getElementsByName('weight')[0].value);
	var inputHeightFt = parseInt(document.getElementsByName('height')[0].value);
	var inputHeightIn = parseInt(document.getElementsByName('height')[1].value);
	var inputHeightCm = parseInt(document.getElementsByName('height')[2].value);
	var inputGoal = parseInt(document.getElementsByName('goal')[0].value);

	if(document.getElementById('imperial').checked) {
		// Convert lb to kg and in to cm
		inputWeight *= 0.45359237;
		inputHeight = ((inputHeightFt * 12) + inputHeightIn) * 2.54;
		inputGoal *= 0.45359237;
	}
	else {
		inputHeight = inputHeightCm;
	}
	return [inputWeight, inputHeight, inputGoal];
};
	
// Calculate BMI with weight and height
function bodyMassIndex() {
	var measurements = convertMeasurements();
	var inputWeight = measurements[0];
	var inputHeight = measurements[1];

	// Formula for calculating BMI
	// The height is divided by 100 because the input is now in cm but the formula uses m
	var bodyMassIndexResult = (inputWeight / Math.pow(inputHeight/100, 2)).toFixed(1);
	
	// Function for ease of getting a range 
	function between(x, min, max) {
		return x >= min && x <= max;
	}

	//Display the BMI results and suggestions
	var displayBmi = "Your body mass index (BMI) is " + bodyMassIndexResult + ". You are considered ";

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
		displayBmiResult.innerHTML = displayBmi + "normal weight. " + displayHealthyWeight;
	}
	else if (between(bodyMassIndexResult, 25.0, 29.9)) {
		displayBmiResult.innerHTML = displayBmi + "overweight." + displayHealthyWeight;
	}
	else if (bodyMassIndexResult > 0) {
		displayBmiResult.innerHTML = displayBmi + "obese." + displayHealthyWeight;
	}
	else {
		displayBmiResult.innerHTML = "";
	}
}

function caloricNeed() {
	//Convert the input weight and height
	var measurements = convertMeasurements();
	var inputWeight = measurements[0];
	var inputHeight = measurements[1];
	var inputGoal = measurements[2];

	var inputAge = parseInt(document.getElementsByName('age')[0].value);
	var inputBodyFat = document.getElementsByName('body-fat')[0].value;

	//Make sure that all of the form is completed
	validateForm();

	// Calculate the healthy weight range in order to limit extremely low goal inputs
	var healthyWeightLow = Math.floor(18.5 * Math.pow(inputHeight/100, 2));

	// Declare variables to be used in formulas for calculating calories
	var male = document.getElementsByName('sex')[0].checked;
	var female = document.getElementsByName('sex')[1].checked;
	var bmrDisplay = document.getElementById('bmr-result');	
	var calorieBase;

	if(document.getElementById('imperial').checked) {
		document.getElementById('current-weight').innerHTML = "Current weight: " + Math.floor(inputWeight/0.45359237) + ' lb';
	}
	else{
		document.getElementById('current-weight').innerHTML = "Current weight: " + inputWeight + ' kg';
	}

	// If the body fat input is empty, use MSJ, otherwise use KMA
	if (inputBodyFat == '') {
		mifflinStJeor(inputWeight, inputHeight, inputAge);
		if (isNaN(calorieBase)) {
			return '';
		}
		else {
			bmrDisplay.innerHTML = "Your BMR: " + calorieBase + " Calories";
		}
	}
	else {
		katchMcArdle(inputWeight, parseInt(inputBodyFat));
		bmrDisplay.innerHTML = "Your BMR: " + calorieBase + " Calories.";
	}

	//Mifflin St Jeor formula for calculating BMR
	function mifflinStJeor(weight, height, age) {
		if (male) {
			var mifflinStJeorBase = (9.99 * weight) + (6.25 * height) - (4.92 * age) + 5;
		}
		else if (female) {
			var mifflinStJeorBase = (9.99 * weight) + (6.25 * height) - (4.92 * age) - 161;
		}
		calorieBase = Math.floor(mifflinStJeorBase);
	}

	// Katch-McArdle formula for calculating BMR 
	function katchMcArdle(weight, fat) {
		var leanBodyMass = weight * ((100 - fat)/100);
		var katchMcArdleBase = 370 + (21.6 * leanBodyMass);
		calorieBase = Math.floor(katchMcArdleBase);
	}

	// Multiply the BMR by the appropriate multiplier
	var totalCalories;
	function calculateTotalCalories(){
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

		if (male && totalCalories < 1800) {
			totalCalories = 1800;
		}
		else if (female && totalCalories < 1200) {
			totalCalories = 1200;
		}
		totalCalories = Math.floor(totalCalories);
	}
	calculateTotalCalories();

	var calorieDisplay = document.getElementById('tdee-result');

	if (isNaN(totalCalories)) {
		return '';
	}
	else {
		calorieDisplay.innerHTML = "Your TDEE: " + totalCalories + " Calories";
	}
	
	var rateChange = document.getElementById('rate').options.selectedIndex;
	var calorieDifference;
	switch (rateChange) {
		case 0: 
			calorieDifference = totalCalories * 0.15;
			break;
		case 1:
			calorieDifference = totalCalories * 0.20;
			break;
		case 2:
			calorieDifference = totalCalories * 0.25;
			break;
	}

	var displayNewTotal = document.getElementById('new-calorie-result');
	var newTotalCalories;

	document.getElementById('weight-warning').innerHTML = '';
	displayNewTotal.innerHTML = '';
	if (inputGoal < healthyWeightLow) {
		alert("Please enter a weight within the healthy BMI range.");
		document.getElementById('weight-warning').innerHTML = 'This weight is outside the healthy BMI range. Please enter another weight.';
	}
	else {
		// Weight loss
		if (inputGoal < inputWeight) {
			newTotalCalories = Math.floor(totalCalories - calorieDifference);
			// The calorie deficit cannot go past the BMR 
			if (newTotalCalories < calorieBase) {
				newTotalCalories = calorieBase;
			}
			// The new total calorie cannot be less than the limit
			if (male && calorieBase < 1800) {
				newTotalCalories = 1800;
			}
			else if (female && calorieBase < 1200) {
				newTotalCalories = 1200;
			}
			displayNewTotal.innerHTML = "In order to lose weight, eat at a deficit of " + Math.floor(totalCalories - newTotalCalories) + " Calories each day. The recommended intake for your current weight is " + newTotalCalories + " Calories.";
		}
		// Weight gain
		else if (inputGoal > inputWeight) {
			newTotalCalories = Math.floor(totalCalories + calorieDifference);
			displayNewTotal.innerHTML = "In order to gain weight, eat at a surplus of " + Math.floor(calorieDifference) + " Calories each day. The recommended intake for your current weight is " + newTotalCalories + " Calories.";
		}
	}

	// Method to used to calculate when to reach goal weight
	function calculateGoalDate() {
		var goalDate = document.getElementById('reach-goal-date');
		goalDate.innerHTML = '';			

	// The TDEE is recalculated for each pound lost so that the estimate is more accurate
		for (i = 0; i < weightArray.length; i++) {
			mifflinStJeor(weightArray[i], inputHeight, inputAge);
			calculateTotalCalories();

			if (male && calorieBase < 1800) {
				newTotalCalories = 1800;
			}
			else if (female && calorieBase < 1200) {
				newTotalCalories = 1200;
			}
			
			if (inputGoal < inputWeight) {
				newTotalCalories = totalCalories - calorieDifference;
				if (newTotalCalories < calorieBase) {
					newTotalCalories = calorieBase;
				}
			}
			else if (inputGoal > inputWeight) {
				newTotalCalories = totalCalories + calorieDifference;
			}	
		}

		// There are 3500 calories in a pound
		// Dividing 3500 by the calorie difference will result in the number of days needed to lose one pound
		calorieDifference = Math.abs(totalCalories - newTotalCalories);
		numDays = (3500/calorieDifference);
		daysArray.push(numDays);
		
		// Loop to find the total number of days to reach goal weight
		var sumDays = 0;
		for (var j=0; j < daysArray.length; j++) {
			sumDays += daysArray[j];
		}

		// Add the total number of days to today's date to get an approximation
		var todayDate = new Date();
		todayDate.setDate(todayDate.getDate() + sumDays);

		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		var dd = todayDate.getDate();
		var mm = todayDate.getMonth() + 1;
		var mmWritten = monthNames[todayDate.getMonth()];
		var y = todayDate.getFullYear();

		var formattedDate = mmWritten + ' ' + dd + ',' + ' ' + y 
												+ ' ('+ mm + '/' + dd + '/' + y + ')';

		if (isNaN(numDays)) {
			return '';
		}
		else {
			goalDate.innerHTML = "You will reach your goal weight on " + formattedDate + ". When you reach your goal weight, eat at maintenance (TDEE) to maintain your weight.";
		}

		if(document.getElementById('imperial').checked) {
			document.getElementById('goal-weight').innerHTML = "Goal weight: " + Math.floor(inputGoal/0.45359237) + " lb";
		}
		else{
			document.getElementById('goal-weight').innerHTML = "Goal weight: " + inputWeight + " kg";
		}
		document.getElementById('bmr-result2').innerHTML = "Your BMR: " + calorieBase + " Calories";
		document.getElementById('tdee-result2').innerHTML = "Your TDEE: " + totalCalories + " Calories"
	}

	var weightArray = [];
	var daysArray = [];
	var numDays;

	while (inputWeight > inputGoal) {
		weightArray.push(inputWeight);
		inputWeight--;
		calculateGoalDate();
	}
	
	while (inputWeight < inputGoal) {
		weightArray.push(inputWeight);
		inputWeight++;
		calculateGoalDate();
	}

	function drawTable() {
		document.getElementById('weight-change-info').style.display = 'block';
		var weightChangeTable = document.getElementById('weight-change-table');
		Object.assign(weightChangeTable.style,{opacity:"1",height:"100%",lineHeight:"30px", marginTop:"20px", marginBottom:"20px"});
		while(weightChangeTable.rows.length > 1) {
			for (var x = 1; x < weightChangeTable.rows.length; x++)
		  weightChangeTable.deleteRow(x);
		}

		if(document.getElementById('imperial').checked) {
			for (i = 0; i < weightArray.length - 2; i++) {
				chartInput();
			}
		}
		else {
			for (i = 0; i < weightArray.length - 1; i++) {
				chartInput();
			}
		}

		function chartInput() {
			var tr = weightChangeTable.insertRow();

			mifflinStJeor(weightArray[i], inputHeight, inputAge);
			calculateTotalCalories();

			if (inputGoal <= inputWeight) {
				newTotalCalories = totalCalories - calorieDifference;
				if (newTotalCalories < calorieBase) {
					newTotalCalories = calorieBase;
				}
			}

			else if (inputGoal >= inputWeight) {
				newTotalCalories = totalCalories + calorieDifference;
			}	

			if (male && calorieBase < 1800) {
				newTotalCalories = 1800;
			}
			else if (female && calorieBase < 1200) {
				newTotalCalories = 1200;
			}

			var td1 = tr.insertCell(0),
					td2 = tr.insertCell(1),
					td3 = tr.insertCell(2),
					td4 = tr.insertCell(3);

			if(document.getElementById('imperial').checked) {
				td1.innerHTML = Math.floor((weightArray[i]) / 0.45359237) + ' lb';
			}
			else {
				td1.innerHTML = (weightArray[i]) + ' kg';
			}
			td2.innerHTML = calorieBase;
			td3.innerHTML = totalCalories;
			td4.innerHTML = Math.floor(newTotalCalories);
		}
	}
	drawTable();
}

function validateForm() {
	var checkArray = [];
	var checkSex = document.forms[0].sex.value;
	var checkAge = document.forms[0].age.value;
	var checkWeight = document.forms[0].weight.value;
	var checkHeight = document.forms[0].height.value;
	var checkGoal = document.forms[1].goal.value;

	var bmr = document.getElementById('bmr-result');
	var tdee = document.getElementById('tdee-result');
	var newTdee = document.getElementById('new-calorie-result');
	var goalDate = document.getElementById('reach-goal-date');

	checkArray.push(checkSex, checkAge, checkWeight, checkHeight, checkGoal);

	document.getElementById('empty-warning').innerHTML = '';

	for (i = 0; i < checkArray.length; i++) {
		if (checkArray[i] == null || checkArray[i] == '') {
			document.getElementById('empty-warning').innerHTML = "Please fill all required fields.";
		}
		else {
			return '';
		}
	}
}
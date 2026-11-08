
// Global variables
let score = 0;

let attempts = Number(localStorage.getItem("total_attempts") || 0);

// Display saved attempts
document.querySelector("#totalAttempts").textContent =
  `Total Quiz Attempts: ${attempts}`;


// SHUFFLE ARRAY

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));

    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}


// CREATE RADIO BUTTONS AND CHECKBOXES

function displayChoices(containerId, questionName, choices, type) {
  let choicesArray = [...choices];

  shuffleArray(choicesArray);

  let container = document.querySelector(`#${containerId}`);
  container.textContent = "";

  choicesArray.forEach((choice, index) => {
    let id = `${questionName}_${index}`;

    let wrapper = document.createElement("div");
    wrapper.className = "form-check";

    let input = document.createElement("input");
    input.type = type;
    input.className = "form-check-input";
    input.name = questionName;
    input.id = id;
    input.value = choice.value;

    let label = document.createElement("label");
    label.className = "form-check-label";
    label.htmlFor = id;
    label.textContent = choice.label;

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}



// DISPLAY RANDOMIZED QUESTIONS

// Question 4: Radio buttons
displayChoices("q4Choices", "q4", [
  { value: "maine", label: "Maine" },
  { value: "rhodeisland", label: "Rhode Island" },
  { value: "maryland", label: "Maryland" },
  { value: "delaware", label: "Delaware" }
], "radio");


// Question 5: Radio buttons
displayChoices("q5Choices", "q5", [
  { value: "florida", label: "Florida" },
  { value: "georgia", label: "Georgia" },
  { value: "california", label: "California" },
  { value: "texas", label: "Texas" }
], "radio");


// Question 6: Checkboxes
displayChoices("q6Choices", "q6", [
  { value: "oregon", label: "Oregon" },
  { value: "nevada", label: "Nevada" },
  { value: "arizona", label: "Arizona" },
  { value: "utah", label: "Utah" }
], "checkbox");


// Question 9: Radio buttons
displayChoices("q9Choices", "q9", [
  { value: "hawaii", label: "Hawaii" },
  { value: "alaska", label: "Alaska" },
  { value: "florida", label: "Florida" },
  { value: "oregon", label: "Oregon" }
], "radio");


// Question 10: Checkboxes
displayChoices("q10Choices", "q10", [
  { value: "superior", label: "Lake Superior" },
  { value: "michigan", label: "Lake Michigan" },
  { value: "huron", label: "Lake Huron" },
  { value: "erie", label: "Lake Erie" },
  { value: "ontario", label: "Lake Ontario" },
  { value: "champlain", label: "Lake Champlain" }
], "checkbox");



// GET SELECTED ANSWERS
function getRadioAnswer(name) {
  let selected = document.querySelector(
    `input[name="${name}"]:checked`
  );

  return selected ? selected.value : "";
}

function getCheckboxAnswers(name) {
  return Array.from(
    document.querySelectorAll(`input[name="${name}"]:checked`)
  ).map(input => input.value);
}

function arraysMatch(selected, correct) {
  return selected.length === correct.length &&
    correct.every(answer => selected.includes(answer));
}



// VALIDATE FORM
function isFormValid() {
  let valid = true;
  let message = "";

  for (let i = 1; i <= 10; i++) {
    let answered = false;

    if ([1, 8].includes(i)) {
      answered = document.querySelector(`#q${i}`).value.trim() !== "";
    }

    else if ([2, 7].includes(i)) {
      answered = document.querySelector(`#q${i}`).value !== "";
    }

    else if (i === 3) {
      answered = getCheckboxAnswers("q3").length > 0;
    }

    else if ([4, 5, 9].includes(i)) {
      answered = getRadioAnswer(`q${i}`) !== "";
    }

    else if ([6, 10].includes(i)) {
      answered = getCheckboxAnswers(`q${i}`).length > 0;
    }

    if (!answered) {
      valid = false;
      message += `Question ${i} is unanswered. `;
    }
  }

  document.querySelector("#validationFdbk").textContent = message;

  return valid;
}


// DISPLAY IMAGE

function setMarkImage(index, imageName, altText) {
  let container = document.querySelector(`#markImg${index}`);

  container.textContent = "";

  let img = document.createElement("img");

  img.src = `img/${imageName}`;
  img.alt = altText;
  img.className = "mark-image";

  container.appendChild(img);
}


// CORRECT ANSWER FEEDBACK
function rightAnswer(index) {
  let feedback = document.querySelector(`#q${index}Feedback`);

  feedback.textContent = "Correct! Well done!";
  feedback.className = "feedback correct";

  setMarkImage(index, "checkmark.png", "Correct answer");
  score += 10;
}

// INCORRECT FEEDBACK

function wrongAnswer(index) {
  let feedback = document.querySelector(`#q${index}Feedback`);

  feedback.textContent = "Incorrect! Try again next time.";
  feedback.className = "feedback incorrect";

  setMarkImage(index, "xmark.png", "Incorrect answer");
}



// GRADE QUIZ
function gradeQuiz() {

  document.querySelector("#validationFdbk").textContent = "";

  if (!isFormValid()) {
    return;
  }

  score = 0;

  // Clear previous res
  for (let i = 1; i <= 10; i++) {
    document.querySelector(`#q${i}Feedback`).textContent = "";
    document.querySelector(`#markImg${i}`).textContent = "";
  }

  // QUESTION 1
  let q1 = document.querySelector("#q1").value.trim().toLowerCase();

  if (q1 === "sacramento") {
    rightAnswer(1);
  } else {
    wrongAnswer(1);
  }

  // QUESTION 2
  let q2 = document.querySelector("#q2").value;

  if (q2 === "missouri") {
    rightAnswer(2);
  } else {
    wrongAnswer(2);
  }

  // QUESTION 3
  let q3 = getCheckboxAnswers("q3");

  let q3Correct = [
    "washington",
    "jefferson",
    "roosevelt",
    "lincoln"
  ];

  if (arraysMatch(q3, q3Correct)) {
    rightAnswer(3);
  } else {
    wrongAnswer(3);
  }

  // QUESTION 4
  let q4 = getRadioAnswer("q4");

  if (q4 === "rhodeisland") {
    rightAnswer(4);
  } else {
    wrongAnswer(4);
  }


  // QUESTION 5
  let q5 = getRadioAnswer("q5");

  if (q5 === "florida") {
    rightAnswer(5);
  } else {
    wrongAnswer(5);
  }

  // QUESTION 6
  let q6 = getCheckboxAnswers("q6");

  let q6Correct = ["oregon", "nevada", "arizona"];

  if (arraysMatch(q6, q6Correct)) {
    rightAnswer(6);
  } else {
    wrongAnswer(6);
  }

  // QUESTION 7
  let q7 = document.querySelector("#q7").value;

  if (q7 === "arizona") {
    rightAnswer(7);
  } else {
    wrongAnswer(7);
  }

  // QUESTION 8
  let q8 = document.querySelector("#q8").value.trim().toLowerCase();

  if (q8 === "austin") {
    rightAnswer(8);
  } else {
    wrongAnswer(8);
  }

  // QUESTION 9
  let q9 = getRadioAnswer("q9");

  if (q9 === "hawaii") {
    rightAnswer(9);
  } else {
    wrongAnswer(9);
  }

  // QUESTION 10
  let q10 = getCheckboxAnswers("q10");

  let q10Correct = [
    "superior",
    "michigan",
    "huron",
    "erie",
    "ontario"
  ];

  if (arraysMatch(q10, q10Correct)) {
    rightAnswer(10);
  } else {
    wrongAnswer(10);
  }


  // DISPLAY TOTAL SCORE

  let totalScore = document.querySelector("#totalScore");

  totalScore.textContent = `Your Total Score: ${score} / 100`;

  if (score < 80) {
    totalScore.className = "text-danger";
  } else {
    totalScore.className = "text-success";
  }


  let congratulations = document.querySelector("#congratulations");

  if (score > 80) {
    congratulations.textContent =
      "Congratulations!";
  } else {
    congratulations.textContent = "";
  }


  // SAVE TOTAL ATTEMPTS

  attempts++;

  document.querySelector("#totalAttempts").textContent =
    `Total Quiz Attempts: ${attempts}`;

  localStorage.setItem("total_attempts", attempts);

}

// SUBMIT BUTTON
document.querySelector("#submitQuiz").addEventListener("click", gradeQuiz);

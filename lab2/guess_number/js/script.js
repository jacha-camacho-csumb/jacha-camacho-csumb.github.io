// Evnt Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

// Global vars
let randomNumber;
let attempts = 0;
let totalWins = 0;
let totalLosses = 0;

initializeGame();

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log("Random number: " + randomNumber);
    attempts = 0;

    // Hide the Reset button and show the Guess button
    document.querySelector("#resetBtn").style.display = "none";
    document.querySelector("#guessBtn").style.display = "inline";

    let playerGuess = document.querySelector("#playerGuess");
    playerGuess.focus();
    playerGuess.value = "";

    // Clear feedback/ previous guesses
    document.querySelector("#feedback").textContent = "";
    document.querySelector("#guesses").textContent = "";
}

function checkGuess() {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";

    let guess = Number(document.querySelector("#playerGuess").value);

    // Check that the guess is between 1 and 99
    if (guess < 1 || guess > 99 || !Number.isInteger(guess)) {
        feedback.textContent = "Enter a whole number between 1 and 99";
        feedback.style.color = "red";
        return;
    }

    attempts++;
    console.log("Attempts: " + attempts);

    if (guess == randomNumber) {
        feedback.textContent = "You guessed it! You Won!";
        feedback.style.color = "darkgreen";
        totalWins++;
        document.querySelector("#wins").textContent = totalWins;
        gameOver();
    } else {
        document.querySelector("#guesses").textContent += guess + " ";

        if (attempts == 7) {
            feedback.textContent = "Sorry, you lost! The number was " + randomNumber;
            feedback.style.color = "red";
            totalLosses++;
            document.querySelector("#losses").textContent = totalLosses;
            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Guess was high. Try a lower number.";
            feedback.style.color = "orange";
        } else {
            feedback.textContent = "Guess was low. Try a higher number.";
            feedback.style.color = "orange";
        }
    }
}

function gameOver() {
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");

    guessBtn.style.display = "none"; //hides guess btn
    resetBtn.style.display = "inline"; // shows reset btn
}

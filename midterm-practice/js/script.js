
// API URLs
const QUOTE_API = "https://csumb.space/api/famousQuotes/getRandomQuote.php";
const TRANSLATE_API = "https://csumb.space/api/famousQuotes/translateQuote.php";
const MULTIPLE_QUOTES_API = "https://csumb.space/api/famousQuotes/getQuotes.php";
const PIXABAY_API = "https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&per_page=50&orientation=horizontal&q=flowers";

// Available languages
const languages = [
    { code: "EN", name: "English", flag: "english_flag.png" },
    { code: "ES", name: "Esperanto", flag: "esperanto_flag.png" },
    { code: "FR", name: "French", flag: "french_flag.png" },
    { code: "SP", name: "Spanish", flag: "spanish_flag.png" }
];

// Store the currently displayed quote
let currentQuote = null;


// Run when the page loads
document.addEventListener("DOMContentLoaded", () => {

    // Load a random quote
    getRandomQuote();

    // Randomize language radio button order
    displayLanguages();

    // Load a random background image
    getRandomBackground();

    // Set up button event listeners
    document.getElementById("authorButton")
        .addEventListener("click", displayAuthorInfo);

    document.getElementById("translateButton")
        .addEventListener("click", translateQuote);

    document.getElementById("getQuotesButton")
        .addEventListener("click", getMultipleQuotes);

});


// Retrieve a random quote from the API
async function getRandomQuote() {

    try {

        const response = await fetch(QUOTE_API);

        if (!response.ok) {
            throw new Error("Unable to retrieve quote.");
        }

        const data = await response.json();

        // Save quote information for translation and author details
        currentQuote = data;

        // Display quote and author
        document.getElementById("quoteText").textContent =
            data.quoteText || "No quote available.";

        document.getElementById("quoteAuthor").textContent =
            `${data.firstName || ""} ${data.lastName || ""}`;

    } catch (error) {

        document.getElementById("quoteText").textContent =
            "Unable to load a quote. Please try again.";

        console.error("Quote API error:", error);
    }
}


// Display author biography and picture
function displayAuthorInfo() {

    if (!currentQuote) {
        return;
    }

    // Get author information from the quote API response
    const bio = currentQuote.authorBio || currentQuote.bio || "";
    const picture = currentQuote.authorImage ||
        currentQuote.authorPic ||
        currentQuote.image ||
        "";

    // Display author name and biography
    document.getElementById("authorName").textContent =
        `${currentQuote.firstName || ""} ${currentQuote.lastName || ""}`;

    document.getElementById("authorBio").textContent =
        bio || "Author biography is not available.";

    // Display author picture if available
    const authorImage = document.getElementById("authorImage");

    if (picture) {
        authorImage.src = picture;
        authorImage.classList.remove("hidden");
    } else {
        authorImage.classList.add("hidden");
    }

    // Display the author information section
    document.getElementById("authorInfo").classList.remove("hidden");
}


// Shuffle language choices using Fisher-Yates
function displayLanguages() {

    const shuffledLanguages = [...languages];

    for (let i = shuffledLanguages.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [shuffledLanguages[i], shuffledLanguages[j]] =
            [shuffledLanguages[j], shuffledLanguages[i]];
    }

    const languageContainer =
        document.getElementById("languageOptions");

    languageContainer.innerHTML = "";

    // Create a radio button for each language
    shuffledLanguages.forEach((language, index) => {

        const label = document.createElement("label");

        const radio = document.createElement("input");

        radio.type = "radio";
        radio.name = "language";
        radio.value = language.code;

        // Select the first language by default
        if (index === 0) {
            radio.checked = true;
        }

        label.appendChild(radio);
        label.appendChild(
            document.createTextNode(" " + language.name)
        );

        languageContainer.appendChild(label);
    });
}


// Translate the currently displayed quote
async function translateQuote() {

    if (!currentQuote) {
        return;
    }

    // Find the selected language
    const selectedLanguage =
        document.querySelector('input[name="language"]:checked');

    if (!selectedLanguage) {
        alert("Please select a language.");
        return;
    }

    const languageCode = selectedLanguage.value;

    // Get the quote ID from the API response
    const quoteId = currentQuote.quoteId || currentQuote.id;

    if (!quoteId) {
        alert("The quote ID is unavailable.");
        return;
    }

    // Build the translation API URL
    const url = `${TRANSLATE_API}?lang=${languageCode}&quoteId=${quoteId}`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Translation request failed.");
        }

        const data = await response.json();

        // Display the translated quote
        document.getElementById("translatedQuote").textContent =
            data.translation || "Translation unavailable.";

        // Find the corresponding language flag
        const selectedLanguageInfo = languages.find(
            language => language.code === languageCode
        );

        const flag = document.getElementById("languageFlag");

        flag.src = `img/${selectedLanguageInfo.flag}`;
        flag.alt = selectedLanguageInfo.name + " flag";
        flag.classList.remove("hidden");

    } catch (error) {

        document.getElementById("translatedQuote").textContent =
            "Unable to translate quote.";

        console.error("Translation error:", error);
    }
}


// Retrieve and display multiple quotes
async function getMultipleQuotes() {

    const input = document.getElementById("numberOfQuotes");
    const errorMessage = document.getElementById("errorMessage");
    const quotesList = document.getElementById("quotesList");

    const number = Number(input.value);

    // Clear previous results and errors
    errorMessage.textContent = "";
    quotesList.innerHTML = "";

    // Validate the number of quotes
    if (
        input.value.trim() === "" ||
        !Number.isInteger(number) ||
        number < 1 ||
        number > 5
    ) {

        errorMessage.textContent =
            "Please enter a number between 1 and 5.";

        input.focus();
        return;
    }

    try {

        // Request the specified number of quotes
        const response = await fetch(
            `${MULTIPLE_QUOTES_API}?n=${number}`
        );

        if (!response.ok) {
            throw new Error("Unable to retrieve quotes.");
        }

        const quotes = await response.json();

        // Display each quote and its author
        quotes.forEach(quote => {

            const card = document.createElement("div");
            card.className = "quote-card";

            const quoteText = document.createElement("p");
            quoteText.textContent = `"${quote.quoteText}"`;

            const author = document.createElement("strong");
            author.textContent =
                `— ${quote.firstName} ${quote.lastName}`;

            card.appendChild(quoteText);
            card.appendChild(author);

            quotesList.appendChild(card);
        });

    } catch (error) {

        errorMessage.textContent =
            "Unable to retrieve quotes. Please try again.";

        console.error("Multiple quotes error:", error);
    }
}


// Retrieve a random background image from Pixabay
async function getRandomBackground() {

    try {

        const response = await fetch(PIXABAY_API);

        if (!response.ok) {
            throw new Error("Unable to retrieve background images.");
        }

        const data = await response.json();

        // Get the available images
        const images = data.hits;

        if (images && images.length > 0) {

            // Select a random image
            const randomIndex = Math.floor(
                Math.random() * images.length
            );

            const randomImage = images[randomIndex];

            // Set the background image
            document.body.style.backgroundImage =
                `url("${randomImage.largeImageURL}")`;
        }

    } catch (error) {

        console.error("Background image error:", error);
    }
}

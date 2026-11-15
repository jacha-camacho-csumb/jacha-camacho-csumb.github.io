const breedSelect = document.getElementById("breedSelect");
const breedForm = document.getElementById("breedForm");
const result = document.getElementById("result");

// Load dog breeds on page open
async function loadBreeds() {
    try {
        const response = await fetch(
            "https://dog.ceo/api/breeds/list/all"
        );

        const data = await response.json();

        // Check API response
        if (data.status !== "success") {
            throw new Error("Could not load breeds.");
        }

        // Add breeds to dropdown
        breedSelect.innerHTML = '<option value="">Select a breed</option>';

        const breeds = Object.keys(data.message);

        breeds.forEach(function (breed) {
            const option = document.createElement("option");

            option.value = breed;
            option.textContent =
                breed.charAt(0).toUpperCase() + breed.slice(1);

            breedSelect.appendChild(option);
        });

    } catch (error) {
        breedSelect.innerHTML =
            '<option value="">Unable to load breeds</option>';

        result.innerHTML =
            '<p class="error">Error loading dog breeds.</p>';
    }
}
// Get a random photo of the selected dogbreed
async function getDogImage(breed) {
    try {
        const response = await fetch(
            `https://dog.ceo/api/breed/${breed}/images/random`
        );

        const data = await response.json();

        if (data.status !== "success") {
            throw new Error("Could not load dog image.");
        }

        // Display image
        result.innerHTML = `
            <h2>${breed.charAt(0).toUpperCase() + breed.slice(1)}</h2>
            <img src="${data.message}" alt="${breed} dog">
        `;

    } catch (error) {
        result.innerHTML =
            '<p class="error">Unable to load dog photo. Try again.</p>';
    }
}

// Listen for submission
breedForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const breed = breedSelect.value;

    // validation
    if (breed === "") {
        result.innerHTML =
            '<p class="error">Please select a dog breed.</p>';
        return;
    }

    // Retrieve and display dog photo
    result.innerHTML = "<p>Loading dog photo...</p>";

    getDogImage(breed);
});

loadBreeds();
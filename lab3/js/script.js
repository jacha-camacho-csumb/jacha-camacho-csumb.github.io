
document.addEventListener("DOMContentLoaded", getStates);

// Event listeners
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#pwd").addEventListener("click", displayPwd);
document.querySelector("#signupForm").addEventListener("submit", validateForm);


// Get data from API
async function fetchData(url) {
    let response = await fetch(url);
    return await response.json();
}


// Load states in dropdown
async function getStates() {
    let stateMenu = document.querySelector("#state");

    try {
        let data = await fetchData(
            "https://csumb.space/api/allStatesAPI.php"
        );

        stateMenu.innerHTML = '<option value="">Select One</option>';

        for (let state of data) {
            let option = document.createElement("option");

            option.value = state.usps;
            option.textContent = state.state;

            stateMenu.appendChild(option);
        }

    } catch (error) {
        stateMenu.innerHTML = '<option value="">Unable to load states</option>';
        console.error(error);
    }
}


// Display city, lat, long using ZIP code
async function displayCity() {
    let zipCode = document.querySelector("#zip").value;

    let city = document.querySelector("#city");
    let lat = document.querySelector("#lat");
    let long = document.querySelector("#long");
    let cityError = document.querySelector("#cityError");

    city.textContent = "";
    lat.textContent = "";
    long.textContent = "";
    cityError.textContent = "";

    if (zipCode.length !== 5 || !/^\d{5}$/.test(zipCode)) {
        cityError.textContent = "Enter a valid 5-digit ZIP code.";
        return;
    }

    try {
        let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
        let data = await fetchData(url);

        if (data === false) {
            cityError.textContent = "Zip code not found";
        } else {
            city.textContent = data.city;
            lat.textContent = data.latitude;
            long.textContent = data.longitude;
        }

    } catch (error) {
        cityError.textContent = "Unable to retrieve city";
        console.error(error);
    }
}


// Display counties based on selected state
async function displayCounties() {
    let state = document.querySelector("#state").value;
    let countyMenu = document.querySelector("#county");

    countyMenu.innerHTML = '<option value="">Loading counties...</option>';

    if (state === "") {
        countyMenu.innerHTML = '<option value="">Select a state first</option>';
        return;
    }

    try {
        let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
        let data = await fetchData(url);

        countyMenu.innerHTML = '<option value="">Select County</option>';

        for (let county of data) {
            let option = document.createElement("option");

            option.value = county.county;
            option.textContent = county.county;

            countyMenu.appendChild(option);
        }

    } catch (error) {
        countyMenu.innerHTML = '<option value="">Unable to load counties</option>';
        console.error(error);
    }
}


// Check username availability
// usernames already taken are: eeny, meeny, miny, maria, and john
async function checkUsername() {
    let username = document.querySelector("#username").value;
    let usernameError = document.querySelector("#usernameError");

    usernameError.textContent = "";

    if (username.trim().length === 0) {
        usernameError.textContent = "Username required";
        usernameError.className = "error";
        return false;
    }

    try {
        let url = `https://csumb.space/api/usernamesAPI.php?username=${encodeURIComponent(username)}`;
        let data = await fetchData(url);

        if (data.available) {
            usernameError.textContent = "Username Available";
            usernameError.className = "success";
            return true;
        } else {
            usernameError.textContent = "Username NOT Available";
            usernameError.className = "error";
            return false;
        }

    } catch (error) {
        usernameError.textContent = "Unable to check username";
        usernameError.className = "error";
        console.error(error);
        return false;
    }
}


// Display suggested passwords
async function displayPwd() {
    let suggestion = document.querySelector("#sPwd");

    try {
        let url = "https://csumb.space/api/suggestedPassword.php?length=8";
        let data = await fetchData(url);

        suggestion.textContent = "Suggested password: " + data.password;

    } catch (error) {
        suggestion.textContent = "Unable to generate password";
        console.error(error);
    }
}


// Validate before submitting
async function validateForm(event) {
    event.preventDefault();

    let errors = document.querySelector("#formErrors");
    let password = document.querySelector("#pwd").value;
    let passwordAgain = document.querySelector("#pwdAgain").value;

    errors.innerHTML = "";

    let isValid = true;

    // Check username
    let usernameValid = await checkUsername();

    if (!usernameValid) {
        errors.innerHTML += "Please enter an available username.<br>";
        isValid = false;
    }

    // Check pw length
    if (password.length < 6) {
        errors.innerHTML += "Password must have at least 6 characters.<br>";
        isValid = false;
    }

    // pw confirmation
    if (password !== passwordAgain) {
        errors.innerHTML += "Passwords do not match.<br>";
        isValid = false;
    }

    // Submit if all validatiosn pass
    if (isValid) {
        window.location.href = "welcome.html";
    }
}

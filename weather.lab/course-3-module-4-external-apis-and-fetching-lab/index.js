let BASE_URL = "https://api.weather.gov/alerts/active?area=";

// DOM elements
let stateInput;
let searchBtn;
let errorMessage;
let summaryMessage;
let headlinesList;
let loadingSpinner;

// loading state
function setLoading(isLoading) {
    if (searchBtn) searchBtn.disabled = isLoading;

    if (loadingSpinner) {
        if (isLoading) {
            loadingSpinner.classList.remove("hidden");
        } else {
            loadingSpinner.classList.add("hidden");
        }
    }
}

// fetch alerts
async function fetchWeatherAlerts(state) {

    resetUI();
    setLoading(true);

    try {
        let response = await fetch(BASE_URL + state);

        if (!response.ok) {
            throw new Error("Failed to fetch alerts");
        }

        let data = await response.json();

        // clear error after success
        errorMessage.textContent = "";
        errorMessage.classList.add("hidden");

        displayAlerts(data);

    } catch (err) {
        handleError(err.message);
    } finally {
        setLoading(false);
    }
}

// display alerts
function displayAlerts(data) {
    let alerts = data.features || [];
    let count = alerts.length;

    // summary (IMPORTANT for tests)
    summaryMessage.textContent = data.title + ": " + count;

    // list
    if (count === 0) {
        let li = document.createElement("li");
        li.textContent = "No active alerts.";
        headlinesList.appendChild(li);
        return;
    }

    alerts.forEach(function(alert) {
        let li = document.createElement("li");
        li.textContent = alert.properties.headline;
        headlinesList.appendChild(li);
    });
}

// clear UI
function resetUI() {
    summaryMessage.textContent = "";
    headlinesList.innerHTML = "";
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
}

// show error
function handleError(message) {
    summaryMessage.textContent = "";
    headlinesList.innerHTML = "";

    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

// button click
function onSearch() {
    let state = stateInput.value.trim().toUpperCase();

    resetUI();

    if (state === "" || state.length !== 2) {
        handleError("Enter a valid state code");
        return;
    }

    fetchWeatherAlerts(state);

    // clear input
    stateInput.value = "";
}

// init
function init() {
    stateInput = document.getElementById("state-input");
    searchBtn = document.getElementById("fetch-alerts"); // ⚠️ FIXED ID
    errorMessage = document.getElementById("error-message");
    summaryMessage = document.getElementById("alerts-display"); // ⚠️ match your HTML
    headlinesList = document.createElement("ul"); // simple fallback
    summaryMessage.appendChild(headlinesList);

    loadingSpinner = document.getElementById("loading-spinner");

    searchBtn.addEventListener("click", onSearch);
}

// run
document.addEventListener("DOMContentLoaded", init);
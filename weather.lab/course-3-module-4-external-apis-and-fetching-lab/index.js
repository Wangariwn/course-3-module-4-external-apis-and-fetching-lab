// index.js
let BASE_URL = "https://api.weather.gov/alerts/active?area=";

// Your code here!

// DOM elements (initialized on DOMContentLoaded)
let stateInput;
let searchBtn;
let errorMessage;
let summaryMessage;
let headlinesList;
let loadingSpinner;

let currentAbortController = null;

function setLoading(isLoading) {
    if (searchBtn) searchBtn.disabled = isLoading;
    if (loadingSpinner) {
        loadingSpinner.classList.toggle("hidden", !isLoading);
    }
}

// STEP 1: Fetch Alerts
async function fetchWeatherAlerts(state) {
    // Inline the URL to avoid any scoping surprises in test runners.
    const url = `https://api.weather.gov/alerts/active?area=${state}`;

    // STEP 3: Clear and Reset UI before a new fetch
    resetUI();

    setLoading(true);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const status = typeof response.status === "number" ? ` (status ${response.status})` : "";
            throw new Error(`Could not fetch weather data for that state.${status}`);
        }

        const data = await response.json();

        // Ensure any previous errors are cleared after success.
        if (errorMessage) {
            errorMessage.textContent = "";
            errorMessage.classList.add("hidden");
        }

        // STEP 2: Display the Alerts
        displayAlerts(data, state);
    } catch (errorObject) {
        // STEP 4: Implement Error Handling
        handleError(errorObject?.message ?? "Something went wrong.");
    } finally {
        setLoading(false);
    }
}

// STEP 2: Display alerts on the page
function displayAlerts(data, state) {
    const alerts = Array.isArray(data?.features) ? data.features : [];
    const count = alerts.length;

    // Show summary message
    // Lab expectation: "<title>: <count>"
    const title = typeof data?.title === "string" ? data.title : "Weather Alerts";
    if (summaryMessage) summaryMessage.textContent = `${title}: ${count}`;

    // Show list of headlines
    if (count === 0) {
        const li = document.createElement('li');
        li.textContent = "No active alerts.";
        headlinesList.appendChild(li);
        return;
    }

    alerts.forEach(alert => {
        const li = document.createElement('li');
        li.textContent = alert?.properties?.headline ?? "Alert";
        headlinesList.appendChild(li);
    });
}

// STEP 3: Clear and Reset the UI
function resetUI() {
    if (summaryMessage) summaryMessage.textContent = "";
    if (headlinesList) headlinesList.innerHTML = "";
    if (errorMessage) {
        errorMessage.textContent = "";
        errorMessage.classList.add("hidden");
    }
}

// STEP 4: Handle Errors
function handleError(message) {
    if (!errorMessage) return;
    // Clear any previously rendered results so the error is noticeable.
    if (summaryMessage) summaryMessage.textContent = "";
    if (headlinesList) headlinesList.innerHTML = "";

    const text =
        typeof message === "string"
            ? message
            : message && typeof message.message === "string"
                ? message.message
                : "Something went wrong.";

    errorMessage.textContent = text;
    errorMessage.classList.remove("hidden");
}

function onSearch() {
    if (!stateInput) return;
    const stateAbbr = stateInput.value.toUpperCase().trim();
    // Clear input on click/Enter (regardless of success/failure).
    stateInput.value = "";
    // Tests (and the API) accept any 2-letter area code, even if invalid;
    // the fetch failure path is still part of the expected behavior.
    if (/^[A-Z]{2}$/.test(stateAbbr)) {
        fetchWeatherAlerts(stateAbbr);
    } else {
        handleError("Please enter a valid two-letter U.S. state abbreviation (example: CA).");
    }
}

// Event listener to trigger the app
function init() {
    stateInput = document.getElementById('state-input');
    searchBtn = document.getElementById('search-btn');
    errorMessage = document.getElementById('error-message');
    summaryMessage = document.getElementById('summary-message');
    headlinesList = document.getElementById('headlines-list');
    loadingSpinner = document.getElementById('loading-spinner');

    if (searchBtn) searchBtn.addEventListener('click', onSearch);
    if (stateInput) {
        stateInput.addEventListener('keydown', (e) => {
            if (e.key === "Enter") onSearch();
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

// Your code here!

// DOM elements (initialized on DOMContentLoaded)
let stateInput;
let searchBtn;
let errorMessage;
let summaryMessage;
let headlinesList;

const STATE_NAMES = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
};

// STEP 1: Fetch Alerts
async function fetchWeatherAlerts(state) {
    const url = `${weatherApi}${state}`;
    
    // STEP 3: Clear and Reset UI before a new fetch
    resetUI();

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
        handleError(errorObject.message);
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
    if (stateInput) stateInput.value = "";
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
    const stateAbbr = stateInput.value.toUpperCase().trim();
    // Clear input on click/Enter (regardless of success/failure).
    stateInput.value = "";
    if (/^[A-Z]{2}$/.test(stateAbbr)) {
        fetchWeatherAlerts(stateAbbr);
    } else {
        handleError("Please enter a valid two-letter state abbreviation.");
    }
}

// Event listener to trigger the app
function init() {
    stateInput = document.getElementById('state-input');
    searchBtn = document.getElementById('search-btn');
    errorMessage = document.getElementById('error-message');
    summaryMessage = document.getElementById('summary-message');
    headlinesList = document.getElementById('headlines-list');

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
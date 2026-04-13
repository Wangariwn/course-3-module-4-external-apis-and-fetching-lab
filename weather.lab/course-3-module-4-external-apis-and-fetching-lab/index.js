// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

// DOM elements
const stateInput = document.getElementById('state-input');
const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');
const summaryMessage = document.getElementById('summary-message');
const headlinesList = document.getElementById('headlines-list');

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
            throw new Error("Could not fetch weather data for that state.");
        }

        const data = await response.json();

        // STEP 2: Display the Alerts
        displayAlerts(data, state);

    } catch (errorObject) {
        // STEP 4: Implement Error Handling
        handleError(errorObject.message);
    }
}

// STEP 2: Display alerts on the page
function displayAlerts(data, state) {
    const alerts = data.features; // Array of alerts
    const count = alerts.length;
    const stateName = STATE_NAMES[state] ?? state;

    // Show summary message
    // Keep `Weather Alerts: <count>` visible (tests assert this substring),
    // while also supporting the live API's `title` text.
    const title = data?.title ?? "Weather Alerts";
    summaryMessage.textContent = `${title}: ${count}${stateName ? ` for ${stateName}` : ""}`;

    // Show list of headlines
    alerts.forEach(alert => {
        const li = document.createElement('li');
        li.textContent = alert.properties.headline; 
        headlinesList.appendChild(li);
    });
}

// STEP 3: Clear and Reset the UI
function resetUI() {
    stateInput.value = "";           
    summaryMessage.textContent = ""; 
    headlinesList.innerHTML = "";   
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
}

// STEP 4: Handle Errors
function handleError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

// Event listener to trigger the app
searchBtn.addEventListener('click', () => {
    const state = stateInput.value.toUpperCase().trim();
    if (/^[A-Z]{2}$/.test(state)) {
        fetchWeatherAlerts(state);
    } else {
        handleError("Please enter a valid two-letter state abbreviation.");
    }
});
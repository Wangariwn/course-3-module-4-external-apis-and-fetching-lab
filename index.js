// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

// DOM elements
const stateInput = document.getElementById('state-input');
const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');
const summaryMessage = document.getElementById('summary-message');
const headlinesList = document.getElementById('headlines-list');

// STEP 1: Fetch Alerts
async function fetchWeatherAlerts(state) {
    const url = `https://api.weather.gov/alerts/active?area=${state}`;
    
    // STEP 3: Clear and Reset UI before a new fetch
    resetUI();

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Could not fetch weather data for that state.");
        }

        const data = await response.json();
        console.log(data); 

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

    // Show summary message
    summaryMessage.textContent = `Current watches, warnings, and advisories for ${state}: ${count}`;

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
    errorMessage.style.display = "none"; // Hide error message
    errorMessage.textContent = "";
}

// STEP 4: Handle Errors
function handleError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    console.log(message); 
}

// Event listener to trigger the app
searchBtn.addEventListener('click', () => {
    const state = stateInput.value.toUpperCase().trim();
    if (state) {
        fetchWeatherAlerts(state);
    } else {
        handleError("Please enter a state abbreviation.");
    }
});
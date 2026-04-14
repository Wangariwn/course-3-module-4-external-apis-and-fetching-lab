// index.js
let BASE_URL = "https://api.weather.gov/alerts/active?area="

// Your code here!

// DOM elements
let input = document.getElementById("state-input");
let button = document.getElementById("fetch-alerts");
let results = document.getElementById("alerts-display");
let errorDiv = document.getElementById("error-message");


//  Clear and Reset the UI
function clearUI() {        
    results.innerHTML = "";   
    errorDiv.textContent = "";
    errorDiv.classList.add("hidden");
}


//  Fetch Alerts
async function fetchWeatherAlerts(state) {
    let response = await fetch(BASE_URL + state);

    if (!response.ok)  {
        throw new Error ("Error occurred");
    }

    let data = await response.json();
    return data;
}
    


//  Display alerts on the page
function displayAlerts(data) {
    let count = data.features.length;

    // Show summary message
    let summary = document.createElement("h2");
    summary.textContent = `${data.title}: ${count}`;
    results.appendChild(summary);


    // Show list of headlines
    let list = document.createElement("ul");

    data.features.forEach(function(alert) {

        let item = document.createElement('li');
        item.textContent = alert.properties.headline; 
        list.appendChild(item);
    });
    results.appendChild(list);
}


//  Handle Errors
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
}


// Event listener to trigger the app
button.addEventListener("click", async function () {
    let state = input.value.toUpperCase().trim();
    
    clearUI()

    //input validation
    if (state === "" || state.length !== 2) {
        showError("Please enter a state abbreviation");
        return;
    } 

    try{
        let data = await fetchWeatherAlerts(state);
        displayAlerts(data);

        input.value = ""; // clear input
    }catch (err) {
        showError(err.message);
    }
});
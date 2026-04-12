// Initialize the history log as an empty array
let calculationHistory = [];

/**
 * Main function to perform calculations
 * @param {number} num1 - First value
 * @param {number} num2 - Second value
 * @param {string} operator - The math operation (+, -, *, /)
 */
function calculate(num1, num2, operator) {
    let result;
    let operationName;

    switch (operator) {
        case '+':
            result = num1 + num2;
            operationName = "Addition";
            break;
        case '-':
            result = num1 - num2;
            operationName = "Subtraction";
            break;
        case '*':
            result = num1 * num2;
            operationName = "Multiplication";
            break;
        case '/':
            // Check for division by zero
            if (num2 === 0) {
                return "Error: Cannot divide by zero.";
            }
            result = num1 / num2;
            operationName = "Division";
            break;
        default:
            return "Invalid Operator";
    }

    // Compose the string for the history log
    const entry = `${operationName}: ${num1} ${operator} ${num2} = ${result}`;
    
    // Store the entry in our history array
    calculationHistory.push(entry);

    return result;
}

/**
 * Function to display all past calculations
 */
function showHistory() {
    console.log("\n--- Calculation History ---");
    if (calculationHistory.length === 0) {
        console.log("No calculations performed yet.");
    } else {
        calculationHistory.forEach((item, index) => {
            console.log(`${index + 1}. ${item}`);
        });
    }
}

// --- EXAMPLE USAGE ---

console.log("Result 1:", calculate(10, 5, '+'));  // 15
console.log("Result 2:", calculate(20, 4, '/'));  // 5
console.log("Result 3:", calculate(7, 3, '*'));   // 21

// Display the log
showHistory();
// Select elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');

// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let resetScreen = false;

// Initialize the calculator
function initialize() {
    updateDisplay();
    setupEventListeners();
}

// Update the display
function updateDisplay() {
    currentOperandElement.textContent = currentOperand;
    
    if (operation != null) {
        previousOperandElement.textContent = `${previousOperand} ${getOperationSymbol(operation)}`;
    } else {
        previousOperandElement.textContent = previousOperand;
    }
}

// Get operation symbol
function getOperationSymbol(op) {
    switch(op) {
        case 'add': return '+';
        case 'subtract': return '-';
        case 'multiply': return '×';
        case 'divide': return '÷';
        default: return '';
    }
}

// Append number to the current operand
function appendNumber(number) {
    if (currentOperand === '0' || resetScreen) {
        currentOperand = number;
        resetScreen = false;
    } else {
        currentOperand += number;
    }
    updateDisplay();
}

// Handle decimal point
function appendDecimal() {
    if (resetScreen) {
        currentOperand = '0.';
        resetScreen = false;
        updateDisplay();
        return;
    }
    if (currentOperand.includes('.')) return;
    currentOperand += '.';
    updateDisplay();
}

// Choose operation
function chooseOperation(op) {
    if (currentOperand === '0') return;
    
    if (previousOperand !== '') {
        compute();
    }
    
    operation = op;
    previousOperand = currentOperand;
    resetScreen = true;
    updateDisplay();
}

// Compute the result
function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case 'add':
            computation = prev + current;
            break;
        case 'subtract':
            computation = prev - current;
            break;
        case 'multiply':
            computation = prev * current;
            break;
        case 'divide':
            if (current === 0) {
                alert("Cannot divide by zero!");
                clear();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

// Clear the calculator
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

// Delete the last digit
function deleteDigit() {
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

// Setup event listeners
function setupEventListeners() {
    // Number buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.id === 'decimal') {
                appendDecimal();
            } else {
                appendNumber(button.textContent);
            }
        });
    });
    
    // Operator buttons
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.id);
        });
    });
    
    // Equals button
    equalsButton.addEventListener('click', () => {
        compute();
    });
    
    // Clear button
    clearButton.addEventListener('click', () => {
        clear();
    });
    
    // Delete button
    deleteButton.addEventListener('click', () => {
        deleteDigit();
    });
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);
}

// Handle keyboard input
function handleKeyboard(e) {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    }
    if (e.key === '.') {
        appendDecimal();
    }
    if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault();
        compute();
    }
    if (e.key === 'Backspace') {
        deleteDigit();
    }
    if (e.key === 'Escape') {
        clear();
    }
    if (e.key === '+') {
        chooseOperation('add');
    }
    if (e.key === '-') {
        chooseOperation('subtract');
    }
    if (e.key === '*') {
        chooseOperation('multiply');
    }
    if (e.key === '/') {
        e.preventDefault();
        chooseOperation('divide');
    }
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', initialize);
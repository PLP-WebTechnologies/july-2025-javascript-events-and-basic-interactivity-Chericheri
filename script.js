/**
 * ==============================================
 * MAIN APPLICATION SCRIPT
 * ==============================================
 * 
 * This script handles all interactive functionality including:
 * - Theme toggling
 * - Event handling demos
 * - Interactive components (counter, accordion)
 * - Comprehensive form validation
 */

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Toggle ARIA expanded state for accessibility
 * @param {HTMLElement} element - The element to toggle
 */
function toggleAriaExpanded(element) {
    const isExpanded = element.getAttribute('aria-expanded') === 'true';
    element.setAttribute('aria-expanded', !isExpanded);
}

// ==============================================
// THEME TOGGLE FUNCTIONALITY
// ==============================================

const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or use preferred color scheme
const savedTheme = localStorage.getItem('theme') || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Apply the saved theme
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update the theme and save preference
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update the icon
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Announce theme change for screen readers
    const announcement = newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled';
    liveAnnounce(announcement);
});

// ==============================================
// PART 1: EVENT HANDLING DEMOS
// ==============================================

/**
 * Click Event Demo
 */
const clickDemo = document.getElementById('clickDemo');
const clickCounter = document.getElementById('clickCounter');
let clickCount = 0;

clickDemo.addEventListener('click', () => {
    clickCount++;
    clickCounter.textContent = `Clicked ${clickCount} times`;
    
    // Add visual feedback
    clickDemo.style.transform = 'scale(0.95)';
    setTimeout(() => {
        clickDemo.style.transform = 'scale(1)';
    }, 100);
});

/**
 * Mouse Event Demo
 */
const mouseBox = document.getElementById('mouseBox');
const mousePosition = document.getElementById('mousePosition');

mouseBox.addEventListener('mouseenter', () => {
    mouseBox.textContent = 'Mouse is inside!';
    mouseBox.style.backgroundColor = 'var(--accent-color)';
});

mouseBox.addEventListener('mouseleave', () => {
    mouseBox.textContent = 'Hover over me';
    mouseBox.style.backgroundColor = 'var(--primary-color)';
});

mouseBox.addEventListener('mousemove', debounce((e) => {
    const rect = mouseBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosition.textContent = `Position: (${Math.floor(x)}, ${Math.floor(y)})`;
}, 50));

/**
 * Keyboard Event Demo
 */
const keyboardInput = document.getElementById('keyboardInput');
const keyboardOutput = document.getElementById('keyboardOutput');

keyboardInput.addEventListener('keydown', (e) => {
    keyboardOutput.textContent = `Last key pressed: ${e.key} (Code: ${e.code})`;
});

// ==============================================
// PART 2: INTERACTIVE COMPONENTS
// ==============================================

/**
 * Counter Component
 */
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');
const resetCounter = document.getElementById('resetCounter');
const counterValue = document.getElementById('counterValue');
let count = 0;

// Update counter display
function updateCounter() {
    counterValue.textContent = count;
    counterValue.style.color = count > 0 ? 'var(--success-color)' : 
                              count < 0 ? 'var(--error-color)' : 'inherit';
}

// Event listeners for counter buttons
incrementBtn.addEventListener('click', () => {
    count++;
    updateCounter();
});

decrementBtn.addEventListener('click', () => {
    count--;
    updateCounter();
});

resetCounter.addEventListener('click', () => {
    count = 0;
    updateCounter();
});

/**
 * FAQ Accordion Component
 */
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    
    // Set initial ARIA attributes for accessibility
    header.setAttribute('aria-expanded', 'false');
    header.setAttribute('aria-controls', content.id || `accordion-content-${Math.random().toString(36).substr(2, 9)}`);
    content.id = header.getAttribute('aria-controls');
    
    header.addEventListener('click', () => {
        // Toggle active class on the item
        item.classList.toggle('active');
        
        // Toggle ARIA expanded state
        toggleAriaExpanded(header);
        
        // Close other accordion items (optional)
        // accordionItems.forEach(otherItem => {
        //     if (otherItem !== item) {
        //         otherItem.classList.remove('active');
        //         otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        //     }
        // });
    });
});

// ==============================================
// PART 3: FORM VALIDATION
// ==============================================

const registrationForm = document.getElementById('registrationForm');
const formSuccess = document.getElementById('formSuccess');
const resetFormBtn = document.getElementById('resetForm');

// Form fields
const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

// Error elements
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

// Password requirement elements
const reqLength = document.getElementById('reqLength');
const reqUpper = document.getElementById('reqUpper');
const reqNumber = document.getElementById('reqNumber');
const reqSpecial = document.getElementById('reqSpecial');

/**
 * Validate full name
 * @returns {boolean} True if valid
 */
function validateName() {
    const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+){1,2}$/;
    if (!fullName.value.trim()) {
        nameError.textContent = 'Name is required';
        return false;
    } else if (!nameRegex.test(fullName.value)) {
        nameError.textContent = 'Please enter a valid full name';
        return false;
    } else {
        nameError.textContent = '';
        return true;
    }
}

/**
 * Validate email address
 * @returns {boolean} True if valid
 */
function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        emailError.textContent = 'Email is required';
        return false;
    } else if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Please enter a valid email address';
        return false;
    } else {
        emailError.textContent = '';
        return true;
    }
}

/**
 * Validate password and update requirement indicators
 * @returns {boolean} True if valid
 */
function validatePassword() {
    const hasLength = password.value.length >= 8;
    const hasUpper = /[A-Z]/.test(password.value);
    const hasNumber = /\d/.test(password.value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password.value);
    
    // Update requirement indicators
    reqLength.classList.toggle('valid', hasLength);
    reqUpper.classList.toggle('valid', hasUpper);
    reqNumber.classList.toggle('valid', hasNumber);
    reqSpecial.classList.toggle('valid', hasSpecial);
    
    if (!password.value) {
        passwordError.textContent = 'Password is required';
        return false;
    } else if (!(hasLength && hasUpper && hasNumber && hasSpecial)) {
        passwordError.textContent = 'Password does not meet requirements';
        return false;
    } else {
        passwordError.textContent = '';
        return true;
    }
}

/**
 * Validate password confirmation
 * @returns {boolean} True if valid
 */
function validateConfirmPassword() {
    if (!confirmPassword.value) {
        confirmPasswordError.textContent = 'Please confirm your password';
        return false;
    } else if (confirmPassword.value !== password.value) {
        confirmPasswordError.textContent = 'Passwords do not match';
        return false;
    } else {
        confirmPasswordError.textContent = '';
        return true;
    }
}

// Real-time validation for form fields
fullName.addEventListener('input', debounce(validateName, 300));
email.addEventListener('input', debounce(validateEmail, 300));
password.addEventListener('input', debounce(validatePassword, 300));
confirmPassword.addEventListener('input', debounce(validateConfirmPassword, 300));

// Form submission handler
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    
    if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid) {
        // Form is valid - show success message
        registrationForm.classList.add('hidden');
        formSuccess.classList.remove('hidden');
        
        // In a real app, you would submit the form data here
        console.log('Form submitted successfully', {
            name: fullName.value,
            email: email.value,
            password: password.value
        });
    } else {
        // Focus on the first invalid field
        if (!isNameValid) fullName.focus();
        else if (!isEmailValid) email.focus();
        else if (!isPasswordValid) password.focus();
        else if (!isConfirmValid) confirmPassword.focus();
    }
});

// Reset form handler
resetFormBtn.addEventListener('click', () => {
    registrationForm.reset();
    registrationForm.classList.remove('hidden');
    formSuccess.classList.add('hidden');
    
    // Clear all errors
    nameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
    
    // Reset password requirements
    [reqLength, reqUpper, reqNumber, reqSpecial].forEach(el => {
        el.classList.remove('valid');
    });
});

// ==============================================
// ACCESSIBILITY UTILITIES
// ==============================================

/**
 * Live announcement for screen readers
 * @param {string} message - The message to announce
 */
function liveAnnounce(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    // Remove after a short delay
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// Initialize components on load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial counter state
    updateCounter();
    
    // Initialize form validation
    validatePassword();
});
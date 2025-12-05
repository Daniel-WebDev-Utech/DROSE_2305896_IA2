/* Student: Daniel Rose - 2305896 | Module: CIT2011 */
/* Student: Shavon Mitchener - 2300712 */

/* ============================================
   IA#2 - HELPER FUNCTIONS
   ============================================ */

/* Helper: Validate email format */
function isValidEmail(email) {
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

/* Helper: Show error message */
function showError(inputId, message) {
    var input = document.getElementById(inputId);
    if (!input) return;
    
    input.classList.add('input-error');
    
    var errorSpan = document.getElementById(inputId + '-error');
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }
}

/* Helper: Clear all error messages */
function clearErrors(form) {
    if (!form) return;
    
    var errors = form.querySelectorAll('.error-message');
    for (var i = 0; i < errors.length; i++) {
        errors[i].textContent = '';
        errors[i].style.display = 'none';
    }
    
    var inputs = form.querySelectorAll('.input-error');
    for (var j = 0; j < inputs.length; j++) {
        inputs[j].classList.remove('input-error');
    }
}

/* ============================================
   IA#2 - SHOPPING CART DATA
   ============================================ */

var cart = [];
var cartInitialized = false;

/* Load cart from localStorage */
function loadCart() {
    var savedCart = localStorage.getItem('studyStayCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        for (var i = 0; i < cart.length; i++) {
            cart[i].price = Number(cart[i].price);
        }
    }
    console.log('Cart loaded:', cart.length, 'items');
}

/* Save cart to localStorage */
function saveCart() {
    localStorage.setItem('studyStayCart', JSON.stringify(cart));
}

/* ============================================
   IA#2 - INITIALIZATION
   ============================================ */

function initializeApplication() {
    console.log('Initializing application...');
    
    loadCart();
    initFormValidation();
    initCart();
    initCheckout();
    initCheckoutForm();
    updateCartCount();
    updateCartDisplay();
    
    // Initialize invoice system if available
    if (typeof initInvoiceSystem === 'function') {
        setTimeout(initInvoiceSystem, 300);
    }
    
    // Initialize user tracking for invoices
    initUserTracking();
}

// Event listener for DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    setTimeout(initializeApplication, 100);
}

/* ============================================
   IA#2 (b) - FORM VALIDATION
   ============================================ */

function initFormValidation() {
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        setupLoginValidation(loginForm);
    }
    
    if (registerForm) {
        setupRegisterValidation(registerForm);
    }
}

/* Login Form Validation */
function setupLoginValidation(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        
        clearErrors(form);
        var isValid = true;
        
        if (username === '') {
            showError('username', 'Username is required');
            isValid = false;
        }
        
        if (password === '') {
            showError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        if (isValid) {
            alert('Login successful! Welcome back.');
            
            // Save user email for invoices
            if (username.includes('@')) {
                localStorage.setItem('currentUserEmail', username);
            }
            
            form.reset();
            window.location.href = 'index.html';
        }
    });
}

/* Registration Form Validation */
function setupRegisterValidation(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var firstName = document.getElementById('firstName').value;
        var lastName = document.getElementById('lastName').value;
        var email = document.getElementById('email').value;
        var dob = document.getElementById('dob').value;
        var gender = document.getElementById('gender').value;
        var ageGroup = document.getElementById('ageGroup').value;
        var username = document.getElementById('regUsername').value;
        var password = document.getElementById('regPassword').value;
        var confirmPassword = document.getElementById('confirmPassword').value;
        
        clearErrors(form);
        var isValid = true;
        
        if (firstName === '') {
            showError('firstName', 'First name is required');
            isValid = false;
        }
        
        if (lastName === '') {
            showError('lastName', 'Last name is required');
            isValid = false;
        }
        
        if (email === '') {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email');
            isValid = false;
        }
        
        if (dob === '') {
            showError('dob', 'Date of birth is required');
            isValid = false;
        }
        
        if (gender === '') {
            showError('gender', 'Please select your gender');
            isValid = false;
        }
        
        if (ageGroup === '') {
            showError('ageGroup', 'Please select your age group');
            isValid = false;
        }
        
        if (username === '') {
            showError('regUsername', 'Username is required');
            isValid = false;
        } else if (username.length < 3) {
            showError('regUsername', 'Username must be at least 3 characters');
            isValid = false;
        }
        
        if (password === '') {
            showError('regPassword', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('regPassword', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        if (confirmPassword !== password) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        if (isValid) {
            alert('Registration successful! Welcome to StudyStay.');
            
            // Save user info for invoices and dashboard
            var userData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                dob: dob,
                gender: gender,
                ageGroup: ageGroup,
                username: username,
                registeredDate: new Date().toISOString()
            };
            
            // Save to localStorage for dashboard analytics
            var users = [];
            var savedUsers = localStorage.getItem('studystayUsers');
            if (savedUsers) {
                users = JSON.parse(savedUsers);
            }
            users.push(userData);
            localStorage.setItem('studystayUsers', JSON.stringify(users));
            
            // Save current user
            localStorage.setItem('registeredUserEmail', email);
            localStorage.setItem('currentUserEmail', email);
            
            form.reset();
            window.location.href = 'index.html';
        }
    });
}

/* ============================================
   IA#2 (d) - SHOPPING CART (FIXED WITH EVENT DELEGATION)
   ============================================ */

function initCart() {
    console.log('Cart system initialized');
}

// GLOBAL EVENT DELEGATION FOR CART ACTIONS
document.addEventListener('click', function(event) {
    // Handle "Add to Cart" buttons
    var addButton = event.target.closest('.add-to-cart-btn');
    if (addButton && !addButton.disabled) {
        event.preventDefault();
        
        // Temporarily disable button to prevent double clicks
        addButton.disabled = true;
        
        var id = addButton.getAttribute('data-id');
        var name = addButton.getAttribute('data-name');
        var price = addButton.getAttribute('data-price');
        
        console.log('Adding to cart:', name, '(ID:', id, ')');
        
        // Find item in cart
        var found = false;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id === id) {
                cart[i].quantity += 1;
                found = true;
                break;
            }
        }
        
        // Add new item if not found
        if (!found) {
            cart.push({
                id: id,
                name: name,
                price: Number(price),
                quantity: 1
            });
        }
        
        // Save and update
        saveCart();
        updateCartCount();
        
        // Visual feedback
        var originalText = addButton.textContent;
        var originalBg = addButton.style.backgroundColor;
        
        addButton.textContent = '✓ Added!';
        addButton.style.backgroundColor = '#27ae60';
        
        // Re-enable button after delay
        setTimeout(function() {
            addButton.textContent = originalText;
            addButton.style.backgroundColor = originalBg;
            addButton.disabled = false;
        }, 800);
        
        return;
    }
    
    // Handle "Remove" buttons in cart
    if (event.target.classList.contains('remove-btn')) {
        var button = event.target;
        var itemId = button.getAttribute('data-id');
        
        if (itemId) {
            removeFromCart(itemId);
        }
        return;
    }
});

/* Remove item from cart */
function removeFromCart(id) {
    var newCart = [];
    
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id !== id) {
            newCart.push(cart[i]);
        }
    }
    
    cart = newCart;
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

/* Update cart count in navbar */
function updateCartCount() {
    var cartCountElements = document.querySelectorAll('#cart-count');
    
    if (cartCountElements.length > 0) {
        var total = 0;
        for (var i = 0; i < cart.length; i++) {
            total = total + cart[i].quantity;
        }
        
        cartCountElements.forEach(function(element) {
            element.textContent = total;
        });
    }
}

/* Update cart display on cart page */
function updateCartDisplay() {
    var cartContainer = document.getElementById('cartItems');
    var subtotalElement = document.getElementById('subtotal');
    var taxElement = document.getElementById('tax');
    var totalElement = document.getElementById('total');
    
    if (!cartContainer) {
        return;
    }
    
    // ARITHMETIC: Calculate subtotal
    var subtotal = 0;
    for (var i = 0; i < cart.length; i++) {
        var itemPrice = Number(cart[i].price);
        var itemQty = cart[i].quantity;
        subtotal = subtotal + (itemPrice * itemQty);
    }
    
    // ARITHMETIC: Calculate tax (GCT 15%)
    var tax = subtotal * 0.15;
    
    // ARITHMETIC: Calculate total
    var total = subtotal + tax;
    
    // DOM MANIPULATION: Update summary display
    if (subtotalElement) {
        subtotalElement.textContent = '$' + subtotal.toFixed(2);
    }
    if (taxElement) {
        taxElement.textContent = '$' + tax.toFixed(2);
    }
    if (totalElement) {
        totalElement.textContent = '$' + total.toFixed(2);
    }
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        return;
    }
    
    // Build cart items HTML
    var html = '';
    
    for (var j = 0; j < cart.length; j++) {
        var item = cart[j];
        var price = Number(item.price);
        var itemTotal = price * item.quantity;
        
        html = html + '<div class="cart-item">';
        html = html + '<div class="item-details">';
        html = html + '<p class="item-name">' + item.name + '</p>';
        html = html + '<p class="item-price">$' + price.toFixed(2) + ' x ' + item.quantity + '</p>';
        html = html + '</div>';
        html = html + '<p class="item-total">$' + itemTotal.toFixed(2) + '</p>';
        html = html + '<button class="remove-btn" data-id="' + item.id + '">Remove</button>';
        html = html + '</div>';
    }
    
    cartContainer.innerHTML = html;
}

/* ============================================
   CHECKOUT FUNCTIONS
   ============================================ */

function initCheckout() {
    var checkoutBtn = document.getElementById('checkoutBtn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            checkout();
        });
    }
}

/* Checkout function - redirect to checkout page */
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    window.location.href = 'checkout.html';
}

/* ============================================
   CHECKOUT PAGE FUNCTIONS
   ============================================ */

function initCheckoutForm() {
    var checkoutForm = document.getElementById('checkoutForm');
    var cancelBtn = document.getElementById('cancelCheckout');
    
    if (checkoutForm) {
        // Load checkout items when page loads
        if (window.location.pathname.includes('checkout.html')) {
            displayCheckoutItems();
        }
        
        // Set up cancel button
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                window.location.href = 'cart.html';
            });
        }
        
        // Set up form submission
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // DOM: Get form values
            var firstName = document.getElementById('shippingFirstName').value;
            var lastName = document.getElementById('shippingLastName').value;
            var address = document.getElementById('shippingAddress').value;
            var city = document.getElementById('shippingCity').value;
            var parish = document.getElementById('shippingParish').value;
            
            var form = e.target;
            clearErrors(form);
            var isValid = true;
            
            // VALIDATION: First name
            if (firstName === '') {
                showError('shippingFirstName', 'First name is required');
                isValid = false;
            }
            
            // VALIDATION: Last name
            if (lastName === '') {
                showError('shippingLastName', 'Last name is required');
                isValid = false;
            }
            
            // VALIDATION: Address
            if (address === '') {
                showError('shippingAddress', 'Address is required');
                isValid = false;
            }
            
            // VALIDATION: City
            if (city === '') {
                showError('shippingCity', 'City is required');
                isValid = false;
            }
            
            // VALIDATION: Parish
            if (parish === '') {
                showError('shippingParish', 'Please select a parish');
                isValid = false;
            }
            
            // If valid, complete booking
            if (isValid) {
                // Use invoice system if available
                if (typeof processCheckoutWithInvoice === 'function') {
                    var shippingInfo = {
                        firstName: firstName,
                        lastName: lastName,
                        address: address,
                        city: city,
                        parish: parish
                    };
                    
                    var success = processCheckoutWithInvoice(shippingInfo);
                    
                    if (success) {
                        alert('Thank you for your order!\n\nInvoice has been generated.\nCheck the console for details.');
                        window.location.href = 'index.html';
                    }
                } else {
                    // Fallback to basic checkout
                    var subtotal = 0;
                    for (var i = 0; i < cart.length; i++) {
                        subtotal = subtotal + (Number(cart[i].price) * cart[i].quantity);
                    }
                    var tax = subtotal * 0.15;
                    var total = subtotal + tax;
                    
                    alert('Thank you for your order, ' + firstName + ' ' + lastName + '! Total: $' + total.toFixed(2));
                    
                    // Clear cart
                    cart = [];
                    saveCart();
                    updateCartCount();
                    
                    window.location.href = 'index.html';
                }
            }
        });
    }
}

/* Display items on checkout page */
function displayCheckoutItems() {
    var checkoutSummary = document.getElementById('checkoutSummary');
    var paymentAmount = document.getElementById('paymentAmount');
    
    if (!checkoutSummary) return;
    
    if (cart.length === 0) {
        checkoutSummary.innerHTML = '<div class="empty-cart-message"><p>Your cart is empty.</p><p><a href="cart.html" class="btn">Go to Cart</a></p></div>';
        if (paymentAmount) {
            paymentAmount.value = '0.00';
        }
        return;
    }
    
    // ARITHMETIC: Calculate subtotal
    var subtotal = 0;
    for (var i = 0; i < cart.length; i++) {
        var itemPrice = Number(cart[i].price);
        var itemQty = cart[i].quantity;
        subtotal = subtotal + (itemPrice * itemQty);
    }
    
    // ARITHMETIC: Calculate tax (GCT 15%)
    var tax = subtotal * 0.15;
    
    // ARITHMETIC: Calculate total
    var total = subtotal + tax;
    
    // DOM MANIPULATION: Update payment amount field
    if (paymentAmount) {
        paymentAmount.value = total.toFixed(2);
    }
    
    // Build checkout summary HTML
    var html = '';
    
    for (var j = 0; j < cart.length; j++) {
        var item = cart[j];
        var price = Number(item.price);
        var itemTotal = price * item.quantity;
        
        html = html + '<div class="summary-row">';
        html = html + '<span>' + item.name + ' x ' + item.quantity + '</span>';
        html = html + '<span>$' + itemTotal.toFixed(2) + '</span>';
        html = html + '</div>';
    }
    
    html = html + '<div class="summary-row">';
    html = html + '<span>Subtotal:</span>';
    html = html + '<span>$' + subtotal.toFixed(2) + '</span>';
    html = html + '</div>';
    
    html = html + '<div class="summary-row">';
    html = html + '<span>Tax (GCT 15%):</span>';
    html = html + '<span>$' + tax.toFixed(2) + '</span>';
    html = html + '</div>';
    
    html = html + '<div class="summary-row total">';
    html = html + '<span>Total:</span>';
    html = html + '<span>$' + total.toFixed(2) + '</span>';
    html = html + '</div>';
    
    checkoutSummary.innerHTML = html;
}

/* ============================================
   INVOICE USER TRACKING
   ============================================ */

function initUserTracking() {
    console.log('Initializing user tracking...');
}

/* ============================================
   UTILITY FUNCTIONS FOR INVOICE SYSTEM
   ============================================ */

// Make functions available globally
window.displayCheckoutItems = displayCheckoutItems;
window.updateCartDisplay = updateCartDisplay;
window.updateCartCount = updateCartCount;
window.cart = cart;
window.saveCart = saveCart;

console.log('Script.js loaded successfully');

/* Student: Daniel Rose - 2305896 | Module: CIT2011 */

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
    
    var existingError = document.getElementById(inputId + '-error');
    
    if (existingError) {
        existingError.textContent = message;
    } else {
        var error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = message;
        input.parentNode.appendChild(error);
    }
}

/* Helper: Clear all error messages */
function clearErrors(form) {
    var errors = form.querySelectorAll('.error-message');
    for (var i = 0; i < errors.length; i++) {
        errors[i].textContent = '';
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

/* Load cart from localStorage */
function loadCart() {
    var savedCart = localStorage.getItem('studyStayCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        for (var i = 0; i < cart.length; i++) {
            cart[i].price = Number(cart[i].price);
        }
    }
}

/* Save cart to localStorage */
function saveCart() {
    localStorage.setItem('studyStayCart', JSON.stringify(cart));
}

/* ============================================
   IA#2 - INITIALIZATION
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    initFormValidation();
    initCart();
    initCheckout();
    initCheckoutForm();
    updateCartCount();
    updateCartDisplay();
    displayCheckoutItems();
});

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
            form.reset();
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
            form.reset();
        }
    });
}

/* ============================================
   IA#2 (d) - SHOPPING CART
   ============================================ */

function initCart() {
    var addButtons = document.querySelectorAll('.add-to-cart-btn');
    
    for (var i = 0; i < addButtons.length; i++) {
        addButtons[i].addEventListener('click', function() {
            var id = this.getAttribute('data-id');
            var name = this.getAttribute('data-name');
            var price = this.getAttribute('data-price');
            
            addToCart(id, name, price);
        });
    }
}

/* Add item to cart */
function addToCart(id, name, price) {
    var found = false;
    
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity = cart[i].quantity + 1;
            found = true;
            break;
        }
    }
    
    if (found === false) {
        cart.push({
            id: id,
            name: name,
            price: Number(price),
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    alert(name + ' added to cart!');
}

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
    var cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        var total = 0;
        for (var i = 0; i < cart.length; i++) {
            total = total + cart[i].quantity;
        }
        cartCountElement.textContent = total;
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
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
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
        html = html + '<button class="remove-btn" onclick="removeFromCart(\'' + item.id + '\')">Remove</button>';
        html = html + '</div>';
    }
    
    cartContainer.innerHTML = html;
}

/* Checkout buttons */
function initCheckout() {
    var checkoutBtn = document.getElementById('checkoutBtn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
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
   IA#2 - CHECKOUT PAGE FUNCTIONS
   ============================================ */

/* Display items on checkout page */
function displayCheckoutItems() {
    var checkoutSummary = document.getElementById('checkoutSummary');
    var paymentAmount = document.getElementById('paymentAmount');
    
    if (!checkoutSummary) {
        return;
    }
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    // ARITHMETIC: Calculate subtotal
    var subtotal = 0;
    for (var i = 0; i < cart.length; i++) {
        subtotal = subtotal + (Number(cart[i].price) * cart[i].quantity);
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

/* Initialize checkout form validation */
function initCheckoutForm() {
    var checkoutForm = document.getElementById('checkoutForm');
    var cancelBtn = document.getElementById('cancelCheckout');
    
    if (!checkoutForm) {
        return;
    }
    
    // Cancel button - go back to cart
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // DOM: Get form values
        var firstName = document.getElementById('shippingFirstName').value;
        var lastName = document.getElementById('shippingLastName').value;
        var address = document.getElementById('shippingAddress').value;
        var city = document.getElementById('shippingCity').value;
        var parish = document.getElementById('shippingParish').value;
        
        clearErrors(checkoutForm);
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
            // ARITHMETIC: Calculate total for confirmation
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
            
            // Redirect to home page
            window.location.href = 'index.html';
        }
    });
}
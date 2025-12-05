/* Student: Daniel Rose - 2305896 | Module: CIT2011 */
/* Student: Shavon Mitchener - 2300712 */
/* INVOICE SYSTEM - Group Assignment */

/* ============================================
   INVOICE SYSTEM CONSTANTS AND CORE FUNCTIONS
   ============================================ */

// Storage key for invoices
const INVOICES_STORAGE_KEY = 'studyStayInvoices';

// Generate unique invoice ID
function generateInvoiceId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `INV-${timestamp}-${random}`;
}

// Get current user email
function getCurrentUserEmail() {
    return localStorage.getItem('currentUserEmail') || 
           localStorage.getItem('registeredUserEmail') || 
           'guest@example.com';
}

// Get user's first name (from checkout or registration)
function getUserFirstName() {
    const checkoutFirstName = document.getElementById('shippingFirstName')?.value;
    const regFirstName = document.getElementById('firstName')?.value;
    return checkoutFirstName || regFirstName || 'Customer';
}

// Get user's last name (from checkout or registration)
function getUserLastName() {
    const checkoutLastName = document.getElementById('shippingLastName')?.value;
    const regLastName = document.getElementById('lastName')?.value;
    return checkoutLastName || regLastName || '';
}

/* ============================================
   INVOICE CREATION AND STORAGE
   ============================================ */

// Generate a complete invoice object
function generateInvoice(cartItems, shippingInfo, totalAmount) {
    const subtotal = cartItems.reduce((sum, item) => 
        sum + (Number(item.price) * item.quantity), 0);
    const tax = subtotal * 0.15;
    
    return {
        invoiceId: generateInvoiceId(),
        date: new Date().toISOString(),
        user: {
            firstName: getUserFirstName(),
            lastName: getUserLastName(),
            email: getCurrentUserEmail()
        },
        shipping: {
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            address: shippingInfo.address,
            city: shippingInfo.city,
            parish: shippingInfo.parish
        },
        items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
            itemTotal: Number(item.price) * item.quantity
        })),
        subtotal: subtotal,
        tax: tax,
        total: totalAmount,
        status: 'paid',
        receiptSent: true
    };
}

// Save invoice to localStorage
function saveInvoice(invoice) {
    try {
        // Get existing invoices
        const existingInvoices = JSON.parse(
            localStorage.getItem(INVOICES_STORAGE_KEY) || '[]'
        );
        
        // Add new invoice
        existingInvoices.push(invoice);
        
        // Save back to localStorage
        localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(existingInvoices));
        
        console.log('Invoice saved successfully:', invoice.invoiceId);
        return true;
    } catch (error) {
        console.error('Error saving invoice:', error);
        return false;
    }
}

// Get all invoices from localStorage
function getAllInvoices() {
    try {
        return JSON.parse(localStorage.getItem(INVOICES_STORAGE_KEY) || '[]');
    } catch (error) {
        console.error('Error loading invoices:', error);
        return [];
    }
}

// Get invoices for a specific user
function getUserInvoices(email) {
    const allInvoices = getAllInvoices();
    if (!email) email = getCurrentUserEmail();
    
    return allInvoices.filter(invoice => 
        invoice.user.email.toLowerCase() === email.toLowerCase()
    );
}

/* ============================================
   INVOICE DISPLAY FUNCTIONS
   ============================================ */

// Display invoice details in console
function showInvoiceInConsole(invoice) {
    console.log('='.repeat(40));
    console.log('INVOICE DETAILS');
    console.log('='.repeat(40));
    console.log(`Invoice ID: ${invoice.invoiceId}`);
    console.log(`Date: ${new Date(invoice.date).toLocaleString()}`);
    console.log(`Customer: ${invoice.user.firstName} ${invoice.user.lastName}`);
    console.log(`Email: ${invoice.user.email}`);
    console.log('-'.repeat(40));
    console.log('SHIPPING INFORMATION:');
    console.log(`Address: ${invoice.shipping.address}`);
    console.log(`City: ${invoice.shipping.city}, Parish: ${invoice.shipping.parish}`);
    console.log('-'.repeat(40));
    console.log('ORDER ITEMS:');
    
    invoice.items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name}`);
        console.log(`   Quantity: ${item.quantity} x $${item.price.toFixed(2)}`);
        console.log(`   Subtotal: $${item.itemTotal.toFixed(2)}`);
    });
    
    console.log('-'.repeat(40));
    console.log('ORDER SUMMARY:');
    console.log(`Subtotal: $${invoice.subtotal.toFixed(2)}`);
    console.log(`Tax (15% GCT): $${invoice.tax.toFixed(2)}`);
    console.log(`Total: $${invoice.total.toFixed(2)}`);
    console.log(`Status: ${invoice.status.toUpperCase()}`);
    console.log(`Receipt Sent: ${invoice.receiptSent ? 'YES' : 'NO'}`);
    console.log('='.repeat(40));
}

// Display all invoices in console
function showAllInvoices() {
    const invoices = getAllInvoices();
    
    console.log('='.repeat(50));
    console.log(`TOTAL INVOICES IN SYSTEM: ${invoices.length}`);
    console.log('='.repeat(50));
    
    if (invoices.length === 0) {
        console.log('No invoices found in the system.');
        return;
    }
    
    invoices.forEach((invoice, index) => {
        console.log(`\nINVOICE ${index + 1} of ${invoices.length}`);
        showInvoiceInConsole(invoice);
    });
}

// Display user's invoices in console
function showUserInvoices() {
    const userEmail = getCurrentUserEmail();
    const userInvoices = getUserInvoices(userEmail);
    
    console.log('='.repeat(50));
    console.log(`INVOICES FOR: ${userEmail}`);
    console.log(`FOUND: ${userInvoices.length} invoice(s)`);
    console.log('='.repeat(50));
    
    if (userInvoices.length === 0) {
        console.log('No invoices found for this user.');
        return;
    }
    
    userInvoices.forEach((invoice, index) => {
        console.log(`\nYOUR INVOICE ${index + 1} of ${userInvoices.length}`);
        showInvoiceInConsole(invoice);
    });
}

// Display receipt message on page
function displayReceiptMessage(invoice) {
    const receiptContainer = document.getElementById('invoiceReceipt');
    
    if (!receiptContainer) {
        console.warn('Receipt container not found');
        return;
    }
    
    const receiptHTML = `
        <div class="receipt-message">
            <div class="receipt-content">
                <h3>✅ Order Confirmed!</h3>
                <p><strong>Thank you for your purchase, ${invoice.user.firstName}!</strong></p>
                <p>A receipt has been sent to: <strong>${invoice.user.email}</strong></p>
                <div class="receipt-details">
                    <p><strong>Invoice #:</strong> ${invoice.invoiceId}</p>
                    <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
                    <p><strong>Total Amount:</strong> $${invoice.total.toFixed(2)}</p>
                </div>
                <p><small>Please check your email for the complete invoice details.</small></p>
            </div>
        </div>
    `;
    
    receiptContainer.innerHTML = receiptHTML;
    receiptContainer.style.display = 'block';
    
    // Scroll to receipt
    setTimeout(() => {
        receiptContainer.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

/* ============================================
   CHECKOUT INTEGRATION
   ============================================ */

// Process checkout and generate invoice
function processCheckoutWithInvoice(shippingInfo) {
    // Get cart from global variable (from script.js)
    if (typeof cart === 'undefined' || cart.length === 0) {
        alert('Your cart is empty!');
        return false;
    }
    
    // Calculate total
    const subtotal = cart.reduce((sum, item) => 
        sum + (Number(item.price) * item.quantity), 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;
    
    // Generate invoice
    const invoice = generateInvoice(cart, shippingInfo, total);
    
    // Save invoice to localStorage
    const saved = saveInvoice(invoice);
    
    if (saved) {
        // Display invoice in console (REQUIRED)
        showInvoiceInConsole(invoice);
        
        // Display receipt message on page (OPTIONAL)
        displayReceiptMessage(invoice);
        
        // Clear the cart
        if (typeof saveCart === 'function') {
            cart = [];
            saveCart();
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
        }
        
        return true;
    }
    
    return false;
}

/* ============================================
   INITIALIZATION
   ============================================ */

// Initialize invoice system
function initInvoiceSystem() {
    console.log('Initializing invoice system...');
    
    // Override checkout form submission to include invoice generation
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get shipping info
            const shippingInfo = {
                firstName: document.getElementById('shippingFirstName').value,
                lastName: document.getElementById('shippingLastName').value,
                address: document.getElementById('shippingAddress').value,
                city: document.getElementById('shippingCity').value,
                parish: document.getElementById('shippingParish').value
            };
            
            // Process checkout with invoice
            const success = processCheckoutWithInvoice(shippingInfo);
            
            if (success) {
                // Show success message
                alert(`Thank you for your order!\n\nInvoice has been generated and saved.\nCheck the console for details.`);
                
                // Redirect to home after delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            }
        });
    }
}

// Make functions available globally
window.generateInvoiceId = generateInvoiceId;
window.getAllInvoices = getAllInvoices;
window.getUserInvoices = getUserInvoices;
window.showInvoiceInConsole = showInvoiceInConsole;
window.showAllInvoices = showAllInvoices;
window.showUserInvoices = showUserInvoices;
window.processCheckoutWithInvoice = processCheckoutWithInvoice;
window.initInvoiceSystem = initInvoiceSystem;

console.log('Invoice system loaded successfully');

/* Student: Daniel Rose - 2305896 | Module: CIT2011 */
/* Student: Shavon Mitchener - 2300712 */
/* INVOICES DISPLAY SYSTEM - Group Assignment*/

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Function to get current user with multiple fallbacks
function getCurrentUser() {
    // First check if user is logged in (from sessionStorage)
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        try {
            const user = JSON.parse(loggedInUser);
            if (user && (user.email || user.trn)) {
                return user;
            }
        } catch (e) {
            console.error('Error parsing loggedInUser:', e);
        }
    }
    
    // Fall back to localStorage values
    const email = localStorage.getItem('currentUserEmail') || 
                  localStorage.getItem('registeredUserEmail');
    
    if (email) {
        return { email: email };
    }
    
    return null;
}

// Function to display invoice details
function displayInvoiceDetails(invoice) {
    return `
        <div class="invoice-details">
            <div class="invoice-section">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> ${invoice.user.firstName} ${invoice.user.lastName}</p>
                <p><strong>Email:</strong> ${invoice.user.email}</p>
                ${invoice.user.trn ? `<p><strong>TRN:</strong> ${invoice.user.trn}</p>` : ''}
            </div>
            
            <div class="invoice-section">
                <h3>Shipping Information</h3>
                <p><strong>Address:</strong> ${invoice.shipping.address}</p>
                <p><strong>City:</strong> ${invoice.shipping.city}</p>
                <p><strong>Parish:</strong> ${invoice.shipping.parish}</p>
            </div>
            
            <div class="invoice-section">
                <h3>Invoice Details</h3>
                <p><strong>Date:</strong> ${formatDate(invoice.date)}</p>
                <p><strong>Status:</strong> <span class="invoice-status status-paid">${invoice.status.toUpperCase()}</span></p>
            </div>
        </div>
        
        <div class="invoice-items">
            <h3>Order Items</h3>
            <table class="invoice-items-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${formatCurrency(item.price)}</td>
                            <td>${item.quantity}</td>
                            <td>${formatCurrency(item.itemTotal)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="invoice-totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>${formatCurrency(invoice.subtotal)}</span>
            </div>
            <div class="total-row">
                <span>Tax (15% GCT):</span>
                <span>${formatCurrency(invoice.tax)}</span>
            </div>
            <div class="total-row">
                <span><strong>Total:</strong></span>
                <span><strong>${formatCurrency(invoice.total)}</strong></span>
            </div>
        </div>
    `;
}

// Function to load and display invoices
function loadAndDisplayInvoices() {
    console.log('Loading and displaying invoices...');
    
    const invoicesList = document.getElementById('invoicesList');
    const noInvoicesMessage = document.getElementById('noInvoicesMessage');
    
    if (!invoicesList) {
        console.error('invoicesList element not found');
        return;
    }
    
    // Show loading message
    invoicesList.innerHTML = '<div class="loading-message"><p>Loading your invoices...</p></div>';
    
    // Get current user
    const currentUser = getCurrentUser();
    
    console.log('Current user:', currentUser);
    
    if (!currentUser) {
        invoicesList.innerHTML = `
            <div class="error-message">
                <h3>Please Login</h3>
                <p>You need to be logged in to view your invoices.</p>
                <a href="login.html" class="btn btn-primary">Login Now</a>
            </div>
        `;
        return;
    }
    
    // Get user's invoices
    const userInvoices = getUserInvoices(currentUser);
    
    console.log('Found invoices:', userInvoices.length);
    
    if (userInvoices.length === 0) {
        invoicesList.style.display = 'none';
        if (noInvoicesMessage) {
            noInvoicesMessage.style.display = 'block';
        }
        return;
    }
    
    // Make sure both elements are visible
    invoicesList.style.display = 'block';
    if (noInvoicesMessage) {
        noInvoicesMessage.style.display = 'none';
    }
    
    // Sort invoices by date (newest first)
    userInvoices.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Display invoices
    let html = '';
    
    userInvoices.forEach((invoice, index) => {
        html += `
            <div class="invoice-container">
                <div class="invoice-header">
                    <div class="invoice-title-row">
                        <h2>Invoice #${invoice.invoiceId}</h2>
                        <span class="invoice-date">${formatDate(invoice.date)}</span>
                    </div>
                </div>
                
                ${displayInvoiceDetails(invoice)}
                
                <div class="invoice-actions">
                    <button class="btn btn-secondary print-invoice-btn" 
                            data-invoice-id="${invoice.invoiceId}">
                        🖨️ Print Invoice
                    </button>
                </div>
            </div>
        `;
    });
    
    invoicesList.innerHTML = html;
    
    // Add event listeners to print buttons
    document.querySelectorAll('.print-invoice-btn').forEach(button => {
        button.addEventListener('click', function() {
            const invoiceId = this.getAttribute('data-invoice-id');
            printInvoice(invoiceId);
        });
    });
}

// Function to print an invoice
function printInvoice(invoiceId) {
    const allInvoices = getAllInvoices();
    const invoice = allInvoices.find(inv => inv.invoiceId === invoiceId);
    
    if (!invoice) {
        alert('Invoice not found!');
        return;
    }
    
    // Open print window
    const printWindow = window.open('', '_blank');
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice ${invoice.invoiceId} - StudyStay</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .invoice-header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
                .invoice-title { font-size: 24px; font-weight: bold; }
                .invoice-details { margin-bottom: 30px; }
                .invoice-section { margin-bottom: 15px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #f5f5f5; }
                .total-row { font-weight: bold; }
                .footer { margin-top: 50px; color: #666; font-size: 12px; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <h1 class="invoice-title">StudyStay Housing</h1>
                <p>Premium Student Accommodation</p>
                <h2>INVOICE: ${invoice.invoiceId}</h2>
                <p>Date: ${formatDate(invoice.date)}</p>
            </div>
            
            <div class="invoice-details">
                <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                    <div>
                        <h3>Bill To:</h3>
                        <p>${invoice.user.firstName} ${invoice.user.lastName}</p>
                        <p>${invoice.user.email}</p>
                        ${invoice.user.trn ? `<p>TRN: ${invoice.user.trn}</p>` : ''}
                    </div>
                    <div>
                        <h3>Ship To:</h3>
                        <p>${invoice.shipping.address}</p>
                        <p>${invoice.shipping.city}, ${invoice.shipping.parish}</p>
                    </div>
                </div>
            </div>
            
            <h3>Order Details:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${formatCurrency(item.price)}</td>
                            <td>${item.quantity}</td>
                            <td>${formatCurrency(item.itemTotal)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div style="text-align: right; margin-top: 30px;">
                <p><strong>Subtotal:</strong> ${formatCurrency(invoice.subtotal)}</p>
                <p><strong>Tax (15% GCT):</strong> ${formatCurrency(invoice.tax)}</p>
                <h3><strong>Total:</strong> ${formatCurrency(invoice.total)}</h3>
            </div>
            
            <div class="footer">
                <p>Thank you for your business!</p>
                <p>StudyStay Housing | Kingston, Jamaica</p>
                <p>Email: support@studystay.com | Phone: (876) 123-4567</p>
                <p>Invoice Status: ${invoice.status.toUpperCase()}</p>
            </div>
            
            <div class="no-print" style="margin-top: 30px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #2c3e50; color: white; border: none; cursor: pointer;">
                    Print Invoice
                </button>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Auto-print after a short delay
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Function to initialize the invoices page
function initInvoicesPage() {
    console.log('Initializing invoices page...');
    
    // Load invoices on page load
    loadAndDisplayInvoices();
    
    // Add event listener to refresh button
    const refreshBtn = document.getElementById('refreshInvoices');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            console.log('Refresh button clicked');
            loadAndDisplayInvoices();
        });
    } else {
        console.error('Refresh button not found');
    }
    
    // Add event listener to filter dropdown
    const filterSelect = document.getElementById('filterStatus');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            console.log('Filter changed to:', this.value);
            loadAndDisplayInvoices();
        });
    } else {
        console.error('Filter select not found');
    }
}

// Make functions available globally
window.loadAndDisplayInvoices = loadAndDisplayInvoices;
window.printInvoice = printInvoice;
window.initInvoicesPage = initInvoicesPage;
window.getCurrentUser = getCurrentUser;

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInvoicesPage);
} else {
    setTimeout(initInvoicesPage, 100);
}

console.log('Invoices display system loaded successfully');

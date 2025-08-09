// Supabase Configuration
const supabaseUrl = 'https://rdxsvmugkubauutqlnig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkeHN2bXVna3ViYXV1dHFsbmlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjQ3OTMsImV4cCI6MjA3MDM0MDc5M30.Xw4aqJq_u9uXg7ruyi8YvWqPdnEuXrmiQ7flvnw0usE';

// Initialize Supabase client
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Global variables
let selectedQuantity = 0;
const ticketPrice = 300; // BsS per ticket
const totalTickets = 10000;
let soldTickets = 0;

// DOM Elements
const quantityButtons = document.querySelectorAll('.qty-btn');
const customQuantityInput = document.getElementById('custom-qty');
const totalAmountDisplay = document.getElementById('total-amount');
const buyButton = document.getElementById('buy-btn');
const paymentModal = document.getElementById('payment-modal');
const closeModalBtn = document.getElementById('close-modal');
const paymentForm = document.getElementById('payment-form');
const expandDetailsBtn = document.getElementById('expand-details');
const bankInfo = document.getElementById('bank-info');
const searchBtn = document.getElementById('search-btn');
const cedulaSearchInput = document.getElementById('cedula-search');
const searchResults = document.getElementById('search-results');
const progressFill = document.getElementById('progress-fill');
const progressPercentage = document.getElementById('progress-percentage');
const termsBtn = document.getElementById('terms-btn');
const termsModal = document.getElementById('terms-modal');
const closeTermsBtn = document.getElementById('close-terms');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateProgressBar();
});

// Initialize application
function initializeApp() {
    console.log('Initializing Raffle System...');
    updateTotalDisplay();
    loadSoldTicketsCount();
}

// Setup all event listeners
function setupEventListeners() {
    // Quantity button listeners
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quantity = parseInt(this.dataset.qty);
            selectQuantity(quantity);
        });
    });

    // Custom quantity input listener
    customQuantityInput.addEventListener('input', function() {
        const quantity = parseInt(this.value) || 0;
        selectQuantity(quantity);
        updateQuantityButtonsState();
    });

    // Buy button listener
    buyButton.addEventListener('click', openPaymentModal);

    // Modal close listeners
    closeModalBtn.addEventListener('click', closePaymentModal);
    closeTermsBtn.addEventListener('click', closeTermsModal);

    // Click outside modal to close
    paymentModal.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            closePaymentModal();
        }
    });

    termsModal.addEventListener('click', function(e) {
        if (e.target === termsModal) {
            closeTermsModal();
        }
    });

    // Payment form submission
    paymentForm.addEventListener('submit', handlePaymentSubmission);

    // Bank details expand/collapse
    expandDetailsBtn.addEventListener('click', toggleBankDetails);

    // Search functionality
    searchBtn.addEventListener('click', searchTicketsByCedula);
    cedulaSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchTicketsByCedula();
        }
    });

    // Terms and conditions
    if (termsBtn) {
        termsBtn.addEventListener('click', openTermsModal);
    }
}

// Select quantity function
function selectQuantity(quantity) {
    selectedQuantity = Math.max(0, Math.min(quantity, 100)); // Limit between 0 and 100
    updateTotalDisplay();
    updateQuantityButtonsState();
    updateBuyButtonState();
    
    // Update custom input if quantity was selected via buttons
    if (customQuantityInput.value != selectedQuantity) {
        customQuantityInput.value = selectedQuantity || '';
    }
}

// Update total display
function updateTotalDisplay() {
    const total = selectedQuantity * ticketPrice;
    totalAmountDisplay.textContent = `Total: ${total.toLocaleString()} BsS`;
}

// Update quantity buttons visual state
function updateQuantityButtonsState() {
    quantityButtons.forEach(button => {
        const buttonQty = parseInt(button.dataset.qty);
        if (buttonQty === selectedQuantity) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Update buy button state
function updateBuyButtonState() {
    buyButton.disabled = selectedQuantity <= 0;
}

// Open payment modal
function openPaymentModal() {
    if (selectedQuantity <= 0) return;
    paymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close payment modal
function closePaymentModal() {
    paymentModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    paymentForm.reset();
    bankInfo.classList.remove('active');
    expandDetailsBtn.textContent = 'Ver datos bancarios';
}

// Open terms modal
function openTermsModal() {
    termsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close terms modal
function closeTermsModal() {
    termsModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Toggle bank details
function toggleBankDetails() {
    bankInfo.classList.toggle('active');
    expandDetailsBtn.textContent = bankInfo.classList.contains('active') 
        ? 'Ocultar datos bancarios' 
        : 'Ver datos bancarios';
}

// Generate random ticket numbers
function generateRandomTickets(quantity) {
    const tickets = [];
    const usedNumbers = new Set();
    
    while (tickets.length < quantity) {
        const ticketNumber = Math.floor(Math.random() * totalTickets) + 1;
        const formattedNumber = ticketNumber.toString().padStart(4, '0');
        
        if (!usedNumbers.has(formattedNumber)) {
            usedNumbers.add(formattedNumber);
            tickets.push(formattedNumber);
        }
    }
    
    return tickets.sort();
}

// Handle payment form submission
async function handlePaymentSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(paymentForm);
    const buyerData = {
        nombre: formData.get('nombre').trim(),
        apellido: formData.get('apellido').trim(),
        cedula: formData.get('cedula').trim(),
        referencia: formData.get('referencia').trim(),
        telefono: formData.get('telefono').trim(),
        correo: formData.get('correo').trim(),
        tickets_asignados: generateRandomTickets(selectedQuantity),
        fecha_compra: new Date().toISOString()
    };

    // Validate required fields
    if (!buyerData.nombre || !buyerData.apellido || !buyerData.cedula || !buyerData.referencia) {
        showMessage('Por favor, complete todos los campos obligatorios.', 'error');
        return;
    }

    try {
        // Show loading state
        const submitBtn = paymentForm.querySelector('.confirm-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Procesando...';
        submitBtn.disabled = true;

        // Insert data into Supabase
        const { data, error } = await supabase
            .from('compradores')
            .insert([buyerData])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            
            // Handle specific errors
            if (error.code === '23505') { // Unique constraint violation
                if (error.message.includes('cedula')) {
                    showMessage('Esta cédula ya tiene tickets asignados.', 'error');
                } else if (error.message.includes('referencia')) {
                    showMessage('Este número de referencia ya fue utilizado.', 'error');
                } else {
                    showMessage('Ya existe un registro con estos datos.', 'error');
                }
            } else {
                showMessage('Error al procesar la compra. Intente nuevamente.', 'error');
            }
        } else {
            // Success
            showMessage(`¡Compra exitosa! Tickets asignados: ${buyerData.tickets_asignados.join(', ')}`, 'success');
            
            // Update progress
            soldTickets += selectedQuantity;
            updateProgressBar();
            
            // Reset form and close modal
            setTimeout(() => {
                closePaymentModal();
                resetSelection();
            }, 3000);
        }

        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

    } catch (error) {
        console.error('Unexpected error:', error);
        showMessage('Error inesperado. Verifique su conexión e intente nuevamente.', 'error');
        
        // Reset button state
        const submitBtn = paymentForm.querySelector('.confirm-btn');
        submitBtn.textContent = 'Confirmar Pago';
        submitBtn.disabled = false;
    }
}

// Search tickets by cedula
async function searchTicketsByCedula() {
    const cedula = cedulaSearchInput.value.trim();
    
    if (!cedula) {
        showSearchResults('Por favor, ingrese una cédula para buscar.', 'error');
        return;
    }

    try {
        // Show loading state
        searchBtn.textContent = 'Buscando...';
        searchBtn.disabled = true;
        showSearchResults('Buscando tickets...', 'info');

        const { data, error } = await supabase
            .from('compradores')
            .select('tickets_asignados, nombre, apellido')
            .eq('cedula', cedula);

        if (error) {
            console.error('Search error:', error);
            showSearchResults('Error al buscar tickets. Intente nuevamente.', 'error');
        } else if (data && data.length > 0) {
            const buyer = data[0];
            const ticketsText = buyer.tickets_asignados.join(', ');
            showSearchResults(
                `Tickets asignados a ${buyer.nombre} ${buyer.apellido}: ${ticketsText}`, 
                'success'
            );
        } else {
            showSearchResults('No se encontraron tickets para esta cédula.', 'info');
        }

    } catch (error) {
        console.error('Unexpected search error:', error);
        showSearchResults('Error inesperado al buscar. Intente nuevamente.', 'error');
    } finally {
        // Reset button state
        searchBtn.textContent = 'Buscar Ticket';
        searchBtn.disabled = false;
    }
}

// Show search results
function showSearchResults(message, type) {
    searchResults.innerHTML = `<p class="text-${type === 'error' ? 'error' : type === 'success' ? 'success' : 'accent'}">${message}</p>`;
    searchResults.classList.add('fade-in');
}

// Show general messages
function showMessage(message, type) {
    // Create or update message element in modal
    let messageEl = document.querySelector('.payment-message');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.className = 'payment-message';
        paymentForm.insertBefore(messageEl, paymentForm.firstChild);
    }
    
    messageEl.innerHTML = `<p class="text-${type === 'error' ? 'error' : 'success'}" style="padding: 10px; margin-bottom: 15px; border-radius: 6px; background-color: ${type === 'error' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)'};">${message}</p>`;
    messageEl.classList.add('fade-in');
    
    // Auto-remove success messages
    if (type === 'success') {
        setTimeout(() => {
            if (messageEl) {
                messageEl.remove();
            }
        }, 5000);
    }
}

// Load sold tickets count from Supabase
async function loadSoldTicketsCount() {
    try {
        const { data, error } = await supabase
            .from('compradores')
            .select('tickets_asignados');

        if (error) {
            console.error('Error loading sold tickets:', error);
        } else if (data) {
            soldTickets = data.reduce((total, buyer) => {
                return total + (buyer.tickets_asignados ? buyer.tickets_asignados.length : 0);
            }, 0);
            updateProgressBar();
        }
    } catch (error) {
        console.error('Unexpected error loading sold tickets:', error);
    }
}

// Update progress bar
function updateProgressBar() {
    const percentage = Math.min((soldTickets / totalTickets) * 100, 100);
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = `${percentage.toFixed(1)}%`;
    }
}

// Reset selection
function resetSelection() {
    selectedQuantity = 0;
    customQuantityInput.value = '';
    updateTotalDisplay();
    updateQuantityButtonsState();
    updateBuyButtonState();
}

// Utility function to format numbers
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Handle errors gracefully
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateRandomTickets,
        formatNumber,
        selectQuantity,
        updateProgressBar
    };
}

console.log('Raffle System Script Loaded Successfully');

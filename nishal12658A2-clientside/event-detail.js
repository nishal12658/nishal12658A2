// JavaScript for Event Detail Page
document.addEventListener('DOMContentLoaded', function() {
    const eventId = localStorage.getItem('selectedEventId');
    
    if (!eventId) {
        showError('No event selected. Please go back and select an event.');
        return;
    }

    loadEventDetails(eventId);
    
    // Setup registration button
    const registerBtn = document.getElementById('registerBtn');
    const modal = document.getElementById('registrationModal');
    const closeModal = document.getElementById('closeModal');
    const closeBtn = document.querySelector('.close');

    registerBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

async function loadEventDetails(eventId) {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('errorMessage');
    const eventDetailsElement = document.getElementById('eventDetails');

    try {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        eventDetailsElement.style.display = 'none';

        const response = await fetch(`/api/events/${eventId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Event not found');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const event = await response.json();
        
        loadingElement.style.display = 'none';
        displayEventDetails(event);
        
    } catch (error) {
        console.error('Error loading event details:', error);
        loadingElement.style.display = 'none';
        showError('Failed to load event details. Please try again later.');
    }
}

function displayEventDetails(event) {
    const eventDetailsElement = document.getElementById('eventDetails');
    
    // Format date and time
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Update event header
    document.getElementById('eventName').textContent = event.name;
    document.getElementById('eventDate').textContent = formattedDate;
    document.getElementById('eventLocation').textContent = event.location;
    document.getElementById('eventCategory').textContent = event.category;

    // Update event content
    document.getElementById('eventDescription').textContent = event.description || 'No description available.';
    document.getElementById('eventDateTime').textContent = `${formattedDate} at ${formattedTime}`;
    document.getElementById('eventFullLocation').textContent = event.location;
    document.getElementById('eventCategoryFull').textContent = event.category;

    // Update ticket information
    const ticketPriceElement = document.getElementById('ticketPrice');
    const ticketDescriptionElement = document.getElementById('ticketDescription');
    
    if (event.ticket_price && event.ticket_price > 0) {
        ticketPriceElement.textContent = `$${event.ticket_price}`;
        ticketDescriptionElement.textContent = 'Tickets available for purchase';
    } else {
        ticketPriceElement.textContent = 'FREE';
        ticketDescriptionElement.textContent = 'This is a free event - no ticket required';
    }

    // Update charity goal progress
    const goalAmount = event.goal_amount || 0;
    const raisedAmount = event.raised_amount || 0;
    const progressPercent = goalAmount > 0 ? Math.min((raisedAmount / goalAmount) * 100, 100) : 0;

    document.getElementById('goalAmount').textContent = goalAmount.toLocaleString();
    document.getElementById('raisedAmount').textContent = raisedAmount.toLocaleString();
    document.getElementById('progressPercent').textContent = `${Math.round(progressPercent)}%`;
    
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = `${progressPercent}%`;

    // Show the event details
    eventDetailsElement.style.display = 'block';
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
});

async function loadEvents() {
    const loadingElement = document.getElementById('loading');
    const eventListElement = document.getElementById('eventList');
    const errorElement = document.getElementById('errorMessage');

    try {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';

        const response = await fetch('/api/events');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const events = await response.json();
        
        loadingElement.style.display = 'none';
        
        if (events.length === 0) {
            eventListElement.innerHTML = '<p class="no-results">No events available at the moment.</p>';
            return;
        }

        displayEvents(events);
        
    } catch (error) {
        console.error('Error loading events:', error);
        loadingElement.style.display = 'none';
        errorElement.textContent = 'Failed to load events. Please try again later.';
        errorElement.style.display = 'block';
    }
}

function displayEvents(events) {
    const eventListElement = document.getElementById('eventList');
    
    const eventsHTML = events.map(event => {
        const eventDate = new Date(event.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="event-card" onclick="viewEventDetails(${event.id})">
                <h3>${event.name}</h3>
                <div class="event-meta">
                    <span class="event-date">${eventDate}</span>
                    <span class="event-location">${event.location}</span>
                    <span class="event-category">${event.category}</span>
                    <span class="event-status">${event.status}</span>
                </div>
                <div class="event-description">
                    ${event.description || 'Join us for this meaningful charity event.'}
                </div>
                <a href="#" class="event-link" onclick="event.preventDefault(); viewEventDetails(${event.id})">
                    View Details →
                </a>
            </div>
        `;
    }).join('');

    eventListElement.innerHTML = eventsHTML;
}

function viewEventDetails(eventId) {
    // Store event ID in localStorage for the detail page
    localStorage.setItem('selectedEventId', eventId);
    
    // Navigate to event detail page
    window.location.href = 'event-detail.html';
}
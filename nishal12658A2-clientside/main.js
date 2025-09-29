let allEvents = []; // Store all events for filtering

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

        allEvents = await response.json();
        
        loadingElement.style.display = 'none';
        
        if (allEvents.length === 0) {
            eventListElement.innerHTML = '<p class="no-results">No events available at the moment.</p>';
            return;
        }

        // Show all events by default
        filterEvents('all');
        
    } catch (error) {
        console.error('Error loading events:', error);
        loadingElement.style.display = 'none';
        errorElement.textContent = 'Failed to load events. Please try again later.';
        errorElement.style.display = 'block';
    }
}

async function filterEvents(filterType) {
    const loadingElement = document.getElementById('loading');
    const eventListElement = document.getElementById('eventList');
    const errorElement = document.getElementById('errorMessage');

    try {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';

        // Build API URL with status filter
        let apiUrl = '/api/events';
        if (filterType !== 'all') {
            apiUrl += `?status=${filterType}`;
        }

        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const filteredEvents = await response.json();
        
        loadingElement.style.display = 'none';
        
        // Update active filter button
        updateActiveFilter(filterType);
        
        // Display filtered events
        displayEvents(filteredEvents);
        
    } catch (error) {
        console.error('Error filtering events:', error);
        loadingElement.style.display = 'none';
        errorElement.textContent = 'Failed to load events. Please try again later.';
        errorElement.style.display = 'block';
    }
}

function updateActiveFilter(filterType) {
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    const buttonMap = {
        'all': 'allBtn',
        'upcoming': 'upcomingBtn',
        'past': 'pastBtn'
    };
    
    const activeButton = document.getElementById(buttonMap[filterType]);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function displayEvents(events) {
    const eventListElement = document.getElementById('eventList');
    
    if (events.length === 0) {
        eventListElement.innerHTML = '<p class="no-results">No events found for the selected filter.</p>';
        return;
    }
    
    const eventsHTML = events.map(event => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="event-card" onclick="viewEventDetails(${event.id})">
                <h3>${event.name}</h3>
                <div class="event-meta">
                    <span class="event-date">${formattedDate}</span>
                    <span class="event-location">${event.location}</span>
                    <span class="event-category">${event.category || 'General'}</span>
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
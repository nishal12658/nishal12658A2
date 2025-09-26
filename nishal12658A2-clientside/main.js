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

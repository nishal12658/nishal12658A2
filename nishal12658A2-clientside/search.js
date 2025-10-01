// JavaScript for Search Page
document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("searchForm");
  const clearFiltersBtn = document.getElementById("clearFilters");
  const loadingElement = document.getElementById("loading");
  const searchResultsElement = document.getElementById("searchResults");
  const errorElement = document.getElementById("errorMessage");
  const noResultsElement = document.getElementById("noResults");

  // Handle form submission
  searchForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    await performSearch();
  });

  // Handle clear filters button
  clearFiltersBtn.addEventListener("click", function () {
    clearFilters();
  });

  function clearFilters() {
    // Clear all form fields
    document.getElementById("eventDate").value = "";
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventCategory").value = "";

    // Clear results
    searchResultsElement.innerHTML = "";
    errorElement.style.display = "none";
    noResultsElement.style.display = "none";
  }

  async function performSearch() {
    const formData = new FormData(searchForm);
    const searchParams = new URLSearchParams();

    // Build search parameters
    for (let [key, value] of formData.entries()) {
      if (value.trim() !== "") {
        searchParams.append(key, value.trim());
      }
    }

    try {
      // Show loading
      loadingElement.style.display = "block";
      errorElement.style.display = "none";
      noResultsElement.style.display = "none";
      searchResultsElement.innerHTML = "";

      // Make API call
      const queryString = searchParams.toString();
      const url = queryString ? `/api/events?${queryString}` : "/api/events";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const events = await response.json();

      loadingElement.style.display = "none";

      if (events.length === 0) {
        noResultsElement.style.display = "block";
        return;
      }

      displaySearchResults(events);
    } catch (error) {
      console.error("Error searching events:", error);
      loadingElement.style.display = "none";
      errorElement.textContent =
        "Failed to search events. Please try again later.";
      errorElement.style.display = "block";
    }
  }

  function displaySearchResults(events) {
    const searchResultsElement = document.getElementById("searchResults");

    const eventsHTML = events
      .map((event) => {
        const eventDate = new Date(event.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return `
                <div class="event-card" onclick="viewEventDetails(${event.id})">
                    <h3>${event.name}</h3>
                    <div class="event-meta">
                        <span class="event-date">${eventDate}</span>
                        <span class="event-location">${event.location}</span>
                        <span class="event-category">${event.category}</span>
                    </div>
                    <div class="event-description">
                        ${
                          event.description ||
                          "Join us for this meaningful charity event."
                        }
                    </div>
                    <a href="#" class="event-link" onclick="event.preventDefault(); viewEventDetails(${
                      event.id
                    })">
                        View Details →
                    </a>
                </div>
            `;
      })
      .join("");

    searchResultsElement.innerHTML = eventsHTML;
  }

  fetchCategories();
});

async function fetchCategories() {
  try {
    const response = await fetch("/api/categories");
    const categories = await response.json();
    const categorySelect = document.getElementById("eventCategory");
    categorySelect.innerHTML = '<option value="">All Categories</option>';
    categories.forEach((cat) => {
      categorySelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
    });
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
}

// Global function for navigation (shared with main.js)
function viewEventDetails(eventId) {
  // Store event ID in localStorage for the detail page
  localStorage.setItem("selectedEventId", eventId);

  // Navigate to event detail page
  window.location.href = "event-detail.html";
}

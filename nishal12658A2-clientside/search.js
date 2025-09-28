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

 

  
});


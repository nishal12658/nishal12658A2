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



 

  
});


document.addEventListener("DOMContentLoaded", function () {
    var btnContainerDropdown = document.getElementById("btn_container");
    var btns = btnContainerDropdown ? btnContainerDropdown.getElementsByClassName("btn") : [];
    var searchBar = document.getElementById("search_bar_desktop"); // Correct searchBar declaration
    var activeCategory = "all"; // Track currently selected category

    // Read query from URL
    var urlParams = new URLSearchParams(window.location.search);
    var searchQuery = urlParams.get("search") || localStorage.getItem("searchQuery") || "";

    if (searchBar) {
        searchBar.value = searchQuery; // Restore search text
    }

    localStorage.setItem("searchQuery", searchQuery);

    // Handle filter buttons
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            var current = document.getElementsByClassName("active");
            if (current.length > 0) {
                current[0].classList.remove("active");
            }
            this.classList.add("active");

            // Set active category
            activeCategory = this.getAttribute("data-category");

            // Reapply filtering
            filterSelection();
        });
    }

    if (searchBar) {
        searchBar.addEventListener("keydown", function (event) {
            console.log("Key pressed:", event.key); // Debugging line
            if (event.key === "Enter") {
                console.log("Enter key pressed"); // Debugging line
                event.preventDefault(); // Prevent default action like form submission or page reload

                var query = searchBar.value.toLowerCase().trim();
                console.log("Search Query:", query); // Debugging line
                
                if (query) {
                    localStorage.setItem("searchQuery", query);
                    console.log("Search query saved to localStorage:", query); // Debugging line
    
                    // Redirect to store page with query in URL
                    window.location.href = "store.html?search=" + encodeURIComponent(query);
                }
    
                return false; // Ensure no further actions like form submission
            }
        });

        // Listen for search input
        searchBar.addEventListener("keyup", function () {
            localStorage.setItem("searchQuery", searchBar.value);
            filterSelection(); // Update results based on both category and search
        });
    }

    function filterSelection() {
        var items = document.getElementsByClassName("filterDiv");
        if (!items.length) return;

        var searchInput = (searchBar ? searchBar.value : "").toLowerCase().trim();

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var text = item.textContent.toLowerCase().trim();

            var matchesCategory = activeCategory === "all" || item.classList.contains(activeCategory);
            var matchesSearch = searchInput === "" || text.includes(searchInput);

            // Show item only if BOTH filters match
            item.style.display = matchesCategory && matchesSearch ? "block" : "none";
        }
    }

    if (searchQuery) {
        setTimeout(filterSelection, 100);
    }

    var btnContainer = document.getElementById("store_options_container");
    //var searchBar = document.getElementById("search_bar");
    var searchIcon = document.getElementById("search-icon");

    // Log these elements to check if they're correctly selected
    console.log("btnContainer:", btnContainer);
    console.log("searchBar:", searchBar);
    console.log("searchIcon:", searchIcon);

    if (!btnContainer || !searchBar || !searchIcon) {
        console.error("One or more elements not found!");
    }

    // Toggle the search bar and icon
    function toggleSearchIcon() {
        if (searchBar.classList.contains("show-search")) {
            searchIcon.innerHTML = "❌"; // Change to "X" when search bar is opened
        } else {
            searchIcon.innerHTML = "🔍"; // Return to magnifying glass when closed
        }
    }
    
    if (searchIcon && searchBar) {
        searchIcon.addEventListener("click", function () {
            searchBar.classList.toggle("show-search");
            toggleSearchIcon();
        });
    }

});
document.addEventListener("DOMContentLoaded", function () {
    var btnContainer = document.getElementById("btn_container");
    var btns = btnContainer ? btnContainer.getElementsByClassName("btn") : [];
    var searchBar = document.getElementById("search_bar");
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

    // Prevent Enter key from clearing results
    if (searchBar) {
        searchBar.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                var query = searchBar.value.toLowerCase().trim();
                if (query) {
                    localStorage.setItem("searchQuery", query);

                    // Redirect to store page with query in URL
                    window.location.href = "store.html?search=" + encodeURIComponent(query);
                }
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
});
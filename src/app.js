document.addEventListener('DOMContentLoaded', function () {
    // Fetch and insert header.html into the page
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            // Insert header content into the placeholder
            document.getElementById("header").innerHTML = data;

            // Now safely access the elements in the header
            const btnContainerDropdown = document.getElementById("btn_container");
            const btns = btnContainerDropdown ? btnContainerDropdown.getElementsByClassName("btn") : [];
            const searchBar = document.getElementById("search_bar_desktop");
            const searchIcon = document.getElementById("search-icon");
            const cartIcon = document.getElementById("cart-icon");
            const cartDropdown = document.getElementById("cart-dropdown");
            let cart = [];
            const cartItemsContainer = document.getElementById("cart-items");
            var activeCategory = "all"; // Track currently selected category

            // Retrieve cart from localStorage
            const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = savedCart;

            // Update the cart dropdown UI based on saved cart items
            updateCartDropdown();

            // Add to cart buttons
            const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const productName = this.getAttribute('data-product-name');
                    const productPrice = this.getAttribute('data-product-price');
                    
                    // Add item to cart
                    const item = { name: productName, price: productPrice };
                    cart.push(item);
                    
                    // Update the cart UI
                    updateCartDropdown();
                });
            });

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
                    if (event.key === "Enter") {
                        event.preventDefault(); // Prevent default action like form submission or page reload

                        var query = searchBar.value.toLowerCase().trim();
                        if (query) {
                            localStorage.setItem("searchQuery", query);
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

            // Cart functionality
            if (cartIcon && cartDropdown) {
                cartIcon.addEventListener("click", function (event) {
                    event.stopPropagation(); // Prevent click from closing immediately
                    cartDropdown.classList.toggle("show-cart");
                });

                // Close dropdown when clicking outside
                document.addEventListener("click", function (event) {
                    if (!cartIcon.contains(event.target) && !cartDropdown.contains(event.target)) {
                        cartDropdown.classList.remove("show-cart");
                    }
                });
            }

            function updateCartDropdown() {
                // Clear previous cart items
                cartItemsContainer.innerHTML = '';

                if (cart.length === 0) {
                    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
                } else {
                    cart.forEach((item, index) => {
                        const cartItemElement = document.createElement('div');
                        cartItemElement.classList.add('cart-item');
                        cartItemElement.innerHTML = `
                            <p>${item.name} - ${item.price}</p>
                            <button class="delete-button" data-index="${index}">Delete</button>
                        `;

                        cartItemsContainer.appendChild(cartItemElement);

                        // Add event listener to the delete button
                        const deleteButton = cartItemElement.querySelector('.delete-button');
                        deleteButton.addEventListener('click', function() {
                            deleteCartItem(index);
                        });
                    });
                }

                // Update the cart icon with the number of items
                const cartItemCount = cart.length;
                cartIcon.innerHTML = `🛒 (${cartItemCount})`;
                localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
            }

                function deleteCartItem(index) {
                    // Remove item from the cart array
                    cart.splice(index, 1);
                
                    // Update the cart dropdown
                    updateCartDropdown();
                }
        })
        
        .catch(error => console.error("Error loading header:", error));
});

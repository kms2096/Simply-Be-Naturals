document.addEventListener('DOMContentLoaded', function () {
    // Fetch and insert header.html into the page
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            // Insert header content into the placeholder
            document.getElementById("header").innerHTML = data;

            // Now safely access the elements in the header
            // Check if the btn_container exists before trying to access it
            const btnContainerDropdown = document.getElementById("btn_container");
            if (btnContainerDropdown) {
                const btns = btnContainerDropdown.getElementsByClassName("btn");
                // Now you can safely add event listeners or actions on the buttons
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

                // Add to cart buttons
                document.getElementById('tile_container').addEventListener('click', function (event) {
                    if (event.target.classList.contains('add-to-cart-btn')) {
                        const productName = event.target.getAttribute('data-product-name');
                        const productPrice = event.target.getAttribute('data-product-price');
                
                        const item = { name: productName, price: productPrice };
                        cart.push(item);
                
                        updateCartDropdown();
                    }
                });
            }
            
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


            // Retrieve search query from URL or localStorage
            var urlParams = new URLSearchParams(window.location.search);
            var searchQuery = urlParams.get("search") || localStorage.getItem("searchQuery") || "";

            const searchBar = document.getElementById("search_bar_desktop"); // Ensure searchBar is defined
            // Set the search bar value based on the search query
            if (searchBar) {
                searchBar.value = searchQuery;
            }

            // Save the search query to localStorage
            localStorage.setItem("searchQuery", searchQuery);

            // Handle filter buttons
            /*for (var i = 0; i < btns.length; i++) {
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
            }*/

            // Handle the Enter key press for search
            if (searchBar) {
                searchBar.addEventListener("keydown", function (event) {
                    if (event.key === "Enter") {
                        event.preventDefault(); // Prevent default action like form submission or page reload

                        var query = searchBar.value.toLowerCase().trim();
                        console.log('Search Query:', query);  // Debug: Log the query

                        if (query) {
                            localStorage.setItem("searchQuery", query);  // Store the query in localStorage
                            // Redirect to store page with query in URL
                            window.location.href = "store.html?search=" + encodeURIComponent(query);
                        }

                        return false; // Ensure no further actions like form submission
                    }
                });

                // Listen for search input and update localStorage
                searchBar.addEventListener("keyup", function () {
                    localStorage.setItem("searchQuery", searchBar.value);
                    filterSelection(); // Update results based on both category and search
                });
            }

            // Filter function to display matching items based on category and search query
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
                    item.style.display = matchesCategory && matchesSearch ? "flex" : "none";
                }
            }

            // Apply filter immediately on page load if there's a search query
            if (searchQuery) {
                setTimeout(filterSelection, 100);
            }

            // Toggle the search bar and icon
            function toggleSearchIcon() {
                if (searchBar.classList.contains("show-search")) {
                    searchIcon.innerHTML = "❌";
                } else {
                    searchIcon.innerHTML = "🔍";
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

            // Update the cart dropdown UI
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

            // Remove item from the cart array
            function deleteCartItem(index) {
                // Remove item from the cart array
                cart.splice(index, 1);
            
                // Update the cart dropdown
                updateCartDropdown();
            }
        })
        
        .catch(error => console.error("Error loading header:", error));
});

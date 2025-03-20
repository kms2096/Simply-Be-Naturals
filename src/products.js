// Product page
document.addEventListener("DOMContentLoaded", function () {
    // Function to get query parameter (e.g., ?id=lotion1)
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get product ID from URL
    const productId = getQueryParam("id");

    // Fetch product data
    fetch("./data/products.json")
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(item => item.id === productId);

            if (product) {
                document.getElementById("product_image").src = product.image;
                document.getElementById("product_name").textContent = product.name;
                document.getElementById("product_description").textContent = product.description;
                document.getElementById("product_price").textContent = product.price;

                document.title = product.name + " - Simply Be Naturals";
            } else {
                document.getElementById("product_container").innerHTML = "<p>Product not found.</p>";
                document.title = "Product Not Found - Simply Be Naturals";
            }
        })
        .catch(error => console.error("Error loading product data:", error));
});


// Store page
document.addEventListener("DOMContentLoaded", function () {
    fetch("./data/products.json")
        .then(response => response.json())
        .then(data => {
            const products = data.products;

            const container = document.getElementById('tile_container');
            container.innerHTML = '';

            products.forEach(product => {
                const productTile = document.createElement('div');
                productTile.classList.add('filterDiv', ...product.category);

                productTile.innerHTML = `
                    <a href="product.html?id=${product.id}">
                        <div class="store_image_container">
                            <img class="store-image" src="${product.image}" alt="${product.name}">
                        </div>
                    </a>
                    <div class="store_info">
                        <div class="data-product-name">${product.name}</div>
                        <div class="price_and_button">
                            <div class="data-product-price">${product.price}</div>
                            <button class="add-to-cart-btn" data-product-name="${product.name}" data-product-price="${product.price}">Add to Cart</button>
                        </div>
                    </div>
                `;
                container.appendChild(productTile);
            });
        })
        .catch(error => console.error("Error loading product data:", error));
});

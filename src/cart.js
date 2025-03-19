let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(productId, name, price) {
    let item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ id: productId, name, price, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    let cartContainer = document.getElementById("cart");
    cartContainer.innerHTML = "";
    cart.forEach(item => {
        cartContainer.innerHTML += `<div>${item.name} x ${item.quantity} - ${item.price}</div>`;
    });
}

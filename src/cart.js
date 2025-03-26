const SQUARE_APPLICATION_ID = "sandbox-sq0idb-2b8SdmkXATd2MopBMhmyzg";

async function redirectToSquareCheckout(cartItems) {
    try {
        const response = await fetch("https://your-server.com/create-checkout", { // Replace with your server URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cartItems })
        });

        const data = await response.json();

        if (data.checkout_url) {
            window.location.href = data.checkout_url; // Redirect user to Square's checkout page
        } else {
            console.error("Error creating Square checkout:", data);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

document.getElementById("checkout-button").addEventListener("click", async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const response = await fetch("http://localhost:3000/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart })
    });

    const data = await response.json();
    if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl; // Redirect to Square checkout
    } else {
        alert("Checkout failed!");
    }
});

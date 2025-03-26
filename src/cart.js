const SQUARE_APPLICATION_ID = "sandbox-sq0idb-2b8SdmkXATd2MopBMhmyzg";

document.getElementById("checkout-button").addEventListener("click", async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/create-checkout", { // Replace with your actual backend URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cart }) // Send the entire cart
        });

        const data = await response.json();
        if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl; // Redirect to Square checkout page
        } else {
            console.error("Error creating checkout:", data);
        }
    } catch (error) {
        console.error("Checkout error:", error);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Check if SqPaymentForm is loaded
    if (window.SqPaymentForm) {
        console.log("SqPaymentForm is loaded!");

        const paymentForm = new SqPaymentForm({
            applicationId: SQUARE_APPLICATION_ID, // Your Sandbox Application ID
            locationId: "LFQ5PA03FEVQ0", // Your Square location ID (can be found in your Square Dashboard)
            card: {
                elementId: "card-container", // The element where the payment form will render
                placeholder: "Card Number",
            },
            callback: {
                paymentFormLoaded: function () {
                    console.log("Payment form loaded!");
                },
                paymentVerificationError: function (errors) {
                    console.log(errors);
                },
                paymentMethodNonceReceived: function (nonce) {
                    processPayment(nonce); // Call your payment processing function here
                }
            }
        });

        // Add your form submit event listener here
        document.getElementById("payment-form").addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default form submission
            paymentForm.requestCardNonce(); // This will generate a nonce for the card
        });

    } else {
        console.error("SqPaymentForm is not loaded.");
    }
});

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // ELEMENTS
    // =========================

    const searchBtn = document.getElementById("searchBtn");
    const searchContainer = document.getElementById("searchContainer");
    const searchInput = document.getElementById("searchInput");

    const filterButtons = document.querySelectorAll(".filter-btn");
    const categoryCards = document.querySelectorAll(".category-card");
    const productGrid = document.getElementById("productGrid");
    const productCards = [...document.querySelectorAll(".product-card")];

    const cartBtn = document.getElementById("cartBtn");
    const cartSidebar = document.getElementById("cartSidebar");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");

    const cartItemsContainer = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    const newsletterForm = document.getElementById("newsletterForm");

    const checkoutBtn = document.querySelector(".checkout-btn");


    // =========================
    // CART
    // =========================

    let cart = [];

    let currentCategory = "all";
    let currentSearch = "";
    let currentSort = "default";


    // =========================
    // SEARCH BAR
    // =========================

    searchBtn.addEventListener("click", () => {

        searchContainer.classList.toggle("active");

        if (searchContainer.classList.contains("active")) {
            searchInput.focus();
        }

    });


    // =========================
    // SEARCH
    // =========================

    searchInput.addEventListener("input", () => {

        currentSearch = searchInput.value
            .toLowerCase()
            .trim();

        displayProducts();

    });


    // =========================
    // CREATE SORT DROPDOWN
    // =========================

    const filtersContainer = document.querySelector(".filters");

    const sortSelect = document.createElement("select");

    sortSelect.className = "sort-select";

    sortSelect.innerHTML = `
        <option value="default">Sort Products</option>
        <option value="low-high">Price: Low to High</option>
        <option value="high-low">Price: High to Low</option>
        <option value="name">Name: A to Z</option>
        <option value="name-reverse">Name: Z to A</option>
    `;

    filtersContainer.appendChild(sortSelect);


    // =========================
    // SORT
    // =========================

    sortSelect.addEventListener("change", () => {

        currentSort = sortSelect.value;

        displayProducts();

    });


    // =========================
    // FILTER BUTTONS
    // =========================

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            currentCategory = button.dataset.category;

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            displayProducts();

        });

    });


    // =========================
    // CATEGORY CARDS
    // =========================

    categoryCards.forEach(card => {

        card.addEventListener("click", () => {

            currentCategory = card.dataset.category;

            filterButtons.forEach(button => {

                button.classList.remove("active");

                if (
                    button.dataset.category === currentCategory
                ) {
                    button.classList.add("active");
                }

            });

            displayProducts();

            document
                .getElementById("products")
                .scrollIntoView({
                    behavior: "smooth"
                });

        });

    });


    // =========================
    // DISPLAY PRODUCTS
    // =========================

    function displayProducts() {

        let products = [...productCards];

        // Category filter

        products = products.filter(card => {

            if (currentCategory === "all") {
                return true;
            }

            return card.dataset.category === currentCategory;

        });


        // Search filter

        products = products.filter(card => {

            const name = card
                .querySelector("h3")
                .textContent
                .toLowerCase();

            const category = card
                .dataset.category
                .toLowerCase();

            return (
                name.includes(currentSearch) ||
                category.includes(currentSearch)
            );

        });


        // Sort

        if (currentSort === "low-high") {

            products.sort((a, b) => {

                return getPrice(a) - getPrice(b);

            });

        }


        if (currentSort === "high-low") {

            products.sort((a, b) => {

                return getPrice(b) - getPrice(a);

            });

        }


        if (currentSort === "name") {

            products.sort((a, b) => {

                const nameA =
                    a.querySelector("h3").textContent;

                const nameB =
                    b.querySelector("h3").textContent;

                return nameA.localeCompare(nameB);

            });

        }


        if (currentSort === "name-reverse") {

            products.sort((a, b) => {

                const nameA =
                    a.querySelector("h3").textContent;

                const nameB =
                    b.querySelector("h3").textContent;

                return nameB.localeCompare(nameA);

            });

        }


        // Clear grid

        productGrid.innerHTML = "";


        // No products

        if (products.length === 0) {

            productGrid.innerHTML = `
                <div class="no-products">
                    <h3>No products found 😕</h3>
                    <p>Try another search or category.</p>
                </div>
            `;

            return;

        }


        // Add products

        products.forEach(card => {

            productGrid.appendChild(card);

        });

    }


    // =========================
    // GET PRICE
    // =========================

    function getPrice(card) {

        const button = card.querySelector(".add-cart");

        return Number(button.dataset.price);

    }


    // =========================
    // ADD TO CART
    // =========================

    document.addEventListener("click", event => {

        const button = event.target.closest(".add-cart");

        if (!button) {
            return;
        }

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existingProduct = cart.find(
            item => item.name === name
        );


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }


        updateCart();

        showToast(`${name} added to cart 🛒`);

    });


    // =========================
    // UPDATE CART
    // =========================

    function updateCart() {

        cartItemsContainer.innerHTML = "";


        if (cart.length === 0) {

            cartItemsContainer.innerHTML = `
                <p class="empty-cart">
                    Your cart is empty.
                </p>
            `;

        } else {

            cart.forEach((item, index) => {

                const cartItem =
                    document.createElement("div");

                cartItem.className = "cart-item";

                cartItem.innerHTML = `

                    <div class="cart-item-info">

                        <h4>${item.name}</h4>

                        <p>
                            ₹${item.price.toLocaleString("en-IN")}
                        </p>

                    </div>

                    <div class="quantity-controls">

                        <button
                            class="quantity-btn decrease"
                            data-index="${index}"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            class="quantity-btn increase"
                            data-index="${index}"
                        >
                            +
                        </button>

                    </div>

                    <button
                        class="remove-item"
                        data-index="${index}"
                    >
                        ✕
                    </button>

                `;

                cartItemsContainer.appendChild(cartItem);

            });

        }


        // =========================
        // CART COUNT
        // =========================

        const totalQuantity = cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

        cartCount.textContent = totalQuantity;


        // =========================
        // CART TOTAL
        // =========================

        const totalPrice = cart.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );

        cartTotal.textContent =
            `₹${totalPrice.toLocaleString("en-IN")}`;

    }


    // =========================
    // CART BUTTONS
    // =========================

    cartItemsContainer.addEventListener("click", event => {

        const index = Number(
            event.target.dataset.index
        );


        // Increase

        if (
            event.target.classList.contains(
                "increase"
            )
        ) {

            cart[index].quantity++;

            updateCart();

        }


        // Decrease

        if (
            event.target.classList.contains(
                "decrease"
            )
        ) {

            cart[index].quantity--;

            if (cart[index].quantity <= 0) {

                cart.splice(index, 1);

            }

            updateCart();

        }


        // Remove

        if (
            event.target.classList.contains(
                "remove-item"
            )
        ) {

            cart.splice(index, 1);

            updateCart();

        }

    });


    // =========================
    // OPEN CART
    // =========================

    cartBtn.addEventListener("click", () => {

        cartSidebar.classList.add("active");

        cartOverlay.classList.add("active");

        document.body.style.overflow = "hidden";

    });


    // =========================
    // CLOSE CART
    // =========================

    function closeCartSidebar() {

        cartSidebar.classList.remove("active");

        cartOverlay.classList.remove("active");

        document.body.style.overflow = "";

    }


    closeCart.addEventListener(
        "click",
        closeCartSidebar
    );


    cartOverlay.addEventListener(
        "click",
        closeCartSidebar
    );


    // =========================
    // ESCAPE KEY
    // =========================

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeCartSidebar();

        }

    });


    // =========================
    // CHECKOUT
    // =========================

    checkoutBtn.addEventListener("click", () => {

        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;

        }

        alert(
            "Thank you for shopping with ShopEase! 🛍️"
        );

    });


    // =========================
    // NEWSLETTER
    // =========================

    newsletterForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const emailInput =
                newsletterForm.querySelector("input");

            const email =
                emailInput.value.trim();


            if (!email) {

                return;

            }


            alert(
                "Thank you for subscribing to ShopEase! 🎉"
            );

            emailInput.value = "";

        }
    );


    // =========================
    // TOAST
    // =========================

    function showToast(message) {

        const oldToast =
            document.querySelector(".toast");

        if (oldToast) {
            oldToast.remove();
        }


        const toast =
            document.createElement("div");

        toast.className = "toast";

        toast.textContent = message;

        document.body.appendChild(toast);


        setTimeout(() => {

            toast.remove();

        }, 2000);

    }


    // =========================
    // INITIALIZE
    // =========================

    displayProducts();

    updateCart();

});
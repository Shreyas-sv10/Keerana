// ==========================
// GLOBAL VARIABLES
// ==========================
let currentUser = null;
let cart = [];
let customers = {}; // Stores customer records { username: [orders] }
let items = [
    { id: 1, name: "Rice", price: 60, photo: "images/rice.jpg" },
    { id: 2, name: "Wheat Flour", price: 45, photo: "images/wheat.jpg" },
    { id: 3, name: "Sugar", price: 40, photo: "images/sugar.jpg" },
    { id: 4, name: "Salt", price: 20, photo: "images/salt.jpg" },
    { id: 5, name: "Dal", price: 90, photo: "images/dal.jpg" },
    { id: 6, name: "Oil", price: 120, photo: "images/oil.jpg" },
    { id: 7, name: "Tea Powder", price: 200, photo: "images/tea.jpg" },
    { id: 8, name: "Coffee", price: 250, photo: "images/coffee.jpg" },
    { id: 9, name: "Biscuits", price: 30, photo: "images/biscuits.jpg" },
    { id: 10, name: "Bread", price: 25, photo: "images/bread.jpg" },
    { id: 11, name: "Milk", price: 50, photo: "images/milk.jpg" },
    { id: 12, name: "Paneer", price: 300, photo: "images/paneer.jpg" },
    { id: 13, name: "Butter", price: 350, photo: "images/butter.jpg" },
    { id: 14, name: "Eggs", price: 6, photo: "images/eggs.jpg" },
    { id: 15, name: "Chicken", price: 220, photo: "images/chicken.jpg" },
    { id: 16, name: "Fish", price: 280, photo: "images/fish.jpg" },
    { id: 17, name: "Soap", price: 40, photo: "images/soap.jpg" },
    { id: 18, name: "Shampoo", price: 180, photo: "images/shampoo.jpg" },
    { id: 19, name: "Toothpaste", price: 90, photo: "images/toothpaste.jpg" },
    { id: 20, name: "Detergent", price: 150, photo: "images/detergent.jpg" },
    { id: 21, name: "Vegetables", price: 60, photo: "images/vegetables.jpg" },
    { id: 22, name: "Fruits", price: 120, photo: "images/fruits.jpg" },
    { id: 23, name: "Snacks", price: 80, photo: "images/snacks.jpg" },
    { id: 24, name: "Juice", price: 100, photo: "images/juice.jpg" },
    { id: 25, name: "Chocolates", price: 150, photo: "images/chocolates.jpg" }
];

// ==========================
// LOGIN / LOGOUT SYSTEM
// ==========================
function login() {
    let username = prompt("Enter username:");
    let password = prompt("Enter password:");

    if (username && password) {
        currentUser = username;
        alert("Welcome, " + username + "!");
        if (!customers[username]) customers[username] = [];
        document.getElementById("login-status").innerText = "Logged in as: " + username;
    } else {
        alert("Invalid login details!");
    }
}

function logout() {
    currentUser = null;
    document.getElementById("login-status").innerText = "Not logged in";
    alert("You have logged out!");
}

// ==========================
// RENDER ITEMS
// ==========================
function renderItems(itemsToRender = items) {
    let container = document.getElementById("items-container");
    container.innerHTML = "";

    itemsToRender.forEach(item => {
        let div = document.createElement("div");
        div.classList.add("item");

        div.innerHTML = `
            <img src="${item.photo}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>₹<span id="price-${item.id}">${item.price}</span> / kg</p>
            <label>Weight (kg):</label>
            <input type="number" id="weight-${item.id}" value="1" min="0.25" step="0.25">
            <button onclick="addToCart(${item.id})">Add to Cart</button>
            <button onclick="updatePrice(${item.id})">Set Price</button>
        `;
        container.appendChild(div);
    });
}

// ==========================
// CART FUNCTIONS
// ==========================
function addToCart(itemId) {
    let weight = parseFloat(document.getElementById("weight-" + itemId).value);
    let item = items.find(i => i.id === itemId);

    if (!item) return;
    let totalPrice = item.price * weight;

    cart.push({ ...item, weight, totalPrice });
    alert(item.name + " added to cart!");
    renderCart();
}

function renderCart() {
    let cartContainer = document.getElementById("cart");
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>No items in cart</p>";
        return;
    }

    let totalBill = 0;
    cart.forEach((c, index) => {
        totalBill += c.totalPrice;

        let div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <p>${c.name} - ${c.weight}kg - ₹${c.totalPrice}</p>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;

        cartContainer.appendChild(div);
    });

    let billDiv = document.createElement("div");
    billDiv.innerHTML = `<h3>Total Bill: ₹${totalBill}</h3>
                         <button onclick="generateBill()">Generate Bill</button>`;
    cartContainer.appendChild(billDiv);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

// ==========================
// BILL GENERATION
// ==========================
function generateBill() {
    if (!currentUser) {
        alert("Please login to generate a bill!");
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    let billDetails = "Bill for " + currentUser + ":\n\n";

    cart.forEach(c => {
        billDetails += `${c.name} - ${c.weight}kg - ₹${c.totalPrice}\n`;
    });

    billDetails += "\nTotal: ₹" + total;
    alert(billDetails);

    customers[currentUser].push({ date: new Date(), items: [...cart], total });
    cart = [];
    renderCart();
}

// ==========================
// PRICE SETTING
// ==========================
function updatePrice(itemId) {
    if (!currentUser) {
        alert("Login required to set prices!");
        return;
    }

    let newPrice = prompt("Enter new price:");
    if (newPrice && !isNaN(newPrice)) {
        items = items.map(item => 
            item.id === itemId ? { ...item, price: parseFloat(newPrice) } : item
        );
        document.getElementById("price-" + itemId).innerText = newPrice;
        alert("Price updated!");
    }
}

// ==========================
// SEARCH FUNCTIONALITY
// ==========================
function searchItems() {
    let query = document.getElementById("search").value.toLowerCase();
    let filtered = items.filter(item => item.name.toLowerCase().includes(query));
    renderItems(filtered);
}

// ==========================
// LOAD ITEMS INITIALLY
// ==========================
window.onload = () => {
    renderItems();
};

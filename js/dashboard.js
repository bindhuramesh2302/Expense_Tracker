// ==========================
// Login Protection
// ==========================

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// ==========================
// Auto-fill Today's Date
// ==========================

document.getElementById("date").value =
    new Date().toISOString().split("T")[0];

// ==========================
// Logout
// ==========================

document.getElementById("logoutBtn").addEventListener("click", function () {

    localStorage.removeItem("isLoggedIn");

    alert("Logged out successfully!");

    window.location.href = "login.html";

});

// ==========================
// Load Transactions
// ==========================

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

// ==========================
// DOM Elements
// ==========================

const transactionForm = document.getElementById("transactionForm");
const transactionTable = document.getElementById("transactionTable");
const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");

let expenseChart;

// ==========================
// Add Transaction
// ==========================

transactionForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const type = document.getElementById("type").value;
    const date = document.getElementById("date").value;

    if (title === "") {
        alert("Please enter a title.");
        return;
    }

    if (amount <= 0) {
        alert("Amount must be greater than 0.");
        return;
    }

    const transaction = {
        id: Date.now(),
        title,
        amount,
        category,
        type,
        date
    };

    transactions.push(transaction);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    transactionForm.reset();

    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

    displayTransactions();
    updateSummary();
    drawChart();

});

// ==========================
// Display Transactions
// ==========================

function displayTransactions() {

    transactionTable.innerHTML = "";

    const search = searchInput.value.toLowerCase();
    const category = filterCategory.value;

    const filteredTransactions = transactions.filter(transaction => {

        const titleMatch =
            transaction.title.toLowerCase().includes(search);

        const categoryMatch =
            category === "All" ||
            transaction.category === category;

        return titleMatch && categoryMatch;

    });

    if (filteredTransactions.length === 0) {

        transactionTable.innerHTML = `
            <tr>
                <td colspan="6">No Transactions Found</td>
            </tr>
        `;

        return;
    }

    filteredTransactions.forEach(transaction => {

        transactionTable.innerHTML += `
            <tr>
                <td>${transaction.title}</td>
                <td>₹${transaction.amount}</td>
                <td>${transaction.category}</td>
                <td>${transaction.type}</td>
                <td>${transaction.date}</td>
                <td>
                    <button onclick="deleteTransaction(${transaction.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });

}

// ==========================
// Update Summary
// ==========================

function updateSummary() {

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "Income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }

    });

    const balance = income - expense;
    const savings = balance;

    document.getElementById("income").innerText = "₹" + income;
    document.getElementById("expense").innerText = "₹" + expense;
    document.getElementById("balance").innerText = "₹" + balance;
    document.getElementById("saving").innerText = "₹" + savings;

}

// ==========================
// Delete Transaction
// ==========================

function deleteTransaction(id) {

    if (!confirm("Delete this transaction?")) {
        return;
    }

    transactions = transactions.filter(transaction => transaction.id !== id);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    displayTransactions();
    updateSummary();
    drawChart();

}

// ==========================
// Expense Pie Chart
// ==========================

function drawChart() {

    const expenseData = {};

    transactions.forEach(transaction => {

        if (transaction.type === "Expense") {

            if (!expenseData[transaction.category]) {
                expenseData[transaction.category] = 0;
            }

            expenseData[transaction.category] += transaction.amount;

        }

    });

    const labels = Object.keys(expenseData);
    const data = Object.values(expenseData);

    if (expenseChart) {
        expenseChart.destroy();
    }

    const ctx = document
        .getElementById("expenseChart")
        .getContext("2d");

    expenseChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [{
                label: "Expenses",
                data: data
            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}

// ==========================
// Search
// ==========================

searchInput.addEventListener("keyup", function () {

    displayTransactions();

});

// ==========================
// Category Filter
// ==========================

filterCategory.addEventListener("change", function () {

    displayTransactions();

});

// ==========================
// Initial Load
// ==========================

displayTransactions();
updateSummary();
drawChart();
// -------------------
// Transaction Data
// -------------------
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// -------------------
// DOM Elements
// -------------------
const descInput = document.getElementById("descInput");
const amountInput = document.getElementById("amountInput");
const addBtn = document.getElementById("addBtn");
const transactionList = document.getElementById("transactionList");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

// -------------------
// Auth Section (UI)
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const logoutBtn = document.getElementById('logoutBtn');
// -------------------

// -------------------
// Update UI Function
// -------------------
function updateUI() {
  transactionList.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = t.amount > 0 ? "income" : "expense";
    li.innerHTML = `
      <span class="desc">${t.desc}</span>
      <span class="amount">৳${t.amount}</span>
      <div class="action-btns">
        <button onclick="editTransaction(${index})">✎</button>
        <button onclick="deleteTransaction(${index})">X</button>
      </div>
    `;
    transactionList.appendChild(li);

    t.amount > 0 ? (income += t.amount) : (expense += t.amount);
  });

  const balance = income + expense;
  balanceEl.textContent = `৳${balance}`;
  incomeEl.textContent = `৳${income}`;
  expenseEl.textContent = `৳${Math.abs(expense)}`;

  // --------- BALANCE COLOR ---------
  if (balance > 0) {
    balanceEl.style.color = "green";
  } else if (balance < 0) {
    balanceEl.style.color = "red";
  } else {
    balanceEl.style.color = "#01040a"; // default color for 0
  }

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// -------------------
// Add Transaction
// -------------------
addBtn.addEventListener("click", () => {
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());

  if (!desc || isNaN(amount)) return;

  transactions.push({ desc, amount });
  descInput.value = "";
  amountInput.value = "";
  updateUI();
});

// -------------------
// Delete Transaction
// -------------------
function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateUI();
}

// -------------------
// Edit Transaction
// -------------------
function editTransaction(index) {
  const newDesc = prompt("Edit Description:", transactions[index].desc);
  const newAmount = prompt("Edit Amount:", transactions[index].amount);

  if (newDesc === null || newAmount === null) return;
  if (newDesc.trim() === "" || isNaN(parseFloat(newAmount))) {
    alert("Invalid input");
    return;
  }

  transactions[index] = { desc: newDesc.trim(), amount: parseFloat(newAmount) };
  updateUI();
}

// -------------------
// Logout Button
// -------------------
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('currentUser'); // if you want to keep per-user logic
  transactions = [];
  updateUI();
  authSection.style.display = "block";
  appSection.style.display = "none";
});

// -------------------
// Initial Render
// -------------------
updateUI();

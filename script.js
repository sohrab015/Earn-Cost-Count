// =========================
// Original Expense Tracker
// (kept logic intact)
// =========================
let transactions = JSON.parse(localStorage.getItem('transactions')) || []

const descInput = document.getElementById('descInput')
const amountInput = document.getElementById('amountInput')
const addBtn = document.getElementById('addBtn')
const transactionList = document.getElementById('transactionList')
const balanceEl = document.getElementById('balance')
const incomeEl = document.getElementById('income')
const expenseEl = document.getElementById('expense')

function updateUI() {
    transactionList.innerHTML = ''
    let income = 0
    let expense = 0

    transactions.forEach((t, index) => {
        const li = document.createElement('li')
        li.classList.add(t.amount > 0 ? 'income' : 'expense')
        li.innerHTML =
        `
            <span class="desc">${t.desc}</span>
            <span class="amount">৳${t.amount}</span>
            <div class="action-btns">
                <button class="edit-btn" onclick="editTransaction(${index})">✎</button>
                <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
            </div>
        `

        transactionList.appendChild(li)

        if (t.amount > 0) income += t.amount
        else expense += t.amount
    })

    const balance = income + expense
    balanceEl.textContent = `৳${balance}`
    incomeEl.textContent = `৳${income}`
    expenseEl.textContent = `৳${Math.abs(expense)}`

    localStorage.setItem('transactions', JSON.stringify(transactions))

    if (balance > 0) {
        balanceEl.style.color = "green"
    } else if (balance < 0) {
        balanceEl.style.color = "red"
    } else {
        balanceEl.style.color = "#01040aff"
    }
}

addBtn.addEventListener('click', () => {
    const desc = descInput.value.trim()
    const amount = parseFloat(amountInput.value.trim())

    if (!desc || isNaN(amount)) return

    transactions.push({ desc, amount })
    descInput.value = ''
    amountInput.value = ''
    updateUI()
})

function deleteTransaction(index) {
    transactions.splice(index, 1)
    updateUI()
}

function editTransaction(index) {
    const newDesc = prompt("Edit Description:", transactions[index].desc)
    const newAmount = prompt("Edit Amount:", transactions[index].amount)

    if (newDesc === null || newAmount === null) return
    if (newDesc.trim() === "" || isNaN(parseFloat(newAmount))) {
        alert("Invalid input")
        return
    }

    transactions[index].desc = newDesc.trim()
    transactions[index].amount = parseFloat(newAmount)

    updateUI()
}

updateUI()

// =========================
// Authentication System
// (added, minimal interference)
// =========================
const authSection = document.getElementById('authSection')
const appSection = document.getElementById('appSection')
const authTitle = document.getElementById('authTitle')
const authBtn = document.getElementById('authBtn')
const toggleAuth = document.getElementById('toggleAuth')
const toggleLink = document.getElementById('toggleLink')
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const logoutBtn = document.getElementById('logoutBtn')

let isLoginMode = true
let currentUser = localStorage.getItem('currentUser')

// Toggle between Login and Signup
toggleLink.addEventListener('click', () => {
    isLoginMode = !isLoginMode
    authTitle.textContent = isLoginMode ? 'Login' : 'Sign Up'
    authBtn.textContent = isLoginMode ? 'Login' : 'Sign Up'
    // keep the same DOM structure to avoid losing the reference to toggleLink
    toggleAuth.innerHTML = isLoginMode
        ? `Don't have an account? <span id="toggleLink">Sign Up</span>`
        : `Already have an account? <span id="toggleLink">Login</span>`
    // rebind the reference (since innerHTML replaced the span)
    const newToggle = document.getElementById('toggleLink')
    if (newToggle) {
        newToggle.addEventListener('click', () => toggleLink.click())
    }
})

// Handle Login/Signup
authBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()

    if (!username || !password) {
        alert("Please fill all fields.")
        return
    }

    let users = JSON.parse(localStorage.getItem('users')) || {}

    if (isLoginMode) {
        if (!users[username]) {
            alert("User not found. Please sign up.")
            return
        }
        if (users[username].password !== password) {
            alert("Incorrect password.")
            return
        }

        localStorage.setItem('currentUser', username)
        currentUser = username
        loadUserData()
        showApp()
    } else {
        if (users[username]) {
            alert("Username already exists.")
            return
        }

        users[username] = { password, transactions: [] }
        localStorage.setItem('users', JSON.stringify(users))
        alert("Signup successful! You can login now.")
        isLoginMode = true
        authTitle.textContent = 'Login'
        authBtn.textContent = 'Login'
        toggleAuth.innerHTML = `Don't have an account? <span id="toggleLink">Sign Up</span>`
        // rebind toggleLink
        const newToggle = document.getElementById('toggleLink')
        if (newToggle) newToggle.addEventListener('click', () => toggleLink.click())
    }

    usernameInput.value = ''
    passwordInput.value = ''
})

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser')
    currentUser = null
    showAuth()
})

// Show/hide sections
function showAuth() {
    authSection.style.display = 'block'
    appSection.style.display = 'none'
}

function showApp() {
    authSection.style.display = 'none'
    appSection.style.display = 'block'
}

// Load and Save per user (these interact with original transactions variable)
function loadUserData() {
    const users = JSON.parse(localStorage.getItem('users')) || {}
    transactions = users[currentUser]?.transactions || []
    updateUI()
}

function saveUserData() {
    const users = JSON.parse(localStorage.getItem('users')) || {}
    if (currentUser) {
        users[currentUser].transactions = transactions
        localStorage.setItem('users', JSON.stringify(users))
    }
}

// Ensure user data saved whenever UI updates
const oldUpdateUI = updateUI
updateUI = function () {
    oldUpdateUI()
    saveUserData()
}

// Auto-login if currentUser exists
if (currentUser) {
    showApp()
    loadUserData()
} else {
    showAuth()
}

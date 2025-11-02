
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
        li.innerHTML = `
            <span class="desc">${t.desc}</span>
            <span class="amount">৳${t.amount}</span>
            <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
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

updateUI()

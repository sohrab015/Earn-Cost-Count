
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

$(document).ready(function () {
    let budgetFeedback = $(".budget-feedback");
    let expenseFeedback = $(".expense-feedback");
    let budgetForm = $("#budget-form");
    let budgetInput = $("#budget-input");
    let budgetAmount = $("#budget-amount");
    let expenseAmount = $("#expense-amount");
    let balance = $("#balance");
    let balanceAmount = $("#balance-amount");
    let expenseForm = $("#expense-form");
    let expenseInput = $("#expense-input");
    let amountInput = $("#amount-input");
    let expenseList = $("#expense-list");
    let itemList = [];
    let itemID = 0;


    function submitBudgetForm() {
        const value = budgetInput.val();
        if (value === '' || value < 0) {
            budgetFeedback.addClass('showItem');
            budgetFeedback.html("<p>value cannot be empty or negative</p>");
        } else {
            budgetAmount.text(parseInt(budgetAmount.text()) + parseInt(value));
            budgetInput.val('');
            showBalance();
        }
    }

    budgetForm.submit(function (event) {
        event.preventDefault();
        submitBudgetForm();
    })

    if (budgetInput.val() === "") {
        budgetInput.click(function () {
            budgetFeedback.removeClass('showItem');
        })
    }

    function submitExpenseForm() {
        const expenseValue = expenseInput.val();
        const amountValue = amountInput.val();
        if (expenseValue === '' || amountValue === '' || amountValue < 0) {
            expenseFeedback.addClass('showItem');
            expenseFeedback.html("<p>values cannot be empty or negative</p>");
        } else {
            let amount = parseInt(amountValue);
            expenseInput.val('');
            amountInput.val('');

            let expense = {
                id: itemID,
                title: expenseValue,
                amount: amount
            }
            itemID++;
            itemList.push(expense);
            checkTable();
            addExpense(expense);
            showBalance();

        }

        expenseInput.click(function () {
            if (expenseInput.val() === "") {
                expenseFeedback.removeClass('showItem');
            }
        })

        amountInput.click(function () {
            if (amountInput.val() === "") {
                expenseFeedback.removeClass('showItem');
            }
        })

    }


    expenseForm.submit(function (event) {
        event.preventDefault();
        submitExpenseForm();
    })


    function totalExpense() {
        let total = 0;
        if (itemList.length > 0) {
            total = itemList.reduce(function (acc, curr) {
                acc += curr.amount;
                return acc;
            }, 0)
        }
        expenseAmount.text(total);
        return total;
    }


    function showBalance() {
        const expense = totalExpense();
        const total = parseInt(budgetAmount.text()) - expense;
        balanceAmount.text(total);
        if (total < 0) {
            balance.removeClass('showGreen showBlack');
            balance.addClass('showRed');
        } else if (total > 0) {
            balance.removeClass('showRed showBlack');
            balance.addClass('showGreen');
        } else if (total === 0) {
            balance.removeClass('showRed showGreen');
            balance.addClass('showBlack');
        }
    }

    function addExpense(expense) {
        const tr = document.createElement('tr');
        tr.classList.add('row');
        tr.classList.add('expense');
        tr.innerHTML = `<tr>
                        <td class="list-item col-md-4 h5 text-uppercase">- ${expense.title}</td>
                        <td class="list-item col-md-4 h5">$${expense.amount}</td>
                        <td class="list-item col-md-4 h5">
                            <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
                                <i class="fas fa-edit"></i>
                            </a>
                            <a href="#" class="delete-icon" data-id="${expense.id}">
                                <i class="fas fa-trash"></i>
                            </a>
                        </td>
                    </tr>`;
        expenseList.append(tr);
    }

    expenseList.click(function (event) {
        if (event.target.parentElement.classList.contains('edit-icon')) {
            editExpense(event.target.parentElement);
        } else if (event.target.parentElement.classList.contains('delete-icon')) {
            deleteExpense(event.target.parentElement);
        }
    })

    function editExpense(element) {
        let id = parseInt(element.dataset.id);
        let parent = element.parentElement.parentElement;
        parent.remove();
        let expense = itemList.filter(function (item) {
            return item.id === id;
        })

        expenseInput.val(expense[0].title);
        amountInput.val(expense[0].amount);

        let tempList = itemList.filter(function (item) {
            return item.id !== id;
        })
        itemList = tempList;
        showBalance();
    }

    function deleteExpense(element) {
        let id = parseInt(element.dataset.id);
        let parent = element.parentElement.parentElement;

        parent.remove();

        let tempList = itemList.filter(function (item) {
            return item.id !== id;
        })
        itemList = tempList;
        showBalance();
        checkTable();
    }

    function checkTable() {
        if (itemList.length > 0) {
            $('#expense-list').css('display', 'table');
        } else {
            $('#expense-list').css('display', 'none');
        }
    }
});

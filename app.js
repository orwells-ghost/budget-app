/*
Steps:
Add event handler for 'add' button. (controller model)
Get input values from inputs (UI module)
Add new item to data structure (Data module)
Add the item to the UI (UI module)
Calculate the budget with new item (data module)
Update the budget UI (UI module)

Modules:
- Important aspect of any robust application's architecture.
- Keep the units of code for a porject both cleanly sperated and organized.
- Encapsulate some data into privacy and expose other data publicly.
We'll use a controller module, UI module, data module. We create modules because we want to keep parts of the code that are related to each other together in independent sections. Modules should be written so they are private, using iify, generally, and then return an object that has all of the functions that we want to be public, the outside scope. Each module should be able to run independatly of the others, so you can come back to them later and make edits without worrying too much.
*/

// Budget Controller
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });

        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            var newItem, id;

            // Create new ID, based on length of that type's allItems
            if (data.allItems[type].length > 0){
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            // Create new item based on 'expenses' or 'income' type
            if (type === 'expense') {
                newItem = new Expense(id, des, val);
            } else if (type === 'income') {
                newItem = new Income(id, des, val);
            }

            // Push it into data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        calculateBudget: function() {

            // Calculate total income and expenses
            calculateTotal('expense');
            calculateTotal('income');

            // Calculate the budget: income - expenses
            data.budget = data.totals.income - data.totals.expense;

                        // Calculate the percentage of income that was spent
            if (data.totals.income > 0) {
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            } else {
                data.percentage = -1;
            }

        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };

})();

// UI Controller
var UIController = (function() {

    // Strings to help select HTML elements
    var DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    };

    return {
        getinput: function() { // return getinput function to allow other modules to access input values
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either income or expense
                description: document.querySelector(DOMstrings.inputDesc).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'income') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'                
            } else if (type === 'expense') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue);
            
            // Trick JS into calling fields on array slice method to turn querySelectAll list into array
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();
        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExpense;

            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        // Return DOMstrings so other modules can access them
        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();


// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

    // Event listeners
    var setupEventListeners = function() {

        // Save DOMstrings from UICtrl into this module
        var DOM = UICtrl.getDOMstrings();

        // Event listner for add button
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // Event listner for any keypress on document, pass event arg into function
        document.addEventListener('keypress', function(event) {
            
            // keyCode 13 is Enter. which is for older browsers.
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get the filed input data
        input = UICtrl.getinput();

        // Check if input description, value exists and not 0
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the new item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();
        }

        // 5. Calculate and update budget
        updateBudget();
    };

    return {
        init: function() {
            console.log('App has started.');
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
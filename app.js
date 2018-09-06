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

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        }
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
        inputBtn: '.add__btn'
    };

    return {
        getinput: function() { // return getinput function to allow other modules to access input values
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either income or expense
                description: document.querySelector(DOMstrings.inputDesc).value,
                value: document.querySelector(DOMstrings.inputValue).value
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

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get the filed input data
        input = UICtrl.getinput();

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the new item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    };

    return {
        init: function() {
            console.log('App has started.');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
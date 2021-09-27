'use strict';

////////////////////////

import {
    byID,
    toJSON,
    fromJSON,
    showClass,
    hideClass,
    showElement,
    hideElement
} from './utils.js';

import {
    goToScreen,
    resetInvoiceInfo
} from './navigation.js';

import {
    getIngredients
} from './backend/ingredientsController.js';

import {
    VAT,
    pizzaTime,
    taxId
} from './main.js';

import {
    sessionManager
} from './user.js';

import {
    getCurrentUser,
    getUserByIDBackend
} from './backend/userController.js';

import {
    isFormValidInvoice
} from './validators.js';

export {
    populateIngredients,
    accessIngredients,
    accessOrderDetails,
    invoiceInfoToggle,
    finalizeOrder
};

////////////////////////


async function populateIngredients() {    
    let ingredients = fromJSON(await getIngredients());
    let div = byID('ingredientsDiv');
    
    if (ingredients !== null) {
        for (let i = 0; i < ingredients.length; i++) {
            let label = document.createElement('label');
            let checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.id = 'ingred' + ingredients[i].toLowerCase().replace(/ /g,'');
            checkBox.name= 'ingredientsCheckBox';
            checkBox.value = ingredients[i];
            div.appendChild(label);
            label.appendChild(document.createTextNode(ingredients[i]));
            div.appendChild(checkBox);
        }
    }
}


async function accessIngredients() {
    if (!isCrustSelected()) {
        alert('Please select your crust to continue.');
        return;
    }  
    if (byID("pizzaQuantity").value < 1 || byID("pizzaQuantity").value > 50) {
        alert('Please select quantity from one to fifty.');
        return;
    }
    if (!await isUserLogedIn()) {
        goToScreen('loginScreen');
        return;
    }
    goToScreen('mainScreen', 'pizzaIngredients');
}


function isCrustSelected() {
    const crustSelection = document.querySelector('input[name="crustType"]:checked');
    return crustSelection === null ? false : true;
}


async function isUserLogedIn() {
    return await sessionManager.isLoggedIn();
}


function accessOrderDetails() {
    if (!isIngredientsSelected()) {
        alert('Please select from one to five ingredients.');
        return;
    }

    let orderDetails = processOrderDetails();  
    fillOrderDetails(orderDetails);
    goToScreen('mainScreen', 'orderDetails');
}


function isIngredientsSelected() {
    let checkBoxes = document.getElementsByName("ingredientsCheckBox");
    let count = 0;
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].type === "checkbox" && checkBoxes[i].checked === true) {
            count++;
        }
    }
    return (count >= 1 && count <=5);
}


function processOrderDetails() {
    const crustSelection = document.querySelector('input[name="crustType"]:checked').value;
    let crustPrice = 0;    
    let quantity = byID("pizzaQuantity").value;

    switch (crustSelection) {
        case 'Small':
            crustPrice = 5;
            break;
        case 'Medium':
            crustPrice = 8;
            break;
        case 'Large':
            crustPrice = 10;
            break;
    }
    const ingredientsSelection = [];
    let pricePerIngredient = 0;
    let ingredientsPrice = 0;    

    let checkBoxes = document.getElementsByName("ingredientsCheckBox");
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].type === "checkbox" && checkBoxes[i].checked === true) {
            ingredientsSelection.push(checkBoxes[i].value)
        }
    }

    switch (ingredientsSelection.length) {
        case 1:
        case 2:
        case 3:
            pricePerIngredient = 1.75;
            ingredientsPrice = ingredientsSelection.length * 1.75;            
            break;
        case 4:
        case 5:
            pricePerIngredient = 1.4;
            ingredientsPrice = ingredientsSelection.length * 1.4;            
            break;
    }
    return {
        crust : crustSelection,
        crustPrice : crustPrice,
        quantity : quantity,
        ingreds : ingredientsSelection,
        ingredPricePer : pricePerIngredient,
        ingredsPrice : ingredientsPrice        
    };
}


function fillOrderDetails(orderDetails) {
    let prices = calculatePrices(orderDetails);

    byID('orderDetCrust').innerHTML = orderDetails.crust;
    byID('orderDetBasePrice').innerHTML = `${orderDetails.crustPrice.toFixed(2)} €`;

    let ingredsFormatted = '';
    for (let ing of orderDetails.ingreds) {
        ingredsFormatted += `${ing}<br>`;
    }
    byID('orderDetIngredients').innerHTML = ingredsFormatted;
    byID('orderDetPricePerIngredient').innerHTML = `${orderDetails.ingredPricePer.toFixed(2)} €`;
    byID('orderDetIngredientsPrice').innerHTML = `${orderDetails.ingredsPrice.toFixed(2)} €`;
    byID('orderDetPricePerPizza').innerHTML = `${prices.pricePerPizza.toFixed(2)} €`;
    byID('orderDetQuantity').innerHTML = orderDetails.quantity;
    
    byID('vatRate').innerHTML = `VAT ${VAT}%`;
    byID('orderDetSubTotal').innerHTML = `${prices.subTotal.toFixed(2)} €`;
    byID('orderDetVatTotal').innerHTML = `${prices.vatTotal.toFixed(2)} €`;
    byID('orderDetTotal').innerHTML = `${prices.grandTotal.toFixed(2)} €`;
}


function calculatePrices(orderDetails) {
    let pricePerPizza = orderDetails.crustPrice + orderDetails.ingredsPrice;
    let grandTotal = pricePerPizza * orderDetails.quantity;
    let subTotal = grandTotal / (VAT / 100 + 1);
    let vatTotal = grandTotal - subTotal;
    return {
        pricePerPizza : pricePerPizza,
        grandTotal : grandTotal,
        subTotal : subTotal,
        vatTotal : vatTotal
    };
}


async function invoiceInfoToggle(checked) {
    if (checked) {        
        if (!await isUserLogedIn()) {
            goToScreen('loginScreen');
            return;
        }
        const currentUserMail = fromJSON(await getCurrentUser()).email;
        let currentUser = await getUserByIDBackend(toJSON(currentUserMail));   
        byID('orderDetName').value = `${currentUser.firstName} ${currentUser.lastName}`;
        byID('orderDetAddress').value = currentUser.address;
        byID('orderDetTin').value = currentUser.tin;

        showClass('invoiceInfo');
    }
    else {
        hideClass('invoiceInfo');
    }
}


async function finalizeOrder() {
    let processInvoice = false;
    if(byID('orderDetInvoice').checked) {
        if (isFormValidInvoice()) {
            processInvoice = true;
        }
        else {
            alert('Invalid or missing invoice information.');
            return;
        }
    }
    await fillOrderDone(processInvoice);

    //////////////////////
    resetInvoiceInfo();
    goToScreen('mainScreen', 'orderDone');
}


async function fillOrderDone(processInvoice) {    
    byID('orderDoneMessage').innerHTML = generateDoneMessage();
    hideElement('orderDoneInvoice');

    if(processInvoice) {
        await fillInvoice();
        showElement('orderDoneInvoice');
    }
}


function generateDoneMessage() {
    let quantity = byID("pizzaQuantity").value;
    let pizzaWord = quantity > 1 ? 'pizzas' : 'pizza';

    let pizzaWait = 0;
    for (let i = 1; i <= quantity; i++) {
        if (i === 1) {
            pizzaWait = pizzaTime.first;
            continue;
        }
        pizzaWait += pizzaTime.plusOne;
    }
    let hours = Math.trunc(pizzaWait / 60);
    let minutes = pizzaWait % 60;

    let pizzaWaitText = hours > 0 
        ? `${hours}:${minutes.toString().length === 1 ? '0' + minutes : minutes} min`
        : `${minutes.toString().length === 1 ? '0' + minutes : minutes} min`;

    return `Your ${pizzaWord} will be ready in ${pizzaWaitText}...`;
}


async function fillInvoice() {
    const orderDetails = processOrderDetails();
    const date = new Date();
    const year = date.getFullYear();
    let prices = calculatePrices(orderDetails);

    byID('invoiceSeller').innerHTML =
        `<b>${taxId.title}</b><br>
        ${taxId.subtitle}<br>
        ${taxId.address}<br>
        TIN ${taxId.tin}<br><br>`;

    byID('invoiceBuyer').innerHTML =
        `<b>${byID('orderDetName').value}</b><br>
        ${byID('orderDetAddress').value}<br>
        TIN ${byID('orderDetTin').value}<br><br>`;

    byID('invoiceNumber').innerHTML = `Invoice: ${year}0001<br>`;
    byID('invoiceDate').innerHTML = `Date: ${date.toLocaleDateString()}<br><br>`;

    byID('invoicePizza').innerHTML = `${orderDetails.crust} | ${orderDetails.ingreds.toString().replace(',', ', ')}<br>`;
    byID('invoiceQuantity').innerHTML = `Quantity x ${orderDetails.quantity}<br><br>`;

    byID('invoiceSubTotal').innerHTML = `SubTotal: ${prices.subTotal.toFixed(2)} €<br>`;
    byID('invoiceVatTotal').innerHTML = `VAT ${VAT}%: ${prices.vatTotal.toFixed(2)} €<br>`;
    byID('invoiceTotal').innerHTML = `<b>Total: ${prices.grandTotal.toFixed(2)} €</b>`;
}

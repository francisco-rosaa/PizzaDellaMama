'use strict';

////////////////////////

import {
    byID
} from './utils.js';

import {
    goToScreen,
    goToHome
} from './navigation.js';

import {
    userLoginSide,
    userLogin,
    logout,
    updatePageLayout,
    userCreateAccount,
    userEditAccount
} from './user.js';

import {
    validateInputCreate,
    validateInputEdit,
    validateInputInvoice
} from './validators.js';

import {
    populateIngredients,
    accessIngredients,
    accessOrderDetails,
    invoiceInfoToggle,
    finalizeOrder
} from './order.js';

import {
    initDB,
    seedUsersDB,
    seedIngredientsDB
} from './backend/helpers.js';

export {
    mainScreens,
    contentScreens,
    mainStyle,
    accountStyle,
    mainStyleCssPath,
    accountStyleCssPath,
    orange,
    white,
    darkestGray,
    VAT,
    pizzaTime,
    taxId
};

////////////////////////


let mainScreens = ['mainScreen', 'loginScreen', 'createAccountScreen', 'editAccountScreen'];
let contentScreens = ['pizzaCrust', 'pizzaIngredients', 'orderDetails', 'orderDone'];

let mainStyle = ['mainScreen'];
let accountStyle = ['loginScreen', 'createAccountScreen', 'editAccountScreen'];
let mainStyleCssPath = './css/main.css';
let accountStyleCssPath = './css/accounts.css';

let orange = {r:183, g:55, b:22};
let white = {r:255, g:255, b:255};
let darkestGray = {r:20, g:20, b:20};

let VAT = 13;
let pizzaTime = {first: 15, plusOne: 5};
let taxId = {title : 'JOE MAMA', subtitle : 'Pizza Company Ltd', address : 'Sunset Boulevard 7, LA', tin : 500600700}


window.addEventListener('load', async function() {

    byID('menuLinkOrder').addEventListener('click', function() {goToScreen('mainScreen', 'pizzaCrust')});
    byID('menuLinkLogout').addEventListener('click', function() {logout()});

    byID('buttonToIngredients').addEventListener('click', function() {accessIngredients()});
    byID('buttonBackCrust').addEventListener('click', function() {goToScreen('mainScreen', 'pizzaCrust')});
    byID('buttonToFinish').addEventListener('click', function() {accessOrderDetails()});
    byID('buttonBackIngredients').addEventListener('click', function() {goToScreen('mainScreen', 'pizzaIngredients')});
    byID('orderDetInvoice').addEventListener('change', function() {invoiceInfoToggle(this.checked)});
    byID('buttonToOrder').addEventListener('click', function() {finalizeOrder()});

    byID('buttonLoginSide').addEventListener('click', function() {userLoginSide()});

    byID('buttonLogin').addEventListener('click', function() {userLogin()});
    byID('buttonCreateAcc').addEventListener('click', function() {goToScreen('createAccountScreen')});
    byID('buttonCreateAccount').addEventListener('click', function() {userCreateAccount()});
    byID('buttonEditAccount').addEventListener('click', function() {userEditAccount()});
    byID('buttonRedirectLogin').addEventListener('click', function() {goToScreen('loginScreen')});

    byID('homeLinkLogin').addEventListener('click', function() {goToScreen('mainScreen')});
    byID('homeLinkCreateAcc').addEventListener('click', function() {goToScreen('mainScreen')});
    byID('homeLinkEditAcc').addEventListener('click', function() {goToScreen('mainScreen')});

    byID('registerFirstName').addEventListener("keyup", function() {validateInputCreate('registerFirstName')});
    byID('registerLastName').addEventListener("keyup", function() {validateInputCreate('registerLastName')});
    byID('registerEmail').addEventListener("keyup", function() {validateInputCreate('registerEmail')});
    byID('registerPassword').addEventListener("keyup", function() {validateInputCreate('registerPassword')});
    byID('registerConfirmPass').addEventListener("keyup", function() {validateInputCreate('registerConfirmPass')});
    byID('registerPhone').addEventListener("keyup", function() {validateInputCreate('registerPhone')});
    byID('registerTin').addEventListener("keyup", function() {validateInputCreate('registerTin')});
    byID('registerAddress').addEventListener("keyup", function() {validateInputCreate('registerAddress')});

    byID('editFirstName').addEventListener("keyup", function() {validateInputEdit('editFirstName')});
    byID('editLastName').addEventListener("keyup", function() {validateInputEdit('editLastName')});
    byID('editPassword').addEventListener("keyup", function() {validateInputEdit('editPassword')});
    byID('editConfirmPass').addEventListener("keyup", function() {validateInputEdit('editConfirmPass')});
    byID('editPhone').addEventListener("keyup", function() {validateInputEdit('editPhone')});
    byID('editTin').addEventListener("keyup", function() {validateInputEdit('editTin')});
    byID('editAddress').addEventListener("keyup", function() {validateInputEdit('editAddress')});

    byID('orderDetName').addEventListener("keyup", function() {validateInputInvoice('orderDetName')});
    byID('orderDetAddress').addEventListener("keyup", function() {validateInputInvoice('orderDetAddress')});
    byID('orderDetTin').addEventListener("keyup", function() {validateInputInvoice('orderDetTin')});

    await initDB();
    await seedUsersDB();
    await seedIngredientsDB();
    await populateIngredients();

    history.replaceState([mainScreens[0], contentScreens[0]], null, '');

    await updatePageLayout();
    goToHome();

    window.addEventListener('popstate', function(ev) {
        goToScreen(ev.state[0], ev.state[1], 'popState');
    });
});

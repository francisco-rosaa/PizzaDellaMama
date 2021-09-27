'use strict';

////////////////////////

import {
    byID,
    showElement,
    hideElement,
    hideClass
} from './utils.js';

import {
    mainScreens,
    contentScreens,
    mainStyle,
    accountStyle,
    mainStyleCssPath,
    accountStyleCssPath
} from './main.js';

import {
    userEditAccountGoAndFill,
} from './user.js';

export {
    goToScreen,
    goToHome,
    createEditButtonToggle,
    logoutButtonToggle,
    warningToggle,
    clearLoginText,
    clearCreateAccText,
    clearEditAccPass,
    resetInvoiceInfo
};

////////////////////////


function goToScreen(screen, content, pop) {

    if (pop !== 'popState') {
        addToHistory(screen, content);
    }

    for (let screen of mainScreens) {
        hideElement(screen);
    }    
    showElement(screen);

    if (screen === mainScreens[0]) {
        for (let screen of contentScreens) {
            hideElement(screen);
        }
        if (content === undefined) {
            showElement(contentScreens[0]);
        }
        else {
            showElement(content);
        }
    }
    setCurrentCss(screen);
}


function addToHistory(screen, content) {
    history.pushState([screen, content], null, '');
}


function setCurrentCss(screen) {
    let htmlLink = byID('currentCss');

    for (let item of mainStyle) {
        if (item === screen) {
            htmlLink.href = mainStyleCssPath;
            return;
        }
    }
    for (let item of accountStyle) {
        if (item === screen) {
            htmlLink.href = accountStyleCssPath;
            return;
        }
    }
}


function goToHome() {
    warningToggle('invalidLogin', false);
    goToScreen(mainScreens[0], contentScreens[0]);
}


function createEditButtonToggle(loggedIn) {
    loggedIn
        ? byID('menuLinkAccount').addEventListener('click', function() {userEditAccountGoAndFill()})
        : byID('menuLinkAccount').addEventListener('click', function() {goToScreen('createAccountScreen')});
}


function logoutButtonToggle(loggedIn){
    loggedIn
        ? byID('menuTileLogout').style.cssText = 'display: grid;'
        : byID('menuTileLogout').style.cssText = 'display:none !important;';
}


function warningToggle(id, turnedOn) {
    if (id === 'invalidLogin') {
        if (turnedOn) {
            byID('invalidLogin').style.cssText = 'display: flex !important;';
            warningFade('invalidLogin');
        }
        else {
            byID('invalidLogin').style.cssText = 'display: none !important;';
        }
    }
    if (id === 'alertLogin') {
        if (turnedOn) {
            byID('alertLogin').style.cssText = 'display: flex !important;';
            warningFade('alertLogin');
        }
        else {
            byID('alertLogin').style.cssText = 'display: none !important;';
        }
    }
}


function warningFade(id) {
    let element = byID(id);
    element.style.opacity = 100;
    function step() {
        element.style.opacity = 0;
        warningToggle(id, false);
    }
    setTimeout(step, 2000);
}


function clearLoginText() {
    byID('inputEmailSide').value = '';
    byID('inputPasswordSide').value = '';
    byID('inputEmail').value = '';
    byID('inputPassword').value = '';
}


function clearCreateAccText() {
    byID('registerFirstName').value = '';
    byID('registerLastName').value = '';
    byID('registerEmail').value = '';
    byID('registerPassword').value = '';
    byID('registerConfirmPass').value = '';
    byID('registerPhone').value = '';
    byID('registerTin').value = '';
    byID('registerAddress').value = '';
}


function clearEditAccPass() {
    byID('editPassword').value = '';
    byID('editConfirmPass').value = '';
}


function resetInvoiceInfo() {
    byID('orderDetName').value = '';
    byID('orderDetAddress').value = '';
    byID('orderDetTin').value = '';
    byID('orderDetInvoice').checked = false;
    hideClass('invoiceInfo');
}

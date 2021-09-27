'use strict';

////////////////////////

import {
    byID
} from './utils.js';

import {
    orange,
    white,
    darkestGray
} from './main.js';

export {
    validateInputCreate,
    isFormValidCreateAcc,
    validateInputEdit,
    isFormValidEditAcc,
    isPassValidEditAcc,
    validateInputInvoice,
    isFormValidInvoice
};

////////////////////////


function isFirstNameValid(firstName) {
    return /^([A-Za-z]{2,}){1}(\s*([A-Za-z]{2,}))*$/.test(firstName.trim());
}


function isLastNameValid(lastName) {
    return /^([A-Za-z]{3,}){1}(\s*([A-Za-z]{3,}))*$/.test(lastName.trim());
}


function isEmailValid(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.trim());
}

function isPasswordValid(password) {
    return /^(?=.*[a-z])(?=.*[0-9])(?=.*[.!\$%#])(?=.{8,})/.test(password.trim());
}


function isConfirmPassValid(password , confirmPass) {
return password === confirmPass;
}


function isPhoneValid(phone) {
    return /^(?=.{3,17}$).*^([0-9]{3,14}){1}(([-]{1})([0-9]{3,9}))*$/.test(phone.trim());
}


function isTINValid(tinString) {
    let valid = false;
    let tin = parseInt(tinString, 10);
    let validStartNum = [1, 2, 5, 6, 8, 9];
    let tinArray;
    let checkDigit;
  
    if(!Number.isNaN(tin)) {
        if (tin.toString().length === 9) {

            tinArray = Array.from(tin.toString()).map(Number);

            if(validStartNum.indexOf(tinArray[0]) !== -1) {
                checkDigit = 
                    (9*tinArray[0] + 8*tinArray[1] + 7*tinArray[2] + 6*tinArray[3] + 
                    5*tinArray[4] + 4*tinArray[5] + 3*tinArray[6] + 2*tinArray[7]) % 11;
  
                if (checkDigit === 0 || checkDigit === 1) {
                    checkDigit = 0;
                }
                else {
                    checkDigit = 11 - checkDigit;
                }   

                if (checkDigit === tinArray[8]) {
                    valid = true;
                }
            }
        }
    }
    return valid;
}


function isAddressValid(adress) {
    return /^(?=.{3,}$).*^([A-Za-z0-9,.-]{1,}){1}(\s*([A-Za-z0-9,.-]{1,}))*$/.test(adress.trim());
}


function setTextWarning(element) {
    element.style.backgroundColor = `rgb(${orange.r}, ${orange.g}, ${orange.b})`;
    element.style.color = `rgb(${white.r}, ${white.g}, ${white.b})`;
}


function setTextNormal(element) {
    element.style.backgroundColor = `rgb(${white.r}, ${white.g}, ${white.b})`;
    element.style.color = `rgb(${darkestGray.r}, ${darkestGray.g}, ${darkestGray.b})`;
}


function validateInputCreate(id) {

    if (id === 'registerFirstName') {
        let element = byID('registerFirstName');
        isFirstNameValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }

    if (id === 'registerLastName') {
        let element = byID('registerLastName');
        isLastNameValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }

    if (id === 'registerEmail') {
        let element = byID('registerEmail');
        isEmailValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }

    if (id === 'registerPassword') {
        let element = byID('registerPassword');
        isPasswordValid(element.value) ? setTextNormal(element) : setTextWarning(element);
        validateInputCreate('registerConfirmPass');
    }

    if (id === 'registerConfirmPass') {
        let element = byID('registerConfirmPass');
        isConfirmPassValid(byID('registerPassword').value, element.value) ? setTextNormal(element) : setTextWarning(element);
    }

    if (id === 'registerPhone') {
        let element = byID('registerPhone');
        isPhoneValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }

    if (id === 'registerTin') {
        let element = byID('registerTin');
        isTINValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }

    if (id === 'registerAddress') {
        let element = byID('registerAddress');
        isAddressValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }
}


function isFormValidCreateAcc() {

    if (isFirstNameValid(byID('registerFirstName').value) &&
        isLastNameValid(byID('registerLastName').value) &&
        isEmailValid(byID('registerEmail').value) &&
        isPasswordValid(byID('registerPassword').value) &&
        isConfirmPassValid(byID('registerPassword').value, byID('registerConfirmPass').value) &&
        isPhoneValid(byID('registerPhone').value) &&
        isTINValid(byID('registerTin').value) &&
        isAddressValid(byID('registerAddress').value)) {
        return true;
    }
    return false;
}


function validateInputEdit(id) {

    if (id === 'editFirstName') {
        let element = byID('editFirstName');
        isFirstNameValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }

    if (id === 'editLastName') {
        let element = byID('editLastName');
        isLastNameValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }

    if (id === 'editPassword') {
        let element = byID('editPassword');
        isPasswordValid(element.value) ? setTextNormal(element) : setTextWarning(element);
        validateInputEdit('editConfirmPass');
    }

    if (id === 'editConfirmPass') {
        let element = byID('editConfirmPass');
        isConfirmPassValid(byID('editPassword').value, element.value) ? setTextNormal(element) : setTextWarning(element);
    }

    if (id === 'editPhone') {
        let element = byID('editPhone');
        isPhoneValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }

    if (id === 'editTin') {
        let element = byID('editTin');
        isTINValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }

    if (id === 'editAddress') {
        let element = byID('editAddress');
        isAddressValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }
}


function isFormValidEditAcc() {

    if (isFirstNameValid(byID('editFirstName').value) &&
        isLastNameValid(byID('editLastName').value) &&
        isPhoneValid(byID('editPhone').value) &&
        isTINValid(byID('editTin').value) &&
        isAddressValid(byID('editAddress').value)) {
        return true;
    }
    return false;
}


function isPassValidEditAcc() {

    if (isPasswordValid(byID('editPassword').value) &&
        isConfirmPassValid(byID('editPassword').value, byID('editConfirmPass').value)) {
        return true;
    }
    return false;
}


function validateInputInvoice(id) {

    if (id === 'orderDetName') {
        let element = byID('orderDetName');
        isFirstNameValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }

    if (id === 'orderDetAddress') {
        let element = byID('orderDetAddress');
        isAddressValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }

    if (id === 'orderDetTin') {
        let element = byID('orderDetTin');
        isTINValid(element.value) ? setTextNormal(element) : setTextWarning(element);
    }
}


function isFormValidInvoice() {

    if (isFirstNameValid(byID('orderDetName').value) &&
        isAddressValid(byID('orderDetAddress').value) &&
        isTINValid(byID('orderDetTin').value)) {
        return true;
    }
    return false;
}

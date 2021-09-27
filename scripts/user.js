'use strict';

////////////////////////

import {
    byID,
    toJSON,
    fromJSON,
    showError,
    User
} from './utils.js';

import {
    isFormValidCreateAcc,
    isFormValidEditAcc,
    isPassValidEditAcc
} from './validators.js';

import {
    goToScreen,
    goToHome,
    createEditButtonToggle,
    logoutButtonToggle,
    warningToggle,
    clearLoginText,
    clearCreateAccText,
    clearEditAccPass
} from './navigation.js';

import {
    getCurrentUser,
    getUserByIDBackend,
    authenticateUser,    
    logoutCurrentUser,
    createUser,
    updateUser,
    tinExists,
    UserError,
    LoginError,
    LogoutError
} from './backend/userController.js';

export {
    sessionManager,
    userLoginSide,
    userLogin,
    logout,
    updatePageLayout,
    userCreateAccount,
    userEditAccountGoAndFill,
    userEditAccount
};

////////////////////////


async function userLoginSide() {
    await loginFn(byID('inputEmailSide').value, byID('inputPasswordSide').value);
}


async function userLogin() {
    await loginFn(byID('inputEmail').value, byID('inputPassword').value);
}


async function loginFn(email, password) {
    try {
        await sessionManager.clientSideLogin(email, password);
        await updatePageLayout();
        goToHome();
    }
    catch {
        warningToggle('invalidLogin', true);
        warningToggle('alertLogin', true);
    }
    return false;
}


async function logout() {
    await sessionManager.clientSideLogout();
    await updatePageLayout();
    goToHome();
}


async function updatePageLayout() {    
    let loggedIn = await sessionManager.isLoggedIn();
    createEditButtonToggle(loggedIn);
    logoutButtonToggle(loggedIn);

    if (loggedIn) {
        const user = await sessionManager.getUser();
        byID('menuTextAccount').innerHTML = `HELLO ${user.firstName.toUpperCase()}`;
        clearLoginText();
    }
    else {
        byID('menuTextAccount').innerHTML = 'CREATE ACCOUNT';
    }
}


const sessionManager = (function() {
    let currentUser = undefined;
    let that = {};

    that.isLoggedIn = async function () {
        if (currentUser === undefined) {
            currentUser = await requestUserInformation();
        }
        return currentUser !== undefined;
    };

    that.getUser = async function () {
        if (!await that.isLoggedIn()) {
            throw new UserError('Currently no user is logged in.');
        }
        return currentUser;
    };

    that.clientSideLogin = async function(email, pwd) {
        if (await that.isLoggedIn()) {
            throw new LoginError('Already logged in.');
        }
        currentUser = await requestAuthentication(email, pwd);
        return currentUser;
    };

    that.clientSideLogout = async function() {
        if (!await that.isLoggedIn()) {
            throw new LogoutError('No login session.');
        }
        currentUser = undefined;
        await requestLogout();
    };

    that.clientSideCreateUser = async function(userSpec) {
        await requestCreateUser(userSpec);
    };

    return Object.freeze(that);

    // Private Methods
    
    async function requestCreateUser(userSpec) {
        await createUserBackend(toJSON(userSpec));
    }

    async function requestUserInformation() {
        const NOT_FOUND = "{}";
        const userJSON = await getCurrentUser();

        if (!userJSON) {
            throw new TypeError(`Unexpected falsy return value: ${userJSON}.`);
        }
        const user = fromJSON(userJSON);
        if (user === null || Array.isArray(user) || typeof user !==  'object') {
            throw new TypeError(`Unexpected return value from remote method: ${userJSON}.`);
        }
        return userJSON !==  NOT_FOUND ? user : undefined;
    }

    async function requestAuthentication(email, pwd) {
        return fromJSON(await authenticateUser(email, pwd));
    }

    async function requestLogout() {
        return await logoutCurrentUser();
    }
})();


async function userCreateAccount() {
    if (isFormValidCreateAcc()) {
        const newUser = User(
            byID('registerFirstName').value,
            byID('registerLastName').value,
            byID('registerEmail').value,
            byID('registerPassword').value,
            '',
            byID('registerPhone').value,
            byID('registerTin').value,
            byID('registerAddress').value
        );
        try {
            await createUser(toJSON(newUser));
            alert('Account created successfully.');
            clearCreateAccText();
            goToScreen('loginScreen');
        }
        catch (e) {
            showError(e.message);
        }
    }
    else {
        alert('Invalid or missing information.');
    }
}


async function userEditAccountGoAndFill() {
    goToScreen('editAccountScreen');
    const currentUserMail = fromJSON(await getCurrentUser()).email;
    let currentUser = await getUserByIDBackend(toJSON(currentUserMail));

    byID('editFirstName').value = currentUser.firstName;
    byID('editLastName').value = currentUser.lastName;
    byID('editAddress').value = currentUser.address;
    byID('editPhone').value = currentUser.phone;
    byID('editTin').value = currentUser.tin;
}


async function userEditAccount() {
    if (isFormValidEditAcc()) {

        let isPassChanged = false;
        if (byID('editPassword').value !== '' || byID('editConfirmPass').value !== '') {
            if (!isPassValidEditAcc()) {
                alert('Invalid password or confirmation doesn\'t match.')
                return;
            }
            else {
                isPassChanged = true;
            }
        }

        const currentUserMail = fromJSON(await getCurrentUser()).email;
        let currentUser = await getUserByIDBackend(toJSON(currentUserMail));     

        if (byID('editTin').value !== currentUser.tin) {
            if (await tinExists(toJSON(byID('editTin').value))) {
                alert('Already a user with this TIN.')
                return;
            }
        }

        let userUpdated = {
            firstName : byID('editFirstName').value,
            lastName : byID('editLastName').value,
            address : byID('editAddress').value,
            phone : byID('editPhone').value,
            tin : byID('editTin').value
        }
        if (isPassChanged) {
            userUpdated.password = byID('editPassword').value;
        }

        try {
            await updateUser(toJSON(currentUserMail), toJSON(userUpdated));
 
            if (isPassChanged) {
                alert('Information and password updated successfully.');
                await sessionManager.clientSideLogout();
                await updatePageLayout();
                clearEditAccPass();
                goToHome();
            }
            else {
                alert('Information updated successfully.');
                byID('menuTextAccount').innerHTML = `HELLO ${userUpdated.firstName.toUpperCase()}`;
                goToHome();
            }
        }
        catch (e) {
            showError(e.message);
        }
    }
    else{
        alert('Invalid or missing information');
    }
}

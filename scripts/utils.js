'use strict';

////////////////////////

export {
    byID,
    showElement,
    hideElement,
    showClass,
    hideClass,
    toJSON,
    fromJSON,
    showError,
    getCookieValue,
    setCookieValue,
    delCookie,
    User
};

////////////////////////


function byID(id) {
    return document.getElementById(id);
}


function byClass(className) {
    return document.getElementsByClassName(className);
}


function showElement(id) {
    byID(id).style.display = 'block';
}


function hideElement(id) {
    byID(id).style.display = 'none';
}


function showClass(className) {    
    let elements = byClass(className);

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'block';
    }
}


function hideClass(className) {
    let elements = byClass(className);

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
}


function toJSON(string) {
    return JSON.stringify(string);
}


function fromJSON(string) {
    return JSON.parse(string);
}


function showError(errorMsg) {
    alert("ERROR (!)  " + errorMsg);
}


async function getCookieValue(key) {
    if (key.length === 0) {
        throw new TypeError('Empty key.');
    }
    const pair = document
        .cookie
        .split('; ')
        .find(pair => pair.split('=')[0] === key);
    if (pair) {
        const [key, val] = pair.split('=');
        return val === undefined ? "" : val;
    }
    return undefined;
}


async function setCookieValue(key, value, {path, maxAge, expires, sameSite, secure,} = {}) {
    if (key.length === 0) {
        throw new TypeError('Empty key');
    }
    if (path && path[0] !== '/') {
        throw new TypeError(`Invalid path ${path}. Paths must be absolute.`);
    }
    path = path ? `; path=${path}` : '; path=/';
    maxAge = maxAge || maxAge === 0 ? `; max-age=${maxAge}` : '';
    expires = expires ? `; expires=${expires.toUTCString()}` : '';
    sameSite = sameSite ? '; samesite' : '';
    secure = secure ? '; secure' : '';
    document.cookie = `${key}=${value}${maxAge}${expires}${sameSite}${secure}${path}`;
}


async function delCookie(key, path = '/') {
    await setCookieValue(key, '', {path: path, maxAge: 0, expires: new Date(1970, 0, 1)});
}


function User(firstName, lastName, email, password, salt, phone, tin, address) {
    return {firstName, lastName, email, password, salt, phone, tin, address};
}

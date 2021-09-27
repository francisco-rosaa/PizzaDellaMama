'use strict';

////////////////////////

export {
    USERS_STORAGE_KEY,
    ORDERS_STORAGE_KEY,
    INGREDIENTS_STORAGE_KEY,
    myStorage
};

////////////////////////

const USERS_STORAGE_KEY = 'users';
const ORDERS_STORAGE_KEY = 'orders';
const INGREDIENTS_STORAGE_KEY = 'ingredients';

let myStorage = window.localStorage;

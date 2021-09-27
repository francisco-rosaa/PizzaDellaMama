'use strict';

////////////////////////

import {
    USERS_STORAGE_KEY,
    ORDERS_STORAGE_KEY,
    INGREDIENTS_STORAGE_KEY,
    myStorage
} from './db.js';

import {
    usersDB
} from './userController.js';

import {
    ingredientsDB
} from './ingredientsController.js';

export {
    initDB,
    seedUsersDB,
    seedIngredientsDB,
    toJSON,
    fromJSON
};

////////////////////////


async function initDB() {
    if (!myStorage[USERS_STORAGE_KEY]) {
        myStorage.setItem(USERS_STORAGE_KEY, toJSON([]));
    }
    if (!myStorage[ORDERS_STORAGE_KEY]) {
        myStorage.setItem(ORDERS_STORAGE_KEY, toJSON([]));
    }
    if (!myStorage[INGREDIENTS_STORAGE_KEY]) {
        myStorage.setItem(INGREDIENTS_STORAGE_KEY, toJSON([]));
    }
}


async function seedUsersDB() {
    const users = await usersDB();
    if (users.length === 0) {
        const newUser1 = User(
            'Francisco',
            'Rosa',
            'frnuno@protonmail.com',
            'da9c4cd4da449fcfef558c766be27592bba4785d2a8cd91e454a42806ec983a2',
            'Bh0xn2KAWS',
            '919919919',
            '123456789',
            'Sunrise Street, 9, Lisbon');
        const newUser2 = User(
            'Alberto',
            'Alves',
            'alb@mail.com',
            'da9c4cd4da449fcfef558c766be27592bba4785d2a8cd91e454a42806ec983a2',
            'Bh0xn2KAWS',
            '929929929',
            '299454150',
            'Sunrise Street, 11, Lisbon');
        users.push(newUser1, newUser2);
        myStorage[USERS_STORAGE_KEY] = toJSON(users);
    }    
}


async function seedIngredientsDB() {
    const ingredients = await ingredientsDB();    
    if (ingredients.length === 0) {
        const ingredientsArray =
        ['Tomato Sauce',
        'Mozzarella',
        'Parmesan',
        'Gorgonzola',
        'Ham',
        'Gammon',
        'Chorizo',
        'Pepperoni',
        'Pineapple',
        'Apple',
        'Banana'];
        for (let ing of ingredientsArray) {
            ingredients.push(ing);
        }
        myStorage[INGREDIENTS_STORAGE_KEY] = toJSON(ingredients);
    }
}


function toJSON(string) {
    return JSON.stringify(string);
}


function fromJSON(string) {
    return JSON.parse(string);
}


function User(firstName, lastName, email, password, salt, phone, tin, address) {
    return {firstName, lastName, email, password, salt, phone, tin, address};
}

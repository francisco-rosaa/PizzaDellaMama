'use strict';

////////////////////////

import {
    INGREDIENTS_STORAGE_KEY,
    myStorage
} from './db.js';

import {
    toJSON,
    fromJSON
} from './helpers.js';

export {
    getIngredients,
    storeIngredient,
    ingredientsDB
}

////////////////////////


class DBError extends Error {}


async function getIngredients() {
    return toJSON(await ingredientsDB());
}


async function storeIngredient(newIngredient) {
    const ingredients = await ingredientsDB();
    ingredients.push(fromJSON(newIngredient));
    myStorage[INGREDIENTS_STORAGE_KEY] = toJSON(ingredients);
}


async function ingredientsDB() {
    if (!myStorage[INGREDIENTS_STORAGE_KEY]) {
        throw new DBError('Database is empty/uninitialized.');
    }
    return fromJSON(myStorage[INGREDIENTS_STORAGE_KEY]);
}

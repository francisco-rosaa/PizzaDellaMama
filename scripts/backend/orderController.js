'use strict';

////////////////////////

import {
    ORDERS_STORAGE_KEY,
    myStorage
} from './db.js';

import {
    toJSON,
    fromJSON
} from './helpers.js';

export {
    getOrders,
    storeOrder
}

////////////////////////


class DBError extends Error {}


async function getOrders() {
    return toJSON(await ordersDB());
}


async function storeOrder(newOrder) {
    const orders = await ordersDB();
    orders.push(fromJSON(newOrder));
    myStorage[ORDERS_STORAGE_KEY] = toJSON(orders);
}


async function ordersDB() {
    if (!myStorage[ORDERS_STORAGE_KEY]) {
        throw new DBError('Database is empty/uninitialized.');
    }
    return fromJSON(myStorage[ORDERS_STORAGE_KEY]);
}

'use strict';

////////////////////////

import {
    USERS_STORAGE_KEY,
    myStorage
} from './db.js';

import {
    toJSON,
    fromJSON
} from './helpers.js';

import {
    getCookieValue,
    setCookieValue,
    delCookie
} from '../utils.js';

import {
    KJUR,
    b64utoutf8 as base64UrlDecode,
} from './jsrsasign-all-min.js';

export {
    getCurrentUser,
    getUserByIDBackend,
    authenticateUser,
    logoutCurrentUser,
    createUser,
    updateUser,
    tinExists,
    usersDB,
    UserError,
    LoginError,
    LogoutError
};

////////////////////////


class UserError extends Error {}
class LoginError extends UserError {}
class LogoutError extends UserError {}
class DBError extends Error {}


const SECRET = "aP2doagr1$";
const USER_JWT = "user_jwt";
const SALT_LENGTH = 7;


async function getCurrentUser() {
    const NOT_FOUND = "{}";
    const jwt = await getCookieValue(USER_JWT);
    if (!jwt) {
        return NOT_FOUND;
    }    
    if (!KJUR.jws.JWS.verifyJWT(jwt, SECRET, {alg: ['HS256'], verifyAt: 'now'})) {
        return NOT_FOUND;
    }
    const [header, payload] = jwt
        .split(".")
        .slice(0, -1)
        .map(base64UrlDecode)
        .map(KJUR.jws.JWS.readSafeJSONString);
    const user = await getUserByID(payload.sub);
    if (!user) {
        return NOT_FOUND;
    }
    return toJSON(await extractBasicUserInfo(user));
}


async function getUserByIDBackend(userID) {
    return await getUserByID(fromJSON(userID));
}


async function getUserByID(userID) {
    const users = await usersDB();
    return users.find(user => user.email === userID);
}


async function authenticateUser(username, pwd) {
    const user = await getUserByLoginCredentials(username, pwd);
    if (!user) {
        throw new UserError('Invalid username and/or password.');
    }
    await setCookieValue(USER_JWT, await generateJWTForUser(user), {maxAge: 86400});
    return toJSON(await extractBasicUserInfo(user));
}


async function getUserByLoginCredentials(username, pwd) {
    const users = await usersDB();
    return users.find(function(user) {
        const md = new KJUR.crypto.MessageDigest({alg: "sha256", prov: "cryptojs"});
        return user.email === username
            && user.password === md.digestString(user.salt + pwd);
    });
}


async function extractBasicUserInfo(user) {
    const {email, firstName, lastName} = user;
    return {email, firstName, lastName};
}


async function generateJWTForUser(user) {
    const header = toJSON({alg: 'HS256', typ: 'JWT'});
    const now = KJUR.jws.IntDate.get('now');
    const end = KJUR.jws.IntDate.get('now + 1day');
    const payload = toJSON({
        sub: user.email,    // Subject
        iat: now,           // Issued At
        nbf: now,           // Not BeFore
        exp: end,           // Expiration
    });
    return KJUR.jws.JWS.sign("HS256", header, payload, SECRET);
}


async function logoutCurrentUser() {
    await delCookie(USER_JWT);
}


async function createUser(userJSON) {
    let userSpec = fromJSON(userJSON);    
    const existingAttr = await userExists(userSpec);
    if (existingAttr) {
        throw new UserError(`There is already a registered user with this ${existingAttr}.`);
    }
    const md = new KJUR.crypto.MessageDigest({alg: "sha256", prov: "cryptojs"});
    const salt = generateSalt(SALT_LENGTH);
    const newUser = {
        ...userSpec,
        salt: salt,
        password: md.digestString(salt + userSpec.password)
    };
    await storeUser(newUser);
}


async function userExists(newUserSpec) {
    return await findMapped(await usersDB(), (dbUser) =>
           (dbUser.email === newUserSpec.email && 'email')
        || (dbUser.tin === newUserSpec.tin && 'tin')
    );
}


async function findMapped(arrayLikeObject, mappingFn) {
    for (let i = 0; i < arrayLikeObject.length; ++i) {
        const mappedValue = mappingFn(arrayLikeObject[i]);
        if (mappedValue) {
            return mappedValue;
        }
    }
    return undefined;
}


const generateSalt = (function() {
    const letters = betwenChars('a', 'z') + betwenChars('A', 'Z');
    const digits = '0123456789';
    const punct = '$%.#';
    const alphabet = letters + digits + punct;
    
    return function generateSalt(length) {
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        const symbols = [];
        for (const val of array) {
            const index = val % alphabet.length;
            symbols.push(alphabet[index]);
        }
        return symbols.join('');
    };
})();


function betwenChars(startChar, endChar) {
    return betwenCharCodes(startChar.charCodeAt(), endChar.charCodeAt());
}


function betwenCharCodes(startCode, endCode) {
    const length = endCode - startCode + 1;
    return Array
        .from({length: length}, (v, k) => String.fromCharCode(startCode + k))
        .join('');
}


async function storeUser(newUser) {
    const users = await usersDB();
    users.push(newUser);
    myStorage[USERS_STORAGE_KEY] = toJSON(users);
}


async function updateUser(id, userUpd) {
    const userId = fromJSON(id);
    let userUpdated = fromJSON(userUpd);

    try {
        const users = await usersDB();
        let user = users.find(user => user.email === userId);

        user.firstName = userUpdated.firstName;
        user.lastName = userUpdated.lastName;
        user.address = userUpdated.address;
        user.phone = userUpdated.phone;
        user.tin = userUpdated.tin;

        if (userUpdated.password !== undefined) {
            const md = new KJUR.crypto.MessageDigest({alg: "sha256", prov: "cryptojs"});
            const salt = generateSalt(SALT_LENGTH);
            user.salt = salt;
            user.password = md.digestString(salt + userUpdated.password);
        }

        myStorage[USERS_STORAGE_KEY] = toJSON(users);
    }
    catch {
        throw new UserError('There was a problem trying to update your account.');
    }
}


async function tinExists(tin) {
    return await findMapped(await usersDB(), (dbUser) => dbUser.tin === fromJSON(tin));
}


async function usersDB() {
    if (!myStorage[USERS_STORAGE_KEY]) {
        throw new DBError('Database is empty/uninitialized.');
    }
    return fromJSON(myStorage[USERS_STORAGE_KEY]);
}

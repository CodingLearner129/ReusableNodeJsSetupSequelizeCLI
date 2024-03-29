import redis from "redis";

const client = redis.createClient('6379', '127.0.0.1');

client.connect();
client.on('error', err => {
    console.log('Error ' + err);
});

export const set = async (key, value, ttlSeconds = null, noOverRide = false) => {
    try {
        // Ensure ttlSeconds is a number or null
        const expireOption = ttlSeconds !== null ? { EX: parseInt(ttlSeconds), NX: noOverRide } : { NX: noOverRide };
        return await client.set(key, JSON.stringify(value), expireOption);
    } catch (error) {
        throw error;
    }
}

export const get = async (key) => {
    try {
        return JSON.parse(await client.get(key));
    } catch (error) {
        throw error;
    }
}

export const del = async (key) => {
    try {
        return await client.del(key);
    } catch (error) {
        throw error;
    }
}

export const leftPushInList = async (key, value) => {
    try {
        return await client.lPush(key, value);
    } catch (error) {
        throw error;
    }
}

export const rightPushInList = async (key, value) => {
    try {
        return await client.rPush(key, value);
    } catch (error) {
        throw error;
    }
}

export const getAllDataOfList = async (key) => {
    try {
        return await client.lRange(key, 0, -1);
    } catch (error) {
        throw error;
    }
}

export const leftPopInList = async (key) => {
    try {
        return await client.lPop(key);
    } catch (error) {
        throw error;
    }
}

export const rightPopInList = async (key) => {
    try {
        return await client.rPop(key);
    } catch (error) {
        throw error;
    }
}

export const setValuesInSet = async (key, value) => {
    try {
        // it will store data in set
        return await client.sAdd(key, value);
    } catch (error) {
        throw error;
    }
}

export const getSetMembersFromSet = async (key) => {
    try {
        return await client.sMembers(key);
    } catch (error) {
        throw error;
    }
}

export const removeSet = async (key) => {
    try {
        return await client.sRem(key);
    } catch (error) {
        throw error;
    }
}

export const memberExistInSet = async (key, value) => {
    try {
        return await client.sIsMember(key, value);
    } catch (error) {
        throw error;
    }
}

export const setValuesInHashSet = async (key, fieldValue) => {
    try {
        const fieldValuePairArray = Object.entries(fieldValue);
        const promises = fieldValuePairArray.map(([field, value]) => client.hSet(key, field, value));
        return await Promise.all(promises);
    } catch (error) {
        throw error;
    }
}


export const getAllHashSet = async (key) => {
    try {
        return await client.hGetAll(key);
    } catch (error) {
        throw error;
    }
}

export const getHashSetByKeyAndField = async (key, field) => {
    try {
        return await client.hmGet(key, field);
    } catch (error) {
        throw error;
    }
}

export const memberExistInHashSet = async (key, field) => {
    try {
        return await client.hExists(key, field);
    } catch (error) {
        throw error;
    }
}

export const removeValueFromHashSet = async (key, field) => {
    try {
        return await client.hDel(key, field);
    } catch (error) {
        throw error;
    }
}

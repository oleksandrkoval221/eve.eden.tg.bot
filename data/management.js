import fs from "fs";

const getData = async () => {
    const readData = await fs.readFileSync('data/data.json');
    const data = JSON.parse(readData);
    return data
}
const writeData = async (data) => {
    await fs.writeFileSync('data/data.json', JSON.stringify(data));
    return "OK";
}

/**
 * User Register action
 * @param username: string
 */
const userRegister = async (username) => {
    const data = await getData();
    data[username] = data[username] ? {
        ...data[username]
    }: {
        username,
        point: 0,
        level: 0
    }
    writeData(data)
}

/**
 * Add point to user
 * @param {*} username : string
 * @param {*} point : number
 */
const updateData = async (username, pnt) => {
    const data = await getData();
    const currPoint = data[username].point + pnt;
    let level = data[username].level;
    if (
        (level == 0 && currPoint > 250 && currPoint < 501)
        ||
        (level == 1 && currPoint > 500 && currPoint < 1000)
    ){
        level += 1;
    }
    data[username] = {
        username,
        point: currPoint,
        level
    }
    writeData(data)
}

export default {
    userRegister
}
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
    let levelFlag = 0;
    let level = data[username].level;
    if (
        (level == 0 && currPoint >= 250 && currPoint < 500)
        ||
        (level == 1 && currPoint >= 500 && currPoint < 1000)
    ){
        level += 1;
        levelFlag = 1;
    }
    const updatedData = {
        username,
        point: currPoint,
        level
    }
    data[username] = updatedData
    writeData(data);
    return {
        ...updatedData,
        levelFlag
    };
}

export default {
    userRegister,
    updateData
}
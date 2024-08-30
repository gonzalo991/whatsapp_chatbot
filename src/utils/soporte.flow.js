const path = require('path');
const fs = require('fs');

const soporteFlow = async (message, userSession) => {
    const soportePath = path.join(__dirname, "option", "soporte.txt");
    const soporteContent = fs.readFileSync(soportePath, "utf8");

    await message.reply(soporteContent);

    if (message.contains("0")) {
        return { ...userSession, stage: "menu" }
    } else {
        return { ...userSession, stage: "salir" }
    }

}

module.exports = { soporteFlow }
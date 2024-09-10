const path = require("path");
const fs = require("fs");

const consultasFlow = async (message, userSession) => {
    const consultasPath = path.join(__dirname, "options", "consultas.txt");
    const consultasContent = fs.readFileSync(consultasPath, "utf8");

    await message.reply(consultasContent);

    if (message.contains("0")) {
        return { ...userSession, stage: "menu" }
    } else {
        return { ...userSession, stage: "salir" }
    }
}

module.exports = { consultasFlow };
const path = require("path");
const fs = require("fs");

const productsFlow = async (message, userSession) => {
    const productosPath = path.join(__dirname, "options", "productos.txt");
    const productosContent = fs.readFileSync(productosPath, "utf8");

    await message.reply(productosContent);

    if(message.contains("0")){
        return {...userSession, stage: "menu"}
    } else {
        return {...userSession, stage: "salir"}
    }
}

module.exports = {productsFlow}
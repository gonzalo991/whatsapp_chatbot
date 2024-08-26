const path = require("path");
const fs = require('fs');

const mainFlow = (client) => {
    let userSessions = {};  // Objeto en memoria para rastrear el estado de cada usuario
    const menuPath = path.join(__dirname, "options", "menu.txt");
    const menuContent = fs.readFileSync(menuPath, "utf8");
    const volverAlMenu = "Si desea volver al menú principal, responda: 'Menu'.";

    client.on("message", async (message) => {
        const userId = message.from;  // Identificar al usuario por su número
        const userMessage = message.body.trim();

        // Verificamos si el usuario tiene un estado previo en la session
        if (!userSessions[userId]) {
            // Si no hay sesión, enviar el menú de bienvenida
            userSessions[userId] = { stage: "menu" };  // Establecer la etapa inicial
            await message.reply(menuContent);
        } else {
            // Manejo de la lógica de respuesta según la etapa
            switch (userSessions[userId].stage) {
                case "menu":
                    // Responder según la opción seleccionada
                    if (userMessage === "1") {
                        userSessions[userId].stage = "productos";
                        await message.reply("Nuestros productos incluyen una variedad de opciones en línea. ¿Desea ver más detalles?\n\n" + volverAlMenu);
                    } else if (userMessage === "2") {
                        userSessions[userId].stage = "soporte";
                        await message.reply("Por favor, describa el problema técnico que está experimentando.\n\n" + volverAlMenu);
                    } else if (userMessage === "3") {
                        userSessions[userId].stage = "consulta";
                        await message.reply("¿En qué puedo ayudarle? Por favor, formule su consulta.\n\n" + volverAlMenu);
                    } else if (userMessage === "4") {
                        userSessions[userId].stage = "agente";
                        await message.reply("Un agente se pondrá en contacto con usted lo antes posible. Gracias por su paciencia.\n\n" + volverAlMenu);
                    } else if (userMessage === "5") {
                        delete userSessions[userId];  // Terminar la sesión del usuario
                        await message.reply("Gracias por contactar con nosotros. ¡Hasta luego!");
                    } else {
                        // Si la entrada no es válida, reenvía el menú
                        await message.reply("Por favor, seleccione una opción válida.\n\n" + menuContent);
                    }
                    break;
                default:
                    // Manejo de regreso al menú
                    if (userMessage === "m") {
                        userSessions[userId].stage = "menu";  // Regresar al menú principal
                        await message.reply(menuContent);
                    } else {
                        // Si está en otra etapa, ofrecer la opción de regresar al menú
                        await message.reply("No se reconoce el comando. Por favor, seleccione una opción válida o responda con 'M' para volver al menú principal.\n\n" + volverAlMenu);
                    }
                    break;
            }
        }
    });
}

module.exports = { mainFlow }
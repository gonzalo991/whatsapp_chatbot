const path = require("path");
const fs = require('fs');
const { evaluar } = require('./evaluar_opciones');
const productosFlow = require('./productos.flow');
const soporteFlow = require('./soporte.flow');

const mainFlow = (client) => {
    let userSessions = {};  // Objeto en memoria para rastrear el estado de cada usuario
    const menuPath = path.join(__dirname, "options", "menu.txt");
    const welcomePath = path.join(__dirname, "options", "bienvenida.txt");
    const menuContent = fs.readFileSync(menuPath, "utf8");
    const welcome = fs.readFileSync(welcomePath, "utf8");
    // const volverAlMenu = "Si desea volver al menú principal, responda: 'Menu'.";

    client.on("message", async (message) => {

        if (message.body.includes("consulta") || message.body.includes("menu")) {
            const userId = message.from;  // Identificar al usuario por su número
            const mensajeUsuario = message.body.trim().toLowerCase();

            // Verificamos si el usuario tiene un estado previo en la session
            if (!userSessions[userId]) {
                // Si no hay sesión, enviar el menú de bienvenida
                userSessions[userId] = { stage: "menu" };  // Establecer la etapa inicial
                await message.reply(welcome);
            } else {
                await message.reply(welcome);
            }

            // A partir de aqui se puede modularizar en otro archivo

            userSessions[userId] = evaluar(mensajeUsuario, userSessions[userId]);

            // Manejo de la lógica de respuesta según la etapa
            // Nota: probar que no entre en bucle infinito
            switch (userSessions[userId].stage) {
                case "menu":
                    await message.reply(menuContent);
                    delete userSessions[userId];
                    break;
                case "productos":
                    productosFlow(message, userSessions[userId]);
                    delete userSessions[userId]; // oara serrar la session del usuarios y evitar el infinito
                    break;
                case "soporte":
                    soporteFlow(message, userSessions[userId]);
                    delete userSessions[userId];
                    break;
                case "consultas":
                    //consultasFlow()
                    await message.reply("consultas");
                    delete userSessions[userId];
                    break;
                case "agente":
                    // agenteFlow()
                    await message.reply("agente");
                    delete userSessions[userId];
                    break;
                case "salir":
                    await message.reply("¡Gracias por contactarnos!. Hasta luego.");
                    delete userSessions[userId];
                    break;
                case "incorrecto":
                    await message.reply("¡Opción incorrecta, vuelva a intentar escribiendo 'Menu'!");
                    delete userSessions[userId]
                    break;
            }
        }
    });
}

module.exports = { mainFlow }
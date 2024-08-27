const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const dotenv = require("dotenv");
const path = require("path");
const fs = require('fs');
const connection = require("./src/database/connection.database");
const { loadSession, saveSession, deleteSession } = require('./src/controllers/session.controller');
const { mainFlow } = require('./src/utils/main.flow');
dotenv.config({ path: "./.env" });

// Inicializar el cliente de WhatsApp
(async () => {
    const existingSession = await loadSession();  // Cargar la sesión desde MongoDB

    const client = new Client({
        authStrategy: new LocalAuth({
            dataPath: "./auth",
            clientId: "client-one",
        }),
        puppeteer: {
            headless: true,
            args: ["--no-sandbox"],
        },
    });

    client.on("qr", (qr) => {
        if (!existingSession) {
            console.log("Scan the QR code below:");
            qrcode.generate(qr, { small: true });
        } else {
            console.log(`Already have a session: ${existingSession}`);
        }
    });

    client.on("ready", async () => {
        console.log("Client is ready!");
        const sessionData = await client.getState();  // Asegúrate de esperar la promesa
        if (sessionData) {
            await saveSession(sessionData);  // Guardar la sesión si existe
            console.log(`Session data saved: ${sessionData}`);
        } else {
            console.info(`Session data not saved`);
        }
    });

    client.on("authenticated", async (session) => {
        console.log("Authenticated!");
        const sessionData = await client.getState();  // Asegúrase de esperar la promesa
        if (sessionData) {
            await saveSession(sessionData);  // Guardar la sesión en MongoDB
            console.log(sessionData);
        }
    });

    // Flujo de los mensaje recibidos
    mainFlow(client);

    client.on("disconnected", (reason) => {
        // Intentar reconectar basado en la razón de desconexión
        if (reason === "UNPAIRED" || reason === "UNLAUNCHED") {
            console.log("Client is unpaired or unlaunched, restarting...");
            client.destroy();  // Destruir la instancia del cliente
            setTimeout(() => {
                client.initialize();  // Re-inicializar el cliente después de un tiempo de espera
            }, 5000);  // Reintento de reconexión en 5 segundos
        } else if (reason === "CONFLICT") {
            console.log("Conflict detected, attempting to reconnect...");
            setTimeout(() => {
                client.initialize();  // Re-inicializar el cliente después de un tiempo de espera
            }, 5000);  // Reintento de reconexión en 5 segundos
        }
        else if (reason === "LOGOUT") {
            const _id = existingSession._id;
            deleteSession(_id);
            console.log("Client disconnected successfully!");
            client.logout();
        } else {
            console.log("Attempting to reconnect...");
            setTimeout(() => {
                client.initialize();  // Re-inicializar el cliente después de un tiempo de espera
            }, 5000);  // Reintento de reconexión en 5 segundos
        }
        console.log("Client disconnected due to:", reason);
    });

    client.initialize();
})();
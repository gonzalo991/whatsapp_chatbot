const evaluar = (mensajeUsuario, sesion) => {
    switch (mensajeUsuario) {
        case "1":
            return { ...sesion, stage: "productos" };
        case "2":
            return { ...sesion, stage: "soporte" };
        case "3":
            return { ...sesion, stage: "consultas" };
        case "4":
            return { ...sesion, stage: "agente" };
        case "menu":
            return { ...sesion, stage: "menu" };
        case "salir":
            return { ...sesion, stage: "salir" };
        default:
            return { ...sesion, stage: "incorrecto" };
    }
};

const volverAlMenu = (mensajeUsuario, sesion) => {
    switch (mensajeUsuario) {
        case "volver":
            return { ...sesion, stage: "menu" };
        case "salir":
            return { ...sesion, stage: "salir" };
        default:
            return { ...sesion, stage: "incorrecto" };
    }
}

module.exports = { evaluar, volverAlMenu };
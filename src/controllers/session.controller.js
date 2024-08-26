const Session = require('../models/session_model');

// Loading the user session from database
const loadSession = async () => {
    const sessionLoaded = await Session.findOne();
    if (sessionLoaded) {
        return sessionLoaded.sessionData;
    }
    return null;
}

// Saving the new session on database
// Guardar la sesión en la base de datos
const saveSession = async (session) => {
    try {
        const existingSession = await Session.findOne();
        if (existingSession) {
            existingSession.sessionData = session;
            await existingSession.save();
        } else {
            const newSession = new Session({ sessionData: session });
            await newSession.save();
        }
        console.log(`Session saved on database.`);
    } catch (err) {
        console.error(`Session saving failed: ${err}`);
    }
};

module.exports = {loadSession, saveSession};
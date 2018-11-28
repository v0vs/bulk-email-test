require('dotenv').config();

function getEnvVariable(varName){
    const envVariable = process.env[varName];
    if (!envVariable){
        throw new Error(`Environment variable ${varName} is not defined`);
    }

    return envVariable;
}

const dbUrl = getEnvVariable('DB_URL');
const dbName = getEnvVariable('DB_NAME');
const sendgridApiKey = getEnvVariable('SENDGRID_API_KEY');

module.exports = {
    dbUrl, dbName, sendgridApiKey
};
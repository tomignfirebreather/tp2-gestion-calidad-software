require('./database/connection');
const app = require ('./app');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT ?? 9000;

const server = app.listen(port, (error) => {
    console.log(`Server is running on port http://localhost:${port}`);
});

server.on('error', (error) => {
    throw new Error('Something bad happened...');
})
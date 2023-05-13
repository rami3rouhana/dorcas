import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { adminApi } from './adminApi.js';
import connectDatabase, { connection } from './connectDatabase.js';
import { projectApis } from './projectsApi.js';
import { punchApi } from './punchApi.js';

const StartServer = async () => {

    config();
    const app = express();
    app.use(express.json());
    app.use(cors());
    connectDatabase();

    app.get('/', (req, res) => {
        connection.query('SELECT id, name FROM `users`', (err, rows) => {
            res.json(rows);
        });
    })

    adminApi(app);
    projectApis(app);
    punchApi(app);

    app.listen(process.env.PORT, () => {
        console.log(`Listening to port ${process.env.PORT}`);
    }).on('error', (err) => {
        console.log(err);
        process.exit();
    })

}

StartServer();

import express from 'express';
import { connection } from './connectDatabase.js';

export const adminApi = (app) => {

    const router = express.Router();
    app.use('/admin', router);

    router.post('/:id', (req, res) => {
        const userId = req.params.id;
        const { dateTime, status } = req.body;
        connection.query('INSERT INTO `punch`(`uid`, `time`, `state`) VALUES (?,?,?)', [`${userId}`, dateTime, status], (error, results) => {
            if (error) {
                console.error(error);
            } else {
                console.log(`Inserted row with ID ${results.insertId}`);
            }
        });
        res.json({ error: 'null', data: 'Data inserted.' });
    })

}


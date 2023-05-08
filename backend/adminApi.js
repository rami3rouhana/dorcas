import fs, { stat } from 'fs';
import express from 'express';
import moment from 'moment';
import { connection } from './connectDatabase.js';

export const adminApi = (app) => {

    const router = express.Router();
    app.use('/admin', router);

    router.get('/', (req, res) => {
        let mainObject = [];
        fs.readFile('Tabitha_fp_to_import.txt', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const allData = data.split(' ');
            let id, date, time, dayTime, status;

            let count = 0;
            let firstCount = 0;
            for (let i = 0; i < allData.length; i++) {

                if (allData[i] === '') {
                    continue;
                }

                if (firstCount < 3) {
                    firstCount++;
                    continue;
                }

                switch (count) {
                    case 0:
                        id = allData[i]
                        break;
                    case 1:
                        date = allData[i]
                        break;
                    case 2:
                        time = allData[i]
                        break;
                    case 3:
                        dayTime = allData[i]
                        break;
                    case 4:
                        status = allData[i][2] === 'O' ? true : false;
                        break;
                }
                count++
                if (count === 5) {
                    const dateTimeString = `${date} ${time} ${dayTime}`;
                    const dateTime = moment(dateTimeString, 'DD/MM/YYYY h:mm a').format('YYYY-MM-DD HH:mm:ss');
                    mainObject.push({
                        id, dateTime, status
                    })
                    count = 0;
                }
            }
            mainObject.forEach((obj) => {
                connection.query('INSERT INTO `punch`(`uid`, `time`, `state`) VALUES (?,?,?)', [`10${obj.id}`, obj.dateTime, obj.status], (error, results) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log(`Inserted row with ID ${results.insertId}`);
                    }
                });
            });
            res.json(mainObject);
        });
    });

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
    })
    res.json({ error: 'null', data: 'Data inserted.' });
}


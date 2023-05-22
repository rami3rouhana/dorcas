import express from 'express';
import { connection } from './connectDatabase.js';
import XLSX from 'xlsx';


export const punchApi = (app) => {

    const router = express.Router();
    app.use('/punch', router);

    router.get('/:id/:start/:end', (req, res) => {
        const userId = req.params.id;
        const startDate = req.params.start;
        const endDate = req.params.end;
        connection.query('SELECT punch.id, punch.time, punch.state, punch.comment, work_location.locations FROM punch INNER JOIN work_location ON punch.work_location_id = work_location.id AND punch.uid=? WHERE punch.time BETWEEN ? AND ?', [userId, startDate, endDate], (err, rows) => {
            res.json(rows);
        });
    });

    router.post('/:id', (req, res) => {
        const userId = req.params.id;
        const { time, state, comment, work_location_id } = req.body;
        connection.query('INSERT INTO `punch`(`uid`, `time`, `state`, `comment`, `work_location_id`) VALUES (?,?,?,?,?)', [userId, time, state, comment, work_location_id], (err, rows) => {
            res.json(rows);
        });
    });

    router.patch('/:id', (req, res) => {
        const userId = req.params.id;
        const { time, comment, work_location_id } = req.body;
        connection.query('UPDATE `punch` SET `time`=?,`comment`=?,`work_location_id`=? WHERE `id`=?', [time, comment, work_location_id, userId], (err, rows) => {
            res.json(rows);
        });
    });

    router.delete('/:id', (req, res) => {
        const punchId = req.params.id;
        connection.query('DELETE FROM `punch` WHERE `id` = ?', punchId, (err, rows) => {
            res.json(rows);
        });
    });

    router.get('/excel/:userID', (req, res) => {

        const userId = req.params.userID;
        const workbook = XLSX.readFile('./test.xlsm');
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 5 });

        // Fetch all records from the database for the given user
        connection.query('SELECT punch.uid, punch.time, punch.state FROM punch WHERE uid=?', [userId], (error, results) => {
            if (error) throw error;

            // Convert each record to a string in a specific format for comparison
            const existingRecords = results.map(row => `${row.uid}-${row.time.toISOString()}-${row.state}`);

            rows.forEach((row, index) => {
                if (index === 0) {
                    return;
                }
                if (row[0] && row[1] && row[2]) {
                    const dateSerial = row[0]; // this is your serial number
                    const originDate = new Date(Date.UTC(1899, 11, 30)); // Excel origin date is 1899-12-30, JavaScript counts months from 0

                    const newDate = new Date(originDate.getTime() + dateSerial * 24 * 60 * 60 * 1000);
                    const dateString = newDate.toISOString().slice(0, 10);

                    const startTimeString = `${dateString} ${row[1]}`;
                    const endTimeString = `${dateString} ${row[2]}`;

                    const startTime = new Date(startTimeString);
                    const endTime = new Date(endTimeString);

                    if (isNaN(startTime) || isNaN(endTime)) {
                        console.log(`Invalid date format. Start time: ${startTimeString}, End time: ${endTimeString}`);
                        return;
                    }

                    // Convert new record to a string in the same format for comparison
                    const newRecordStart = `${userId}-${startTime.toISOString()}-0`;
                    const newRecordEnd = `${userId}-${endTime.toISOString()}-1`;

                    // If the new records don't exist in the database, insert them
                    if (!existingRecords.includes(newRecordStart)) {
                        connection.query('INSERT INTO punch (uid, time, state) VALUES (?, ?, 0)', [userId, startTime], (error) => {
                            if (error) throw error;
                        });
                    }
                    if (!existingRecords.includes(newRecordEnd)) {
                        connection.query('INSERT INTO punch (uid, time, state) VALUES (?, ?, 1)', [userId, endTime], (error) => {
                            if (error) throw error;
                        });
                    }
                }
            });

            res.json({ message: 'Data processed' });
        });
    });
}    
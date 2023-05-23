import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { adminApi } from './adminApi.js';
import connectDatabase, { connection } from './connectDatabase.js';
import { projectApis } from './projectsApi.js';
import { punchApi } from './punchApi.js';
import multer from 'multer';
import XLSX from 'xlsx';
import path from 'path';
import moment from 'moment';
import fs from 'fs';

const StartServer = async () => {

    config();
    const app = express();
    app.use(express.json());
    app.use(cors());
    connectDatabase();
    const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

    app.get('/', (req, res) => {
        connection.query('SELECT id, name FROM `users`', (err, rows) => {
            res.json(rows);
        });
    })

    // Function to validate if the file has an allowed extension
    const isFileValid = (file) => {
        const allowedExtensions = ['.xlsx', '.xls', '.xlsm', '.txt'];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        return allowedExtensions.includes(fileExtension);
    };

    // Function to process an Excel file
    const processExcelFile = (res, file, userId) => {

        const workbook = XLSX.readFile(file.path);
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

        });
        res.json({ message: 'Data processed' });
    };

    // Function to process a text file
    const processTextFile = (res, file) => {
        let mainObject = [];
        fs.readFile(file.path, 'utf8', (err, data) => {
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
        });
        res.json(mainObject);
    };

    app.post('/upload/:userId', upload.single('file'), (req, res) => {

        const userId = req.params.userId;
        // Handle the uploaded file here
        const file = req.file;

        if (!file) {
            res.status(400).send('No file uploaded');
            return;
        }

        if (!isFileValid(file)) {
            res.status(400).send('Invalid file type');
            return;
        }

        // File is valid, determine file type and call appropriate processing function
        if (file.mimetype.includes('excel')) {
            processExcelFile(res, file, userId);
        } else if (userId === 'None' || file.mimetype.includes('text')) {
            processTextFile(res, file);
        } else {
            res.status(400).send('Unsupported file type');
            return;
        }

        res.send('File uploaded successfully!');
    });

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

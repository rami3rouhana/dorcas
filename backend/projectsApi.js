import express from 'express';
import { connection } from './connectDatabase.js';

export const projectApis = (app) => {

    const router = express.Router();
    app.use('/projects', router);

    router.get('/', (req, res) => {
        connection.query('SELECT * FROM `projects`', (err, rows) => {
            res.json(rows);
        });
    });

    router.post('/', (req, res) => {
        const { projectNumber, projectName, projectLocation, startDate, endDate } = req.body
        connection.query('INSERT INTO `projects` (`p_number`, `p_name`, `p_location`, `start_date`, `end_date`) VALUES (?,?,?,?,?)',
            [projectNumber, projectName, projectLocation, startDate, endDate], (err, results, fields) => {
                res.json({ err, results, fields });
            });
    });

    router.patch('/:id', (req, res) => {
        const projectId = req.params.id;
        const { projectNumber, projectName, projectLocation, startDate, endDate } = req.body
        connection.query('UPDATE `projects` SET `p_number`=?,`p_name`=?,`p_location`=?,`start_date`=?,`end_date`=? WHERE `id`=?',
            [projectNumber, projectName, projectLocation, startDate, endDate, projectId], (err, results, fields) => {
                res.json({ err, results, fields });
            });
    });

    router.delete('/:id', (req, res) => {
        const projectId = req.params.id;
        connection.query('DELETE FROM `projects` WHERE `id`= ?', [projectId], (err, rows) => {
            res.json({ err, results, fields });
        });
    })

}



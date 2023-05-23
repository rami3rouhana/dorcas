import express from 'express';
import { connection } from './connectDatabase.js';

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

}    
import express from 'express';
import { connection } from './connectDatabase.js';


export const punchApi = (app) => {

    const router = express.Router();
    app.use('/punch', router);

    router.get('/:id', (req, res) => {
        const userId = req.params.id;
        connection.query('SELECT * FROM `punch` WHERE `uid` = 1', userId, (err, rows) => {
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
        const { time, state, comment, work_location_id } = req.body;
        connection.query('UPDATE `punch` SET `uid`=?,`time`=?,`state`=?,`comment`=?,`work_location_id`=? WHERE `id`=?', [userId, time, state, comment, work_location_id], (err, rows) => {
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



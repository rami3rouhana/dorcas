import express from 'express';
import { connection } from './connectDatabase.js';


export const punchApi = (app) => {

    const router = express.Router();
    app.use('/userProject', router);

    router.get('/:id', (req, res) => {
        const userId = req.params.id;
        connection.query('SELECT * FROM `user_projects` WHERE `uid` = ?', [userId], (err, rows) => {
            res.json(rows);
        });
    })

    router.post('/', (req, res) => {
        const { userId, projectId, percentage } = req.body;
        connection.query('INSERT INTO `user_projects` (`uid`, `project_number`, `percentage`) VALUES (?,?,?)', [userId, projectId, percentage], (err, rows) => {
            res.json({ err, results, fields });
        });
    })

    router.patch('/:id', (req, res) => {
        const userProject = req.params.id;
        const { userId, projectId, percentage } = req.body;
        connection.query('UPDATE `user_projects`SET `uid`= ? , `project_number`= ?, `percentage` = ? VALUES (?,?,?) WHERE `id`=?', [userId, projectId, percentage, userProject], (err, rows) => {
            res.json({ err, results, fields });
        });
    })

    router.delete('/:id', (req, res) => {
        const userProject = req.params.id;
        connection.query('DELETE FROM `user_projects` WHERE `id`= ?', [userProject], (err, rows) => {
            res.json({ err, results, fields });
        });
    })


}



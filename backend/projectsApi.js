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
        const { projectID, projectName, projectLocation, startDate, endDate } = req.body
        connection.query('INSERT INTO `projects` (`id`, `name`, `location`, `start_date`, `end_date`) VALUES (?,?,?,?,?)',
            [projectID, projectName, projectLocation, startDate, endDate], (err, results, fields) => {
                res.json({ err, results, fields });
            });
    });

    router.patch('/:id', (req, res) => {
        const projectId = req.params.id;
        const { projectID, projectName, projectLocation, startDate, endDate } = req.body
        connection.query('UPDATE `projects` SET `id`=?,`name`=?,`location`=?,`start_date`=?,`end_date`=? WHERE `id`=?',
            [projectID, projectName, projectLocation, startDate, endDate, projectId], (err, results, fields) => {
                res.json({ err, results, fields });
            });
    });

    router.delete('/:id', (req, res) => {
        const projectId = req.params.id;
        connection.query('DELETE FROM `projects` WHERE `id`= ?', [projectId], (err, rows) => {
            res.json({ err, results, fields });
        });
    })

    router.get('/user/:id', (req, res) => {
        const userId = req.params.id;
        connection.query('SELECT projects.name,user_projects.percentage FROM `user_projects` INNER JOIN `projects` ON projects.id = user_projects.project_id AND user_projects.uid = ?', [userId], (err, rows) => {
            res.json(rows);
        });
    });

    router.post('/user/:id', (req, res) => {
        const userId = req.params.id;
        const { projectId, percentage } = req.body;
        connection.query('INSERT INTO `user_projects`(`uid`, `project_id`, `percentage`) VALUES (?,?,?)', [userId, projectId, percentage], (err, rows) => {
            res.json(rows);
        });
    });

}



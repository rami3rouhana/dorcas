import { useState, useEffect } from "react";
import axios from 'axios';

const ProjectList = () => {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetch = await axios.get(`http://localhost:8000/projects/`);
            setProjects(fetch.data);
        }
        fetchData();
    }, []);

    const deleteProject = async (e) => {
        const projectId = e.currentTarget.parentElement.parentElement.className;
        e.currentTarget.parentElement.parentElement.remove()
        try {
            await axios.delete(`http://localhost:8000/projects/${projectId}`)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ul>
            {projects.length !== 0 && projects.map((project) =>
                <ul key={project.id} className={project.id}>
                    <li>{project.name}</li>
                    <li>{project.location}</li>
                    <li>{project.start_date}</li>
                    <li>{project.end_date}</li>
                    <li><button onClick={deleteProject}>Delete</button></li>
                </ul>
            )}
        </ul>
    );
}

export default ProjectList;

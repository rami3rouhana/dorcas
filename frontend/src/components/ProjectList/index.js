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

    return (
        <ul>
            {projects.map((project) =>
                <ul key={project.id}>
                    <li>{project.name}</li>
                    <li>{project.location}</li>
                    <li>{project.start_date}</li>
                    <li>{project.end_date}</li>
                </ul>
            )}
        </ul>
    );
}

export default ProjectList;

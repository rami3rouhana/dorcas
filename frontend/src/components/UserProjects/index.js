import axios from "axios";
import { useEffect, useState } from "react";

const UserProjects = ({ userId }) => {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchProjects = await axios.get(`http://localhost:8000/projects/user/${userId}`);
            setProjects(fetchProjects.data)
        }
        fetchData();
    }, [userId]);

    const handleDelete = async (e) => {
        const projectId = e.currentTarget.parentElement.parentElement.className;
        e.currentTarget.parentElement.parentElement.remove();
        const fetchProjects = await axios.delete(`http://localhost:8000/projects/user/${projectId}`);
        console.log(projectId)
    }

    return (
        <>
            <ul>
                {
                    projects.map((project) => {
                        return <ul key={project.id} className={project.id}>
                            <li>{project.name}</li>
                            <li>{project.percentage}</li>
                            <li><button onClick={handleDelete}>Delete</button></li>
                        </ul>
                    })
                }
            </ul>
        </>
    )
}

export default UserProjects;
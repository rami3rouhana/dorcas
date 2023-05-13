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

    return (
        <>
            <ul>
                {
                    projects.map((project) => {
                        return <ul key={project.id}>
                            <li>{project.name}</li>
                            <li>{project.percentage}</li>
                        </ul>
                    })
                }
            </ul>
        </>
    )
}

export default UserProjects;
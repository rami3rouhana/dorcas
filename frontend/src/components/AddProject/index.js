import { useEffect, useState } from "react";
import axios from "axios";

const AddProject = ({ userId, setUserId }) => {

    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [percentage, setPercentage] = useState();
    const [projectId, setProjecId] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const fetchUsers = await axios.get(`http://localhost:8000/`);
            const fetchProjects = await axios.get(`http://localhost:8000/projects`);
            setUsers(fetchUsers.data);
            setProjects(fetchProjects.data)
        }
        fetchData();
    }, []);

    const handleSubmit = async () => {
        const data = { projectId, percentage }
        const sendData = await axios.post(`http://localhost:8000/projects/user/${userId}`, data);
        debugger
    }

    return (
        <>
            <select value={userId} onChange={(e) => {
                setUserId(e.currentTarget.value)
            }}>
                <option></option>
                {users.map(user => {
                    return <option key={user.id} value={user.id}>{user.name}</option>
                })}
            </select>
            <select value={projectId} onChange={(e) => {
                setProjecId(e.currentTarget.value)
            }}>
                <option></option>
                {projects.map(project => {
                    return <option key={project.id} value={project.id}>{project.name}</option>
                })}
            </select>
            <input type="number" onChange={(e) => setPercentage(e.currentTarget.value)} />
            <button onClick={() => handleSubmit()}>Add Percentage</button>
        </>

    )

}

export default AddProject;
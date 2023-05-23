import { useState, useRef } from "react";
import AddProject from "../components/AddProject";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";
import UserProjects from "../components/UserProjects";

const ProjectPage = () => {

    const [userId, setUserId] = useState();

    return (
        <div className="Project">
            <ProjectList />
            <ProjectForm />
            <AddProject userId={userId} setUserId={setUserId} />
            <UserProjects userId={userId} />
        </div>
    );
}

export default ProjectPage;

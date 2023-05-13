import { useState } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

const ProjectForm = () => {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [projectName, setProjectName] = useState("");
    const [projectID, setProjectID] = useState("");
    const [projectLocation, setProjectLocation] = useState("");

    const handleSubmit = async () => {
        const data = { projectID, projectName, projectLocation, startDate, endDate }
        const sendData = await axios.post(`http://localhost:8000/projects`, data);
        debugger
    }

    return (
        <div>
            <label>Project Number</label>
            <input type="number" onChange={(e) => setProjectID(e.currentTarget.value)} />
            <label>Project Name</label>
            <input type="text" onChange={(e) => setProjectName(e.currentTarget.value)} />
            <label>Project Location</label>
            <input type="text" onChange={(e) => setProjectLocation(e.currentTarget.value)} />
            <label>Project Start Date</label>
            <DatePicker
                value={startDate}
                onChange={(date) => setStartDate(moment(date).format('YYYY-MM-DD'))}
                dateFormat="DD/MM/YYYY"
            />
            <label>Project End Date</label>
            <DatePicker
                value={endDate}
                onChange={(date) => setEndDate(moment(date).format('YYYY-MM-DD'))}
                dateFormat="DD/MM/YYYY"
            />
            <button onClick={() => handleSubmit()}>Submit</button>
        </div>
    )

}

export default ProjectForm;
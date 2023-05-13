import { useEffect, useState } from "react";
import axios from "axios";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import PunchTable from "../components/PunchTable";

const PunchPage = () => {

    const [users, setUsers] = useState([]);
    const [userID, setUserId] = useState();
    const [selectedStartDatetime, setSelectedStartDatetime] = useState(null);
    const [selectedEndDatetime, setSelectedEndDatetime] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const fetch = await axios.get(`http://localhost:8000/`);
            setUsers(fetch.data);
        }
        fetchData();
    }, []);

    return (
        <div className="Punch">
            <select value={userID} onChange={(e) => {
                setUserId(e.currentTarget.value)
            }}>
                <option></option>
                {users.map(user => {
                    return <option key={user.id} value={user.id}>{user.name}</option>
                })}
            </select>
            <label>Start Date</label>
            <Datetime
                value={selectedStartDatetime}
                onChange={(date) => setSelectedStartDatetime(date.format('YYYY-MM-DD HH:mm:ss'))}
                dateFormat="DD/MM/YYYY"
                timeFormat="HH:mm:ss"
            />
            <label>End Date</label>
            <Datetime
                value={selectedEndDatetime}
                onChange={(date) => setSelectedEndDatetime(date.format('YYYY-MM-DD HH:mm:ss'))}
                dateFormat="DD/MM/YYYY"
                timeFormat="HH:mm:ss"
            />
            <PunchTable userID={userID} startDate={selectedStartDatetime} endDate={selectedEndDatetime} />
        </div>
    );
}

export default PunchPage;

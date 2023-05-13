import { useEffect, useState } from "react";
import axios from 'axios';

const PunchTable = ({ userID, startDate, endDate }) => {

    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetch = await axios.get(`http://localhost:8000/punch/${userID}/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`);
            setEntries(fetch.data);
        }
        fetchData();
    }, [userID, startDate, endDate]);

    return (
        <table>
            <thead>
                <tr>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Work Location</th>
                    <th>Comment</th>
                </tr>
            </thead>
            <tbody>
                {entries.map(element =>
                    <tr key={element.id}>
                        <td>{element.time}</td>
                        <td>{element.state ? 'Out' : 'In'}</td>
                        <td>{element.locations}</td>
                        <td>{element.comment}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default PunchTable;
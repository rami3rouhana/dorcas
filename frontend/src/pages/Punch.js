import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import PunchTable from "../components/PunchTable";
import ReactToPrint from "react-to-print";
import { Button } from "react-bootstrap";

const PunchPage = () => {
    const [users, setUsers] = useState([]);
    const [userID, setUserId] = useState();
    const [selectedStartDatetime, setSelectedStartDatetime] = useState(null);
    const [selectedEndDatetime, setSelectedEndDatetime] = useState(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const componentRef = useRef(null);
    const printRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:8000/`);
            setUsers(response.data);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (isPrinting && printRef.current) {
            printRef.current.handlePrint();
        }
    }, [isPrinting]);

    const handleButtonClick = () => {
        setIsPrinting(true);
    };

    const handleAfterPrint = () => {
        setIsPrinting(false);
    };

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
            <div>
                <ReactToPrint
                    ref={printRef}
                    trigger={() => <Button onClick={handleButtonClick}>Print this out!</Button>}
                    onBeforeGetContent={() => { setIsPrinting(true); }}
                    content={() => componentRef.current}
                    onAfterPrint={handleAfterPrint}
                />

                {/* component to be printed */}
                <PunchTable ref={componentRef} userID={userID} startDate={selectedStartDatetime} endDate={selectedEndDatetime} isPrinting={isPrinting} />
            </div>
        </div>
    );
};

export default PunchPage;

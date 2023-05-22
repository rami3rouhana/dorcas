import React, { useState, useEffect } from "react";

const SummaryTable = ({ entries }) => {
    const [totalHours, setTotalHours] = useState(0);
    const [workingDays, setWorkingDays] = useState(0);
    const [totalDays, setTotalDays] = useState(0);
    const [transport, setTransport] = useState(0);

    useEffect(() => {
        let hours = 0;
        let days = 0;
        let daySet = new Set();
        let newTransport = 0;
        let newTransportHalf = 0;
        entries.forEach((element) => {
            if (element.length !== 0) {
                const punchIn = element[1].punchIn;
                const punchOut = element[1].punchOut;

                if (punchIn && punchOut) {
                    const timeIn = new Date(punchIn.time);
                    const timeOut = new Date(punchOut.time);
                    const timeDiff = timeOut - timeIn;
                    const hr = Math.floor(timeDiff / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
                    const hoursForThisDay = hr + minutes / 60;
                    if (punchIn.locations === "Office" || punchIn.locations === "Training" || punchOut.locations === "Office" || punchOut.locations === "Training") {
                        if (hr > 4) {
                            newTransport += 1;
                        } else {
                            newTransportHalf += 1;
                        }
                    }
                    hours += hoursForThisDay;
                    days++;
                    daySet.add(new Date(punchIn.time).toDateString());
                }
            }
        });
        newTransportHalf = newTransportHalf / 2;
        newTransport = newTransport + Math.floor(newTransportHalf);
        setTransport(newTransport);
        setTotalHours(hours);
        setWorkingDays(days);
        setTotalDays(daySet.size);
    }, [entries]);

    return (
        <table>
            <thead>
                <tr>
                    <th>Total Hours</th>
                    <th>Working Days</th>
                    <th>Total Days</th>
                    <th>Transport</th>
                    <th>Expected Hours</th>
                    <th>Diffrence</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{totalHours.toFixed(2)}</td>
                    <td>{workingDays}</td>
                    <td>{totalDays}</td>
                    <td>{transport}</td>
                    <td>{transport * 8}</td>
                    <td>{Math.floor(Math.abs(totalHours.toFixed(2) - (transport * 8)))}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default SummaryTable;

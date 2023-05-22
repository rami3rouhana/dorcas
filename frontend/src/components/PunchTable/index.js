import React, { forwardRef, useEffect, useState } from "react";
import axios from "axios";
import SummaryTable from "../SummaryTable";

const PunchTable = forwardRef(({ userID, startDate, endDate, isPrinting }, ref) => {
    const [entries, setEntries] = useState([]);
    const [projects, setProjects] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/punch/${userID}/${encodeURIComponent(
                        startDate
                    )}/${encodeURIComponent(endDate)}`
                );
                const fetch = await axios.get(`http://localhost:8000/projects/user/${userID}`);


                const mergedObjects = {};

                if (response.data.length === 0) {
                    return;
                }

                for (const obj of response.data) {
                    const { time, state } = obj;
                    const date = time.split("T")[0];

                    if (!mergedObjects[date]) {
                        mergedObjects[date] = {
                            punchIn: null,
                            punchOut: null,
                        };
                    }

                    if (state === 0) {
                        mergedObjects[date].punchIn = obj;
                    } else if (state === 1) {
                        mergedObjects[date].punchOut = obj;
                    }
                }
                let newTotalHours = 0;
                const mappedArray = Object.entries(mergedObjects).map(
                    ([key, value]) => {
                        const timeIn = new Date(value.punchIn.time);
                        const timeOut = new Date(value.punchOut.time);
                        const timeDiff = (timeOut - timeIn) / (1000 * 60 * 60);
                        newTotalHours = newTotalHours + timeDiff;
                        return [
                            key,
                            value,
                            timeDiff
                        ];
                    }
                );

                const mappedProjects = fetch.data.map((project) => {
                    return [
                        project.name,
                        project.percentage * newTotalHours / 100
                    ]
                })
                setProjects(mappedProjects);
                mappedArray.push([]);
                setRefresh(false);
                setEntries(mappedArray);
                setIsLoaded(true);
            } catch (error) {
                console.error("Error fetching punch data:", error);
            }
        };

        fetchData();
    }, [refresh, userID, startDate, endDate]);

    useEffect(() => {
        setIsLoaded(false);
        let projectIndex = 0;
        const newEntries = [...entries];
        if (projects.length !== 0) {
            let remainingHours = projects[projectIndex][1];
            let rest = 0;
            for (let i = 0; i < newEntries.length - 1; i++) {
                if (newEntries[i][1] !== null) {
                    newEntries[i][3] = null;
                    while (remainingHours <= newEntries[i][2]) {
                        rest = newEntries[i][2] - remainingHours;
                        if (i === newEntries.length - 2) {
                            newEntries[i][3] = (newEntries[i][3] || '') + projects[projectIndex][0] + '(' + rest.toFixed(1) + ')';
                        } else {
                            newEntries[i][3] = (newEntries[i][3] || '') + projects[projectIndex][0] + '(' + rest.toFixed(1) + ')' + '|';
                        }
                        projectIndex = projectIndex + 1;
                        remainingHours = newEntries[i][2] + remainingHours;
                    }
                    if (projectIndex >= projects.length) {
                        break;
                    }
                    remainingHours = remainingHours - newEntries[i][2];
                    newEntries[i][3] = (newEntries[i][3] || '') + projects[projectIndex][0] + '(' + (newEntries[i][2] - rest).toFixed(1) + ')';
                    rest = 0;
                }
            }
        }

        setEntries(newEntries);
        setIsLoaded(true);
    }, [projects])

    const saveChanges = async (e) => {
        const tableRow = e.currentTarget.parentNode.parentElement;
        const date = tableRow.children[0].innerHTML;
        const punchInId = tableRow.children[1].className;
        const punchOutId = tableRow.children[2].className;
        const timeIn = tableRow.children[1].innerHTML;
        const timeOut = tableRow.children[2].innerHTML;
        const commentIn = tableRow.children[4].innerHTML;
        const commentOut = tableRow.children[5].innerHTML;

        try {
            if (punchInId) {
                const combinedDateTime = date + " " + timeIn;
                const jsDate = new Date(combinedDateTime);
                const sqlDate = jsDate.toISOString().split("T")[0];
                const sqlTime = jsDate.toLocaleTimeString([], { hour12: false });
                const sqlDateTime = sqlDate + " " + sqlTime;

                const punchIn = {
                    time: sqlDateTime,
                    work_location_id: 1,
                    comment: commentIn || "",
                };

                await axios.patch(`http://localhost:8000/punch/${punchInId}`, punchIn);
            }

            if (punchOutId) {
                const combinedDateTime = date + " " + timeOut;
                const jsDate = new Date(combinedDateTime);
                const sqlDate = jsDate.toISOString().split("T")[0];
                const sqlTime = jsDate.toLocaleTimeString([], { hour12: false });
                const sqlDateTime = sqlDate + " " + sqlTime;

                const punchOut = {
                    time: sqlDateTime,
                    work_location_id: 1,
                    comment: commentOut || "",
                };

                await axios.patch(
                    `http://localhost:8000/punch/${punchOutId}`,
                    punchOut
                );
            }
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    const deleteHandle = async (e) => {
        const tableRow = e.currentTarget.parentNode.parentElement;
        const punchInId = tableRow.children[1].className;
        const punchOutId = tableRow.children[2].className;

        try {
            if (punchInId) {
                await axios.delete(`http://localhost:8000/punch/${punchInId}`);
            }

            if (punchOutId) {
                await axios.delete(`http://localhost:8000/punch/${punchOutId}`);
            }
            tableRow.remove();
        } catch (error) {
            console.error("Error deleting entry:", error);
        }
    };

    const addEntry = async (e) => {
        const tableRow = e.currentTarget.parentElement.parentElement;
        const date = tableRow.children[0].innerHTML;
        const timeIn = tableRow.children[1].innerHTML;
        const timeOut = tableRow.children[2].innerHTML;
        const commentIn = tableRow.children[4].innerHTML;
        const commentOut = tableRow.children[5].innerHTML;

        try {
            const punchInDateTime = new Date(date + " " + timeIn);
            const punchOutDateTime = new Date(date + " " + timeOut);

            const punchIn = {
                time: punchInDateTime.toISOString(),
                state: 0,
                comment: commentIn,
                work_location_id: 1,
            };

            const punchOut = {
                time: punchOutDateTime.toISOString(),
                state: 1,
                comment: commentOut,
                work_location_id: 1,
            };

            tableRow.children[0].innerHTML = "";
            tableRow.children[1].innerHTML = "";
            tableRow.children[2].innerHTML = "";
            tableRow.children[4].innerHTML = "";
            tableRow.children[5].innerHTML = "";

            await axios.post(`http://localhost:8000/punch/${userID}`, punchIn);
            await axios.post(`http://localhost:8000/punch/${userID}`, punchOut);

            setRefresh(true);
        } catch (error) {
            console.error("Error adding entry:", error);
        }
    };
    if (!isLoaded) {
        return <div>Loading...</div>
    }

    return (
        <table ref={ref}>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    {isPrinting && <th>Time Difference</th>}
                    <th>Work Location</th>
                    <th>Comment In</th>
                    <th>Comment Out</th>
                    <th>Project</th>
                    {!isPrinting && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {entries.map((element) => {
                    if (element.length !== 0) {
                        const punchIn = element[1].punchIn;
                        const punchOut = element[1].punchOut;

                        if (punchIn && punchOut) {
                            const timeIn = new Date(punchIn.time);
                            const timeOut = new Date(punchOut.time);
                            const timeDiff = timeOut - timeIn;
                            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                            const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
                            const formattedTimeDiff = `${hours}h ${minutes}m`;
                            return (
                                <tr key={element[0]}>
                                    <td contentEditable>{element[0]}</td>
                                    <td contentEditable className={punchIn.id || ""}>
                                        {punchIn.time ? timeIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                    </td>
                                    <td contentEditable className={punchOut.id || ""}>
                                        {punchOut.time ? timeOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                    </td>
                                    {isPrinting && <td>{formattedTimeDiff}</td>}
                                    <td contentEditable>{punchIn.locations || punchOut.locations}</td>
                                    <td contentEditable>{punchIn.comment || ""}</td>
                                    <td contentEditable>{punchOut.comment || ""}</td>
                                    <td>{element[3]}</td>
                                    {!isPrinting && (
                                        <td>
                                            <button onClick={saveChanges}>Save Changes</button>
                                            <button onClick={deleteHandle}>Delete</button>
                                        </td>
                                    )}
                                </tr>
                            );
                        }
                    } else {
                        return (
                            <tr key="add-entry-row">
                                <td contentEditable></td>
                                <td contentEditable></td>
                                <td contentEditable></td>
                                {isPrinting && <td></td>}
                                <td contentEditable></td>
                                <td contentEditable></td>
                                <td contentEditable></td>
                                <td contentEditable></td>
                                {!isPrinting && (
                                    <td>
                                        <button onClick={addEntry}>Save</button>
                                    </td>
                                )}
                            </tr>
                        );
                    }
                    return null;
                })}
            </tbody>
            <SummaryTable entries={entries} />
        </table>
    );
});

export default PunchTable;

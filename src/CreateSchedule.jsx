import React from 'react';
import './CreateSchedule.css';

const CreateSchedule = () => {
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['8:30', '9:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30'];
    return (
        <div>
            <table>
                <thead>
                    <tr align="center">
                        <th>Day</th>
                        <th>Time</th>
                        {years.map(year => <th key={year}>{year}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {days.map(day => (
                        times.map((time, index) => (
                            <tr key={day + time}>
                                {index === 0 && <td rowSpan={times.length}>{day}</td>}
                                <td>{time}</td>
                                {years.map(year => <td key={year + day + time}>-</td>)}
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CreateSchedule;
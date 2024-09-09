import React, { useEffect, useState } from 'react';

function CheckInOutHistory() {
    const [records, setRecords] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('/api/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => setRecords(data))
        .catch(err => {
            setError('Error fetching records: ' + err.message);
            console.error('Fetch error:', err);
        });
    }, []);

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    };

    const thTdStyle = {
        border: '1px solid #ddd',
        padding: '8px',
    };

    const thStyle = {
        ...thTdStyle,
        backgroundColor: '#f2f2f2',
        textAlign: 'left',
    };

    const tdStyle = {
        ...thTdStyle,
        textAlign: 'left',
    };

    return (
        <div>
            <h2>Check-In/Check-Out History</h2>
            {error && <p>{error}</p>}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Check-In Location</th>
                        <th style={thStyle}>Check-In Date/Time</th>
                        <th style={thStyle}>Check-Out Location</th>
                        <th style={thStyle}>Check-Out Date/Time</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr key={record.id}>
                            <td style={tdStyle}>{record.check_in_location || 'Location not available'}</td>
                            <td style={tdStyle}>{record.check_in_at ? new Date(record.check_in_at).toLocaleString() : 'N/A'}</td>
                            <td style={tdStyle}>{record.check_out_location || 'Location not available'}</td>
                            <td style={tdStyle}>{record.check_out_at ? new Date(record.check_out_at).toLocaleString() : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CheckInOutHistory;

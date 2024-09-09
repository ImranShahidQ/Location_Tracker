import React from 'react';
import CheckInOut from './CheckInOut'; 
import CheckInOutHistory from './CheckInOutHistory'; 
import '../css/CheckInOutContainer.css';

function CheckInOutContainer() {
    return (
        <div className="container">
            <div className="check-in-out-section">
                <CheckInOut />
            </div>
            <div className="history-section">
                <CheckInOutHistory />
            </div>
        </div>
    );
}

export default CheckInOutContainer;

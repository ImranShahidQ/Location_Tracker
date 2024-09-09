import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import '../css/CheckInOut.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function CheckInOut() {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const handleCheckIn = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                sendLocationToApi('check-in', latitude, longitude);
            },
            () => {
                setStatus('Error fetching location');
            }
        );
    };

    const handleCheckOut = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                sendLocationToApi('check-out', latitude, longitude);
            },
            () => {
                setStatus('Error fetching location');
            }
        );
    };

    const handleLogout = () => {
        const token = localStorage.getItem('token');

        fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
        })
        .then((response) => response.json())
        .then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        })
        .catch(() => {
            setStatus('Error during logout');
        });
    };

    const sendLocationToApi = (action, latitude, longitude) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
    
        if (!token) {
            setStatus('Authentication token not found. Please log in.');
            return;
        }
    
        fetch(`/api/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({
                latitude,
                longitude,
                user_id: user.id,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`API call failed with status ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setStatus(data.message);
        })
        .catch((error) => {
            console.error(error);
            setStatus('Error with API call');
        });
    };

    return (
        <div className="check-in-out-container">
            <h1>Check-In/Check-Out</h1>
            <div className="button-container">
                <button className="action-button" onClick={handleCheckIn}>Check-In</button>
                <button className="action-button" onClick={handleCheckOut}>Check-Out</button>
                <button className="action-button" onClick={handleLogout}>Logout</button>
            </div>
            {location.latitude && (
                <>
                    <p>
                        Latitude: {location.latitude}, Longitude: {location.longitude}
                    </p>
                    <MapContainer
                        center={[location.latitude, location.longitude]}
                        zoom={15}
                        style={{ height: '400px', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[location.latitude, location.longitude]} />
                    </MapContainer>
                </>
            )}
            <p>Status: {status}</p>
        </div>
    );
}

export default CheckInOut;

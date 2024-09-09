import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import CheckInOutContainer from './CheckInOutContainer';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/check-in-out"
                    element={
                        <ProtectedRoute>
                            <CheckInOutContainer />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    </React.StrictMode>
);

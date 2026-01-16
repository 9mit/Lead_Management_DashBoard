import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('phone'); // phone, chart, group, layers

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            logout();
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#C5F82A" />
                    <path d="M2 17L12 22L22 17" stroke="#C5F82A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="#C5F82A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${activeTab === 'phone' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('phone');
                        document.querySelector('.main-content').scrollTo({ top: 0, behavior: 'smooth' });
                        // Add immediate feedback
                        const btn = document.querySelector('.nav-item.active');
                        btn.style.transform = 'scale(1.2)';
                        setTimeout(() => btn.style.transform = 'scale(1)', 200);
                    }}
                    title="Dashboard"
                >
                    <span className="icon">📞</span>
                </button>
                <button
                    className={`nav-item ${activeTab === 'chart' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('chart');
                        document.querySelector('.analytics-grid').scrollIntoView({ behavior: 'smooth' });
                    }}
                    title="Analytics"
                >
                    <span className="icon">📊</span>
                </button>
            </nav>

            <div className="sidebar-footer">
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                    title="Logout"
                >
                    <span className="icon">🚪</span>
                    <span className="logout-text">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

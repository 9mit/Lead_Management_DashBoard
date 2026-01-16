import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './RightPanel.css';

const RightPanel = () => {
    const [newLeads, setNewLeads] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leadsRes, statsRes] = await Promise.all([
                    api.get('/api/leads?limit=3&stage=New'),
                    api.get('/api/analytics/summary')
                ]);

                if (leadsRes.data.success) setNewLeads(leadsRes.data.data);
                if (statsRes.data.success) setStats(statsRes.data.data);
            } catch (err) {
                console.error("Failed to fetch right panel data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper for initials
    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
    };

    return (
        <aside className="right-panel">
            {/* Admin Profile - Now Dynamic */}
            <div className="admin-profile">
                <div className="admin-info">
                    <span className="admin-name">{user?.username || 'Admin'}</span>
                    <span className="admin-role">{user?.role || 'Manager'}</span>
                </div>
                <div className="admin-avatar">
                    {getInitials(user?.username || 'AD')}
                </div>
            </div>

            {/* New Leads */}
            <section className="panel-section">
                <h3>New Leads</h3>
                <div className="panel-list">
                    {loading ? (
                        <div className="loading-small" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Loading...</div>
                    ) : newLeads.length > 0 ? (
                        newLeads.map(lead => (
                            <div key={lead._id} className="panel-card">
                                <div className="user-avatar">{getInitials(lead.name)}</div>
                                <span className="user-name">{lead.name}</span>
                            </div>
                        ))
                    ) : (
                        <div className="no-data-small" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>No new leads</div>
                    )}
                </div>
            </section>

            {/* Stage Summary */}
            <section className="panel-section">
                <h3>Stage Summary</h3>
                <div className="panel-list">
                    {stats?.leadsByStage?.map((item, index) => (
                        <div key={index} className="panel-card with-meta">
                            <div className="user-avatar" style={{ background: 'var(--bg-accent)', color: 'black' }}>
                                {item.count}
                            </div>
                            <div className="user-info">
                                <span className="user-name">{item.stage}</span>
                                <span className="user-activity">Pipeline Stage</span>
                            </div>
                            <div className="break-timer">
                                {Math.round((item.count / stats.totalLeads) * 100)}%
                            </div>
                        </div>
                    ))}
                    {!loading && !stats && <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>No summary data</div>}
                </div>
            </section>
        </aside>
    );
};

export default RightPanel;

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import Analytics from './Analytics';
import LeadDetails from './LeadDetails';
import './Dashboard.css';

const Dashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [stageFilter, setStageFilter] = useState('');
    const [callingLead, setCallingLead] = useState(null);
    const [selectedDate, setSelectedDate] = useState('07'); // Default day



    useEffect(() => {
        const fetchLeads = async () => {
            setLoading(true);
            try {
                // Construct query parameters
                const params = new URLSearchParams({
                    page,
                    limit: 10,
                    sortBy,
                    sortOrder,
                    ...(searchTerm && { search: searchTerm }),
                    ...(stageFilter && { stage: stageFilter }),
                    ...(selectedDate && { day: selectedDate })
                });

                const res = await api.get(`/api/leads?${params.toString()}`);
                if (res.data.success) {
                    setLeads(res.data.data);
                    setTotalPages(res.data.pagination.pages);
                }
            } catch (err) {
                console.error("Failed to fetch leads", err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchLeads();
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchTerm, page, sortBy, sortOrder, stageFilter, selectedDate]);


    // Reset to page 1 when search or filter changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm, stageFilter]);

    // Helper to get initials
    const getInitials = (name) => {
        return name
            ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
            : '??';
    };

    const handleCallLead = (e, lead) => {
        e.stopPropagation();
        setCallingLead(lead);
    };

    const handleMessageLead = (e, lead) => {
        e.stopPropagation();
        alert(`Opening message draft for ${lead.name} at ${lead.email}...`);
    };


    const getStageStyle = (stage) => {
        switch (stage) {
            case 'New': return { background: '#ffd700', color: '#000' };
            case 'Contacted': return { background: 'var(--bg-accent)', color: '#000' };
            case 'Qualified': return { background: '#4ade80', color: '#000' };
            case 'Converted': return { background: '#22c55e', color: '#000' };
            case 'Lost': return { background: '#ef4444', color: '#fff' };
            default: return { background: '#333', color: '#fff' };
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                {/* Top Bar with Search & Filters */}
                <div className="top-bar">
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <small style={{ color: 'var(--text-secondary)', fontSize: '12px', marginRight: 'auto', paddingLeft: '20px' }}>
                        Last updated: {new Date().toLocaleTimeString()}
                    </small>
                    <div className="filter-controls">
                        <select
                            value={stageFilter}
                            onChange={(e) => setStageFilter(e.target.value)}
                            className="minimal-select"
                        >
                            <option value="">All Stages</option>
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Converted">Converted</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="minimal-select"
                        >
                            <option value="createdAt">Sort by Date</option>
                            <option value="name">Sort by Name</option>
                        </select>
                        <button
                            className="toggle-order"
                            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                            title={`Current order: ${sortOrder.toUpperCase()}`}
                        >
                            {sortOrder === 'desc' ? '↓' : '↑'}
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <Analytics
                    selectedDate={selectedDate}
                    onDateChange={(date) => setSelectedDate(date)}
                />


                {/* Dashboard Leads Table */}
                <section className="ongoing-section">
                    <div className="section-header">
                        <h3>Recent Leads</h3>
                        <div className="pagination-small">
                            <span>Page {page} of {totalPages}</span>
                            <div className="page-btns">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    ‹
                                </button>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container" style={{ color: 'white' }}>
                            <div className="loader-dots"><span></span><span></span><span></span></div>
                        </div>
                    ) : leads.length > 0 ? (
                        <div className="table-responsive">
                            <table className="leads-table">
                                <thead>
                                    <tr>
                                        <th>Lead</th>
                                        <th>Contact</th>
                                        <th>Company</th>
                                        <th>Stage</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead) => (
                                        <tr
                                            key={lead._id}
                                            onClick={() => setSelectedLead(lead)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="col-lead">
                                                <div className="lead-cell">
                                                    <div className="user-avatar-sm">{getInitials(lead.name)}</div>
                                                    <div>
                                                        <div className="lead-name">{lead.name}</div>
                                                        <div className="lead-email-sm">{lead.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="col-contact">{lead.phone || '-'}</td>
                                            <td className="col-company">{lead.company || '-'}</td>
                                            <td className="col-stage">
                                                <span
                                                    className="stage-pill"
                                                    style={getStageStyle(lead.stage)}
                                                >
                                                    {lead.stage}
                                                </span>
                                            </td>
                                            <td className="col-date">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="col-actions">
                                                <div className="action-buttons">
                                                    <button onClick={(e) => handleCallLead(e, lead)}>📞</button>
                                                    <button onClick={(e) => handleMessageLead(e, lead)}>💬</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="no-data-msg" style={{ color: 'var(--text-secondary)' }}>
                            No leads found matching your criteria.
                        </div>
                    )}
                </section>
            </main>

            <RightPanel />

            {/* Lead Details Modal */}
            {selectedLead && (
                <LeadDetails
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                />
            )}

            {/* Call Overlay UI */}
            {callingLead && (
                <div className="call-overlay">
                    <div className="call-card-popup">
                        <div className="call-avatar">{getInitials(callingLead.name)}</div>
                        <div className="call-details">
                            <h4>Calling {callingLead.name}...</h4>
                            <p>{callingLead.phone || 'Private Number'}</p>
                            <span className="calling-dots">Line Secured ...</span>
                        </div>
                        <button className="end-call-btn" onClick={() => setCallingLead(null)}>
                            End Call
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './Analytics.css';

const Analytics = ({ selectedDate, onDateChange }) => {
    const [stats, setStats] = useState(null);
    const [timeRange, setTimeRange] = useState('days'); // days, weeks, months

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch stats for the specific day if provided
                const res = await api.get(`/api/analytics/summary?day=${selectedDate}`);
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, [timeRange, selectedDate]);


    // Mock days for the date picker
    const days = [
        { d: '01', w: 'Sat' }, { d: '02', w: 'Sun' }, { d: '03', w: 'Mon' },
        { d: '04', w: 'Tue' }, { d: '05', w: 'Wed' }, { d: '06', w: 'Thu' },
        { d: '07', w: 'Fri' }, { d: '08', w: 'Sat' }, { d: '09', w: 'Sun' },
        { d: '10', w: 'Mon' }, { d: '11', w: 'Tue' }, { d: '12', w: 'Wed' },
        { d: '13', w: 'Thu' }
    ];

    // Generate a semi-random path based on the selected date and timeRange to ensure visual uniqueness
    const generatePath = () => {
        const seed = (parseInt(selectedDate) || 7) + (timeRange === 'weeks' ? 20 : timeRange === 'months' ? 40 : 0);
        const points = [];
        const step = timeRange === 'days' ? 100 : 50;
        for (let x = 0; x <= 900; x += step) {
            // Distinct math patterns for different time ranges
            let y;
            if (timeRange === 'days') {
                y = 100 + Math.sin(x * 0.01 + seed) * 50 + Math.cos(seed * 0.5) * 20;
            } else if (timeRange === 'weeks') {
                y = 80 + Math.sin(x * 0.05 + seed) * 30 + (x / 10); // Upward trend
            } else {
                y = 120 + Math.cos(x * 0.02 + seed) * 60 - Math.sin(x * 0.1) * 10; // Volatile
            }
            points.push(`${x},${y}`);
        }
        return `M${points.join(' L')}`;
    };

    const getXAxisLabels = () => {
        if (timeRange === 'days') {
            return ['7 am', '11 am', '3 pm', '7 pm', '11 pm'];
        } else if (timeRange === 'weeks') {
            return ['Mon', 'Wed', 'Fri', 'Sun'];
        } else {
            return ['Jan', 'Apr', 'Jul', 'Oct', 'Dec'];
        }
    };

    return (
        <section className="analytics-section">
            <div className="analytics-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h2>Performance</h2>
                    {stats && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span className="stat-pill accent">
                                {stats.totalLeads} Total Leads
                            </span>
                            <span className="stat-pill outline">
                                {stats.conversionRate}% Conv. Rate
                            </span>
                        </div>
                    )}
                </div>
                <div className="date-filters">
                    <button
                        className={timeRange === 'days' ? 'active' : ''}
                        onClick={() => setTimeRange('days')}
                    >
                        Days
                    </button>
                    <button
                        className={timeRange === 'weeks' ? 'active' : ''}
                        onClick={() => setTimeRange('weeks')}
                    >
                        Weeks
                    </button>
                    <button
                        className={timeRange === 'months' ? 'active' : ''}
                        onClick={() => setTimeRange('months')}
                    >
                        Months
                    </button>
                </div>
            </div>

            {/* Date Scroll */}
            <div className="date-scroller">
                {days.map((day, i) => (
                    <div
                        key={i}
                        className={`date-pill ${selectedDate === day.d ? 'active' : ''}`}
                        onClick={() => onDateChange(day.d)}
                    >
                        <span className="day-num">{day.d}</span>
                        <span className="day-week">{day.w}</span>
                    </div>
                ))}
            </div>

            {/* Visual Graph Deterministic for each Day & Range */}
            <div className="graph-container">
                <div className="y-axis">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                </div>

                <div className="graph-plot">
                    <svg width="100%" height="200" preserveAspectRatio="none">
                        <path
                            d={generatePath()}
                            fill="none"
                            stroke="#C5F82A"
                            strokeWidth="3"
                            strokeLinecap="round"
                            style={{ transition: 'd 0.5s ease' }}
                        />

                        <line x1="450" y1="0" x2="450" y2="200" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                        <circle cx="450" cy={timeRange === 'days' ? 110 : 80} r="6" fill="#000" stroke="#C5F82A" strokeWidth="2" style={{ transition: 'cy 0.5s ease' }} />
                    </svg>

                    <div className="x-axis">
                        {getXAxisLabels().map((label, idx) => (
                            <span key={idx}>{label}</span>
                        ))}
                    </div>
                </div>
            </div>
        </section>

    );
};

export default Analytics;

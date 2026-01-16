import './LeadDetails.css';

const LeadDetails = ({ lead, onClose }) => {
    if (!lead) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Lead Details</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="detail-group">
                        <label>Name</label>
                        <p>{lead.name}</p>
                    </div>

                    <div className="detail-group">
                        <label>Email</label>
                        <p><a href={`mailto:${lead.email}`}>{lead.email}</a></p>
                    </div>

                    <div className="detail-group">
                        <label>Phone</label>
                        <p>{lead.phone || 'Not provided'}</p>
                    </div>

                    <div className="detail-group">
                        <label>Company</label>
                        <p>{lead.company || 'Not provided'}</p>
                    </div>

                    <div className="detail-row">
                        <div className="detail-group">
                            <label>Stage</label>
                            <p><span className={`badge stage-${lead.stage.toLowerCase()}`}>{lead.stage}</span></p>
                        </div>

                        <div className="detail-group">
                            <label>Status</label>
                            <p><span className={`badge status-${lead.status.toLowerCase()}`}>{lead.status}</span></p>
                        </div>
                    </div>

                    <div className="detail-group">
                        <label>Created Date</label>
                        <p>{formatDate(lead.createdAt)}</p>
                    </div>

                    {lead.notes && (
                        <div className="detail-group">
                            <label>Notes</label>
                            <p>{lead.notes}</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="close-modal-button" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default LeadDetails;

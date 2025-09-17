import React from 'react';
import PaymentRow from './PaymentRow';

const PaymentList = ({ payments, loading, onConfirm, onRefresh }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="mb-0">All Payments</h3>
          <button className="btn btn-secondary btn-sm" disabled>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Loading...
          </button>
        </div>
        <div className="card-body">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="mb-0">All Payments</h3>
        <button className="btn btn-secondary btn-sm" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>
      <div className="card-body">
        {payments.length === 0 ? (
          <div className="text-center text-muted py-5">
            <p className="mb-0">No payments found.</p>
            <small>Create your first payment using the form above.</small>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Payment ID</th>
                  <th>Customer ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                    onConfirm={onConfirm}
                    formatDate={formatDate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {payments.length > 0 && (
        <div className="card-footer text-muted">
          <small>Total payments: {payments.length}</small>
        </div>
      )}
    </div>
  );
};

export default PaymentList;
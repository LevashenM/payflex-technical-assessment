import React, { useState } from 'react';

const PaymentRow = ({ payment, onConfirm, formatDate }) => {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    if (window.confirm('Are you sure you want to confirm this payment?')) {
      setConfirming(true);
      try {
        await onConfirm(payment.id);
      } catch (error) {
        // Error handling is done in parent component
      } finally {
        setConfirming(false);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badgeClass = status === 'Confirmed' ? 'bg-success' : 'bg-warning text-dark';
    return <span className={`badge ${badgeClass}`}>{status}</span>;
  };

  return (
    <tr>
      <td>
        <code className="payment-id" title={payment.id}>
          {payment.id}
        </code>
      </td>
      <td>{payment.customerId}</td>
      <td>${payment.amount.toFixed(2)}</td>
      <td>{getStatusBadge(payment.status)}</td>
      <td>
        <small className="text-muted">
          {formatDate(payment.createdAt)}
        </small>
      </td>
      <td>
        {payment.status === 'Pending' ? (
          <button
            className="btn btn-success btn-sm"
            onClick={handleConfirm}
            disabled={confirming}
          >
            {confirming ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Confirming...
              </>
            ) : (
              '✓ Confirm'
            )}
          </button>
        ) : (
          <span className="text-muted">
            <small>No actions</small>
          </span>
        )}
      </td>
    </tr>
  );
};

export default PaymentRow;
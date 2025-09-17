import React, { useState } from 'react';

const PaymentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    amount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId.trim()) {
      alert('Customer ID is required');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        customerId: formData.customerId.trim(),
        amount: parseFloat(formData.amount)
      });

      // Reset form on success
      setFormData({ customerId: '', amount: '' });
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="mb-0">Create New Payment</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="customerId" className="form-label">Customer ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="customerId"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-control"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              'Create Payment'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
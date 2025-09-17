import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PaymentForm from './components/PaymentForm';
import PaymentList from './components/PaymentList';
import Alert from './components/Alert';

// Use service discovery URL from Aspire, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://localhost:49381/api';

function App() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/payments`);
      setPayments(response.data);
    } catch (error) {
      console.error('Error loading payments:', error);
      showAlert('Error loading payments. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments`, paymentData);
      showAlert('Payment created successfully!', 'success');
      loadPayments();
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      const message = error.response?.data || 'Error creating payment. Please try again.';
      showAlert(message, 'danger');
      throw error;
    }
  };

  const confirmPayment = async (paymentId) => {
    try {
      await axios.post(`${API_BASE_URL}/payments/simulate-confirmation/${paymentId}`);
      showAlert('Payment confirmed successfully!', 'success');
      loadPayments();
    } catch (error) {
      console.error('Error confirming payment:', error);
      const message = error.response?.data || 'Error confirming payment. Please try again.';
      showAlert(message, 'danger');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <div className="min-vh-100">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand">Payment Orchestrator</span>
        </div>
      </nav>

      <div className="container mt-4">
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

        <PaymentForm onSubmit={createPayment} />

        <PaymentList
          payments={payments}
          loading={loading}
          onConfirm={confirmPayment}
          onRefresh={loadPayments}
        />
      </div>
    </div>
  );
}

export default App;
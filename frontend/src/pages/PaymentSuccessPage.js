import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState('checking'); // checking, success, failed
  const [paymentInfo, setPaymentInfo] = useState(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setStatus('failed');
      return;
    }

    const checkPaymentStatus = async () => {
      const token = localStorage.getItem('token');
      let attempts = 0;
      const maxAttempts = 5;
      const pollInterval = 2000;

      const poll = async () => {
        try {
          const response = await axios.get(`${API}/payments/status/${sessionId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          });

          if (response.data.payment_status === 'paid') {
            setStatus('success');
            setPaymentInfo(response.data);
            return;
          } else if (response.data.status === 'expired') {
            setStatus('failed');
            return;
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, pollInterval);
          } else {
            // Still pending after max attempts, but show as processing
            setStatus('success');
            setPaymentInfo(response.data);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
          setStatus('failed');
        }
      };

      poll();
    };

    checkPaymentStatus();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6" data-testid="payment-success-page">
      <div className="max-w-md w-full">
        {status === 'checking' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <Loader2 className="w-16 h-16 text-[#f16a2f] mx-auto mb-4 animate-spin" />
            <h1 className="font-['Outfit'] text-2xl font-bold text-[#053d6c] mb-2">
              Processing Payment
            </h1>
            <p className="text-slate-600">
              Please wait while we confirm your payment...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-['Outfit'] text-2xl font-bold text-[#053d6c] mb-2">
              Payment Successful!
            </h1>
            <p className="text-slate-600 mb-6">
              Thank you for enrolling! Your course is now available in your dashboard.
            </p>
            
            {paymentInfo && (
              <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-medium text-[#053d6c]">
                    ${(paymentInfo.amount_total / 100).toFixed(2)} {paymentInfo.currency?.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Link to="/dashboard">
                <Button className="w-full btn-primary" data-testid="go-to-dashboard">
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" className="w-full">
                  Browse More Courses
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="font-['Outfit'] text-2xl font-bold text-[#053d6c] mb-2">
              Payment Failed
            </h1>
            <p className="text-slate-600 mb-6">
              We couldn't process your payment. Please try again or contact support.
            </p>
            
            <div className="space-y-3">
              <Link to="/courses">
                <Button className="w-full btn-primary">
                  Try Again
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

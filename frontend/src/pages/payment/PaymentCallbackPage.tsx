import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { paymentApi } from '@/api/payment.api';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const PaymentCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [verificationState, setVerificationState] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [orderId, setOrderId] = useState<string | null>(null);

    const { execute: verifyPayment } = useApi((ref: string) =>
        paymentApi.verifyPayment({ reference: ref })
    );

    const handleVerifyPayment = useCallback(async (reference: string) => {
        try {
            const payment = await verifyPayment(reference);
            
            if (!payment) {
                throw new Error('Payment verification failed');
            }
            
            setOrderId(payment.orderId);
            setVerificationState('success');
        } catch (error) {
            console.error('Payment verification failed:', error);
            setVerificationState('failed');
        }
    }, [verifyPayment]);

    useEffect(() => {
        const reference = searchParams.get('reference') || searchParams.get('trxref');
        
        if (!reference) {
            setVerificationState('failed');
            return;
        }

        handleVerifyPayment(reference);
    }, [searchParams, handleVerifyPayment]);

    if (verificationState === 'verifying') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="max-w-md w-full p-8 text-center">
                    <Loader2 className="w-16 h-16 text-teal-600 mx-auto mb-4 animate-spin" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Verifying Payment
                    </h2>
                    <p className="text-gray-600">
                        Please wait while we confirm your payment...
                    </p>
                </Card>
            </div>
        );
    }

    if (verificationState === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="max-w-md w-full p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Payment Successful!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your order has been confirmed and payment received.
                    </p>
                    <div className="space-y-3">
                        <Button
                            onClick={() => navigate(`/orders/${orderId}`)}
                            className="w-full"
                        >
                            View Order Details
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/orders')}
                            className="w-full"
                        >
                            View All Orders
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="max-w-md w-full p-8 text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Failed
                </h2>
                <p className="text-gray-600 mb-6">
                    We couldn't verify your payment. Please try again or contact support.
                </p>
                <div className="space-y-3">
                    <Button onClick={() => navigate('/cart')} className="w-full">
                        Return to Cart
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/')}
                        className="w-full"
                    >
                        Continue Shopping
                    </Button>
                </div>
            </Card>
        </div>
    );
};
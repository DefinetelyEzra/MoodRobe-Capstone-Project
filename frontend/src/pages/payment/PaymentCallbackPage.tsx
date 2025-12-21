import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { paymentApi } from '@/api/payment.api';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { AxiosError } from 'axios';

interface ErrorResponse {
    error?: string;
    message?: string;
    errors?: Array<{ msg: string; param?: string }>;
}

export const PaymentCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [verificationState, setVerificationState] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { execute: verifyPayment } = useApi((ref: string) =>
        paymentApi.verifyPayment({ reference: ref })
    );

    const handleVerifyPayment = useCallback(async (reference: string) => {
        try {
            console.log('🔍 Starting payment verification for reference:', reference);

            const payment = await verifyPayment(reference);

            console.log('✅ Payment verification response:', payment);

            if (!payment) {
                throw new Error('Payment verification failed - no response');
            }

            setOrderId(payment.orderId);
            setVerificationState('success');
            console.log('✅ Verification successful, orderId:', payment.orderId);
        } catch (error) {
            console.error('❌ Payment verification failed:', error);

            // Type-safe error handling
            if (error instanceof AxiosError) {
                const axiosError = error as AxiosError<ErrorResponse>;
                console.error('❌ Error response:', {
                    status: axiosError.response?.status,
                    data: axiosError.response?.data,
                    headers: axiosError.response?.headers
                });

                // Extract error message
                const errorData = axiosError.response?.data;
                if (errorData?.error) {
                    setErrorMessage(errorData.error);
                } else if (errorData?.message) {
                    setErrorMessage(errorData.message);
                } else if (errorData?.errors && Array.isArray(errorData.errors)) {
                    setErrorMessage(errorData.errors.map((e) => e.msg).join(', '));
                }
            } else if (error instanceof Error) {
                setErrorMessage(error.message);
            }

            setVerificationState('failed');
        }
    }, [verifyPayment]);

    useEffect(() => {
        console.log('🔍 PaymentCallbackPage mounted');
        console.log('📦 All URL params:', Object.fromEntries(searchParams.entries()));

        const reference = searchParams.get('reference') || searchParams.get('trxref');

        console.log('🎫 Payment reference:', reference);

        if (!reference) {
            console.error('❌ No reference found in URL');
            setVerificationState('failed');
            setErrorMessage('No payment reference found in URL');
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
                    {errorMessage || "We couldn't verify your payment. Please try again or contact support."}
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
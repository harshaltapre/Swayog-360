import { useEffect, useState, type FormEvent } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { hasStripePublishableKey, stripePromise } from '../../lib/stripe';
import { createSetupIntent, syncPaymentMethod } from '../../utils/api';

interface PaymentGatewayModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface PaymentMethodFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

function PaymentMethodForm({ onClose, onSuccess }: PaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not finished loading yet. Please wait a moment and try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (result.error) {
        setError(result.error.message ?? 'Unable to save this payment method.');
        return;
      }

      const setupIntent = result.setupIntent;
      const paymentMethodId =
        typeof setupIntent?.payment_method === 'string'
          ? setupIntent.payment_method
          : setupIntent?.payment_method?.id;

      if (!paymentMethodId) {
        setError('Stripe completed setup, but the payment method could not be synchronized.');
        return;
      }

      await syncPaymentMethod(paymentMethodId);
      onSuccess();
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save this payment method.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg flex gap-3">
        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 flex-shrink-0">lock</span>
        <p className="text-sm text-blue-900 dark:text-blue-100">
          Cards are stored securely by Stripe. This form never sends raw card details to our server.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
        <PaymentElement />
      </div>

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !stripe || !elements}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Saving Card...' : 'Save Payment Method'}
        </button>
      </div>
    </form>
  );
}

export default function PaymentGatewayModal({ onClose, onSuccess }: PaymentGatewayModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(hasStripePublishableKey);
  const [error, setError] = useState<string | null>(
    hasStripePublishableKey ? null : 'Missing VITE_STRIPE_PUBLISHABLE_KEY. Add it to the frontend environment before saving cards.'
  );

  useEffect(() => {
    if (!hasStripePublishableKey) {
      return;
    }

    let active = true;

    void createSetupIntent()
      .then((response) => {
        if (!active) {
          return;
        }

        if (!response.clientSecret) {
          setError('Stripe did not return a setup client secret.');
          return;
        }

        setClientSecret(response.clientSecret);
      })
      .catch((setupError) => {
        if (!active) {
          return;
        }

        setError(setupError instanceof Error ? setupError.message : 'Unable to initialize Stripe setup.');
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-lg w-full">
          <div className="flex items-center justify-between p-6 border-b bg-white dark:bg-slate-900 rounded-t-lg">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Payment Method</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Save a card for future invoice payments.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">Preparing secure payment form...</div>
            ) : null}

            {!loading && error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

            {!loading && !error && clientSecret && stripePromise ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                  },
                }}
              >
                <PaymentMethodForm onClose={onClose} onSuccess={onSuccess} />
              </Elements>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

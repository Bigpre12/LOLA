'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, customerId: 'cus_placeholder' }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 p-8">
      <PricingCard
        title="Starter"
        price="$30"
        priceId="price_starter_placeholder"
        features={['100 generations/month', 'Basic templates', 'Email support']}
        onSubscribe={handleCheckout}
      />
      <PricingCard
        title="Pro"
        price="$60"
        priceId="price_pro_placeholder"
        features={['500 generations/month', 'Advanced templates', 'Priority support', 'API access']}
        onSubscribe={handleCheckout}
        featured
      />
      <PricingCard
        title="Enterprise"
        price="Custom"
        features={['Unlimited generations', 'Custom templates', 'White-label', 'Dedicated support']}
        onSubscribe={() => window.location.href = '/contact'}
      />
    </div>
  );
}

function PricingCard({ title, price, priceId, features, onSubscribe, featured }: any) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!priceId) return onSubscribe();
    
    setLoading(true);
    await onSubscribe(priceId);
    setLoading(false);
  };

  return (
    <div className={`border rounded-lg p-6 ${featured ? 'border-blue-500 shadow-lg' : ''}`}>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-3xl font-bold my-4">{price}<span className="text-sm">/month</span></p>
      <ul className="space-y-2 mb-6">
        {features.map((f: string) => <li key={f}>✓ {f}</li>)}
      </ul>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Loading...' : priceId ? 'Subscribe' : 'Contact Us'}
      </button>
    </div>
  );
}

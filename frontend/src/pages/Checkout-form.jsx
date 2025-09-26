import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState, useContext } from 'react';
import api from '../components/api';
import { GlobalContext } from '../context/Context';


export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState("");

  let {state} = useContext(GlobalContext)

  let baseUrl = state.baseURL

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("Processing...");

    const response = await fetch("http://localhost:5004/api/v1/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000 }), // $10
    });

    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setStatus(`❌ ${result.error.message}`);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setStatus("✅ Payment succeeded!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={!stripe}>Pay $10</button>
      <p>{status}</p>
    </form>
  );
}

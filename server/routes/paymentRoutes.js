// File: server/routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {

  console.log('Received payment request:', req.body);

  try {
    const { amount, currency } = req.body;

    // Validate the input
    if (!amount || !currency) {
      return res.status(400).json({ error: 'Amount and currency are required' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    // Send the client secret to the client
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: 'An error occurred while creating the PaymentIntent' });
  }
});

module.exports = router;
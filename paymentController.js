const Payment = require('../models/Payment');

// POST /payments
exports.processPayment = async (req, res) => {
  try {
    const { orderId, userId, amount, method } = req.body;

    // Check for duplicate payment on same order
    const existing = await Payment.findOne({ orderId, status: 'completed' });
    if (existing) return res.status(409).json({ error: 'Payment already completed for this order' });

    // Simulate payment processing (always succeeds in MVP)
    const payment = await Payment.create({ orderId, userId, amount, method, status: 'completed' });
    res.status(201).json({ message: 'Payment processed successfully', payment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /payments/:orderId
exports.getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) return res.status(404).json({ error: 'Payment not found for this order' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /payments/:id/refund
exports.refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'refunded' },
      { new: true }
    );
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json({ message: 'Payment refunded', payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

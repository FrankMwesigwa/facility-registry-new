import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// Simple webhook receiver for testing
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.header('X-Signature') || '';
    const apiKey = req.header('X-API-KEY') || '';
    const algo = req.header('X-Signature-Alg') || '';

    // If a ?secret= is provided in query, verify HMAC for debugging
    let verified = null;
    if (req.query.secret) {
      const bodyStr = JSON.stringify(req.body || {});
      const expected = crypto.createHmac('sha256', String(req.query.secret)).update(bodyStr).digest('hex');
      verified = expected === signature;
    }

    console.log('📥 Webhook received:', {
      apiKey,
      algo,
      signature,
      verified,
      body: req.body,
    });

    res.json({ ok: true, receivedAt: new Date().toISOString(), verified });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;



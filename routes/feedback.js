const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { body, validationResult } = require('express-validator');

router.post(
    '/submit-feedback',
    [
      body('userr').notEmpty().withMessage('Name is required.'),
      body('uemail').isEmail().withMessage('Valid email is required.'),
      body('ucomment').notEmpty().withMessage('Comment is required.')
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const { userr, uemail, ucomment } = req.body;
        const feedback = new Feedback({ userr, uemail, ucomment });
        await feedback.save();
        res.json({ message: 'Feedback submitted successfully!' });
      } catch (error) {
        console.error('Database save error:', error);
        res.redirect('/Err');
      }
    }
  );
// routes/feedback.js
router.get('/api/feedback', async (req, res) => {
  try {
      const feedbacks = await Feedback.find(); 
      res.json(feedbacks);
  } catch (error) {
      console.error('Error fetching feedback:', error);
      res.redirect('/Err');
  }
});


module.exports = router;

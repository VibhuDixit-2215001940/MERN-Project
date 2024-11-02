const express = require('express');
const router = express.Router();
router.get('/Sanitization', async (req, res) => {
    res.render('Sanitization/sanitization');
});

module.exports = router;

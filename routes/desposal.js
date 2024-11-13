const express = require('express');
const router = express.Router();

router.get('/Desposal', async (req, res) => {
    res.render('Desposal/desposal.ejs');
});

module.exports = router;
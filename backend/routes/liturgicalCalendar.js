const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/v1/liturgical/year/2025
router.get('/liturgical/year/:year', async (req, res) => {
  const { year } = req.params;

  try {
    const response = await axios.get(
      `https://litcal.johnromanodorazio.com/api/dev/calendar?year=${year}&locale=en`
    );
    const liturgicalEvents = response.data.litcal;

    res.json(liturgicalEvents);
  } catch (err) {
    console.error('Liturgical Year API error:', err.message);
    res.status(500).json({ message: 'Failed to fetch liturgical year data' });
  }
});

module.exports = router;

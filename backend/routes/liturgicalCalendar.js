const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/v1/liturgical/year/2025
router.get('/liturgical/year/:year', async (req, res) => {
  const { year } = req.params;

  try {
    const response = await axios.get(
      `https://litcal.johnromanodorazio.com/api/dev/calendar?year=${year}&locale=en`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const liturgicalEvents = response.data?.litcal;

    if (!Array.isArray(liturgicalEvents)) {
      return res.status(500).json({ message: 'Invalid liturgical data structure' });
    }

    console.log(`Fetched ${liturgicalEvents.length} liturgical events for year ${year}`);
    res.status(200).json({ litcal: liturgicalEvents });
  } catch (err) {
    console.error('Liturgical Year API error:', err.message);
    res.status(500).json({ message: 'Failed to fetch liturgical year data' });
  }
});


module.exports = router;

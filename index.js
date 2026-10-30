const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Render ko live rakhne ke liye route
app.get('/', (req, res) => {
  res.send(`
    <h2>Guruvidhya Class Bot is Active!</h2>
    <p>System is running smoothly.</p>
  `);
});

// Yahan hum ek webhook endpoint set kar rahe hain jo aane wale messages ko handle karega
app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;
    console.log("New update received:", update);
    res.status(200).send('OK');
  } catch (err) {
    console.error("Error processing update:", err);
    res.status(500).send('Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

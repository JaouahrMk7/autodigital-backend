// server.js
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Route principale
app.get("/", (req, res) => {
  res.send("Backend AutoDigital attivo! Usa /generate o /publish.");
});

// Route per generare contenuti OpenAI
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 500
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route per creare prodotto su Gumroad
app.post('/publish', async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const response = await fetch('https://api.gumroad.com/v2/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GUMROAD_API_TOKEN}`
      },
      body: JSON.stringify({
        product: { name, description, price_cents: price }
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

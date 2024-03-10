
const fetch = require('node-fetch')
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const PORT = 3000; 

app.listen(PORT, () => {console.log(`It's alive in http://localhost:${PORT}`)})

dotenv.config();
app.use(express.json());

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_;

app.get('/api/', async (req, res) => {

  const url = "https://accounts.spotify.com/api/token";
  const response = await fetch(url, {
    method: 'POST',
    headers: "Content-Type: application/x-www-form-urlencoded",
    body: JSON.stringify({
      grant_type: "client_credential",
      client_id: client_id,
      client_secret: client_secret,
    })
  });

  res.status(200).json(response);
});


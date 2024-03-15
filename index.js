
const fetch = require('node-fetch')
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const PORT = 3000; 

app.listen(PORT, () => {console.log(`It's alive in http://localhost:${PORT}`)});
app.use(express.static('public'));

dotenv.config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

app.get('/api', async (req, res) => {
  res.json({data: "hello"});
});

//SPOTIFY AUTHENTICATE
app.get('/auth/login', (req, res) => {

  const scope = "streaming \
               user-read-playback-state \
               user-read-email \
               user-read-private"

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: "http://raspberrypi.local:3000/auth/callback",
  })

  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code; 

  const url = "https://accounts.spotify.com/api/token";
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
      'Content-Type': "application/x-www-form-urlencoded"},
    body: `grant_type=authorization_code&code=${code}&redirect_uri=http://raspberrypi.local:3000/auth/callback`
  });

  const data = await response.json();
  console.log(data);

  process.env.SPOTIFY_ACCESS_TOKEN = data.access_token;
  process.env.SPOTIFY_REFRESH_TOKEN = data.refresh_token;

  res.redirect('/');
})

app.get('/auth/refresh', async (req, res) => {
  const url = "https://accounts.spotify.com/api/token";

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  })

  const data = await response.json();
  process.env.SPOTIFY_ACCESS_TOKEN = data.access_token;

  res.json(data)
})

app.get('/auth/token', (req, res) => {
  res.json({ access_token: process.env.SPOTIFY_ACCESS_TOKEN});
})

app.get('/player/state', async (req, res) => {
  const url = "https://api.spotify.com/v1/me/player";
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {'Authorization': `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`}
  })

  // //TODO: error handling
  console.log(response.status)
  if (response.status === 204) {
    res.status(204);
    return
  }
  if (response.status === 401) {
    res.status(401).send('Expired access token. Try refreshing it!');
    return;
  }

  const data = await response.json();
  res.json(data);
})
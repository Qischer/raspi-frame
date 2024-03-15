
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

var token = null;

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
    redirect_uri: "http://localhost:3000/auth/callback",
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
    body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/auth/callback`
  });

  const data = await response.json();
  console.log(data);
  token = data.access_token;

  res.redirect('/');
})

app.get('/auth/token', (req, res) => {
  res.json({ access_token: token});
})

app.get('/player/state', async (req, res) => {
  const url = "https://api.spotify.com/v1/me/player";
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {'Authorization': `Bearer ${token}`}
  })

  // //TODO: error handling

  const data = await response.json();
  res.json(data);
})
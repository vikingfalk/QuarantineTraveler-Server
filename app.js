const express = require('express');
require('dotenv').config();
const { selectRandomCountries, fetchPictureURL, mapPictureURLs, getFlagsForPictures } = require('./helpers')

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', async (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  }

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', 'https://vikingfalk.github.io');
  }
  try {
    const randomCountries = selectRandomCountries(6);
    const pictureURLs = await Promise.all(randomCountries.map(country => fetchPictureURL(country.name)));
    const countriesData = {
      pictures: mapPictureURLs(randomCountries, pictureURLs),
      flags: getFlagsForPictures(randomCountries)
    };
    res.json(countriesData);
  } catch (err) {
    console.log(err.message);
    res.json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`QT server listening at http://localhost:${port}`);
});

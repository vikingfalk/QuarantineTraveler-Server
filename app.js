const express = require('express');
const axios = require('axios');
require('dotenv').config();
const COUNTRIES = require('./countries');

const app = express();
const port = process.env.PORT || 8080;
const API_KEY = process.env.API_KEY;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const selectRandomCountries = (prevIndex) => {
  let countriesIndex = prevIndex || [];
  const randomindex = getRandomInt(0, COUNTRIES.length - 1);
  if (!countriesIndex.includes(randomindex)) {
    countriesIndex.push(randomindex);
  }
  if (countriesIndex.length >= 6) {
    return COUNTRIES.filter((country, index) => countriesIndex.includes(index));
  }
  return selectRandomCountries(countriesIndex);
}

const fetchPictureURL = async country => {
  const axiosRes = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${country}%20landmark%20-art%20-black%20-white%20-gray%20-woman%20-man&image_type=photo&category=buildings&safesearch=true&orientation=horizontal`);
  const pictureIndex = getRandomInt(0, 5);
  return axiosRes.data.hits[pictureIndex].largeImageURL ;
}

const mapPictureURLs = (countriesArray, pictureURLs) => {
  return countriesArray.map((country, index) => ({
    ...country,
    pictureURL: pictureURLs[index]
  }))
}

app.get('/', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://vikingfalk.github.io')
  try {
    const randomCountries = selectRandomCountries();
    const pictureURLs = await Promise.all(randomCountries.map(country => fetchPictureURL(country.name)));
    const countriesData = mapPictureURLs(randomCountries, pictureURLs);
    res.json(countriesData);
  } catch (err) {
    console.log(err.message);
    res.json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

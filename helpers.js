const axios = require('axios');
const COUNTRIES = require('./countries');
const API_KEY = process.env.API_KEY;

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const selectRandomCountries = (amount, prevIndexes) => {
  let countryIndexes = prevIndexes || [];
  const randomindex = getRandomInt(0, COUNTRIES.length - 1);
  if (!countryIndexes.includes(randomindex)) {
    countryIndexes.push(randomindex);
  }
  if (countryIndexes.length >= amount) {
    return countryIndexes.map(countryIndex => COUNTRIES[countryIndex]);
  }
  return selectRandomCountries(amount, countryIndexes);
}

const fetchPictureURL = async country => {
  if (process.env.NODE_ENV === 'development') {
    return 'https://picsum.photos/600/400';
  }
  const axiosRes = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${country}%20landmark%20-art%20-black%20-white%20-gray%20-woman%20-man&image_type=photo&category=buildings&safesearch=true&orientation=horizontal`);
  const images = axiosRes.data.hits;
  const pictureIndex = images.length > 20 ? getRandomInt(0, 20) : getRandomInt(0, images.length);
  return images[pictureIndex].largeImageURL ;
}

const mapPictureURLs = (countriesArray, pictureURLs) => {
  return countriesArray.map((country, index) => ({
    ...country,
    pictureURL: pictureURLs[index]
  }))
}

const getFlagsForPictures = (pictureCountries) => {
  return pictureCountries
    .map(country => selectRandomCountries(6, [COUNTRIES.map(c => c.name).indexOf(country.name)]));
}

module.exports = {
  getRandomInt,
  selectRandomCountries,
  fetchPictureURL,
  mapPictureURLs,
  getFlagsForPictures
}
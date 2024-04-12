import {
  WEATHER_API_KEY,
  GEOAPIFY_API_KEY,
  TICKETMASTER_API_KEY,
} from "./config.js";

const form = document.getElementById("cityForm");
const weatherInfo = document.getElementById("weatherInfo");
const mapContainer = document.getElementById("mapContainer");
const eventsInfo = document.getElementById("eventsInfo");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const city = document.getElementById("cityInput").value;
  weatherInfo.innerHTML = "";
  mapContainer.innerHTML = "";
  eventsInfo.innerHTML = "";
  getWeatherData(city);
  getMapImage(city);
  getEvents(city);
});

function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const name = data.name;
      const temperature = data.main.temp;
      const description = data.weather[0].description;
      const descriptionCapitalized =
        description.charAt(0).toUpperCase() + description.slice(1);
      weatherInfo.innerHTML = `<h2>${name}</h2><p>${descriptionCapitalized}</p><p>Temperature: ${temperature}°C</p>`;
    })
    .catch((error) => console.log(error));
}

function getMapImage(city) {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${city}&apiKey=${GEOAPIFY_API_KEY}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const lat = data.features[0].properties.lat;
      const lon = data.features[0].properties.lon;
      const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:${lon},${lat}&zoom=12&apiKey=${GEOAPIFY_API_KEY}`;
      mapContainer.innerHTML = `<img src="${mapUrl}" alt="Map of ${city}">`;
    })
    .catch((error) => console.log(error));
}

function getEvents(city) {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&apikey=${TICKETMASTER_API_KEY}&size=5`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const events = data._embedded.events;
      let eventsHtml = "<h3>Upcoming Events:</h3>";
      events.forEach((event) => {
        const name = event.name;
        const date = event.dates.start.localDate;
        const url = event.url;
        eventsHtml += `<p><a href="${url}" target="_blank">${name}</a> - ${date}</p>`;
      });
      eventsInfo.innerHTML = eventsHtml;
    })
    .catch((error) => console.log(error));
  eventsInfo.innerHTML = "No upcoming events at the moment :-(";
}

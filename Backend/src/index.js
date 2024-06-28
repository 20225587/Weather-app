const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

const apiKey = process.env.API_KEY;
const baseURL = "https://api.openweathermap.org/data/2.5";

// Fetch current weather
app.get("/api/weather", async (req, res) => {
  const city = req.query.city;
  const url = `${baseURL}/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching current weather data" });
  }
});

// Fetch 5-day weather forecast
app.get("/api/forecast", async (req, res) => {
  const city = req.query.city;
  const url = `${baseURL}/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching 5-day forecast data" });
  }
});

// Endpoint to get current time
app.get("/api/currentTime", (req, res) => {
  const currentTime = new Date().toLocaleTimeString();
  res.json({ currentTime });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

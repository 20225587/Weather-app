document.addEventListener("DOMContentLoaded", () => {
  const weatherForm = document.getElementById("weatherForm");
  if (weatherForm) {
    weatherForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const city = document.getElementById("cityInput").value;
      fetchWeatherData(city);
    });
  }

  const showForecastBtn = document.getElementById("showForecastBtn");
  if (showForecastBtn) {
    showForecastBtn.addEventListener("click", () => {
      const city = document.getElementById("cityInput").value;
      // Redirect to forecast page with city as query parameter
      window.location.href = `/forecast.html?city=${city}`;
    });
  }

  // Fetch weather data
  function fetchWeatherData(city) {
    fetch(`/api/weather?city=${city}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === 200) {
          updateWeatherUI(data);
          displayCurrentTime(); // Update current time after fetching weather
        } else {
          showAlert("City not found. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        showAlert("An error occurred. Please try again.");
      });
  }

  // Update weather data on UI
  function updateWeatherUI(data) {
    document.getElementById("temperature").textContent = `${Math.round(
      data.main.temp
    )}°C`;
    document.getElementById("city").textContent = data.name;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById(
      "windSpeed"
    ).textContent = `${data.wind.speed} km/h`;
  }

  // Display current time
  function displayCurrentTime() {
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const currentTime = now.toLocaleTimeString("en-US", options);
    document.getElementById(
      "currentTime"
    ).textContent = `Current time: ${currentTime}`;
  }

  // Show alert message
  function showAlert(message) {
    alert(message);
  }

  // Forecast page functionality
  const urlParams = new URLSearchParams(window.location.search);
  const city = urlParams.get("city");
  if (city) {
    fetchForecastData(city);
  }

  // Fetch 5-day forecast data
  function fetchForecastData(city) {
    fetch(`/api/forecast?city=${city}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === "200") {
          showForecast(data);
        } else {
          showAlert("Forecast not available.");
        }
      })
      .catch((error) => {
        console.error("Error fetching forecast data:", error);
        showAlert("An error occurred while fetching forecast data.");
      });
  }

  // Show 5-day forecast
  function showForecast(data) {
    const forecastDays = data.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );
    const forecastContainer = document.getElementById("forecastDays");
    forecastDays.forEach((day) => {
      const forecastItem = document.createElement("div");
      forecastItem.classList.add("forecast-day");
      forecastItem.innerHTML = `
                <h5>${getDayOfWeek(day.dt)}</h5>
                <p>${Math.round(day.main.temp)}°C</p>
                <img src="https://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }.png" alt="${day.weather[0].description}" />
            `;
      forecastContainer.appendChild(forecastItem);
    });
  }

  // Function to get day of the week from timestamp
  function getDayOfWeek(timestamp) {
    const date = new Date(timestamp * 1000);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  }

  // Initial call to display current time on page load
  displayCurrentTime();
});

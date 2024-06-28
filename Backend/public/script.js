document.addEventListener("DOMContentLoaded", () => {
  const weatherForm = document.getElementById("weatherForm");
  weatherForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("cityInput").value;
    fetchWeatherData(city);
  });

  const showForecastBtn = document.getElementById("showForecastBtn");
  showForecastBtn.addEventListener("click", () => {
    const city = document.getElementById("cityInput").value;
    fetchForecastData(city);
  });

  // Fetch weather data
  function fetchWeatherData(city) {
    fetch(`/api/weather?city=${city}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === 200) {
          updateWeatherUI(data);
        } else {
          showAlert("City not found. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        showAlert("An error occurred. Please try again.");
      });
  }

  // Fetch 5-day forecast data
  function fetchForecastData(city) {
    fetch(`/api/forecast?city=${city}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === "200") {
          showForecastPopup(data);
        } else {
          showAlert("Forecast not available.");
        }
      })
      .catch((error) => {
        console.error("Error fetching forecast data:", error);
        showAlert("An error occurred while fetching forecast data.");
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

  // Show 5-day forecast in a popup
  function showForecastPopup(data) {
    const forecastDays = data.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );
    const popupContent = forecastDays
      .map(
        (day) => `
            <div class="forecast-day">
                <h5>${getDayOfWeek(day.dt)}</h5>
                <p>${Math.round(day.main.temp)}°C</p>
                <img src="https://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }.png" alt="${day.weather[0].description}" />
            </div>
        `
      )
      .join("");

    const forecastPopup = document.createElement("div");
    forecastPopup.classList.add("forecast-popup");
    forecastPopup.innerHTML = `
            <h3>5-Day Forecast (Mon - Fri)</h3>
            <div id="forecastDays">${popupContent}</div>
            <button class="btn btn-outline-danger" id="closeForecastBtn">Close</button>
        `;
    document.body.appendChild(forecastPopup);

    const closeForecastBtn = document.getElementById("closeForecastBtn");
    closeForecastBtn.addEventListener("click", () => {
      forecastPopup.style.display = "none";
    });

    forecastPopup.style.display = "block";
  }

  // Function to get day of the week from timestamp
  function getDayOfWeek(timestamp) {
    const date = new Date(timestamp * 1000);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  }

  // Show alert message
  function showAlert(message) {
    alert(message);
  }
});

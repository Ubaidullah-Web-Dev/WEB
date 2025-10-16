const apiKey = "764ef473be5a5431ac103172e8918ddd";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const locationEl = document.getElementById("location");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
            locationEl.textContent = data.name;
            tempEl.textContent = data.main.temp + "°C";
            descEl.textContent = data.weather[0].description;
            humidityEl.textContent = data.main.humidity + "%";
            windEl.textContent = data.wind.speed + " km/h";
            precipEl.textContent = data.clouds.all + "%";
        })
});
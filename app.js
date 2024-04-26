const cityInput=document.getElementById('cityInput');
const apiKey='9aa99c39954c3d4b5b856795f1508ec4';
let days=[];
const today = new Date();
function formatDate(date) {
    const options = { weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
}

for (let i = 0; i< 6; i++) {
today.setDate(today.getDate() + 1);
days.push(formatDate(today));
}

cityInput.addEventListener('change', async function() {

    const selectedCity = cityInput.value;
    console.log(days);
  
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${apiKey}&units=metric`;

      try {
        console.log(url);
        const response = await fetch(url);
        const data = await response.json();
        console.log(`Weather for ${selectedCity} `, data);
        console.log(data);
        document.getElementById('cityname').innerText = data.name;
        //date current
        const today = new Date(data.dt * 1000);        
        let currentDateElement = document.getElementById('currentDate');
        currentDateElement.textContent = formatDate(today);
        // Update current temperature
        const currentTemperature = data.main.temp;
        document.querySelector('.temperature > span').innerText = `${currentTemperature}°`;
         // Update temperature range (optional)
         const minTemperature = data.main.temp_min;
         const maxTemperature = data.main.temp_max;
         document.querySelector('.temperature > small').innerText = `${minTemperature}° / ${maxTemperature}°`;
          // Update weather description (optional)
        const weatherDescription = data.weather[0].description;
        document.querySelector('.weather-panel p').innerText = weatherDescription;
          // Fetch forecast data
        fetchForecastData(forecastUrl);

      } catch (error) {
        console.error(`Error fetching weather data for ${selectedCity} `, error);
      }
    
  });
  
  window.addEventListener("DOMContentLoaded", () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
                const response = await fetch(geoUrl);
                const data = await response.json();
                const cityName = data[0].name;
                console.log(`Your location: ${cityName}`);
                // Display the city name on page 
                document.getElementById('cityname').innerText = cityName;

            },
            function (error) {
                console.error("Error getting location: " + error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
});

async function fetchForecastData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Forecast data:', data);

        // Clear previous data
        forecastDays = [];
        forecastTemperatureData = [];

        // Update forecast for each day
        const forecastList = data.list.slice(1, 7); // Take the next 6 days
        
        forecastList.forEach((forecast, index) => {
            const dayElement = document.querySelector(`.forecast li:nth-child(${index + 1}) h3`);
            const temperatureElement = document.querySelector(`.forecast li:nth-child(${index + 1}) p`);

            const forecastDate = new Date(forecast.dt * 1000);
            const dayName = formatDate(forecastDate, { weekday: 'long' });
            dayElement.innerText = dayName;
            console.log(forecastDate);
           
            const minTemperature = forecast.main.temp_min;
            const maxTemperature = forecast.main.temp_max;
            temperatureElement.innerText = `${minTemperature}°/${maxTemperature}°`;

            // Collect data for chart
            forecastDays.push(dayName);
            forecastTemperatureData.push((minTemperature + maxTemperature) / 2);
            console.log(forecastTemperatureData);
            console.log(forecastDays);

        });

        // Update chart
        updateChart();

    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}
function updateChart() {
    const ctx = document.getElementById('forecastChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
            labels: forecastDays,
            datasets: [{
                label: 'Temperature (°C)',
                data: forecastTemperatureData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}





  
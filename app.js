const cityInput=document.getElementById('cityInput');
const apiKey='9aa99c39954c3d4b5b856795f1508ec4';
let days=[];

const today = new Date();

/*function formatDate(date) {
const year = date.getFullYear();
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const day = date.getDate().toString().padStart(2, '0');
return `${year}-${month}-${day}`;
}*/
function formatDate(date) {
    const options = { weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
}


for (let i = 0; i<= 6; i++) {
today.setDate(today.getDate() + 1);
days.push(formatDate(today));

}


cityInput.addEventListener('change', async function() {

    const selectedCity = cityInput.value;
    
  
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`;
      
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
        

      } catch (error) {
        console.error(`Error fetching weather data for ${selectedCity} `, error);
      }
    
  });
  
  window.addEventListener("DOMContentLoaded", () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const geoUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
                fetchWeatherData(geoUrl);
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

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
async function fetchWeatherData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Weather data:', data);
        //logic  to display or process the weather data
        

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}
  
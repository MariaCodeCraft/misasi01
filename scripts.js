function getCountryData() {
    const countryName = document.getElementById('country').value;

    if (!countryName) {
        alert('Please enter a country name');
        return;
    }

    // Clear weather-related elements
    document.getElementById('temp-div').innerHTML = '';
    document.getElementById('weather-info').innerHTML = '';
    document.getElementById('weather-icon').src = '';
    document.getElementById('hourly-forecast').innerHTML = '';

    // Fetch and display country data
    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => response.json())
        .then(data => {
            displayCountryData(data[0]);
        })
        .catch(error => {
            console.error('Error fetching country data:', error);
            alert('Error fetching country data. Please try again.');
        });
}

function displayCountryData(countryData) {
    const countryInfoDiv = document.getElementById('country-info');
    countryInfoDiv.innerHTML = ''; // Clear previous content

    if (!countryData) {
        countryInfoDiv.innerHTML = `<p>Country not found</p>`;
    } else {
        const countryName = countryData.name.common;
        const capital = countryData.capital ? countryData.capital[0] : 'N/A';
        const population = countryData.population ? countryData.population.toLocaleString() : 'N/A';
        const flagUrl = countryData.flags.png;

        const countryHtml = `
            <div>
                <h3>${countryName}</h3>
                <p>Capital: ${capital}</p>
                <p>Population: ${population}</p>
            </div>
            <div>
                <img src="${flagUrl}" alt="${countryName} Flag">
                <button onclick="getWeather('${countryName}')">Get Weather</button>
            </div>
            <div id="weather-info-${countryName}"></div>
        `;

        countryInfoDiv.innerHTML = countryHtml;
    }
}



function getWeather() {
    const apiKey = 'fd645be4646fd3497a835a15b9a9b187'; 
    const country = document.getElementById('country').value;

    if (!country) {
        alert('Please enter a country name');
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            // Since we're using country as input for weather, displayHourlyForecast is not relevant here.
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
}


function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === 404) {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block'; 

        // Show "More Details" button
        const moreDetailsButton = document.getElementById('more-details-button');
        moreDetailsButton.style.display = 'inline-block';
    }
}


async function searchCountry() {
    const searchInput = document.getElementById('searchInput').value;
    const response = await fetch(`https://restcountries.com/v3.1/name/${searchInput}`);
    const data = await response.json();

    const countryDetails = document.getElementById('countryDetails');
    countryDetails.innerHTML = '';

    data.forEach(async country => {
        const countryCard = document.createElement('div');
        countryCard.classList.add('country-card');

        const countryName = document.createElement('h2');
        countryName.textContent = country.name.common;

        const moreDetailsButton = document.createElement('button');
        moreDetailsButton.textContent = 'More Details';
        moreDetailsButton.onclick = function() {
            alert(`Population: ${country.population}`);
        };

        const weatherDetailsButton = document.createElement('button');
        weatherDetailsButton.textContent = 'Weather Details';
        weatherDetailsButton.onclick = async function() {
            const weatherData = await fetchWeatherData(country);
            alert(`Weather in ${country.name.common}: ${weatherData.temperature}, ${weatherData.condition}`);
        };

        countryCard.appendChild(countryName);
        countryCard.appendChild(moreDetailsButton);
        countryCard.appendChild(weatherDetailsButton);
        countryDetails.appendChild(countryCard);
    });
}

async function fetchWeatherData(country) {
    return { temperature: '25°C', condition: 'Sunny' };
}

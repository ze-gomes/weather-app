let apikey = '783f3afe625ea602dbce4efd6fe61aeb';

// Input location
let input = document.querySelector('.input-effect');
let inputLoc = document.getElementById('loc-input');
let labelLoc = document.getElementById('loc-label');
// Main displays
let loadingDisplay = document.getElementById('loading-display');
let weatherDisplay = document.getElementById('weather-display');
// Header block - Name and local time
let weatherHeader = document.getElementById('card-header');
let cityName = document.getElementById('city-name');
let localTime = document.getElementById('local-time');
// Icon block - Image and description
let weatherImage = document.querySelector('.weather-icon');
let weatherIcon = document.getElementById('weather-icon');
let weatherDescription = document.getElementById('weather-description');
// Info block - Temps
let weatherInfo = document.querySelector('.weather-info');
let weatherTemp = document.getElementById('weather-temp');
// Map
let map;
let mapDiv = document.getElementById('map');

// start with map invisible
document.getElementById('map').style.display = 'none';

// Get weather from API and display
async function getWeather(cityname) {
	let response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apikey}&units=metric`
	);
	if (response.ok) {
		// Disable start screen
		loadingDisplay.style.display = 'none';
		let weatherData = await response.json();
		/* Get suitable icon for weather */
		// Create new date representing the local Time
		const now = new Date();
		// Converto to UTC Date
		const date = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
		// timezone returns shift in seconds from UTC, convert to miliseconds and add to the date epoch time to get localTime
		const millisecondsOffsetUTC = date.getTime() + weatherData.timezone * 1000;
		const localDate = new Date(millisecondsOffsetUTC);
		// Get local sun phases and convert a unix timestamp to time
		const sunrise = new Date(weatherData.sys.sunrise * 1000);
		const sunset = new Date(weatherData.sys.sunset * 1000);
		// Get correct weather icon for day/night periods
		if (date > sunrise && date < sunset) {
			let weatherIconID = `wi wi-owm-day-${weatherData.weather[0].id}`;
			weatherIcon.className = weatherIconID;
		} else {
			let weatherIconID = `wi wi-owm-night-${weatherData.weather[0].id}`;
			weatherIcon.className = weatherIconID;
		}
		// Turns on elements display and triggers animations
		turnOnDisplay();
		// Parse API weather data and write to page
		cityName.innerText = weatherData.name;
		localTime.innerText = localDate.toLocaleTimeString();
		weatherTemp.innerText = Math.round(weatherData.main.temp) + '' + 'ºC';
		document.getElementById('weather-max').innerText =
			'MAX: ' + Math.round(weatherData.main.temp_max) + 'ºC';
		document.getElementById('weather-min').innerText =
			'MIN: ' + Math.round(weatherData.main.temp_min) + 'ºC';
		weatherDescription.innerText = weatherData.weather[0].description;
		setTemperatureGradient(weatherData.main.temp);
		getMap(weatherData.coord.lat, weatherData.coord.lon);
	} else {
		// If no city is found, display loading screen with error and disable weather screen
		weatherDisplay.style.display = 'none';
		loadingDisplay.style.display = 'flex';
		document.getElementById('unknown-city-name').innerText =
			'City not found! Please try again.';
		// Print errors
		console.log(response.status, response.statusText);
	}
}


// Get map using Google maps API given a latitude and longitude (obtained from OpenWeatherMap)
async function getMap(lati, long) {
	document.getElementById('map').style.display = 'block';
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: lati, lng: long },
		zoom: 10,
	});
}

// Input event listeners
input.addEventListener('focusin', (e) => {
	if (inputLoc.value != '') {
		inputLoc.value = '';
		labelLoc.style.visibility = 'visible';
		input.classList.add('has-content');
	} else {
		labelLoc.style.visibility = 'visible';
		input.classList.remove('has-content');
	}
});

input.addEventListener('focusout', (e) => {
	if (inputLoc.value != '') {
		labelLoc.style.visibility = 'hidden';
	} else {
		labelLoc.style.visibility = 'visible';
	}
});

// Form submit
inputLoc.addEventListener('keydown', function (e) {
	// Enter is pressed
	if (e.code == 'Enter') {
		turnOffDisplay();
		getWeather(inputLoc.value);
	}
});

// To trigger animations on location swap
function turnOffDisplay() {
	weatherHeader.style.display = 'none';
	weatherInfo.style.display = 'none';
	weatherImage.style.display = 'none';
	mapDiv.style.display = 'none';
}
function turnOnDisplay() {
	weatherDisplay.style.display = 'grid';
	weatherHeader.style.display = 'block';
	weatherInfo.style.display = 'flex';
	weatherImage.style.display = 'flex';
	mapDiv.style.display = 'block';
}

// Color temperature gradient to paint info blocks
function setTemperatureGradient(temp) {
	let arrayTemps = [
		'#FF140050',
		'#FF960050',
		'#FFf00050',
		'#00ff1050',
		'#00e4ff50',
		'#00e4ff50',
	];
	if (temp < 0) {
		weatherInfo.style.backgroundColor = arrayTemps[5];
		weatherImage.style.backgroundColor = arrayTemps[5];
	} else if (temp < 5) {
		weatherInfo.style.backgroundColor = arrayTemps[4];
		weatherImage.style.backgroundColor = arrayTemps[4];
	} else if (temp < 15) {
		weatherInfo.style.backgroundColor = arrayTemps[3];
		weatherImage.style.backgroundColor = arrayTemps[3];
	} else if (temp < 25) {
		weatherInfo.style.backgroundColor = arrayTemps[2];
		weatherImage.style.backgroundColor = arrayTemps[2];
	} else if (temp < 35) {
		weatherInfo.style.backgroundColor = arrayTemps[1];
		weatherImage.style.backgroundColor = arrayTemps[1];
	} else {
		weatherInfo.style.backgroundColor = arrayTemps[0];
		weatherImage.style.backgroundColor = arrayTemps[0];
	}
}

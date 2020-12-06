let input = document.querySelector('.input-effect');
let inputLoc = document.getElementById('loc-input');
let labelLoc = document.getElementById('loc-label');
let cityName = document.getElementById('city-name');
let weatherIcon = document.getElementById('weather-icon');
let weatherTemp = document.getElementById("weather-temp");
let apikey = '783f3afe625ea602dbce4efd6fe61aeb';
let weatherDescription = document.getElementById("weather-description");
document.getElementById('map').style.display = 'none';
let map;

let loadingDisplay = document.getElementById("loading-display");
let weatherDisplay = document.getElementById("weather-display");


async function getWeatherIcons() {
	// Replace ./data.json with your JSON feed
	let response = await fetch('./icons.json');
	let icons = await response.json();
	console.log(icons);
}
getWeatherIcons();

async function getWeather(cityname) {
	let response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apikey}&units=metric`
	);
	if (response.ok) {
		weatherDisplay.style.display = "block";
		loadingDisplay.style.display = "none";
		let weatherData = await response.json();
		/* Get suitable icon for weather */
		// Create new date representing the local Time
		const now = new Date();
		const date = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
		const millisecondsOffsetUTC = date.getTime() + (weatherData.timezone*1000);
		//date.setTime(millisecondsOffsetUTC);
		// Get local sun phases and convert a unix timestamp to time
		const sunrise = new Date(weatherData.sys.sunrise * 1000);
		const sunset = new Date(weatherData.sys.sunset * 1000);
		if (
			date >  sunrise &&
			date < sunset
		) {
			let weatherIconID = `wi wi-owm-day-${weatherData.weather[0].id}`;
			weatherIcon.className = weatherIconID;
		} else {
			let weatherIconID = `wi wi-owm-night-${weatherData.weather[0].id}`;
			weatherIcon.className = weatherIconID;
		}
		cityName.innerText = weatherData.name;
		getMap(weatherData.coord.lat, weatherData.coord.lon);
		weatherTemp.innerText = Math.round(weatherData.main.temp) + " ºC";
		document.getElementById("card-header").style.backgroundColor = getTemperatureGradient(weatherData.main.temp);
		//weatherTemp.style.backgroundColor = getTemperatureGradient(weatherData.main.temp);
		console.log(weatherData);
	} else {
		weatherDisplay.style.display = "none";
		loadingDisplay.style.display = "block";
		document.getElementById("unknown-city-name").innerText = 'City not found! Please try again.';
		// Handle errors
		console.log(response.status, response.statusText);
	}
}

async function getMap(lati, long) {
	document.getElementById('map').style.display = 'block';
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: lati, lng: long },
		zoom: 10,
	});
}

input.addEventListener('focusin', (e) => {
	console.log('focus Effect');
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
	console.log(inputLoc.value);
	if (inputLoc.value != '') {
		labelLoc.style.visibility = 'hidden';
	} else {
		labelLoc.style.visibility = 'visible';
	}
});

inputLoc.addEventListener('keydown', function (e) {
	// Enter is pressed
	if (e.code == 'Enter') {
		getWeather(inputLoc.value);
	}
});


function getTemperatureGradient(temp){
	let arrayTemps = ["#FF140050","#FF960050","#FFf00050","#00ff1050","#00e4ff50", "#00e4ff50"];
	if (temp<0) {
		return arrayTemps[5];
	} else if (temp<5) {
		return arrayTemps[4];
	} else if (temp<15) {
		return arrayTemps[3];
	} else if (temp<25) {
		return arrayTemps[2];
	} else if (temp<35) {
		return arrayTemps[1];
	} else {
		return arrayTemps[0];
	}
}

// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
const updateSun = function(sun, left, bottom, now){
	sun.style.left = `${left}%`;
	sun.style.bottom = `${bottom}%`;

	const currentTimeStamp = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
	sun.setAttribute('data-time', currentTimeStamp);

};

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	const htmlSun = document.querySelector(".js-sun");
	const htmlMinutesLeft = document.querySelector(".js-time-left");
	
	// Bepaal het aantal minuten dat de zon al op is.
	const now = new Date();
	const sunriseDate = new Date(sunrise*1000);

	const minutesSunUp = (now.getHours() * 60 + now.getMinutes()) - (sunriseDate.getHours() * 60 + sunriseDate.getMinutes());
	const percentage = (100 / totalMinutes) * minutesSunUp,
		sunLeft = percentage,
		sunBottom = percentage < 50 ? percentage * 2 : (100-percentage) * 2;


	updateSun(htmlSun, sunLeft, sunBottom, now);
	
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.

	htmlMinutesLeft.innerHTML = Math.round(totalMinutes - minutesSunUp);
	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	console.log(queryResponse)

	const location = queryResponse.city.name;
	const sunrise = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise);
	const sunset = _parseMillisecondsIntoReadableTime(queryResponse.city.sunset);

	document.querySelector(".js-location").innerHTML = location;
	
	
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	document.querySelector(".js-sunset").innerHTML = sunset;
	document.querySelector(".js-sunrise").innerHTML = sunrise;
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.

	const timeDifference = (queryResponse.city.sunset-queryResponse.city.sunrise) / 60; 
	placeSunAndStartMoving(timeDifference, queryResponse.city.sunrise);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	// Eerst bouwen we onze url op
	url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=2f03e123abefff8417c987f8238aea0a
	&units=metric&lang=nl&cnt=1`;

	console.log(url)
	fetch(url)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(`Fout bij het laden van de API: ${response.status}`);
      }
    })
    .then(function(jsonObject) {
      showResult(jsonObject);
    })
    .catch(function(error) {
      console.log(`Fout bij het verwerken van de API: ${error}`);
    });
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});

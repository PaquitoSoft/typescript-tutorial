import axios from 'axios';

// declare var google: any;
declare var ol: any;

// type GeocodeResult = {
// 	status: 'OK' | 'ZERO_RESULTS';
// 	results: {
// 		geometry: {
// 			location: {
// 				lat: number,
// 				lng: number
// 			}
// 		}
// 	}[]
// };

const $map = document.getElementById('map') as HTMLElement;
const $addressForm = document.querySelector('.address-form') as HTMLFormElement;
const $addressInput = document.querySelector(
	'[name="address"]'
) as HTMLInputElement;

const GOOGLE_API_KEY = 'GOOGLE_API_KEY';

async function searchAddressHandler(event: Event) {
	event.preventDefault();
	// const address = $addressInput.value;

	// const response = await axios.get<GeocodeResult>(
	// 	`https://maps.googleapis.com/api/geocode/json?key=${GOOGLE_API_KEY}&address=${encodeURIComponent(
	// 		address
	// 	)}`
	// );

	// if (response.data.status === 'OK') {
	// 	console.log({ response });
	// 	const coordinates = response.data.results[0].geometry.location;
	// 	const map = new google.maps.Map($map, {
	// 		center: coordinates,
	// 		zoom: 8
	// 	});

	// 	const marker = new google.maps.Marker({ position: coordinates, map });
	// } else {
	// 	console.error('Response not ok:', response);
	// }

	const coordinates = { lat: 40.41, lng: -73.99 }; 
	new ol.Map({
		target: 'map',
		layers: [
			new ol.layer.Tile({
				source: new ol.source.OSM()
			})
		],
		view: new ol.View({
			center: ol.proj.fromLonLat([coordinates.lng, coordinates.lat]),
			zoom: 8
		})
	})
}

$addressForm.addEventListener('submit', searchAddressHandler);

import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import _ from 'lodash';
import { Vehicle } from './vehicle.model';

// Tell Typescript about a global variable 
// (I set this in an inline script in the HTML file)
declare var GLOBAL_VALUE: string;

console.log(_.shuffle([1,2,3]));

console.log({ GLOBAL_VALUE });

// const car = new Vehicle('Opel Astra', 16000);
// console.log(car.getInformation());

const vehiclesRaw = [
	{ title: 'Seat Ibiza', price: 9000 },
	{ title: 'Yamaha IBM', price: 1500 },
	{ title: 'Suzuki GS500', price: 2000 },
	{ title: 'Opel Astra', price: 16000 },
	{ title: 'KTM Duke 200', price: 3000 },
	{ title: 'Mercedes Clase A200', price: 36000 }
];

// const vehicles = vehiclesRaw.map(v => new Vehicle(v.title, v.price));
const vehicles = plainToClass(Vehicle, vehiclesRaw);

for (const v of vehicles) {
	console.log(v.getInformation());
}

const invalidVehicle = new Vehicle('', -100);
validate(invalidVehicle).then(errors => {
	console.log('Validation errors:', errors);
});

// function Logger(constructor: Function) {
// 	console.log('Logging...');
// 	console.log(constructor);
// }

// @Logger // This gets executed in definition time. No need to create a instance to get executed
// class Persona {
// 	name = 'Max';

// 	constructor() {
// 		console.log('Creating Person object...');
// 	}
// }

// const p1 = new Persona();
// console.log(p1);

/* ------------------------------------------------------------------------

function Logger(logPrefix: string) {
	// class decorator
	return function(constructor: Function) {
		console.log(`${logPrefix}...`);
		console.log(constructor);
	}
}

@Logger('Building class definition')
class Persona {
	name = 'Max';

	constructor() {
		console.log('Creating Person object...');
	}
}
*/

/* ------------------------------------------------------------------------ 

function WithTemplate(template: string, hookId: string) {
	return function (_: Function) {
		console.log('Rendering template');
		const $el = document.getElementById(hookId);
		if ($el) {
			$el.innerHTML = template;
		}
	}
}

@WithTemplate('<h1>My Item</h1>', 'root')
@Logger('Hi')
class Item {
	name = 'DefaultItem';

	constructor() {
		console.log('Building an Item...');
	}
}
*/

/* ------------------------------------------------------------------------
// Property decorator
// target: 
//	If you apply in a instance prop -> class prototype
//	If you apply in a static prop -> class constructor function
function Log(target: any, propertyName: string | Symbol) {
	console.log('Property decorator');
	console.log({ target, propertyName });
}

// Accessor decorator
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
	console.log('Accessor decorator');
	console.log({ target, name, descriptor });
}

// Method decorator
function Log3(target: any, name: string, descriptor: PropertyDescriptor) {
	console.log('Method decorator');
	console.log({ target, name, descriptor });
}

// Parameter decorator
function Log4(target: any, methodName: string, parameterIndexPosition: number) {
	console.log('Parameter decorator');
	console.log({ target, methodName, parameterIndexPosition });
}

class Product {
	@Log
	private _title: string;
	private _price: number;

	constructor(title: string, price: number) {
		this._title = title;
		this._price = price;
	}

	get title() {
		return this._title;
	}

	get price() {
		return this._price;
	}

	@Log2
	set price(value: number) {
		if (value > 0) {
			this._price = value;
		} else {
			throw new Error('Invalid price - value must be positive');
		}
	}

	@Log3
	getPriceWithTax(@Log4 tax: number) {
		return this.price * (1 + tax);
	}
}
*/

/* ------------------------------------------------------------------------

function WithTemplate(template: string, hookId: string) {
	return function<T extends {new(...args: any[]): { name: string }}> (klass: T) {
		return class extends klass {
			constructor(...args: any[]) {
				super([...args]);
				
				console.log('Rendering template');
				const $el = document.getElementById(hookId);
				if ($el) {
					$el.innerHTML = template;
					$el.querySelector('h1')!.textContent = this.name;
				}
			}
		}
	}
}

@WithTemplate('<h1>My Item</h1>', 'root')
class Item {
	name = 'DefaultItem';

	constructor(name: string) {
		console.log('Building an Item...');
		this.name = name;
	}
}

new Item('iPad');
*/

/* ------------------------------------------------------------------------ 

function Autobind(_: any, __: string, descriptor: PropertyDescriptor) {
	const original = descriptor.value;
	const newDescriptor: PropertyDescriptor = {
		configurable: true,
		enumerable: false,
		get() {
			return original.bind(this);
		}
	};
	return newDescriptor;

	// This is not valid: we can only get to THIS by using the getter. 
	//	But we can't assign a getter to a descriptor with a value
	// return Object.assign(descriptor, {
	// 	get() { return original.bind(this) }
	// })
}

class Printer {
	message = 'This works!';

	@Autobind
	showMessage() {
		console.log(this.message);
	}
}

const p1 = new Printer();

const button = document.querySelector('button')!;
button.addEventListener('click', p1.showMessage);
*/


/* ------------------------------------------------------------------------ */
interface ValidatorConfig {
	[property: string]: {
		[validatetableProps: string]: string[] // ['required', 'positive']
	}
}

// const registeredValidators: ValidatorConfig = {};

class ValidationsRegistry {
	private static instance: ValidationsRegistry;
	validationsData: ValidatorConfig = {};

	static initialize() {
		ValidationsRegistry.instance = new ValidationsRegistry();
		return ValidationsRegistry.instance;
	}

	static getInstance(): ValidationsRegistry {
		if (!ValidationsRegistry.instance) {
			throw new Error('You forgot to initialize the registry. You need to call "Validation.initialize" static method');
		} else {
			return ValidationsRegistry.instance;
		}
	}

	registerValidation(className: string, propertyName: string, validationCode: string) {
		const validators = this.validationsData[className] || {}; // Class validations
		const propValidations = validators[propertyName] || []; // Class property validations
		if (!propValidations.includes(validationCode)) {
			propValidations.push(validationCode);
			validators[propertyName] = propValidations;
			this.validationsData[className] = validators;
		}
	}

	validateObject(obj: any) {
		const validationConfig = this.validationsData[obj.constructor.name];
		let isValid = true;

		outer:
		for (const prop in validationConfig) {
			for (const validation of validationConfig[prop]) {
				switch(validation) {
					case 'required':
						isValid = !!obj[prop];
						break;
					case 'positive':
						isValid = obj[prop] > 0;
						break;
				}
				if (!isValid) break outer;
			}
		}

		return isValid;
	}
}

function Reqired(target: any, propName: string) {
	// registeredValidators[target.constructor.name] = {
	// 	[propName]: ['required']
	// };

	// const validators = registeredValidators[target.constructor.name] || {}; // Class validations
	// const propValidations = validators[propName] || []; // Class property validations
	// if (!propValidations.includes('required')) {
	// 	propValidations.push('required');
	// 	validators[propName] = propValidations;
	// 	registeredValidators[target.constructor.name] = validators;
	// }

	ValidationsRegistry.getInstance().registerValidation(target.constructor.name, propName, 'required');
}

function PositiveNumber(target: any, propName: string) {
	// registeredValidators[target.constructor.name] = {
	// 	[propName]: ['positive']
	// };

	// const validators = registeredValidators[target.constructor.name] || {}; // Class validations
	// const propValidations = validators[propName] || []; // Class property validations
	// if (!propValidations.includes('positive')) {
	// 	propValidations.push('positive');
	// 	validators[propName] = propValidations;
	// 	registeredValidators[target.constructor.name] = validators;
	// }
	
	ValidationsRegistry.getInstance().registerValidation(target.constructor.name, propName, 'positive');
}

// function validate(obj: any): boolean {
// 	const validationConfig = myValidationRegistry.validations[obj.constructor.name];

// 	if (!validationConfig) return true;

// 	for (const prop in validationConfig) {
// 		for (const validation of validationConfig[prop]) {
// 			switch(validation) {
// 				case 'required':
// 					return !!obj[prop];
// 				case 'positive':
// 					return obj[prop] > 0;
// 			}
// 		}
// 	}

// 	return true;
// }

function Validation(validationCode: string) {
	return function(klass: any, propName: string) {
		ValidationsRegistry.getInstance().registerValidation(klass.constructor.name, propName, validationCode);
	}
}

const myValidationsRegistry = ValidationsRegistry.initialize();

class Course {
	// @Reqired
	@Validation('required')
	title: string;

	// @PositiveNumber
	@Validation('positive')
	price: number;

	constructor(title: string, price: number) {
		this.title = title;
		this.price = price;
	}
}

const $form = document.querySelector('form')!;
$form.addEventListener('submit', event => {
	event.preventDefault();
	const $title = <HTMLInputElement> document.getElementById('title');
	const $price = <HTMLInputElement> document.getElementById('price');

	const title = $title.value;
	const price = +$price.value;

	const newCourse = new Course(title, price);

	if (myValidationsRegistry.validateObject(newCourse)) {
		console.log('New Course created:', newCourse);
	} else {
		throw new Error('Input data is not valid to create a Course');
	}
});

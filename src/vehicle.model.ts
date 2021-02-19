import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class Vehicle {
	@IsNotEmpty()
	title: string;

	@IsNumber()
	@IsPositive()
	price: number;

	constructor(title: string, price: number) {
		this.title = title;
		this.price = price;
	}

	getInformation() {
		return { title: this.title, price: this.price };
	}
}

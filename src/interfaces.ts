interface Greetable {
	name: string;
	
	greet(message: string): void;
}

interface Singer {
	sing(): void;
}

// interface FakeSinger {
// 	sing(lyrics: string): void;
// }

class Person implements Greetable, Singer {
	// name: string;

	constructor(public name: string, private age: number) {}

	greet(message: string) {
		console.log(`${message} ${this.name}`);
	}

	get ages() {
		return this.age;
	}

	printAge() {
		console.log(`${this.name} is ${this.age} years old`);
	}

	sing() {
		console.log('Bring on the niiiiiight');
	}
}

const user1 = new Person('Paquito', 42);

console.log({ age: user1.ages });
user1.printAge();
user1.greet('Fool');
user1.sing();

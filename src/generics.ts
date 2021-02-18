const names = ['Max', 'Manuel'];

// function merge(objA: object, objB: object) {
// 	return Object.assign(objA, objB);
// }

// function merge<T, U>(objA: T, objB: U) {
// 	return Object.assign(objA, objB);
// }

function merge<T extends object, U extends object>(objA: T, objB: U) {
	return Object.assign(objA, objB);
}

const merged = merge({ name: 'Max' }, { age: '29'});
// const merged = merge({ name: 'Max' }, 29);

console.log(merged.age);

/* --------------------------------------------------------------------------- */

interface Lengthy {
	length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
	let description = 'Got no value';
	if (element.length === 1) {
		description = 'Got 1 element.';
	} else if (element.length > 1) {
		description = `Got ${element.length} elements.`;
	}

	return [element, description];
}
// With this another version I lose the actual type of the element in the result
// function countAndDescribe(element: Lengthy): [Lengthy, string] {
// 	let description = 'Got no value';
// 	if (element.length === 1) {
// 		description = 'Got 1 element.';
// 	} else if (element.length > 1) {
// 		description = `Got ${element.length} elements.`;
// 	}

// 	return [element, description];
// }

const data = countAndDescribe(['Sports', 'Music']); 
data[0].splice(0, 1);
console.log(data);

/* --------------------------------------------------------------------------- */

function extract<T extends object, U extends keyof T>(obj: T, key: U) {
	return obj[key];
}

console.log('Property:', extract({ foo: '100', bar: '200' }, 'foo'));

/* --------------------------------------------------------------------------- */

class DataStorage<T> {
	private data: T[] = [];

	addItem(item: T) {
		this.data.push(item);
	}

	removeItem(item: T) {
		this.data.splice(this.data.indexOf(item), 1);
	}

	getItems() {
		return [...this.data];
	}
}

const textStorage = new DataStorage<string>();
// textStorage.addItem(10);
// textStorage.getItems()[0].toFixed();
textStorage.addItem('Max');
textStorage.getItems()[0].toUpperCase();

const numberStorage = new DataStorage<number>();
// numberStorage.addItem('Max');
// numberStorage.getItems()[0].toUpperCase();
numberStorage.addItem(10);
numberStorage.getItems()[0].toFixed();


/* --------------------------------------------------------------------------- */

// interface CourseGoal {
// 	title: string;
// 	description: string;
// 	completeUntil: Date;
// }

type CourseGoal = {
	title: string;
	description: string;
	completeUntil: Date;
}

function createGoal(title: string, description: string, date: Date): CourseGoal {
	let goal: Partial<CourseGoal> = {};
	goal.title = title;
	goal.description = description;
	goal.completeUntil = date;
	return <CourseGoal> goal;
}

enum Role {
	ADMIN,
	READ_ONLY,
	AUTHOR
};

// const person: { 
// 	name: string;
// 	age: number;
//  hobbies: string[];
// } = {

const person = {
	name: 'PaquitoSoft',
	age: 42,
	hobbies: ['Sports', 'Cooking'],
	role: Role.AUTHOR
};

console.log(person.role);

for (const hobby of person.hobbies) {
	console.log(hobby.toUpperCase());
}

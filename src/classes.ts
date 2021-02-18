class Department {
	// private name: string;
	protected employees: string[] = [];

	// constructor(n: string) {
	// 	this.name = n;
	// }
	constructor(private readonly id: string, private readonly name: string) {}

	describe() {
		console.log(`This is department "${this.name}" (${this.id})`);
	}

	addEmployee(employee: string) {
		this.employees.push(employee);
	}

	printEmployees() {
		console.log('Employees:', this.employees);
	}
}

class ITDepartment extends Department {
	constructor(id: string, public admins: string[] = []) {
		super(id, 'IT');
	}

	printEmployees() {
		console.log('Employees:', this.employees);
		console.log('Admins:', this.admins);
	}
}

const dept1 = new Department('d1', 'Accounting');
dept1.addEmployee('Manuel');
dept1.addEmployee('Kitché');
// dept1.employees[2] = 'Mario';

dept1.describe();
dept1.printEmployees();

const dept2 = new ITDepartment('d2', ['Josema', 'Eze']);
// const dept2 = new ITDepartment('d2');
dept2.addEmployee('Marta');
dept2.addEmployee('Rivero');

dept2.describe();
dept2.printEmployees();

console.log(dept2);
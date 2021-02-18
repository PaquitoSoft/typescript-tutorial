type Validatable = {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
};

// type Project = {
// 	id: string;
// 	type: "active" | "finished";
// 	title: string;
// 	description: string;
// 	people: number;
// };

function validate(validatableInput: Validatable): boolean {
	const { value } = validatableInput;
	let isValid = true;

	if (validatableInput.required) {
		isValid = isValid && value.toString().trim().length !== 0;
	}
	if (validatableInput.minLength !== undefined && typeof value === "string") {
		isValid = isValid && value.trim().length > validatableInput.minLength;
	}
	if (validatableInput.maxLength !== undefined && typeof value === "string") {
		isValid = isValid && value.trim().length < validatableInput.maxLength;
	}
	if (validatableInput.min !== undefined && typeof value === "number") {
		isValid = isValid && value > validatableInput.min;
	}
	if (validatableInput.max !== undefined && typeof value === "number") {
		isValid = isValid && value < validatableInput.max;
	}

	return isValid;
}

function Autobind(_: any, __: string, descriptor: PropertyDescriptor) {
	const original = descriptor.value;
	return <PropertyDescriptor>{
		configurable: true,
		get() {
			return original.bind(this);
		}
	};
}

function Singleton<T extends { new (...args: any[]): {} }>(klass: T) {
	return class SingletonKlass extends klass {
		private static instance: SingletonKlass;

		private constructor(...args: any[]) {
			super([...args]);
			console.log("Building a singleton");
		}

		static getInstance() {
			if (!this.instance) {
				this.instance = new SingletonKlass();
			}
			return this.instance;
		}
	};
}

type Listener<T> = (items: T[]) => void;

enum ProjectStatus {
	ACTIVE = "active",
	FINISHED = "finished"
}

class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: ProjectStatus
	) {}
}

class State<T> {
	protected listeners: Listener<T>[] = [];

	onStateUpdate(listener: Listener<T>) {
		this.listeners.push(listener);
	}
}

class ProjectState extends State<Project> {
	private projects: Project[] = [];
	// private listeners: Listener[] = [];
	private static instance: ProjectState;

	private constructor() { super(); }

	static getInstance() {
		if (!this.instance) {
			this.instance = new ProjectState();
		}
		return this.instance;
	}

	addProject(title: string, description: string, people: number) {
		const newProject = new Project(
			Math.random().toString(),
			title,
			description,
			people,
			ProjectStatus.ACTIVE
		);
		this.projects.push(newProject);

		for (const listener of this.listeners) {
			try {
				listener([...this.projects]);
			} catch (error) {
				console.error(
					"Error executing one project state listener:",
					error
				);
			}
		}
	}

	// onStateUpdate(listener: Listener) {
	// 	this.listeners.push(listener);
	// }
}

const appState = ProjectState.getInstance();

abstract class ViewComponent<T extends HTMLElement, U extends HTMLElement> {
	$template: HTMLTemplateElement;
	$host: T;
	$templateContent: U;
	insertAtStart: boolean;

	constructor(
		templateId: string,
		hostElementId: string,
		insertAtStart: boolean,
		newElementId?: string
	) {
		this.$template = document.getElementById(
			templateId
		) as HTMLTemplateElement;
		this.$host = document.getElementById(hostElementId) as T;
		this.insertAtStart = insertAtStart;

		const importedTemplate = document.importNode(
			this.$template.content,
			true
		);
		this.$templateContent = importedTemplate.firstElementChild as U;
		if (newElementId) {
			this.$templateContent.id = newElementId;
		}

		this.attach();
		// If we call these methods right away, the constructor of the extended class 
		// would not be fully executed (only the 'super' part) so maybe some od its initialization
		// wouldn't be done yet (ex: this.type in ProjectList class)
		// We can move the execution of these methods to the constructor of every class
		// or use this hack to move then into the next tick of the runtime stack so we allow
		// the extended clases constructor to finalize
		setTimeout(() => {
			this.configure();
			this.renderContent();
		}, 0);
	}

	private attach() {
		this.$host.insertAdjacentElement(
			this.insertAtStart ? "afterbegin" : "beforeend",
			this.$templateContent
		);
	}

	protected abstract configure(): void;
	protected abstract renderContent(): void;
}

class ProjectList extends ViewComponent<HTMLDivElement, HTMLElement> {
	// $template: HTMLTemplateElement;
	// $host: HTMLElement;
	// $templateContent: HTMLElement;
	private type: ProjectStatus

	constructor(type: ProjectStatus) {
		super('project-list', 'app', false, `${type}-projects`);
		this.type = type;
		// this.$template = document.getElementById(
		// 	"project-list"
		// ) as HTMLTemplateElement;
		// this.$host = document.getElementById("app")!;

		// const importedTemplate = document.importNode(
		// 	this.$template.content,
		// 	true
		// );
		// this.$templateContent = importedTemplate.firstElementChild as HTMLFormElement;
		// this.$templateContent.id = `${this.type}-projects`;
		// this.attach();
		// this.renderContent();
		// appState.onStateUpdate(this.renderContent);
	}

	// private attach() {
	// 	this.$host.insertAdjacentElement("beforeend", this.$templateContent);
	// }

	protected configure() {
		appState.onStateUpdate((projects: Project[]) => this.renderContent(projects));
	}

	@Autobind
	protected renderContent(projects: Project[] = []) {
		const $list = this.$templateContent.querySelector("ul")!;
		const filteredProjects = projects.filter(
			(project) => project.status === this.type
		);
		$list.id = `${this.type}-projects-list`;
		this.$templateContent.querySelector(
			"h2"
		)!.textContent = `${this.type.toUpperCase()} PROJECTS (${
			filteredProjects.length
		})`;

		$list.innerHTML = "";
		for (const project of filteredProjects) {
			const $project = document.createElement("li");
			$project.textContent = project.title;
			$list.appendChild($project);
		}
	}
}

class ProjectInput extends ViewComponent<HTMLDivElement, HTMLFormElement> {
	// $template: HTMLTemplateElement;
	// $host: HTMLElement;
	// $templateContent: HTMLFormElement;
	$title: HTMLInputElement;
	$description: HTMLInputElement;
	$people: HTMLInputElement;

	constructor() {
		super('project-input', 'app', true, 'user-input');
		// this.$template = document.getElementById(
		// 	"project-input"
		// ) as HTMLTemplateElement;
		// this.$host = document.getElementById("app")!;

		// const importedTemplate = document.importNode(
		// 	this.$template.content,
		// 	true
		// );
		// this.$templateContent = importedTemplate.firstElementChild as HTMLFormElement;
		// this.$templateContent.id = "user-input";

		this.$title = this.$templateContent.querySelector(
			"#title"
		) as HTMLInputElement;
		this.$description = this.$templateContent.querySelector(
			"#description"
		) as HTMLInputElement;
		this.$people = this.$templateContent.querySelector(
			"#people"
		) as HTMLInputElement;

		// this.configure();
		// this.attach();
	}

	private gatherUserInput(): [string, string, number] {
		const title = this.$title.value;
		const description = this.$description.value;
		const people = +this.$people.value;

		const titleValidationConfig = { value: title, required: true };
		const descriptionValidationConfig = {
			value: description,
			minLength: 5
		};
		const peopleValidationConfig = { value: people, min: 1, max: 5 };

		if (
			validate(titleValidationConfig) &&
			validate(descriptionValidationConfig) &&
			validate(peopleValidationConfig)
		) {
			return [title, description, people];
		} else {
			throw new Error("Invalid input!");
		}
	}

	@Autobind
	private submitHandler(event: Event) {
		event.preventDefault();
		const [title, description, people] = this.gatherUserInput();
		console.log({ title, description, people });
		appState.addProject(title, description, people);
		this.resetForm();
	}

	private resetForm() {
		this.$templateContent.reset();
	}

	protected configure() {
		this.$templateContent.addEventListener("submit", this.submitHandler);
	}

	protected renderContent() {}

	// private attach() {
	// 	this.$host.insertAdjacentElement("afterbegin", this.$templateContent);
	// }

}

const projectInput1 = new ProjectInput();
const activeProjectsList = new ProjectList(ProjectStatus.ACTIVE);
const finishedProjectsList = new ProjectList(ProjectStatus.FINISHED);

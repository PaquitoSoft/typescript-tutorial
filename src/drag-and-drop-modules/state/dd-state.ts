import { Project, ProjectStatus } from '../models/dd-models';

type Listener<T> = (items: T[]) => void;

class State<T> {
	protected listeners: Listener<T>[] = [];

	onStateUpdate(listener: Listener<T>) {
		this.listeners.push(listener);
	}
}

export class ProjectState extends State<Project> {
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new ProjectState();
		}
		return this.instance;
	}

	private updateListeners() {
		for (const listener of this.listeners) {
			try {
				listener([...this.projects]);
			} catch (error) {
				console.error(
					'Error executing one project state listener:',
					error
				);
			}
		}
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

		this.updateListeners();
	}

	moveProject(projectId: string, newStatus: ProjectStatus) {
		const project = this.projects.find((p) => p.id === projectId);
		if (project && project.status !== newStatus) {
			project.status = newStatus;
			this.updateListeners();
		}
	}
}

export const appState = ProjectState.getInstance();

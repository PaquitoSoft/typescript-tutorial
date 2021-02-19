import { ViewComponent } from './dd-view-component.js';
import { Draggable } from '../models/dd-interfaces.js';
import { Project } from '../models/dd-models.js';
import { Autobind } from '../decorators/dd-decorators.js';

export class ProjectItem
	extends ViewComponent<HTMLUListElement, HTMLLIElement>
	implements Draggable {
	private project: Project;

	constructor(hostId: string, project: Project) {
		super('single-project', hostId, false, project.id);
		this.project = project;
	}

	get persons() {
		if (this.project.people === 1) {
			return '1 person assigned.';
		} else {
			return `${this.project.people} persons assigned.`;
		}
	}

	protected configure() {
		this.$templateContent.addEventListener(
			'dragstart',
			this.dragStartHandler
		);
		this.$templateContent.addEventListener('dragend', this.dragEndHandler);
	}

	protected renderContent() {
		this.$templateContent.querySelector(
			'h2'
		)!.textContent = this.project.title;
		this.$templateContent.querySelector('h3')!.textContent = this.persons;
		this.$templateContent.querySelector(
			'p'
		)!.textContent = this.project.description;
	}

	@Autobind
	dragStartHandler(event: DragEvent) {
		event.dataTransfer!.setData('text/plain', this.project.id);
		event.dataTransfer!.effectAllowed = 'move';
	}

	@Autobind
	dragEndHandler(event: DragEvent) {
		console.log('Drag End event:', event);
	}
}

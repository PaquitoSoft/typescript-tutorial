/// <reference path="./dd-view-component.ts" />
/// <reference path="./dd-project-item.ts" />

namespace DDApp {
	export class ProjectList
		extends ViewComponent<HTMLDivElement, HTMLElement>
		implements DragTarget {
		private type: ProjectStatus;

		constructor(type: ProjectStatus) {
			super('project-list', 'app', false, `${type}-projects`);
			this.type = type;
		}

		protected configure() {
			this.$templateContent.addEventListener(
				'dragover',
				this.dragOverHandler
			);
			this.$templateContent.addEventListener(
				'dragleave',
				this.dragLeaveHandler
			);
			this.$templateContent.addEventListener('drop', this.dropHandler);

			appState.onStateUpdate((projects: Project[]) =>
				this.renderContent(projects)
			);
		}

		@Autobind
		protected renderContent(projects: Project[] = []) {
			const $list = this.$templateContent.querySelector('ul')!;
			const filteredProjects = projects.filter(
				(project) => project.status === this.type
			);
			$list.id = `${this.type}-projects-list`;
			this.$templateContent.querySelector(
				'h2'
			)!.textContent = `${this.type.toUpperCase()} PROJECTS (${
				filteredProjects.length
			})`;

			$list.innerHTML = '';
			for (const project of filteredProjects) {
				new ProjectItem($list.id, project);
			}
		}

		@Autobind
		dragOverHandler(event: DragEvent) {
			if (event.dataTransfer?.types[0] === 'text/plain') {
				event.preventDefault();
				const $list = this.$templateContent.querySelector('ul')!;
				$list.classList.add('droppable');
			}
		}

		@Autobind
		dropHandler(event: DragEvent) {
			const projectId = event.dataTransfer!.getData('text/plain');
			appState.moveProject(
				projectId,
				this.type === ProjectStatus.ACTIVE
					? ProjectStatus.ACTIVE
					: ProjectStatus.FINISHED
			);
		}

		@Autobind
		dragLeaveHandler(event: DragEvent) {
			const $list = this.$templateContent.querySelector('ul')!;
			$list.classList.remove('droppable');
		}
	}
}

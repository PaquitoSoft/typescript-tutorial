/// <reference path="./dd-view-component.ts" />

namespace DDApp {
	export class ProjectInput extends ViewComponent<
		HTMLDivElement,
		HTMLFormElement
	> {
		$title: HTMLInputElement;
		$description: HTMLInputElement;
		$people: HTMLInputElement;

		constructor() {
			super('project-input', 'app', true, 'user-input');

			this.$title = this.$templateContent.querySelector(
				'#title'
			) as HTMLInputElement;
			this.$description = this.$templateContent.querySelector(
				'#description'
			) as HTMLInputElement;
			this.$people = this.$templateContent.querySelector(
				'#people'
			) as HTMLInputElement;
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
				throw new Error('Invalid input!');
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
			this.$templateContent.addEventListener(
				'submit',
				this.submitHandler
			);
		}

		protected renderContent() {}
	}
}

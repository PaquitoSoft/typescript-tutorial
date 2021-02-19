/// <reference path="../decorators/dd-decorators.ts" />
/// <reference path="../util/dd-validation.ts" />
/// <reference path="../state/dd-state.ts" />

namespace DDApp {
	export abstract class ViewComponent<T extends HTMLElement, U extends HTMLElement> {
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
				this.insertAtStart ? 'afterbegin' : 'beforeend',
				this.$templateContent
			);
		}

		protected abstract configure(): void;
		protected abstract renderContent(): void;
	}
}

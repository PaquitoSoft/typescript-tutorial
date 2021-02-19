/*
/// <reference path="./drag-and-drop-namespaces/models/dd-interfaces.ts" />
/// <reference path="./drag-and-drop-namespaces/models/dd-models.ts" />
/// <reference path="./drag-and-drop-namespaces/components/dd-project-input.ts" />
/// <reference path="./drag-and-drop-namespaces/components/dd-project-list.ts" />
*/

import { ProjectInput } from './drag-and-drop-modules/components/dd-project-input';
import { ProjectList } from './drag-and-drop-modules/components/dd-project-list';
import { ProjectStatus } from './drag-and-drop-modules/models/dd-models';

new ProjectInput();
new ProjectList(ProjectStatus.ACTIVE);
new ProjectList(ProjectStatus.FINISHED);

/* ------------------------------------------------------------------------------------------ */

const testProjects: any[] = [
	{
		title: 'Gipi',
		description: 'Build a tool for post purchase management',
		people: 2
	},
	{
		title: 'CIS',
		description:
			'Build a tool for integrating warehouse stocks with online store',
		people: 3
	},
	{
		title: 'Logistics',
		description:
			'Build a tool for managing picking, packing and sending onlines orders to customers',
		people: 5
	}
];

declare global {
	var appTools: any;
}
window.appTools = {
	addProject() {
		testProjects.unshift(testProjects.pop());
		const project = testProjects[0];
		(<HTMLInputElement>document.querySelector('form #title')).value =
			project.title;
		(<HTMLInputElement>document.querySelector('form #description')).value =
			project.description;
		(<HTMLInputElement>document.querySelector('form #people')).value =
			project.people;
		(<HTMLButtonElement>document.querySelector('form button')).click();
	}
};

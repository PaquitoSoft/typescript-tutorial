namespace DDApp {
	export function Autobind(
		_: any,
		__: string,
		descriptor: PropertyDescriptor
	) {
		const original = descriptor.value;
		return <PropertyDescriptor>{
			configurable: true,
			get() {
				return original.bind(this);
			}
		};
	}
}

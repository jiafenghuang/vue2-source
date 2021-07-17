import observe from './observe';
function defineReactiveData(data, key, value) {
	observe(value);
	// value可能是对象
	Object.defineProperty(data, key, {
		get() {
			console.log(`value`, value);
			return value;
		},
		set(newValue) {
			observe(newValue);
			console.log(`newValue`, newValue);
			if (newValue === value) return;
			value = newValue;
		},
	});
}
export { defineReactiveData };

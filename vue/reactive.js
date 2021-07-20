import observe from './observe';
function defineReactiveData(data, key, value) {
	observe(value);
	// value可能是对象
	Object.defineProperty(data, key, {
		get() {
			return value;
		},
		set(newValue) {
			observe(newValue);
			if (newValue === value) return;
			value = newValue;
		},
	});
}
export { defineReactiveData };

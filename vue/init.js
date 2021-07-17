import proxyData from './proxyData';
import observe from './observe';
function initState(vm) {
	var option = vm.$options;
	if (option.data) {
		initData(vm);
	}
}
function initData(vm) {
	var data = vm.$options.data;
	data = vm._data = typeof data === 'function' ? data.call(vm) : data || {};
	for (var key in data) {
		proxyData(vm, '_data', key);
	}
	observe(vm._data);
}
export { initState };

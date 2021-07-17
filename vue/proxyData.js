/*
为了解决
vm._data.title=>vm.title
*/
// target==='_data'
function proxyData(vm, target, key) {
	Object.defineProperty(vm, key, {
		get() {
			return vm[target][key];
			// 将拦截`vm.title`,获取的是`vm._data.title`
		},
		set(newValue) {
			// 将newValue拦截，赋给`vm._data.title`

			vm[target][key] = newValue;
		},
	});
}
export default proxyData;

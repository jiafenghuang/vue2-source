import proxyData from './proxyData';
import observe from './observe';
import { compileToRenderFunction } from './compiler';
import { mountComponent } from './lifecycle';
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
function initMixin(Vue) {
	Vue.prototype._init = function (options) {
		var vm = this;
		vm.$options = options;
		initState(vm);

		if (vm.$options.el) {
			vm.$mount(vm.$options.el);
		}
	};
	Vue.prototype.$mount = function (el) {
		// 编译过程的开始
		var vm = this;
		var options = vm.$options;
		el = document.querySelector(el);
		vm.$el = el;

		if (!options.render) {
			// 不存在render函数
			let template = options.template;
			if (!template && el) {
				// 不存在tempalte属性
				template = el.outerHTML;
			}
			const render = compileToRenderFunction(template);
			options.render = render;
		}
		mountComponent(vm);
	};
}
export { initMixin };

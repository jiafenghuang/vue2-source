/**
 * 主要是要在Vue.prototype上添加方法
 *
 *
 *
 */
import { initState } from './init';
function Vue(options) {
	this._init(options);
}
Vue.prototype._init = function (options) {
	var vm = this;
	vm.$options = options;
	initState(vm);
};
export default Vue;

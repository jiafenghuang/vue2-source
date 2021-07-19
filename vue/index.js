/**
 * 主要是要在Vue.prototype上添加方法
 *
 *
 *
 */
import { initMixin } from './init';
function Vue(options) {
	this._init(options);
}
initMixin(Vue);

export default Vue;

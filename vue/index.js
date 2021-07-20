/**
 * 主要是要在Vue.prototype上添加方法
 *
 *
 *
 */
import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';
import { renderMixin } from './vdom/index';

function Vue(options) {
	this._init(options);
}
initMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;

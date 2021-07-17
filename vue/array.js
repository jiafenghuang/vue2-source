import { ARR_METHODS } from './config';
import observeArr from './observeArr';
// var ARR_METHODS = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort'];
var originArrMethods = Array.prototype;
/*
Array.prototype=>类似于一个Array对象里的方法
里面的方法是通过原型继承即Array.prototype.sort
arrMethods[m]=>Array.prototype.sort

Object.create=>深拷贝

*/
var arrMethods = Object.create(originArrMethods);

ARR_METHODS.map(function (m) {
	arrMethods[m] = function () {
		// arguments是类数组
		var args = Array.prototype.slice.call(arguments);
		// args=[1,2,3,4,5]
		var rt = originArrMethods[m].apply(this, args);
		// 上面是原来的执行结果
		var newArr;
		switch (m) {
			case 'push':
			case 'unshift':
				newArr = args;
				break;
			case 'splice':
				newArr = args.slice(2);
				// splice有3个参数，第三个可能是对象
				break;
			default:
				break;
		}
		newArr && observeArr(newArr);
		return rt;
	};
});
export { arrMethods };

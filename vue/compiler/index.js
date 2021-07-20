import { parseHtmlToAst } from './astParser';
import { generate } from './generate';
function compileToRenderFunction(html) {
	const ast = parseHtmlToAst(html);
	// 通过正则将template转ast，以及保持原有的父子关系
	const code = generate(ast);
	// 区分开标签和文本和{{}}
	console.log(`code`, code);
	const render = new Function(`
			with(this) {
				return ${code}}`);

	// render就是将_c,_s,_v更改结构
	return render;
}
export { compileToRenderFunction };

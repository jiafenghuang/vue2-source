/*
  <div id="app" style="color:red;font-size: 20px;">hello {{name}}
    hello{{name}}
    <span class="text" style="color: green;">{{age}}</span>
  </div>

  _c() => createElement()
  _v() => createTextNode()
  _s() => {{name}} => _s(name)

  render(){

  }
*/
// function vrender() {
// 	// tag,{attrs},slot,children
// 	return `
//     _c("div",
//       {
//         id:'app',
//         style:{
//           "color":"red","font-size": "20px"
//         }
//       },
//       _v("hello"+_s(name)),

//       _c(
//         "span",
//         {
//           "class":"text",
//           "style":{
//             "color: "green"
//           }
//         },
//         _v(_s(age))
//       )
//     })
//   `;
// }
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function generateChild(node) {
	if (node.type === 1) {
		return generate(node);
	} else if (node.type === 3) {
		let text = node.text;
		if (!defaultTagRE.test(text)) {
			// 判断是否是纯文本
			return `_v(${JSON.stringify(text)})`;
		}
		let match, index;
		let textArr = [];
		let lastIndex = (defaultTagRE.lastIndex = 0);
		// 正则有lastIndex用于记录遍历完后,遍历出来的位置

		while ((match = defaultTagRE.exec(text))) {
			index = match.index;
			if (index > lastIndex) {
				textArr.push(JSON.stringify(text.slice(lastIndex, index)));
			}
			textArr.push(`_s(${match[1].trim()})`);
			lastIndex = index + match[0].length;
		}
		if (lastIndex < text.length) {
			textArr.push(JSON.stringify(text.slice(lastIndex)));
		}
		return `_v(${textArr.join('+')})`;
	}
}
function formatProps(attrs) {
	let attrStr = '';
	for (var i = 0; i < attrs.length; i++) {
		let attr = attrs[i];
		if (attr.name === 'style') {
			let styleAttrs = {};
			attr.value.split(';').map(styleAttr => {
				let [key, value] = styleAttr.split(':');
				styleAttrs[key] = value;
			});
			attr.value = styleAttrs;
		}
		attrStr += ` ${attr.name}:${JSON.stringify(attr.value)},`;
	}
	// slice(0, -1)删除最后的`,`
	return `{${attrStr.slice(0, -1)}}`;
}
function getChildren(el) {
	const children = el.children;
	if (children) {
		return children.map(c => generateChild(c)).join(',');
	}
}
function generate(el) {
	let children = getChildren(el);
	let code = `_c('${el.tag}',${el.attrs.length > 0 ? `${formatProps(el.attrs)}` : 'undefined'} ${children ? `,${children}` : ''})`;
	return code;
}
export { generate };

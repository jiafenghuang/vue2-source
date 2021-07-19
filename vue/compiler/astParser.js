// id="app" or id='app' or id=app
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

// 标签名 <my-header></my-header>
const ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*';

// <my:header></my:header>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// ((?:[a-zA-Z_][\\-\\.0-9_a-zA-Z*\\:)?[a-zA-Z_][\\-\\.0-9_a-zA-Z*)
// 起始标签 <div

const startTagOpen = new RegExp(`^<${qnameCapture}`);

// <input />
const startTagClose = /^\s*(\/?)>/;

// </div>结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);

function parseHtmlToAst(html) {
	let text,
		root,
		currentParent,
		stack = [];

	/*
    text,=>text->用于将标签内的文本赋值，进入chars
		root,=>用于保留根节点，最开始获取的标签
		currentParent=>暂时存储当前的父节点，例如[div,span],div是span的currentParent
		stack = []=>将DOM标签存入栈内，用于确认标签之间的父子关系
    */
	while (html) {
		let textEnd = html.indexOf('<');
		if (textEnd === 0) {
			// 遇到<div
			const startTagMatch = parseStartTag();
			// match={tag,attrs}
			if (startTagMatch) {
				start(startTagMatch.tagName, startTagMatch.attrs);
				continue;
			}
			// -----上面把<div id="app" style="color:green">
			// =>tagName:'div',attr:[{name:"id",value:"app"},{name:"style",value:"color:green"}]
			// 文本则通过chars进入AST
			const engTagMatch = html.match(endTag);
			if (engTagMatch) {
				//处理</div>以及DOM树之间的关系
				advance(engTagMatch[0].length);
				end(engTagMatch[1]);
				continue;
			}
		}
		if (textEnd > 0) {
			text = html.substring(0, textEnd);
		}
		if (text) {
			advance(text.length);
			chars(text);
		}
	}
	function parseStartTag() {
		// return match
		const start = html.match(startTagOpen);
		let end, attr;

		if (start) {
			const match = {
				tagName: start[1],
				attrs: [],
			};
			advance(start[0].length);

			while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
				match.attrs.push({
					name: attr[1],
					// attr会因为`""`， `''` ，`` 属性赋值的方式而value出现的位置不同
					value: attr[3] || attr[4] || attr[5],
				});
				// id="app"
				advance(attr[0].length);
			}
			if (end) {
				advance(end[0].length);
				return match;
			}
		}
	}
	// 每存入一个到stack里后，删除该内容
	function advance(n) {
		html = html.substring(n);
	}

	// stack [div]
	function start(tagName, attrs) {
		const element = createASTElement(tagName, attrs);
		// 判断是否头元素
		if (!root) {
			root = element;
		}
		currentParent = element;
		stack.push(element);
	}
	// 找element.parent
	function end(tagName) {
		// stack=>[div,span]
		const element = stack.pop(); //[div  span] ,pop了就获取到父元素
		// element=>span
		// currentParent=>div
		currentParent = stack[stack.length - 1];
		if (currentParent) {
			//span.parent = div
			element.parent = currentParent;
			//div.children = span
			currentParent.children.push(element);
		}
	}
	function chars(text) {
		text = text.trim();
		if (text.length > 0) {
			currentParent.children.push({
				type: 3,
				text,
			});
		}
	}
	function createASTElement(tagName, attrs) {
		return {
			tag: tagName,
			type: 1,
			children: [],
			attrs,
			parent,
		};
	}
	return root;
}

export { parseHtmlToAst };

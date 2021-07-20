function patch(oldNode, vNode) {
	let el = createElement(vNode);
	let parentElement = oldNode.parentNode;
	parentElement.insertBefore(el, oldNode.nextSibling);
	parentElement.removeChild(oldNode);
}
function createElement(vnode) {
	const { tag, props, children, text } = vnode;
	if (typeof tag === 'string') {
		vnode.el = document.createElement(tag);
		updateProps(vnode);
		children.map(child => {
			vnode.el.appendChild(createElement(child));
		});
	} else {
		// 文本节点
		vnode.el = document.createTextNode(text);
	}
	return vnode.el;
}
function updateProps(vnode) {
	const el = vnode.el;
	const newProps = vnode.props || {};
	for (let key in newProps) {
		if (key === 'style') {
			for (var sKey in newProps.style) {
				el.style[sKey] = newProps.style[sKey];
			}
		} else if (key === 'class') {
			el.className = el.class;
		} else {
			el.setAttribute(key, newProps[key]);
		}
	}
}
export { patch };

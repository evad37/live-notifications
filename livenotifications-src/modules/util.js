/**
 * 
 * @param {string} tagName 
 * @param {object<string,string|number>} [attributes]
 * @param {Node|string|Node[]|string[]} [contents]
 * @returns {HTMLElement}
 */
const makeElement = function(tagName, attributes, contents) {
	const el = document.createElement(tagName);
	if (attributes) {
		for (const prop in attributes) {
			el.setAttribute(prop, attributes[prop]);
		}
	}
	if (contents) {
		(Array.isArray(contents) ? contents : [contents])
		.forEach(content => {
			const node = content && content.nodeType ? content : document.createTextNode(content);
			el.appendChild(node);
		});
	}
	return el;
}

/**
 * @param {string} htmlString
 * @return {Node|Node[]} Node or Nodes parsed from HTML
 */
const parseHtml = function(htmlString) {
	const div = document.createElement("div");
	div.innerHTML = htmlString;
	const children = Array.from(div.childNodes);
	return children.length === 1 ? children[0] : children;
}

export {makeElement, parseHtml}
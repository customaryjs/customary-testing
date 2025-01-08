export class CustomaryTesting {
	static open(url?: string | URL): Window {
		return globalThis.window.open(url)
				?? (() => {throw new Error(`Blocked?! ${url}`)})();
	}

	static querySelector(selectors: string, window: Window): Element;
	static querySelector(selectors: string, element: Element): Element;
	static querySelector(selectors: string, target: Window | Element): Element {
		const parentNode: ParentNode =
				(target as Window).document ?? (target as Element).shadowRoot ?? target;

		return parentNode.querySelector(selectors)
			?? (()=>{throw new Error(`No element matching ${selectors}`)})();
	}

	static allTextContent(node: Node) {
		const textContentArray: string[] = collectAllTextContent(node);
		return textContentArray
				.map(s => {const t = s.trim(); return t.length ? t : s})
				.join('')
				.trim();
	}

	static input(text: string, input: HTMLInputElement) {
		input.focus();
		input.value += text;
		input.dispatchEvent(new Event("input"));
	}

	static textarea(text: string, textarea: HTMLTextAreaElement) {
		textarea.focus();
		textarea.value += text;
		textarea.dispatchEvent(new Event("input"));
	}

	static checkbox(input: HTMLInputElement) {
		input.focus();
		input.click();
		input.dispatchEvent(new Event("input"));
	}
}

function collectAllTextContent(node: Node): string[] {
	if (node.nodeType === Node.COMMENT_NODE) return [];
	if ((node as Element).tagName === 'SCRIPT') return [];
	if ((node as Element).shadowRoot) return collectAllTextContent((node as Element).shadowRoot!);
	const textContent = node.textContent?.replace(/\s+/g, ' ');
	if (textContent?.trim?.().length) return [textContent];
	if (node.hasChildNodes()) return Array.from(node.childNodes).flatMap(child => collectAllTextContent(child));
	if (textContent === ' ') return [textContent];
	return [];
}

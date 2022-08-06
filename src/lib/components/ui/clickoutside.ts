export function clickoutside(node: HTMLElement) {
	function onClick(event: MouseEvent) {
		if (node && !node.contains(event.target as HTMLElement) && !event.cancelBubble) {
			node.dispatchEvent(new CustomEvent('clickoutside', event));
		}
	}
	document.addEventListener('click', onClick, true);
	return {
		destroy() {
			document.removeEventListener('click', onClick, true);
		}
	};
}

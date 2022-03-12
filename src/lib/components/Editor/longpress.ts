export function longpress(node: HTMLElement, threshold = 500) {
	function onStart(event: MouseEvent | TouchEvent) {
		if (event.type === 'mousedown' && (event as MouseEvent).button !== 0) {
			return;
		}

		const timeout = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longpress', event));
		}, threshold);

		function cancel() {
			clearTimeout(timeout);
			node.removeEventListener('mousemove', cancel);
			node.removeEventListener('mouseup', cancel);
			node.addEventListener('touchmove', cancel);
			node.addEventListener('touchend', cancel);
		}

		node.addEventListener('mousemove', cancel);
		node.addEventListener('mouseup', cancel);
		node.addEventListener('touchmove', cancel);
		node.addEventListener('touchend', cancel);
	}

	node.addEventListener('mousedown', onStart);
	node.addEventListener('touchstart', onStart);

	return {
		destroy() {
			node.removeEventListener('mousedown', onStart);
			node.removeEventListener('touchstart', onStart);
		}
	};
}

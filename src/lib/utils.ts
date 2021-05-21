import type { Text } from 'automerge';
import type Op from 'quill-delta/dist/Op';

export function applyOpsToText(text: Text, ops: Op[]): void {
	let i = 0;
	for (const op of ops) {
		if (op.retain) {
			i += op.retain;
		}
		if (typeof op.insert === 'string') {
			const chars = op.insert.split('');
			text.insertAt!(i, ...chars);
			i += chars.length;
		} else if (op.delete) {
			text.deleteAt!(i, op.delete);
		}
	}
}

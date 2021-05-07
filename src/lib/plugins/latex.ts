import type { IPlugin } from '@aicacia/markdown';
import { addPlugin } from '@aicacia/markdown';
import katex from 'katex';

const latex: IPlugin = (code: string) => {
	try {
		return katex.renderToString(code);
	} catch (error) {
		return error;
	}
};

addPlugin('latex', latex);

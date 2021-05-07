import type { IPlugin } from '@aicacia/markdown';
import { addPlugin } from '@aicacia/markdown';
import { renderToString } from 'katex';

const latex: IPlugin = (code: string) => {
	try {
		return renderToString(code);
	} catch (error) {
		return error;
	}
};

addPlugin('latex', latex);

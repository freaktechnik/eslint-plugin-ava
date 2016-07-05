'use strict';
const createAvaRule = require('../create-ava-rule');

module.exports = context => {
	const ava = createAvaRule();
	const ifMultiple = context.options[0] !== 'always';
	let testCount = 0;

	return ava.merge({
		'CallExpression': ava.if(
			ava.isInTestFile,
			ava.isTestNode,
			ava.hasNoHookModifier
		)(node => {
			testCount++;

			const requiredLength = ava.hasTestModifier('todo') ? 1 : 2;
			const hasNoTitle = node.arguments.length < requiredLength;
			const isOverThreshold = !ifMultiple || testCount > 1;

			if (hasNoTitle && isOverThreshold) {
				context.report({
					node,
					message: 'Test should have a title.'
				});
			}
		}),
		'Program:exit': () => {
			testCount = 0;
		}
	});
};

module.exports.schema = [{
	enum: [
		'always',
		'if-multiple'
	]
}];

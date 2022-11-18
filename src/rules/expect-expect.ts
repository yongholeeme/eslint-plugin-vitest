import { createEslintRule } from "../utils";

export const RULE_NAME = "expect-expect";
export type MESSAGE_ID = "expected-expect";


export default createEslintRule<[], MESSAGE_ID>({
	name: RULE_NAME,
	meta: {
		type: "problem",
		docs: {
			description: "Enforce having expectation in test body",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			"expected-expect": "Use 'expect' in test body",
		},
	},
	defaultOptions: [],
	create: (context) => {
		return {
			"CallExpression[callee.name=/^(it|test)$/]"(node: any) {
				const { arguments: args } = node;

				// check if there is expect in test body
				const hasExpect = args.some((arg: any) => {
					if (arg?.body?.body.length) {
						return arg.body.body[0].expression?.callee.object.callee.name === "expect";
					}
				});

				if (!hasExpect) {
					context.report({
						node,
						messageId: "expected-expect",
					});
				}
			},
		};
	}
})
import { terser } from 'rollup-plugin-terser';

var isProduction = process.env.NODE_ENV === 'production';

export default {
	input: './src/index.js',
	output: {
		file: './dist/datagrid.js',
		name: 'Datagrid',
		format: 'iife',
		exports: 'default',
		globals: {
			preact: 'preact',
			'preact/hooks': 'preactHooks',
			'preact/compat': 'preactCompat'
		}
	},
	external: [
		'preact',
		'preact/hooks',
		'preact/compat',
	],
	plugins: [isProduction && terser()]
};

const path = require('path');

module.exports = {
	mode: 'production',
	entry: './src/ts/client/entry.ts',
	resolve: {
		extensions: ['.ts', '.tsx', '.mjs', '.cjs', '.js', '.json'],
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'build.js',
	},
	devServer: {
		compress: true,
		port: 8192,
	},
	module: {
		rules: [
			{ test: /\.ts/, use: 'ts-loader' },
		]
	}
};
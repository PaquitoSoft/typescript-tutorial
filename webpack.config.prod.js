const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/app.ts',
	output: {
		// filename: 'app.bundle.[contenthash].js',
		filename: 'app.bundle.js',
		path: path.resolve(__dirname, 'dist'), // webpack needs an absolute path
	},
	devtool: false,
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	plugins: [
		new CleanPlugin.CleanWebpackPlugin()
	]
};

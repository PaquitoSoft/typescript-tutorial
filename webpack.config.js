const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/app.ts',
	output: {
		// filename: 'app.bundle.[contenthash].js',
		filename: 'app.bundle.js',
		path: path.resolve(__dirname, 'dist'), // webpack needs an absolute path
		publicPath: 'dist'
	},
	devtool: 'inline-source-map',
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
	}
};

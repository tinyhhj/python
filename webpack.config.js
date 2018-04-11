const webpack = require('webpack');
const static_folder = '/com/accountbook/static';
const path = require('path');
const config = {
	entry: __dirname+static_folder+'/jsx/Entry.js',
	output: {
				path: __dirname+static_folder+'/js',
				filename: 'bundle.js',	
			},
	resolve: {
		extensions: ['.js','.jsx','.css'],
		modules: [
			path.resolve('./com/accountbook/utils'),
			path.resolve('./com/accountbook/static/jsx'),
			path.resolve('./node_modules'),
		],
	},
	module: {
		rules: [
			{
				test: /\.jsx?/,
				exclude: /node_modules/,
				use: [{
            loader: 'babel-loader'
        }]
			}
		]
	}
};

module.exports = config;

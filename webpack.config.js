const webpack = require('webpack');
const static_folder = '/com/accountbook/static';
const config = {
	entry: __dirname+static_folder+'/jsx/index.js',
	output: {
				path: __dirname+static_folder+'/js',
				filename: 'bundle.js',	
			},
	resolve: {
		extensions: ['.js','.jsx','.css']
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

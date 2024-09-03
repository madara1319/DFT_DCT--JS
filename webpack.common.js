const path=require('path')l
const HtmlWebpackPlugin=require('html-webpack-plugin');

module.exports={
  entry:{
    app:'./src/index.js',
  },
  plugins:[
    new HtmlWebpackPlugin({
      title:'Production',
      template:'index.hmtl',
    }),
  ],
  output:{
    filename:'[name].bundle.js',
    path:path.resolve(__dirname,'dist'),
    clean:true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};

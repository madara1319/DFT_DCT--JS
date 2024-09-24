//requred to work with directories
const path = require('path');
//main configuration object that tells webpack what to do
module.exports={
  //path to entry point
  entry:'./src/index.js',
  //path and filename of the final output
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'bundle.js'
  },
  //default mode is production
  mode:'development',
  module:{
    rules:[
      {
        test:/\.js$/, //apply rule to .js files
        exclude:/node_modules/, //exclude node_modules directory
        use:{
          loader:'babel-loader', // use babel-loader for .js files
          options:{
            presets:['@babel/preset-env'], //transpile JS files using preset-env
          },
        },
      },
    ],
  },
//  resolve:{
//    extensions:['.js'],
//    fallback:{
//      "path":require.resolve("path-browserify")
//    }
//  }
};


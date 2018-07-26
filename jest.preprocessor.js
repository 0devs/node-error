const babelOptions = {
  "presets": ["env"],
  "plugins": [
    [
      "babel-plugin-transform-builtin-extend", 
      {
        "globals": ["Error"]
      }
    ]
  ]
};

module.exports = require('@0devs/package/lib/babel-jest')
  .createTransformer(babelOptions);

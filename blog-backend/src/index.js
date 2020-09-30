//이 파일 에서만 no-global-assign eslint 옵션을 비활

require = require('esm')(module /*,options*/);
module.exports = require('./main.js');

var through = require('through2');

var GulpLanguageTool = require('./lib/gulp-language-tool');

module.exports = function(opts) {
	var lt = new GulpLanguageTool(opts || {});

	return through.obj(lt.processFile, lt.displayResults);
};
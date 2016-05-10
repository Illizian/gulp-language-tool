var gutil = require('gulp-util');
var table = require('text-table');

module.exports = {
	TabularResults: function(errors) {
		return generateTabularResults(errors);
	},
	Errors: function(results) {
		return generateErrorObjects(results);
	}
};

var generateErrorObjects = function(results) {
	return results.map(generateErrorObject);
};

var generateErrorObject = function(error) {
	var fromy = parseInt(error.$.fromy) + 1;
	var toy = parseInt(error.$.toy) + 1;
	
	return {
		line: fromy === toy ? fromy : fromy + '-' + toy,
		column: error.$.fromx,
		rule: error.$.ruleId,
		message: error.$.shortmsg,
		context: generateErrorContextString(error.$)
	};
};

var generateErrorContextString = function(error) {
	var before = error.context.slice(0, error.contextoffset);
	var offender = error.context.slice(error.contextoffset, parseInt(error.contextoffset) + parseInt(error.errorlength));
	var after = error.context.slice(parseInt(error.contextoffset) + parseInt(error.errorlength), error.context.length);

	return before + gutil.colors.underline.red(offender) + after;
};

var generateTabularResults = function(files) {
	return files.map(generateTable).join('\n\n');
};

var generateTable = function(file) {
	return  generateTableHeader(file) +
			'\n\n' +
			generateTableRows(file.errors);
};

var generateTableHeader = function(file) {
	var error = file.errors.length > 1 ? 'errors' : 'error';

	return gutil.colors.underline(
		file.errors.length + ' ' + error + ' in ' + file.path 
	);
};

var generateTableRows = function(errors) {
	var tableOpt = {
		align: [',', 'r', 'l', 'r'],
		stringLength: function(str) {
			return gutil.colors.stripColor(str).length;
		}
	};

	return table(errors.map(generateTableRow), tableOpt);
};

var generateTableRow = function(error) {
	return [
		gutil.colors.dim(' ' + error.line + ':' + error.column),
		error.message,
		error.context,
		gutil.colors.dim(error.rule)
	];
};
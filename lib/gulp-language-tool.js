var FileParser = require('./file-parser');
var LanguageToolInterface = require('./language-tool-interface');
var Generators = require('./generators');

module.exports =  function GulpLanguageTool(opts) {
	var Errors = [];

	if (opts.interface) {
		LanguageToolInterface.setInterface(opts.interface);
	}

	return {
		processFile: function(gulpFile, encoding, next) {
			var file = new FileParser(gulpFile, encoding);
			if (! file.isValidFile()) {
				return next(null, gulpFile);
			}

			file.getContents()
				.then(LanguageToolInterface.check)
				.then(function(results) {
					if (results.length) {
						Errors = Errors.concat({ path: gulpFile.path, errors: Generators.Errors(results) });
					}

					return next(null, gulpFile);
				})
				.catch(function(error) {
					console.log(error);
					return next(null, gulpFile);
				});

		},
		displayResults: function(callback) {
			if (! Errors.length) {
				return callback();
			}

			console.info('\n\n' + Generators.TabularResults(Errors) + '\n\n');

			return callback();
		}
	};
};
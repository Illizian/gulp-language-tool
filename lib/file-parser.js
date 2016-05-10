var path = require('path');

var supported = [ '.md', '.mdown', '.html' ];

module.exports = function FileParser(file, encoding) {
	return {
		isValidFile: function() {
			return !!~supported.indexOf(path.extname(file.path));
		},
		getFilename: function() {
			return path.basename(file.path);
		},
		getContents: function() {
			return new Promise((resolve, reject) => {
				if (file.isNull()) {
					return resolve();
				}

				if (file.isStream()) {
					return reject(new Error('Streams are not supported!'));
				}

				if (file.isBuffer()) {
					return resolve(file.contents.toString(encoding));
				}
			});
		}
	};
};
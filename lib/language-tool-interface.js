var request = require('superagent');
var xml2json = require('xml2js').parseString;

var interface = 'https://languagetool.org:8081'; 

module.exports = {
	setInterface: function(newInterface) {
		interface = newInterface;
	},
	check: function(string) {
		return new Promise((resolve, reject) => {
			if (!string) {
				return resolve([]);
			}
			
			request
				.post(interface)
				.type('form')
				.send({ language: 'en-GB', text: string })
				.end((err, res) => {
					if (err || !res.ok) {
						return reject(new Error('Communicating with Language Tool.'));
					}

					xml2json(res.text, function(err, json) {
						if (err) {
							return reject(new Error('Parsing XML from Language Tool.'));
						}

						return resolve(json.matches.error || []);
					});
				});
		});
	}
};
module.exports = {
	404: [
		{
			pattern: 'https://languagetool.org:8081',
			fixtures: function () {
				throw new Error(404);
			}
		}
	],
	200: [
		{
			pattern: 'https://languagetool.org:8081',
			fixtures: function () {
				return '<root>Example XML</root>';
			}
		}
	],
	invalidXml: [
		{
			pattern: 'https://languagetool.org:8081',
			fixtures: function () {
				return 'invalidXml';
			}
		}
	]
};
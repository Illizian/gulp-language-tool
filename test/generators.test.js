var should = require('should'); // eslint-disable-line no-unused-vars
var rewire = require('rewire');

var Generators = rewire('../lib/generators');

// A mock LanguageTool Error Array
var results = [{
	'$': {
		fromy: '0',
		fromx: '11',
		toy: '0',
		tox: '12',
		ruleId: 'EN_A_VS_AN',
		msg: 'Use \'an\' instead of \'a\' if the following word starts with a vowel sound, e.g. \'an article\', \'an hour\'',
		shortmsg: 'Wrong article',
		replacements: 'an',
		context: '## This is a example input to to show you how Langua...',
		contextoffset: '11',
		offset: '11',
		errorlength: '1',
		category: 'Miscellaneous',
		categoryid: 'MISC',
		locqualityissuetype: 'misspelling'
	}
}, {
	'$': {
		fromy: '0',
		fromx: '27',
		toy: '0',
		tox: '32',
		ruleId: 'ENGLISH_WORD_REPEAT_RULE',
		msg: 'Possible typo: you repeated a word',
		shortmsg: 'Word repetition',
		replacements: 'to',
		context: '## This is a example input to to show you how LanguageTool works.',
		contextoffset: '27',
		offset: '27',
		errorlength: '5',
		category: 'Miscellaneous',
		categoryid: 'MISC',
		locqualityissuetype: 'duplication'
	}
}];

var errorObjects = [{
	path: '/path/to/file.html',
	errors: [{
		line: 1,
		column: '11',
		rule: 'EN_A_VS_AN',
		message: 'Wrong article',
		context: '## This is \u001b[4m\u001b[31ma\u001b[39m\u001b[24m example input to to show you how Langua...'
	}, {
		line: 1,
		column: '27',
		rule: 'ENGLISH_WORD_REPEAT_RULE',
		message: 'Word repetition',
		context: '## This is a example input \u001b[4m\u001b[31mto to\u001b[39m\u001b[24m show you how LanguageTool works.'
	}]
}];

describe('Generators', function() {
	it('should return an Array of `Error Objects` with generateErrorObjects()', function() {
		var generateErrorObjects = Generators.__get__('generateErrorObjects');

		var objects = generateErrorObjects(results);

		objects.should.be.Array;
		objects.should.be.length(2);
		objects[0].should.have.keys('line', 'column', 'rule', 'message', 'context');
		objects[1].should.have.keys('line', 'column', 'rule', 'message', 'context');
	});

	it('should return an `Error Object` with generateErrorObject()', function() {
		var generateErrorObject = Generators.__get__('generateErrorObject');

		var object0 = generateErrorObject(results[0]);
		var object1 = generateErrorObject(results[1]);

		object0.should.be.an.array;
		object0.should.have.keys('line', 'column', 'rule', 'message', 'context');
		object1.should.be.an.object;
		object1.should.have.keys('line', 'column', 'rule', 'message', 'context');
	});

	it('should return a correctly formatted string with generateErrorContextString()', function() {
		var generateErrorContextString = Generators.__get__('generateErrorContextString');

		var string0 = generateErrorContextString(results[0].$);
		var string1 = generateErrorContextString(results[1].$);

		string0.should.equal('## This is \u001b[4m\u001b[31ma\u001b[39m\u001b[24m example input to to show you how Langua...');
		string1.should.equal('## This is a example input \u001b[4m\u001b[31mto to\u001b[39m\u001b[24m show you how LanguageTool works.');
	});

	it('should return the correct string with generateTabularResults()', function() {
		var generateTabularResults = Generators.__get__('generateTabularResults');

		generateTabularResults(errorObjects).should.equal(
			'\u001b[4m2 errors in /path/to/file.html\u001b[24m\n\n\u001b[2m 1:11\u001b[22m    Wrong article  ## This is \u001b'+
			'[4m\u001b[31ma\u001b[39m\u001b[24m example input to to show you how Langua...                          \u001b[2mE'+
			'N_A_VS_AN\u001b[22m\n\u001b[2m 1:27\u001b[22m  Word repetition  ## This is a example input \u001b[4m\u001b[31mto '+
			'to\u001b[39m\u001b[24m show you how LanguageTool works.  \u001b[2mENGLISH_WORD_REPEAT_RULE\u001b[22m'
		);

	});

	it('should return the correct string with generateTable()', function() {
		var generateTable = Generators.__get__('generateTable');

		generateTable(errorObjects[0]).should.equal(
			'\u001b[4m2 errors in /path/to/file.html\u001b[24m\n\n\u001b[2m 1:11\u001b[22m    Wrong article  ## This is \u001b'+
			'[4m\u001b[31ma\u001b[39m\u001b[24m example input to to show you how Langua...                          \u001b[2mE'+
			'N_A_VS_AN\u001b[22m\n\u001b[2m 1:27\u001b[22m  Word repetition  ## This is a example input \u001b[4m\u001b[31mto '+
			'to\u001b[39m\u001b[24m show you how LanguageTool works.  \u001b[2mENGLISH_WORD_REPEAT_RULE\u001b[22m'
		);
	});

	it('should return the correct string with generateTableHeader()', function() {
		var generateTableHeader = Generators.__get__('generateTableHeader');

		generateTableHeader(errorObjects[0]).should.equal('\u001b[4m2 errors in /path/to/file.html\u001b[24m');
	});

	it('should return the correct string with generateTableRows()', function() {
		var generateTableRows = Generators.__get__('generateTableRows');

		generateTableRows(errorObjects[0].errors).should.equal(
			'\u001b[2m 1:11\u001b[22m    Wrong article  ## This is \u001b[4m\u001b[31ma\u001b[39m\u001b[24m example input to t'+
			'o show you how Langua...                          \u001b[2mEN_A_VS_AN\u001b[22m\n\u001b[2m 1:27\u001b[22m  Word r'+
			'epetition  ## This is a example input \u001b[4m\u001b[31mto to\u001b[39m\u001b[24m show you how LanguageTool work'+
			's.  \u001b[2mENGLISH_WORD_REPEAT_RULE\u001b[22m'
		);
	});

	it('should return a generateTableRow()', function() {
		var generateTableRow = Generators.__get__('generateTableRow');

		var tableRow = generateTableRow(errorObjects[0].errors[0]);

		tableRow.should.be.an.Array;
		tableRow.should.be.length(4);

	});

});
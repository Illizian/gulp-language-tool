var gulp = require('gulp');
var plumber = require('gulp-plumber');
var path = require('path');
var sinon = require('sinon');
var lt = require('../.');

describe('gulp-language-tool', function() {
	beforeEach(function() {
		sinon.stub(console, 'info');
	});

	afterEach(function() {
		console.info.restore();
	});

	it('should integrate with gulp', function(done) {

		gulp.src(path.join(__dirname, 'fixtures/*'))
			.pipe(lt())
			.on('end', function() {
				console.info.callCount.should.equal(1);
				console.info.calledWithExactly('\n\n\u001b[4m4 errors in /home/alex/Development/Playground/gulp-language-tool/test/fixtures/html.html\u001b[24m\n\n\u001b[2m 4:16\u001b[22m'+'    Wrong article  ...YPE html> <html> <head> \t<title>This is \u001b[4m\u001b[31ma\u001b[39m\u001b[24m example input to to show you how Langua...                    \u001b[2mEN_A_VS_AN\u001b[22m\n\u001b[2m 4:32\u001b[22m  Word repetition  ... <head> \t<title>This is a example input \u001b[4m\u001b[31mto to\u001b[39m\u001b[24m show you how LanguageTool works.</title...  \u001b[2mENGLISH_WORD_REPEAT_RULE\u001b[22m\n\u001b[2m 7:12\u001b[22m    Wrong article  ...rks.</title> </head> <body> \t<p>This is \u001b[4m\u001b[31ma\u001b[39m\u001b[24m example input to to show you how Langua...                    \u001b[2mEN_A_VS_AN\u001b[22m\n\u001b[2m 7:28\u001b[22m  Word repetition  ...ead> <body> \t<p>This is a example input \u001b[4m\u001b[31mto to\u001b[39m\u001b[24m show you how LanguageTool works.</p> </...  \u001b[2mENGLISH_WORD_REPEAT_RULE\u001b[22m\n\n\u001b[4m2 errors in /home/alex/Development/Playground/gulp-language-tool/test/fixtures/markdown.md\u001b[24m\n\n\u001b[2m 1:11\u001b[22m    Wrong article  ## This is \u001b[4m\u001b[31ma\u001b[39m\u001b[24m example input to to show you how Langua...                          \u001b[2mEN_A_VS_AN\u001b[22m\n\u001b[2m 1:27\u001b[22m  Word repetition  ## This is a example input \u001b[4m\u001b[31mto to\u001b[39m\u001b[24m show you how LanguageTool works.  \u001b[2mENGLISH_WORD_REPEAT_RULE\u001b[22m\n\n');
				done();
			})
			.pipe(plumber());
	});

	it('should not use a reporter if there are no errors', function(done) {

		gulp.src(path.join(__dirname, 'fixtures/markdown-correct.md'))
			.pipe(lt())
			.on('end', function() {
				console.info.callCount.should.equal(0);
				done();
			})
			.pipe(plumber());
	});
});

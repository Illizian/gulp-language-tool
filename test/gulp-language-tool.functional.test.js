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

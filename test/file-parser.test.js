var should = require('should'); // eslint-disable-line no-unused-vars
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var es = require('event-stream');
var File = require('vinyl');

chai.use(chaiAsPromised);

var FileParser = require('../lib/file-parser');

describe('FileParser', function() {
	context('in buffer mode', function() {
		var validFile = new FileParser(new File({
			contents: new Buffer('ValidFile'),
			path: '/path/to/file.html'
		}), 'utf8');

		var invalidFile = new FileParser(new File({
			contents: new Buffer('InvalidFile'),
			path: '/path/to/file.doc'
		}), 'utf8');

		var nullFile = new FileParser(new File({
			contents: null,
			path: '/path/to/'
		}), 'utf8');

		it('should correctly assert a whether a file is valid with isValidFile()', function() {
			validFile.isValidFile().should.be.true();
			invalidFile.isValidFile().should.be.false();
		});

		it('should correctly retrieve a filename with getFilename()', function() {
			validFile.getFilename().should.equal('file.html');
			invalidFile.getFilename().should.equal('file.doc');
		});

		it('should resolve with undefined if isNull()', function() {
			return nullFile.getContents().should.be.fulfilled;
		});

		it('should return the contents of a file with getContents()', function() {
			return validFile.getContents().should.eventually.equal('ValidFile');
		});
	});

	context('in streaming mode', function() {
		var validFile = new FileParser(new File({
			contents: es.readArray(['ValidFile']),
			path: '/path/to/file.html'
		}), 'utf8');

		var invalidFile = new FileParser(new File({
			contents: es.readArray(['InvalidFile']),
			path: '/path/to/file.doc'
		}), 'utf8');

		var nullFile = new FileParser(new File({
			contents: null,
			path: '/path/to/'
		}), 'utf8');

		it('should correctly assert a whether a file is valid with isValidFile()', function() {
			validFile.isValidFile().should.be.true();
			invalidFile.isValidFile().should.be.false();
		});

		it('should correctly retrieve a filename with getFilename()', function() {
			validFile.getFilename().should.equal('file.html');
			invalidFile.getFilename().should.equal('file.doc');
		});

		it('should return an error when provided with a stream', function() {
			return validFile.getContents().should.be.rejectedWith(Error);
		});

		it('should resolve with undefined if isNull()', function() {
			return nullFile.getContents().should.be.fulfilled;
		});

		it.skip('should return the contents of a file with getContents()', function() {
			return validFile.getContents().should.eventually.equal('ValidFile');
		});
	});
});
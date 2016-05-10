var should = require('should'); // eslint-disable-line no-unused-vars
var rewire = require('rewire');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var superagentMock = require('superagent-mock');
var superagentMockConfig = require('./superagent-mock-config');

chai.use(chaiAsPromised);

var Interface = rewire('../lib/language-tool-interface');

describe('language-tool-interface', function() {
	var superagent;

	afterEach(function() {
		if (superagent !== undefined) {
			superagent.unset();
		}
	});

	it('should return an empty array with given an empty string', function() {
		return Promise.all([
			Interface.check(undefined).should.eventually.be.an.instanceof(Array).and.have.lengthOf(0),
			Interface.check(null).should.eventually.be.an.instanceof(Array).and.have.lengthOf(0),
			Interface.check().should.eventually.be.an.instanceof(Array).and.have.lengthOf(0),
			Interface.check('').should.eventually.be.an.instanceof(Array).and.have.lengthOf(0)
		]);
	});

	it('should return an error when it encounters Language Tool returns an error code', function() {
		superagent = superagentMock(Interface.__get__('request'), superagentMockConfig['404']);
		
		return Interface.check('A valid string').should.be.rejectedWith(Error);
	});

	it('should return an error when it encounters invalid XML', function() {
		superagent = superagentMock(Interface.__get__('request'), superagentMockConfig['invalidXml']);

		return Interface.check('A valid string').should.be.rejectedWith(Error);
	});
});


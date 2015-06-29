/* jshint node: true */
/* global beforeEach, describe, it */

'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

// var should = chai.should();
chai.should();

describe('Formatter', function () {
  var MicropubFormatter = require('../lib/formatter.js');
  var formatter;
  var baseMicropubData;

  beforeEach(function () {
    formatter = new MicropubFormatter();
    baseMicropubData = {
      'type': ['h-entry'],
      'properties': {
        'content': ['hello world'],
        'name': ['awesomeness is awesome'],
      },
    };
  });

  describe('format', function () {

    it('should return a fully formatted page on sunny day content', function () {
      return formatter.format(baseMicropubData).should.eventually.equal(
        '---\n' +
        'layout: post\n' +
        'date: \'2015-04-05T16:20:00+02:00\'\n' +
        'title: awesomeness is awesome\n' +
        '---\n' +
        'hello world\n'
      );
    });

    it('should handle non-existing title', function () {
      delete baseMicropubData.properties.name;

      return formatter.format(baseMicropubData).should.eventually.equal(
        '---\n' +
        'layout: post\n' +
        'date: \'2015-04-05T16:20:00+02:00\'\n' +
        '---\n' +
        'hello world\n'
      );
    });

    it('should handle non-existing content', function () {
      delete baseMicropubData.properties.content;

      return formatter.format(baseMicropubData).should.eventually.equal(
        '---\n' +
        'layout: post\n' +
        'date: \'2015-04-05T16:20:00+02:00\'\n' +
        'title: awesomeness is awesome\n' +
        '---\n'
      );
    });

  });

  describe('formatFilename', function () {

    it('should base file name on title', function () {
      return formatter.formatFilename(baseMicropubData).should.eventually.equal('2015-04-05-awesomeness-is-awesome.html');
    });

    it('should fall back on content', function () {
      delete baseMicropubData.properties.name;
      return formatter.formatFilename(baseMicropubData).should.eventually.equal('2015-04-05-hello-world.html');
    });

    it('should ulimately fallback to just date', function () {
      delete baseMicropubData.properties.name;
      delete baseMicropubData.properties.content;
      return formatter.formatFilename(baseMicropubData).should.eventually.equal('2015-04-05.html');
    });

  });

});
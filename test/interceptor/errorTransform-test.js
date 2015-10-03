/*
 * Copyright 2012-2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Blaine Bublitz
 */

(function (buster, define) {
	'use strict';

	var assert, refute, fail, failOnThrow;

	assert = buster.assertions.assert;
	refute = buster.assertions.refute;
	fail = buster.assertions.fail;
	failOnThrow = buster.assertions.failOnThrow;

	define('rest/interceptor/errorTransform-test', function (require) {

		var errorTransform, rest, when;

		errorTransform = require('rest/interceptor/errorTransform');
		rest = require('rest');
		when = require('when');

		buster.testCase('rest/interceptor/errorTransform', {
			'should leave the response alone by default': function () {
				var originalResponse;
				var client = errorTransform(
					function (request) {
						originalResponse = { request: request, error: 'Thrown by fake client' };
						return when.reject(originalResponse);
					}
				);
				return client({}).then(
					fail,
					failOnThrow(function (response) {
						assert.equals(response, originalResponse);
					})
				);
			},
			'should transform an error response with a custom transform function': function () {
				function transform (response) {
					response.entity = new Error(response.entity.message);
					return response;
				}

				var client = errorTransform(
					function (request) {
						return when.reject({ request: request, entity: { message: 'Thrown by fake client' } });
					},
					{ transform: transform }
				);
				return client({}).then(
					fail,
					failOnThrow(function (response) {
						assert.equals(response.entity instanceof Error, true);
					})
				);
			},
			'should have the default client as the parent by default': function () {
				assert.same(rest, errorTransform().skip());
			},
			'should support interceptor warpping': function () {
				assert(typeof errorTransform().wrap === 'function');
			}
		});

	});

}(
	this.buster || require('buster'),
	typeof define === 'function' && define.amd ? define : function (id, factory) {
		var packageName = id.split(/[\/\-]/)[0], pathToRoot = id.replace(/[^\/]+/g, '..');
		pathToRoot = pathToRoot.length > 2 ? pathToRoot.substr(3) : pathToRoot;
		factory(function (moduleId) {
			return require(moduleId.indexOf(packageName) === 0 ? pathToRoot + moduleId.substr(packageName.length) : moduleId);
		});
	}
	// Boilerplate for AMD and Node
));

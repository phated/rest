/*
 * Copyright 2012-2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Blaine Bublitz
 */

(function (define) {
  'use strict';

  define(function (require) {

    var interceptor, when;

    interceptor = require('../interceptor');
    when = require('when');

    function noopTransform (response) {
      return response;
    }

    /**
     * Modifies an error response using a transform function.
     * Useful for turning JSON responses into Error objects.
     *
     * @param {Client} [client] client to wrap
     * @param {number} [config.tranform=<noop>] transform function returns a modified response
     *
     * @returns {Client}
     */
    return interceptor({
      init: function (config) {
        config.transform = config.transform || noopTransform;
        return config;
      },
      error: function (response, config) {
        return when.reject(config.transform(response));
      }
    });

  });

}(
  typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
  // Boilerplate for AMD and Node
));

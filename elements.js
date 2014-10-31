/*jshint unused: false */
/* exported elementNode, textNode */

function elementNode(tagName, props, text) {
  'use strict';

  var element = document.createElement(tagName);
  var key;

  for (key in props) {
    element[key] = props[key];
  }

  element.innerHTML = text || '';
  return element;
}

function textNode(text) {
  'use strict';

  return document.createTextNode(text);
}
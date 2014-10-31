// Respond to open tab messages
chrome.runtime.onMessage.addListener(function (request) {
  'use strict';

  request.tabs.forEach(function (tab) {
    chrome.tabs.create({ url: tab, selected: request.focus });
  });
});
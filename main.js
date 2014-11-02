/*global elementNode, textNode */

var fbNotificationsFlyout = document.getElementById('fbNotificationsFlyout');
var openNotesButton = document.getElementById('fbNotificationsJewel');

// Wait for notifications to be opened
openNotesButton.addEventListener('click', function initialize() {
	'use strict';

	var headerActions = fbNotificationsFlyout.querySelectorAll('.uiHeaderActions')[0];
	var openAllLink = elementNode('a', {
		id: 'FBSN_OpenAll',
		href: '#',
		role: 'button'
	}, 'Open unread in new tabs');
	var dot = textNode(' · ');

	openAllLink.addEventListener('click', openAllNotes);

	if (this.classList.contains('FBSN_active') === false) {
		this.classList.add('FBSN_active');
		headerActions.insertBefore(dot, headerActions.childNodes[0]);
		headerActions.insertBefore(openAllLink, dot);
	}
});

function openAllNotes(e) {
	'use strict';

	var clickType = e.which;
	var focus;
	var tabs = [];

	// Ignore everything but left and middle click
	if (clickType !== 1 && clickType !== 2) {
		return true;
	}

	// Loop through all notifications
	Array.prototype.slice.call(fbNotificationsFlyout.querySelectorAll('li[data-gt]'), 0).forEach(function (element) {
		var markAsReadButton = element.querySelectorAll('[aria-label="Mark as Read"]')[0];

		// Get data from each notification
		var data = JSON.parse(element.getAttribute('data-gt'));
		// Get link to post
		var postLink = element.querySelectorAll('a')[0].href;

		if (postLink.indexOf('/photo.php') < 0) {
			// Remove querystring (except on photo.php)
			postLink = postLink.replace(/\?.*/gi, '');
		} else {
			// Remove extra querystring params for photo.php
			postLink = postLink.replace(/&(?:type|ref|notif_t)=[^&]+/gi, '');
		}


		// If notification is unread, open the post
		if (data.unread && tabs.indexOf(postLink) < 0) {
			tabs.push(postLink);
		}

		// Make sure post is marked as read
		data.unread = 0;
		element.setAttribute('data-gt', JSON.stringify(data));

		// Mark notification as read via Facebook interface
		if (markAsReadButton !== undefined) markAsReadButton.click();
	});

	// Left click brings focus to open tabs
	if (clickType === 1) {
		focus = true;
	}
	
	// Middle click opens tabs in background
	if (clickType === 2) {
		focus = false;
	}

	// Send request to open tabs
	chrome.runtime.sendMessage({'action' : 'openTabs', 'tabs' : tabs, 'focus': focus });
}
/* global chrome */
// Listen for installation
chrome.runtime.onInstalled.addListener(function() {
  // Initialize storage with empty user profile
  chrome.storage.sync.set({
    userProfile: {
      id: '',
      email: '',
      name: ''
    }
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "getCookies") {
      chrome.cookies.getAll({}, function(cookies) {
        sendResponse({cookies: cookies});
      });
      return true; // Will respond asynchronously
    }
  }
); 
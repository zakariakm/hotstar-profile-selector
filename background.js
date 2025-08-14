// Background script for Hotstar Auto Profile Selector
chrome.webNavigation.onCompleted.addListener((details) => {
  // Check if the completed navigation is to the profile selection page
  if (details.url.includes('/in/onboarding/profile')) {
    // Inject the content script to handle profile selection
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ['content.js']
    }).catch(error => {
      console.log('Content script already injected or error:', error);
    });
  }
});

// Also handle navigation to the main hotstar domain
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.url === 'https://www.hotstar.com/' || details.url === 'https://hotstar.com/') {
    // Wait a bit for potential redirects, then check if we're on the profile page
    setTimeout(() => {
      chrome.tabs.get(details.tabId, (tab) => {
        if (tab.url && tab.url.includes('/in/onboarding/profile')) {
          chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['content.js']
          }).catch(error => {
            console.log('Content script injection error:', error);
          });
        }
      });
    }, 1000);
  }
});

// Handle redirects and navigation changes
chrome.webNavigation.onBeforeRedirect.addListener((details) => {
  if (details.redirectUrl && details.redirectUrl.includes('/in/onboarding/profile')) {
    // The page is redirecting to the profile selection page
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ['content.js']
      }).catch(error => {
        console.log('Content script injection after redirect error:', error);
      });
    }, 500);
  }
});

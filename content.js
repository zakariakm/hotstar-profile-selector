// Content script for Hotstar Auto Profile Selector
(function() {
  'use strict';

  // Function to get the saved default profile name
  function getDefaultProfileName() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['defaultProfileName'], (result) => {
        resolve(result.defaultProfileName || '');
      });
    });
  }

  // Function to find and click on the profile with the given name
  function selectProfileByName(profileName) {
    if (!profileName) {
      console.log('No default profile name set');
      return;
    }

    // Look for profile elements with the specified name
    const profileElements = document.querySelectorAll('div[role="presentation"]');
    
    for (const element of profileElements) {
      // Find the paragraph element containing the profile name
      const nameElement = element.querySelector('p[title]');
      if (nameElement && nameElement.textContent.trim() === profileName) {
        console.log(`Found profile: ${profileName}, clicking...`);
        element.click();
        return true;
      }
    }
    
    console.log(`Profile "${profileName}" not found`);
    return false;
  }

  // Main function to handle profile selection
  async function handleProfileSelection() {
    try {
      const defaultProfileName = await getDefaultProfileName();
      
      if (defaultProfileName) {
        console.log(`Attempting to select profile: ${defaultProfileName}`);
        
        // Try to select the profile immediately
        let selected = selectProfileByName(defaultProfileName);
        
        // If not found immediately, wait a bit and try again (in case page is still loading)
        if (!selected) {
          setTimeout(() => {
            selectProfileByName(defaultProfileName);
          }, 1000);
        }
      } else {
        console.log('No default profile name configured. Please set one in the extension popup.');
      }
    } catch (error) {
      console.error('Error in profile selection:', error);
    }
  }

  // Run the profile selection when the page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleProfileSelection);
  } else {
    handleProfileSelection();
  }

  // Also run when the URL changes (for SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      if (url.includes('/in/onboarding/profile')) {
        setTimeout(handleProfileSelection, 500);
      }
    }
  }).observe(document, { subtree: true, childList: true });

})(); 
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
      return false;
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
    
    // Also try alternative selectors in case the DOM structure changes
    const alternativeSelectors = [
      'div[data-testid*="profile"]',
      'div[class*="profile"]',
      'button[data-testid*="profile"]',
      'button[class*="profile"]'
    ];
    
    for (const selector of alternativeSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent || element.innerText || '';
        if (text.trim() === profileName) {
          console.log(`Found profile with alternative selector: ${profileName}, clicking...`);
          element.click();
          return true;
        }
      }
    }
    
    console.log(`Profile "${profileName}" not found`);
    return false;
  }

  // Function to check if we're on the profile selection page
  function isProfileSelectionPage() {
    return window.location.href.includes('/in/onboarding/profile') ||
           document.querySelector('div[role="presentation"]') !== null ||
           document.querySelector('div[data-testid*="profile"]') !== null;
  }

  // Main function to handle profile selection
  async function handleProfileSelection() {
    try {
      // Only proceed if we're on the profile selection page
      if (!isProfileSelectionPage()) {
        console.log('Not on profile selection page, skipping...');
        return;
      }

      const defaultProfileName = await getDefaultProfileName();
      
      if (defaultProfileName) {
        console.log(`Attempting to select profile: ${defaultProfileName}`);
        
        // Try to select the profile immediately
        let selected = selectProfileByName(defaultProfileName);
        
        // If not found immediately, retry multiple times with increasing delays
        if (!selected) {
          const retryDelays = [500, 1000, 2000, 3000];
          for (let i = 0; i < retryDelays.length; i++) {
            setTimeout(() => {
              if (!selected) {
                console.log(`Retry ${i + 1}: Attempting to select profile again...`);
                selected = selectProfileByName(defaultProfileName);
              }
            }, retryDelays[i]);
          }
        }
      } else {
        console.log('No default profile name configured. Please set one in the extension popup.');
      }
    } catch (error) {
      console.error('Error in profile selection:', error);
    }
  }

  // Function to initialize the extension
  function initialize() {
    // Run immediately if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleProfileSelection);
    } else {
      handleProfileSelection();
    }

    // Also run when the page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(handleProfileSelection, 500);
    });

    // Set up a mutation observer to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      let shouldRetry = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if profile elements were added
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.querySelector && (
                node.querySelector('div[role="presentation"]') ||
                node.querySelector('div[data-testid*="profile"]')
              )) {
                shouldRetry = true;
                break;
              }
            }
          }
        }
      }
      
      if (shouldRetry) {
        setTimeout(handleProfileSelection, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also watch for URL changes (for SPA navigation)
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        if (url.includes('/in/onboarding/profile')) {
          setTimeout(handleProfileSelection, 500);
        }
      }
    });

    urlObserver.observe(document, { subtree: true, childList: true });
  }

  // Initialize the extension
  initialize();

})(); 
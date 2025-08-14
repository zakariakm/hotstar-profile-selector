// Popup script for Hotstar Auto Profile Selector
document.addEventListener('DOMContentLoaded', function() {
  const profileNameInput = document.getElementById('profileName');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Load saved profile name when popup opens
  chrome.storage.sync.get(['defaultProfileName'], function(result) {
    if (result.defaultProfileName) {
      profileNameInput.value = result.defaultProfileName;
    }
  });

  // Save profile name when button is clicked
  saveBtn.addEventListener('click', function() {
    const profileName = profileNameInput.value.trim();
    
    if (!profileName) {
      showStatus('Please enter a profile name', 'error');
      return;
    }

    chrome.storage.sync.set({
      defaultProfileName: profileName
    }, function() {
      showStatus(`Profile name "${profileName}" saved successfully!`, 'success');
      
      // Clear status after 3 seconds
      setTimeout(() => {
        hideStatus();
      }, 3000);
    });
  });

  // Save profile name when Enter key is pressed
  profileNameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  });

  // Function to show status message
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
  }

  // Function to hide status message
  function hideStatus() {
    statusDiv.style.display = 'none';
  }
}); 
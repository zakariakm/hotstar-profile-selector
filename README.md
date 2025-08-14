# Hotstar Auto Profile Selector

A Chrome extension that automatically selects your default profile on Hotstar's profile selection page, so you don't have to manually click on your profile every time.

## Features

- Automatically selects your default profile when visiting Hotstar's profile selection page
- Easy-to-use popup interface to set your default profile name
- Works with any profile name you have on Hotstar
- Saves your preference across browser sessions

## Installation

### Method 1: Load as Unpacked Extension (Recommended)

1. **Download the extension files**
   - Clone or download this repository from GitHub
   - Extract the files if you downloaded a ZIP file

2. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `hotstar-auto-profile-selector` folder
   - The extension should now appear in your extensions list

## Usage

1. **Set your default profile name**
   - Click on the extension icon in your Chrome toolbar
   - Enter your Hotstar profile name (e.g., "Zak")
   - Click "Save Profile Name"

2. **Visit Hotstar**
   - Go to [hotstar.com](https://www.hotstar.com)
   - When you're redirected to the profile selection page, the extension will automatically select your default profile

## How it Works

The extension:
1. Detects when you're on the Hotstar profile selection page (`https://www.hotstar.com/in/onboarding/profile`)
2. Looks for profile elements with the name you specified
3. Automatically clicks on your default profile
4. Works even if the page takes time to load (retries after 1 second)

## File Structure

```
hotstar-auto-profile-selector/
├── manifest.json      # Extension configuration
├── content.js         # Script that runs on Hotstar pages
├── popup.html         # Extension popup interface
├── popup.js           # Popup functionality
├── icon16.png         # 16x16 icon (you need to create this)
├── icon48.png         # 48x48 icon (you need to create this)
├── icon128.png        # 128x128 icon (you need to create this)
└── README.md          # This file
```

## Troubleshooting

### Extension not working?
1. Make sure you've set a default profile name in the extension popup
2. Check that the profile name matches exactly (case-sensitive)
3. Open Chrome DevTools (F12) and check the console for any error messages
4. Try refreshing the Hotstar page

### Profile not found?
1. Double-check the spelling of your profile name
2. Make sure there are no extra spaces
3. The profile name is case-sensitive

### Extension not loading?
1. Make sure all files are in the correct folder
2. Check that you have the icon files (PNG format)
3. Try reloading the extension in `chrome://extensions/`

## Privacy

This extension:
- Only runs on Hotstar.com
- Stores your profile name locally in Chrome's sync storage
- Does not collect or transmit any personal data
- Does not access any other websites or data

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Make sure your profile name is correct
3. Try reloading the extension

## License

This extension is provided as-is for personal use. 
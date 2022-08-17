# webreq-blocker

Barebones Chrome extension to block web-requests from certain domains.

## Installation

1. Clone repo
2. Go to [chrome://extensions/](chrome://extensions/) in your browser
3. Turn on Developer mode in the top-right
4. Click "Load Unpacked" in the top-left
5. Navigate to where the repo is cloned to and open the folder

## How to use

The blocker works on all subdomains, and all security levels for a domain. For example, if you input `twitter.com`, it will block:

- api.twitter.com
- http://twitter.com
- https://twitter.com
- https://api.twitter.com
- https://api.twitter.com/thistoo

Click on a domain in the popup to remove it.

// the blocked domains
let blockedDomains = [];

// listener for blocked domains
let listener = function (details) {
  // whitelist extension
  if (details.url.includes("chrome-extension://")) {
    return { cancel: false };
  }
  return { cancel: true };
};

// Get blocked domains from storage
let getBlocked = function () {
  chrome.storage.sync.get("blocked", function (result) {
    let blocked = result.blocked;
    if (!blocked) {
      blockedDomains = [];
    } else {
      blockedDomains = blocked;

      // register the listener with new blocked domains
      registerListener();
    }
  });
};

// Register listener to block webrequests to blocked domains
let registerListener = function () {
  // if the listener is already registered, unregister it
  if (chrome.webRequest.onBeforeRequest.hasListener(listener)) {
    chrome.webRequest.onBeforeRequest.removeListener(listener);
  }
  blockedDomains = blockedDomains.map(function (domain) {
    // add a trailing slash to the domain if it doesn't have one
    if (domain.charAt(domain.length - 1) !== "/") {
      domain += "/*";
    }

    // handle http and https and also subdomains
    if (domain.includes("http://")) {
      domain = domain.replace("http://", "*://*.");
    } else if (domain.includes("https://")) {
      domain = domain.replace("https://", "*://*.");
    } else {
      domain = "*://*." + domain;
    }
    return domain;
  });

  if (blockedDomains.length < 1) {
    return;
  }

  // register the listener
  chrome.webRequest.onBeforeRequest.addListener(
    listener,
    {
      urls: blockedDomains,
    },
    ["blocking"]
  );
};

// when the user updates the blocked domains, get the new blocked domains and update the listener
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateBlocked") {
    getBlocked();
  }
});

getBlocked();

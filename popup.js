// Get the blocked domains from chrome storage and update the html
function getBlocked() {
  chrome.storage.sync.get("blocked", function (result) {
    let blocked = result.blocked;
    if (!blocked) {
      blocked = [];
    }

    // clear the html
    var list = document.getElementById("blocked-list");
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    for (let i = 0; i < blocked.length; i++) {
      let item = document.createElement("div");
      item.setAttribute("id", blocked[i]);
      item.innerHTML = blocked[i];
      item.onclick = function () {
        deleteItem(blocked[i]);
      };
      item.setAttribute("class", "blocked-item");
      document.getElementById("blocked-list").appendChild(item);
    }
  });
}

// add a domain to the blocked domains list
function addToBlocked() {
  let value = document.getElementById("url-value").value;
  console.log("value: " + value);
  if (!value) {
    return;
  }
  // add to chrome storage
  chrome.storage.sync.get("blocked", function (result) {
    let blocked = result.blocked;
    if (!blocked) {
      blocked = [];
    }
    blocked.push(value);
    chrome.storage.sync.set({ blocked: blocked }, function () {
      console.log("blocked: " + blocked);
      getBlocked();

      // tell background to update blocked domains
      chrome.runtime.sendMessage({ action: "updateBlocked" });
    });
  });
}

// Delete an item from the blocked domains list
function deleteItem(id) {
  // delete the item from html
  var item = document.getElementById(id);
  item.parentNode.removeChild(item);

  // delete the item from chrome storage
  chrome.storage.sync.get("blocked", function (result) {
    var blocked = result.blocked;
    var index = blocked.indexOf(id);
    if (index > -1) {
      blocked.splice(index, 1);
    }
    chrome.storage.sync.set({ blocked: blocked });
    // tell background to update blocked domains
    chrome.runtime.sendMessage({ action: "updateBlocked" });
  });
}

// clear the blocked domains from chrome storage
function clearBlocked() {
  chrome.storage.sync.set({ blocked: [] }, function () {
    getBlocked();

    // tell background to update blocked domains
    chrome.runtime.sendMessage({ action: "updateBlocked" });
  });
}

// On load, get the blocked domains from chrome storage and update the html
function load() {
  getBlocked();
  document.getElementById("add-button").addEventListener("click", addToBlocked);
  document
    .getElementById("clear-button")
    .addEventListener("click", clearBlocked);
}

// onload event, load the app
window.onload = load;

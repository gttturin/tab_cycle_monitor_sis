let enabled = 0;

/*
 * Updates the icon if tab cycling is enabled
 */
function updateIcon() {
  browser.browserAction.setIcon({
    path: enabled !== 0 ? {
      30: "icons/cycle-enabled.png",
    } : {
      30: "icons/cycle-disabled.png",
    },
  });
}

/*
 * Make the next tab active
 */
function openNextTab() {
  browser.tabs.query({currentWindow: true})
    .then(tabs => {
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        if (tab.active) {
          let id;
          if (i + 1 === tabs.length) { // Last tab active, reset cycle
            id = tabs[0].id;
          } else { // Make next tab active
            id = tabs[i + 1].id;
          }
          return browser.tabs.update( id, {active:  true });
        }
      }
      // No active tab found, should not happen
      return Promise.reject('No active tabs found!');
    });
}

/*
 * Enable periodic tab cycling
 */
function toggleTabCycle() {
  if (enabled === 0) {
    browser.storage.sync.get('delay')
      .then((res) => {
        const delay  = (res.delay !== undefined) ? res.delay * 1000 : 5000;
        enabled = setInterval(openNextTab, delay);
        updateIcon();
      });
  } else {
    clearInterval(enabled);
    enabled = 0;
    updateIcon();
  }
}

browser.browserAction.onClicked.addListener(toggleTabCycle);

let enabled = 0;
let odd_tab_touch = 0;
let tabs_to_reload;

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
  browser.tabs.query({ currentWindow: true })
    .then(tabs => {
      let nextId;
      let idx;
      let id;
      if (tabs.length == 0) {
        // No active tab found, should not happen
        return Promise.reject('No active tabs found!');
      }
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        if (tab.active) {
          id = tab.id;

          if (tab.title == tabs_to_reload) {
            browser.tabs.reload(id, { bypassCache: true });
          }

          if (i + 1 === tabs.length) { // Last tab active, reset cycle
            nextId = tabs[0].id;
            idx = tabs[0].index;
          } else { // Make next tab active
            nextId = tabs[i + 1].id;
            idx = tabs[i + 1].index;
          }
          break;
        }
      }

      if ((idx + 1) % 2 == 0) {
        if (odd_tab_touch == 4) {
          odd_tab_touch = 0;
          return browser.tabs.update(nextId, { active: true });
        }
        odd_tab_touch += 1;
        return true;
      }

      return browser.tabs.update(nextId, { active: true });

    });
}

/*
 * Enable periodic tab cycling
 */
function toggleTabCycle() {
  if (enabled === 0) {
    browser.storage.sync.get('tabs_to_reload')
      .then((res) => {
        tabs_to_reload = (res.tabs_to_reload !== undefined) ? res.tabs_to_reload : 'FALCO';
      });

    browser.storage.sync.get('delay')
      .then((res) => {
        const delay = (res.delay !== undefined) ? res.delay * 1000 : 5000;
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

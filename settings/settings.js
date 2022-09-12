function saveOptions(e) {
  browser.storage.sync.set({
    delay: document.querySelector("#delay").value,
	tabs_to_reload: document.querySelector("#tabs_to_reload").value
  });
  e.preventDefault();
}

function restoreOptions() {
	browser.storage.sync.get('delay')
		.then((res) => {
			if (res.delay !== undefined) {
				document.querySelector("#delay").value = res.delay;
			}
			if (res.tabs_to_reload !== undefined) {
				document.querySelector("#tabs_to_reload").value = res.tabs_to_reload;
			}
		});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

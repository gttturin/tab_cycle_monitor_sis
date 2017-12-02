function saveOptions(e) {
  browser.storage.sync.set({
    delay: document.querySelector("#delay").value
  });
  e.preventDefault();
}

function restoreOptions() {
	browser.storage.sync.get('delay')
		.then((res) => {
			if (res.delay !== undefined) {
				document.querySelector("#delay").value = res.delay;
			}
		});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

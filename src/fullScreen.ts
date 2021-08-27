import screenfull = require("screenfull");
import isMobile from "ismobilejs";

export default function tryInitInFullscreen(cb: () => any) {
	if (isMobile().any) {
		const showMessage = document.createElement("button");
		showMessage.innerHTML = "Touch to start";
		showMessage.classList.add("full-screen-message");
		document.body.appendChild(showMessage);

		showMessage.addEventListener("click", () => {
			if (screenfull.isEnabled) {
				screenfull.request();
				setTimeout(() => {
					cb();
				}, 2000);
				showMessage.remove();
			}
		});
	} else {
		cb();
	}
}

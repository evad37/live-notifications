class Spinner {
	constructor() {
		this.badges = document.querySelectorAll(".mw-echo-notifications-badge");
		this.minDuration = 2500; // milliseconds
	}

	start() {
		this.startTime = new Date();
		this.badges.forEach(el => el.setAttribute("style", "background-image:url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Ajax_loader_metal_512.gif/20px-Ajax_loader_metal_512.gif)"))
	}

	stop() {
		const timeUsed = new Date() - this.startTime;
		const remainingTime = Math.max(0, this.minDuration - timeUsed);
		window.setTimeout(
			() => this.badges.forEach(el => el.removeAttribute("style")),
			remainingTime
		);
	}
}

const spinner = new Spinner();
export default spinner;
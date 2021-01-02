
import {makeElement, parseHtml} from "./util";
import spinner from "./spinner";

const App = () => {
	const api = new mw.Api({
		ajax: {
			headers: { 
				"Api-User-Agent": "livenotifications/1.1.0" + 
					" ( https://en.wikipedia.org/wiki/User:Evad37/livenotifications )"
			}
		}
	});
	const config = mw.config.get([
		"wgServer"
	]);
	const waitTimeMilliseconds = 1000 * 60;
	let lastCheckedTimestamp = new Date();

	// Main function for retreiving and displaying notifications
	const mainloop = function mainloop() {
		// Only make the request if the window/tab is active (focused)
		if ( document.hasFocus() ) {
			return api
				.get({				
					"action": "query",
					"format": "json",
					"formatversion": "2",
					"curtimestamp": 1,
					"meta": "notifications",
					"notfilter": "!read",
					"notformat": "model",
					"notlimit": "20"
				})
				.then(response => {
					// Find notifications which are new since the last request
					const notifications = (response && response.query && response.query.notifications && response.query.notifications.list || [])
						.filter(notification => lastCheckedTimestamp < new Date(notification.timestamp.utciso8601))
						.forEach(notification => {
							const iconFulllUrl = "https:" + config.wgServer + notification["*"].iconUrl;
							const readableDate = notification.timestamp.utciso8601.replace("T", " ").replace(/:\d\dZ/, " (UTC)");
							const messageDiv = makeElement("div", null, [
								makeElement("span", {
									height: "30px",
									style: "float:right; margin:-0.2em -0.2em 0.2em 0.5em"
								}, "X"),
								makeElement("a", {
									href: notification["*"].links.primary.url,
									title: notification["*"].links.primary.label,
									target: "_blank",
									style: "display:block"
								}, [
									makeElement("img", {
										src: iconFulllUrl,
										height: "30px",
										style: "display:block; float:left; margin:0 0.5em 22em -0.5em; color:#666; font-size:88%"
									}),
									parseHtml(notification["*"].header),
									makeElement("span", {
										style: "display: block; color: #666; font-size:88%"
									}, readableDate)
								].flatMap(x=>x) // Flattening in case parseHtml() returns an array
								)
							]);
							mw.notify(messageDiv, {autoHide:false});
						});
					// Update the last checked timestamp (for the next request)
					lastCheckedTimestamp = new Date(response.curtimestamp)
				})
				.catch((error, details) => console.log("[livenotifications] error", {error, details}));
		}
	}

	window.setInterval(() => {
		const loop = mainloop();
		if (loop) {
			spinner.start();
			loop.then(() => spinner.stop());
		}
	}, waitTimeMilliseconds);
}

export default App;
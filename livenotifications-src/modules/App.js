const App = () => {
	const api = new mw.Api({
		ajax: {
			headers: { 
				"Api-User-Agent": "livenotifications/1.0.0" + 
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
			api
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
							mw.notify(
								$("<div>").append(
									$("<span>")
										.attr({
											height: "30px"
										 })
										 .css({
											 float: "right",
											 "margin-left": "1em"
										 })
										 .text("X"),
									$("<a>")
										.css({
											display: "block",
										})
										.attr({
											href: notification["*"].links.primary.url,
											title: notification["*"].links.primary.label,
											target: "_blank"
										})
										.html(notification["*"].header)
										.prepend(
											$("<img>")
												.css({
													float: "left",
													margin: "0.2em 0.5em 0.5em 0"
												})
												.attr({
													src: iconFulllUrl,
													height: "30px"
												})
										)
										.append(
											$("<span>")
												.css({
													display: "block",
													color: "#666", "font-size":"88%"
												})
												.text(readableDate)
										)
								),
								{
									autoHide: false
								}
							); 
						});
					// Update the last checked timestamp (for the next request)
					lastCheckedTimestamp = new Date(response.curtimestamp)
				})
				.catch((error, details) => console.log("[livenotifications] error", {error, details}));
		}
	}

	window.setInterval(() => mainloop(), waitTimeMilliseconds)
}

export default App;
const App = () => {
	const api = new mw.Api();

	// Main function for retreiving and displaying notifications
	function mainloop() {
		if ( document.hasFocus() ) {
			api.get({
				"action": "query",
				"format": "json",
				"formatversion": "2",
				"meta": "notifications",
				"notlimit": "20"
			})
				.then(response => {
					const notifications = (response && response.query && response.query.notifications && response.query.notifications.list || [])
						.filter(notification => notification.id); // FIXME: Filter based on whether that notification has been shown
					if ( notifications.length > 0 && document.hasFocus() ) {
						notifications.forEach(notification => {
							// TODO: Save notification id so it doesn't get re-shown again
							mw.notify(
								$("<a>").attr({
									"href":mw.util.getUrl(notification.title.full)
								}).css({
									display:"block",
									width: "100%",
									height: "100%"
								}).text(
									`User:${notification.agent.name} on ${notification.title.text} at ${notification.timestamp.utciso8601}`
								),
								{
									title: `${notification.type} ${notification.section}`, // TODO: get the localised message instead of the code for this
									autoHideSeconds: 30,
									visibleTimeout: true
								} ); 
						})
					}
				})
				.then(() => {
					window.setTimeout(mainloop, 1000*60)
				})
		}
	}


	// Check for visibility changes
	// https://stackoverflow.com/questions/7389328/detect-if-browser-tab-has-focus
	var hidden, visibilityState, visibilityChange;

	if (typeof document.hidden !== "undefined") {
	  hidden = "hidden", visibilityChange = "visibilitychange", visibilityState = "visibilityState";
	} else if (typeof document.msHidden !== "undefined") {
	  hidden = "msHidden", visibilityChange = "msvisibilitychange", visibilityState = "msVisibilityState";
	}
	var document_hidden = document[hidden];

	document.addEventListener(visibilityChange, function() {
	  if (document_hidden != document[hidden]) {
		if (!document[hidden]) {
		  mainloop();
		}
		document_hidden = document[hidden];
	  }
	});

	mainloop();
}

export default App;
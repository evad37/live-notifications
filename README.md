# Live notifications
Wikimedia user script to show Echo notification as bubble notifications when they occur (or very soon thereafter)

## Outline of methodology
*In pseudo-script*
FUNCTION main():
   - IF browser tab is active THEN
      - FETCH unread echo notifications THEN
         - Filter out already-previewed notifications (maybe by comparing id to those saved in localStorage?)
      - IF number of not-previewed notification > 0 AND browser tab is active THEN
         - FOR EACH notification
            - Show bubble notification preview
            - Mark notification as previewed (maybe save id to localStorage?)
      - SLEEP 60 seconds
      - RUN main

ON load RUN main()

ON browser tab activated RUN main()

## About this repo
This script is written in modern Javascript, within the "livenotifications-src" folder
   * Modules go in the "/modules" subdirectory, and can use es6 `import` and `export`
   * index.js is for loading dependencies - ResourceLoader modules, document ready, etc
   * Main code for the user script is in App.js, which imports modules as required

Build the app by running `npm build`. This writes two files to the "dist" directory:
   1. out.js - Bundled/transpiled version of the code, with an inline sourcemap for debugging with devtools.
      - For the sandbox or testing version of the script.
   2. out.min.js - Minified version of out.js, without a sourcemap.
      - For the main version of your userscript (that other users import), in order to reduce file size. Keep in mind that without a sourcemap, debugging could be harder

Deploy to the wiki using `node deploy` (or by manually copy the built files). Or deploy just the sandbox version using `node deploy --sandbox`.
   - This requires some initial setup before first use:
      1. Set up a bot password from [[Special:BotPasswords]]
      2. Create a file `credentials.json` to store the username and password. This should be a plain JSON file, like:
         ```json
         {
            "username": "Exampleuser@somedescription",
            "password": "mybotpassword1234567890123456789"
         }
         ```
         *Do **not** commit this file to your repository!*
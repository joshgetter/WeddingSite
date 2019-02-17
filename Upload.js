/**
 * Initialize the google api.
 */
function start() {
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
        'apiKey': 'AIzaSyASq0RUHfmnchkzbNAx2Z9eYHwf7xKr0TM',
        // clientId and scope are optional if auth is not required.
        'clientId': '691983488668-1445jb3l89u4n0ghuo8lem2jutbmjfkf.apps.googleusercontent.com',
        'scope': 'profile',
    }).then(function() {
        // 3. Initialize and make the API request.
        return gapi.client.request({
            'path': 'https://people.googleapis.com/v1/people/me?requestMask.includeField=person.names',
        })
    }).then(function(response) {
        console.log(response.result);
    }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
    });
};
gapi.load()
// 1. Load the JavaScript client library.
gapi.load('client', start);

/**
 * Load the API and make an API call.  Display the results on the screen.
 */
function callScriptFunction() {
    var scriptId = "M9rcj_z4AP083h43VvmLbiXIUW3oY1-Jz";

    // Call the Apps Script API run method
    //   'scriptId' is the URL parameter that states what script to run
    //   'resource' describes the run request body (with the function name
    //              to execute)
    gapi.client.script.scripts.run({
        'scriptId': scriptId,
        'resource': {
            'function': 'getFoldersUnderRoot'
        }
    }).then(function(resp) {
        var result = resp.result;
        if (result.error && result.error.status) {
            // The API encountered a problem before the script
            // started executing.
            appendPre('Error calling API:');
            appendPre(JSON.stringify(result, null, 2));
        } else if (result.error) {
            // The API executed, but the script returned an error.

            // Extract the first (and only) set of error details.
            // The values of this object are the script's 'errorMessage' and
            // 'errorType', and an array of stack trace elements.
            var error = result.error.details[0];
            appendPre('Script error message: ' + error.errorMessage);

            if (error.scriptStackTraceElements) {
                // There may not be a stacktrace if the script didn't start
                // executing.
                appendPre('Script error stacktrace:');
                for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
                    var trace = error.scriptStackTraceElements[i];
                    appendPre('\t' + trace.function + ':' + trace.lineNumber);
                }
            }
        } else {
            // The structure of the result will depend upon what the Apps
            // Script function returns. Here, the function returns an Apps
            // Script Object with String keys and values, and so the result
            // is treated as a JavaScript object (folderSet).

            var folderSet = result.response.result;
            if (Object.keys(folderSet).length == 0) {
                appendPre('No folders returned!');
            } else {
                appendPre('Folders under your root folder:');
                Object.keys(folderSet).forEach(function(id){
                    appendPre('\t' + folderSet[id] + ' (' + id  + ')');
                });
            }
        }
    });
}
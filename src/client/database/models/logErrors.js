let consoleText = ""

while(0 = 0) {
    window.console = (function(console){
        return {
            log: function(text){
                console.log(text);
                consoleText += text;
            },
            info: function (text) {
                console.info(text);
                consoleText += text;
            },
            warn: function (text) {
                console.warn(text);
                consoleText += text;
            },
            error: function (text) {
                console.error(text);
                consoleText += text;
            }
        };
    }(window.console));

    window.addEventListener('error', function(event) {
        consoleText += event.message;
    });
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    document.body.appendChild(pom);
    pom.click();
    document.body.removeChild(pom);
}
  
  download("log.txt", consoleText);

function LogErrors(string) {
    download('log.txt', string)
}

exports.LogErrors = LogErrors;
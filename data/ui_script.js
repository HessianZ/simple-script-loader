var jsurl = document.getElementById("jsurl");

function onUrlChange() {
    self.port.emit( "urlchanged", jsurl.value );
};

jsurl.onkeyup =  onUrlChange;

document.getElementById("load_button").onclick = function( ){
    self.port.emit( "loadjs" );
};

document.getElementById('autoload').onclick = function() {
    self.port.emit( 'autoload', !!this.checked );
};

self.port.on( "init", function( url, autoload ) {
    jsurl.value = url;
    document.getElementById('autoload').checked = autoload;
});

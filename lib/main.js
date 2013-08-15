const widgets = require("sdk/widget");
const tabs = require('sdk/tabs');
const self = require('sdk/self');
const prefs = require('sdk/simple-prefs').prefs;


function loadJS( tab )
{
    if ( !prefs.script_url )
        return;

    console.log( "Loading: " + prefs.script_url );

    var worker = tab.attach({
        //contentScriptFile: [ self.data.url("jquery-1.8.0.min.js") ],
        contentScriptFile: [ self.data.url("loader.js") ],
        contentScript: "insertScript('"+prefs.script_url+"');"
    });

}

var widget = widgets.Widget({
    id: "AutoLoadJS",
    label: "AutoLoadJS",
    contentURL: self.data.url('ui.html'),
    contentScriptFile: self.data.url('ui_script.js'),
    width: 420
});

widget.port.on( "loadjs", function(){
    console.log( "Event[loadjs]" );

    loadJS( tabs.activeTab );
});


widget.port.on( 'autoload', function(enabled) {
    console.log( "Event[autoload] : " + enabled );

    prefs.autoload = enabled;
});

widget.port.on( 'urlchanged', function(u) {
    console.log( "Event[urlchanged] : " + u );

    prefs.script_url = u;
});

tabs.on('ready', function ( tab ) {
    console.log( "Event[tabs.ready] : " + tab.index + ' - ' + tab.url );


    if ( prefs.url_filter )
    {
        var re = new RegExp( prefs.url_filter );

        console.log( "Check[URL Filter] : " + re.test( tab.url ) );

        if ( ! re.test( tab.url ) )
            return;
    }

    if ( prefs.autoload )
        loadJS( tab );
});

widget.on("attach", function(w){
    console.log( "Event[Widget attached]" );
    w.port.emit("init", prefs.script_url, prefs.autoload);
});

require('sdk/simple-prefs').on( "", function( pref ){
    console.log( "Event[Preference changed] " + pref + ' = ' + prefs[pref] );
    widget.port.emit("init", prefs.script_url, prefs.autoload);
});


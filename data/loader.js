function insertScript(src, charset) {
    if (src && typeof src == 'object') {
        charset = src.charset;
        src = src.src
    }
    var b = document.body || document.getElementsByTagName('head')[0],
        g = document.createElement('script');
    g.type = 'text/javascript';
    g.async = 'async';
    g.charset = charset || 'utf-8';
    g.src = src;
    src && b.insertBefore(g, b.firstChild)
}

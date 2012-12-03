/*Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = jQuery.inArray(what, this)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};*/

function Log(text) {
	$("#debug-info").html( $("#debug-info").html() + text + "<br/>" ); 
}

function getURLParameter(name) {
    var r = decodeURIComponent(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
    return r == "null" ? null : r;
}

// emulates the $.getScript functionality, but caches and doesn't re download
// FROM: http://themergency.com/an-alternative-to-jquerys-getscript-function/
jQuery.loadScript = function (url, callback) {         
  var load = true;
  //check all existing script tags in the page for the url
  jQuery('script[type="text/javascript"]')
    .each(function () { 
      return load = (url != $(this).attr('src')); 
    });
  if (load){
    //didn't find it in the page, so load it
    jQuery.ajax({
      type: 'GET',
      url: url,
      success: callback,
      dataType: 'script',
      cache: true
    });
  } else {
    //already loaded so just call the callback
    if (jQuery.isFunction(callback)) {
      callback.call(this);
    };
  };
};
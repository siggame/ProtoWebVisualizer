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
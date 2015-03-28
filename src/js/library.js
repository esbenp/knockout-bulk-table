+(function(scope){

    var previousLibrary = scope.Library;

    var Library = function Library()
    {

    }

    // Prototype functions

    Library.noConflict = function()
    {
        scope.Library = previousLibrary;
        return Library;
    }

    scope.Library = Library;

})(this);
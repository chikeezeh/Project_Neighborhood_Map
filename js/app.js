var appModel = function(){
    // define our model


    //define our viewModel

};

var map;
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 29.948762, lng: -90.127115},
    zoom: 13
    });
}
ko.applyBindings(new appModel());

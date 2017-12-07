// data model for locations to show on map
var locations = [
    {title: 'Lebanon\'s Cafe', location: {lat: 29.949681, lng: -90.127463}},
    {title: 'The Halal Guys', location: {lat: 29.935162, lng: -90.108591}},
    {title: 'Felipe\'s Mexican Taqueria', location: {lat: 29.946726, lng: -90.112940}},
    {title: 'Commander\'s Palace', location: {lat: 29.928739, lng: -90.084253}},
    {title: 'The Bulldog, Uptown', location: {lat: 29.923453, lng: -90.087374}}
];
var ViewModel = function(){
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
    var marker = new google.maps.Marker({
        position: locations[0].location,
        map:map,
        title:'First Marker'
        });
}
ko.applyBindings(new ViewModel());

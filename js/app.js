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
    var self = this;
    // an empty array to contain the names of each restaurant.
    self.locationList = [];
    // loop over the initial location array and add the title alone to the array.
    locations.forEach(function(locationItem){
        self.locationList.push(locationItem.title);
    });
    //define our viewModel

};

var map;
var markers = [];
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 29.948762, lng: -90.127115},
    zoom: 13
    });
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < locations.length; i++ ){
        // get position from location array
        var position = locations[i].location;
        var title = locations[i].title;
        var marker = new google.maps.Marker({
            position:position,
            title:title,
            map:map,
            title:title,
            animation:google.maps.Animation.DROP,
            id:i
            });
        // push each marker to the markers array
        markers.push(marker);
        // create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
          populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);

}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
}

ko.applyBindings(new ViewModel());

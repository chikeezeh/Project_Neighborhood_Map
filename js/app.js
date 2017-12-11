// data model for locations to show on map
var locations = [
    {title: 'Lebanon\'s Cafe', location: {lat: 29.949595, lng: -90.127439}},
    {title: 'The Halal Guys', location: {lat: 29.934997, lng:  -90.108576}},
    {title: 'Felipe\'s Mexican Taqueria', location: {lat: 29.946572, lng: -90.113087}},
    {title: 'Commander\'s Palace', location: {lat: 29.928723, lng: -90.084324}},
    {title: 'The Bulldog, Uptown', location: {lat: 29.923530, lng: -90.087461}}
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
    var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
          }
          // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the infowindow on the correct marker.
          infowindow.open(map, marker);
  }
}

ko.applyBindings(new ViewModel());

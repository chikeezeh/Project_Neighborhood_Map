// data model for locations to show on map
var locations = [
    {title: 'Lebanon\'s Cafe', location: {lat: 29.949595, lng: -90.127439}},
    {title: 'The Halal Guys', location: {lat: 29.934997, lng:  -90.108576}},
    {title: 'Felipe\'s Mexican Taqueria', location: {lat: 29.946572, lng: -90.113087}},
    {title: 'Commander\'s Palace', location: {lat: 29.928723, lng: -90.084324}},
    {title: 'The Bulldog, Uptown', location: {lat: 29.923530, lng: -90.087461}}
];
var map;
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 29.948762, lng: -90.127115},
    zoom: 13,
    disableDefaultUI: true
    });
    var largeInfowindow = new google.maps.InfoWindow();
    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('bf0505');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('e3ed74');
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
            icon: defaultIcon,
            id:i
            });
        // push each marker to the markers array
        markers.push(marker);
        // create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
          populateInfoWindow(this, largeInfowindow);
        });
        // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
    // start the view model here, so that it only works when Google map is succesfully loaded.
    ko.applyBindings(new ViewModel());
}
var ViewModel = function(){
    // define our model
    var self = this;
    // an empty array to contain the names of each restaurant.
    self.locationList = ko.observableArray([]);
    // loop over the initial location array and add the title alone to the array.
    locations.forEach(function(locationItem){
        self.locationList.push(locationItem);
    });
    // filter the locations based on user input
    self.visibleList = ko.observableArray([]); // an array of the list that should be visible.
    // the visibleList should contain all the array initially, then filter it by search input.
    self.locationList().forEach(function (locationItem){
        self.visibleList.push(locationItem);
    });
    // track the user input
    self.userInput = ko.observable('');

    // take user input and use it to filter the locations on the list.
    self.filterMarkers = function () {
        // convert the user input to lower case letters
        var searchInput = self.userInput().toLowerCase();
        // remove all the visible location list
        self.visibleList.removeAll();

        self.locationList().forEach(function (locationItem) {
            // locationItem.marker.setVisible(false);
            // Compare the name of each place to user input
            // If user input is included in the name, set the place and marker as visible
            if (locationItem.title.toLowerCase().indexOf(searchInput) !== -1) {
                self.visibleList.push(locationItem);
            }
        });
        self.visibleList().forEach(function (locationItem) {
            //locationItem.marker.setVisible(true);
        });
    };


    //define our viewModel

};


var markers = [];

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
// This function takes in a COLOR, and then creates a new marker
      // icon of that color. The icon will be 21 px wide by 34 high, have an origin
      // of 0, 0 and be anchored at 10, 34).
      function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }
// error that alerts users if the map doesnt load.
function googleMapError(){
    document.getElementById('error').innerHTML = "<h2>Google Maps is not loading, please check your connection, or try reloading the page.</h2>";
}

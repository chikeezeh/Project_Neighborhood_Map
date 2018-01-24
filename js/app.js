// data model for locations to show on map
var locations = [
    {title: "Lebanon's Cafe", location: {lat: 29.949595, lng: -90.127439}, id: "4ad4c04df964a5207cf320e3"},
    {title: "The Halal Guys", location: {lat: 29.934997, lng: -90.108576}, id: "58962c42cf11d448aa676f25"},
    {title: "Felipe's Mexican Taqueria", location: {lat: 29.946572, lng: -90.113087}, id: "4ad4c04cf964a52004f320e3"},
    {title: "Commander's Palace", location: {lat: 29.928723, lng: -90.084324}, id: "4ad4c050f964a520abf420e3"},
    {title: "The Bulldog, Uptown", location: {lat: 29.923530, lng: -90.087461}, id: "41326e00f964a520a11a1fe3"}
];
var map;
function initMap() {
    "use strict";
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 29.948762, lng: -90.127115},
        zoom: 13,
        disableDefaultUI: true
    });
    // start the view model here, so that it only works when Google map is succesfully loaded.
    ko.applyBindings(new ViewModel());
}
// error that alerts users if the map doesnt load.
function googleMapError() {
    "use strict";
    document.getElementById("error").innerHTML = "<h2>Google Maps is not loading, please check your connection, or try reloading the page.</h2>";
}
// Location constructor, takes in a location list and creates a ko object.
var Location = function (data) {
    "use strict";
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
    this.marker = ko.observable();
    this.id = ko.observable(data.id);
    this.rating = ko.observable("");
    this.url = ko.observable("");
};
var ViewModel = function () {
    "use strict";
    var self = this;
    // an empty observable array to contain each restaurant.
    this.locationList = ko.observableArray([]);
    // loop over locations array and create a new Location object for each restaurant in locationList
    // and store it in the locationList array.
    locations.forEach(function (locationItem) {
        self.locationList.push(new Location(locationItem));
    });
    // initialize the infowindow
    var largeInfowindow = new google.maps.InfoWindow();
    // initialize the marker
    var markers = [];
    // code from non ko method
    var defaultIcon = makeMarkerIcon("bf0505");
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon("e3ed74");
    var bounds = new google.maps.LatLngBounds();
    // loop over the locationList array and create a marker and infowindow.
    self.locationList().forEach(function (locationItem) {
        // get position from location array
        var position = new google.maps.LatLng(locationItem.lat(), locationItem.lng());
        var title = locationItem.title();
        var id = locationItem.id();
        var rating = locationItem.rating();
        var url = locationItem.url();
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            map: map,
            id: id,
            rating: rating,
            url: url,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon
        });
        // assign the marker object to each locationItem
        locationItem.marker = marker;
        // push each marker to the markers array
        markers.push(marker);
        // create an onclick event to open an infowindow at each marker.
        marker.addListener("click", function () {
            populateInfoWindow(this, largeInfowindow);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener("mouseover", function () {
            this.setIcon(highlightedIcon);
        });
        marker.addListener("mouseout", function () {
            this.setIcon(defaultIcon);
        });
        bounds.extend(locationItem.marker.position);
    });
    map.fitBounds(bounds);
    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow) {
        // check to make sure the infowindow is not open yet.
        if (infowindow.marker !== marker) {
            // Clear the infowindow content to give the streetview time to load.
            infowindow.setContent(" ");
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener("closeclick", function () {
                infowindow.marker = null;
            });
            var infowindowContent = "<p><h5>" + marker.title + "</h5></p>";
            infowindow.setContent(infowindowContent);
            // get google street view
            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;
            var getStreetView = function (data, status) {
                if (status === google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                    infowindowContent += "</div><br><div id='pano'></div>";
                    infowindow.setContent(infowindowContent);
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"), panoramaOptions);
                } else {
                    infowindowContent += "<div>No Street View Found</div>";
                    infowindow.setContent(infowindowContent);
                }
            };
            infowindow.open(map, marker);
            $.ajax({
                url: "https://api.foursquare.com/v2/venues/" + marker.id +
                "?client_id=EKP3EYHBY0A0D3BW2TIBOE3A0QHQEMRB0EXW3YHBB4YRV2GQ&client_secret=Z5EBPJKFN0EDI53DLUGP4UDM1ZFF5YUSEIPHHFUUOPR4W1RZ&v=20130815",
                dataType: "json",
                success: function (data) {
                    // Make results easier to handle
                    var result = data.response.venue;
                    // check if the rating property is in the result returned.
                    if (result.hasOwnProperty("rating")) {
                        marker.rating = result.rating;
                    } else {
                        marker.rating = "No rating";
                    }
                    // check if the url property is in the result returned.
                    if (result.hasOwnProperty("url")) {
                        marker.url = result.url;
                    } else {
                        marker.url = "  ";
                    }
                    infowindowContent += "<p>Information from Foursquare API</P><div>Website: <a  target = _blank href =" +
                    marker.url + ">" + marker.title + "</a></div><br><div>Rating: " +
                    marker.rating + " of 10</div>";
                    // call the getStreetView function here so that the AJAX response doesnt overwrite it.
                    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                    infowindow.setContent(infowindowContent);
                },
                error: function (e) {
                    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                    infowindowContent += "<h4>Foursquare data is unavailable. Please try refreshing later.</h4>";
                    infowindow.setContent(infowindowContent);
                    //infowindow.open(map, marker);
                }
            });
        }
    }
    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34).
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            "http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|" + markerColor +
            "|40|_|%E2%80%A2",
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34)
        );
        return markerImage;
    }
    //when the user clicks on the list it triggers a click on the corresponding marker.
    self.showInfo = function (locationItem) {
        google.maps.event.trigger(locationItem.marker, "click");
    };
    //when the user hovers on the list it triggers a mouse hover on the corresponding marker.
    self.hoverMarkerIn = function (locationItem) {
        google.maps.event.trigger(locationItem.marker, "mouseover");
    };
    //when the user hovers out the list it triggers a mouse hover out on the corresponding marker.
    self.hoverMarkerOut = function (locationItem) {
        google.maps.event.trigger(locationItem.marker, "mouseout");
    };
    // filter the locations based on user input
    self.visibleList = ko.observableArray([]); // an array of the list that should be visible.
    // the visibleList should contain all the array initially, then filter it by search input.
    self.locationList().forEach(function (locationItem) {
        self.visibleList.push(locationItem);
    });
    // track the user input
    self.userInput = ko.observable("");
    // take user input and use it to filter the locations on the list.
    self.filterMarkers = function () {
        // convert the user input to lower case letters
        var searchInput = self.userInput().toLowerCase();
        // remove all the visible location list
        self.visibleList.removeAll();
        self.locationList().forEach(function (locationItem) {
            locationItem.marker.setVisible(false);
            // Compare the name of each place to user input
            // If user input is included in the name, set the place and marker as visible
            if (locationItem.title().toLowerCase().indexOf(searchInput) !== -1) {
                self.visibleList.push(locationItem);
            }
        });
        self.visibleList().forEach(function (locationItem) {
            locationItem.marker.setVisible(true);
        });
    };
};

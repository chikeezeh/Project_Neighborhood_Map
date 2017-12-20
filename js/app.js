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
    // start the view model here, so that it only works when Google map is succesfully loaded.
    ko.applyBindings(new ViewModel());
}
// error that alerts users if the map doesnt load.
function googleMapError(){
    document.getElementById('error').innerHTML = "<h2>Google Maps is not loading, please check your connection, or try reloading the page.</h2>";
}
// Location constructor, takes in a location list and creates a ko object.
var Location = function (data){
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
    this.marker = ko.observable();

};

var ViewModel = function(){
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
};

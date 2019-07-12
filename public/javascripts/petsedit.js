let markers = []

function getYourCurrentPosition() {
    let user_location = { lat: 40.4167754, lng: -3.7037902 }; //madrid coordinates to start
    // Initialize the map
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: new google.maps.LatLng(user_location.lat, user_location.lng)
    });
    //first at all I get the user position
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            user_location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Center map with user location
            map.setCenter(user_location);

            map.addListener('click', function(e) {
                cleanMarkers()
                placeMarker(e.latLng, map);
            });

        }, function() {
            console.log('Error in the geolocation service.');
        });
    } else {
        console.log('Browser does not support geolocation.');
    }

}

getYourCurrentPosition();

function placeMarker(position, map) {
    let marker = new google.maps.Marker({
        position: position,
        map: map
    });
    map.panTo(position);
    markers.push(marker);

    document.querySelector("#lat").value = position.lat()
    document.querySelector("#lng").value = position.lng()
}

function cleanMarkers() {
    for (let cont = 0; cont < markers.length; cont++) {
        markers[cont].setMap(null);
    }
    markers = [];
}
var radiousOfAction = 50;

function startMap() {
    let user_location = { lat: 41.3977381, lng: 2.190471916 };

    // Initialize the map
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: user_location
    });

    //first at all I get the user position
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            user_location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Center map with user location
            map.setCenter(user_location);

            // Add a marker for your user location
            const userMarker = new google.maps.Marker({
                position: {
                    lat: user_location.lat,
                    lng: user_location.lng
                },
                map: map,
                title: "You are here."
            });

        }, function() {
            console.log('Error in the geolocation service.');
        });
    } else {
        console.log('Browser does not support geolocation.');
    }

    showLostPetsInMap(user_location.lng, user_location.lat, radiousOfAction)
}

function showLostPetsInMap(lng, lat, dist) {

    axios.get("/pet/lostpetsmap/" + lng + "/" + lat + "/" + dist, {
            responseType: 'json'
        })
        .then((res) => {

            console.log(res.data)
            res.data.pets.forEach(pet => {
                const petMarker = new google.maps.Marker({
                    position: {
                        lat: pet.location[0],
                        lng: pet.location[1]
                    },
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: `${pet.name} (${pet.type_animal})`
                });
            });
        })
}

var slider = document.getElementById("myRange");
var tagdistance = document.getElementById("valuemeters");
tagdistance.innerHTML = slider.value;

slider.oninput = function() {
    tagdistance.innerHTML = this.value;
    radiousOfAction = +this.value
}

startMap();
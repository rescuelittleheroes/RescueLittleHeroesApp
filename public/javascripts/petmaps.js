var radiousOfAction = 0;
let user_location = {}
let map
let markers = []
startMap();

function startMap() {
    user_location = { lat: 41.3977381, lng: 2.190471916 };
    // Initialize the map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
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
            cleanMarkers()
            if (res.data.pets.length > 0) {
                res.data.pets.forEach(pet => {
                    const petMarker = new google.maps.Marker({
                        position: {
                            lat: +pet.location.coordinates[1],
                            lng: +pet.location.coordinates[0]
                        },
                        icon: "https://img.icons8.com/cotton/36/000000/footprint-scanning--v2.png",
                        map: map,
                        animation: google.maps.Animation.DROP,
                        title: `${pet.name} (${pet.type_animal})`
                    });
                    let contentString = `<style>
                        img{
                            border-radius: 50%;
                        }
                    </style>
                    <h5> ${pet.name} </h5>
                    <img src="${pet.photo_url}" alt="${pet.photo_name}" height="100" width="100">
                    <a href="/pet/list">listado</a>`
                    let infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                    petMarker.addListener('click', function() {
                        infowindow.open(map, petMarker);
                    });
                    markers.push(petMarker);

                });
            }
        })
        .catch(err => console.log(err));
}

function cleanMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

var slider = document.getElementById("myRange");
var tagdistance = document.getElementById("valuemeters");
tagdistance.innerHTML = slider.value;
radiousOfAction = +(slider.value);

slider.oninput = function() {
    tagdistance.innerHTML = this.value;
    radiousOfAction = +this.value
    showLostPetsInMap(user_location.lng, user_location.lat, radiousOfAction)
}
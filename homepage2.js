
     
     let map = L.map('map').setView([20.5937, 78.9629], 6);
        let distance = 0;
        let control = null;
        let fromMarker = null;
        let toMarker = null;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        function calculateRoute() {
            let from = document.getElementById('from').value;
            let to = document.getElementById('to').value;

            if (!to) {
                alert("Please enter a destination");
                return;
            }

            if (control) {
                map.removeControl(control);
            }

            if (fromMarker) {
                map.removeLayer(fromMarker);
            }

            if (toMarker) {
                map.removeLayer(toMarker);
            }

            if (from) {
                geocodeAndRoute(from, to);
            } else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        let currentLocation = L.latLng(position.coords.latitude, position.coords.longitude);
                        geocodeAndRoute(currentLocation, to);
                    }, function() {
                        alert("Geolocation failed. Please enter the starting location manually.");
                    });
                } else {
                    alert("Geolocation is not supported by this browser. Please enter the starting location manually.");
                }
            }
        }

        function geocodeAndRoute(from, to) {
            if (typeof from === "string") {
                L.Control.Geocoder.nominatim().geocode(from, function(fromResults) {
                    if (fromResults.length > 0) {
                        let fromLatLng = fromResults[0].center;
                        fromMarker = L.marker(fromLatLng).addTo(map).bindPopup('From: ' + fromResults[0].name).openPopup();
                        setRoute(fromLatLng, to);
                    } else {
                        alert('Starting location not found: ' + from);
                    }
                });
            } else {
                fromMarker = L.marker(from).addTo(map).bindPopup('From: Current Location').openPopup();
                setRoute(from, to);
            }
        }

        function setRoute(fromLatLng, to) {
            L.Control.Geocoder.nominatim().geocode(to, function(toResults) {
                if (toResults.length > 0) {
                    let toLatLng = toResults[0].center;
                    toMarker = L.marker(toLatLng).addTo(map).bindPopup('To: ' + toResults[0].name).openPopup();

                    control = L.Routing.control({
                        waypoints: [
                            L.latLng(fromLatLng),
                            L.latLng(toLatLng)
                        ],
                        routeWhileDragging: false,
                        show: false, // Disable turn-by-turn directions
                        createMarker: function() { return null; },
                        addWaypoints: false,
                        draggableWaypoints: false
                    }).addTo(map);

                    control.on('routesfound', function(e) {
                        distance = e.routes[0].summary.totalDistance / 1000; // distance in kilometers
                        document.getElementById('output').innerHTML = `Distance: ${distance.toFixed(2)} km`;
                        showPrices();
                    });

                } else {
                    alert('Destination not found: ' + to);
                }
            });
        }

        function showPrices() {
            const transportOptions = document.getElementById('transport-options');
            transportOptions.innerHTML = '';

            if (distance > 10) {
                transportOptions.innerHTML += `
                    <div class="transport-option" onclick="navigateToPayment('car', ${distance * 50})">
                        <img src="https://via.placeholder.com/100x100.png?text=Car" alt="Car">
                        <p>Car Price: ₹${(distance * 50).toFixed(2)}</p>
                    </div>
                    <p>Auto and Bike are not available for distances over 10 km. Please select Car.</p>
                `;
            } else {
                transportOptions.innerHTML += `
                    <div class="transport-option" onclick="navigateToPayment('auto', ${distance * 35})">
                        <img src="https://cdn-icons-png.flaticon.com/512/1927/1927158.png" alt="Auto">
                        <p> "Auto Price: ₹${(distance * 35).toFixed(2)}</p>
                    </div>
                    <div class="transport-option" onclick="navigateToPayment('bike', ${distance * 20})">
                        <img src="https://th.bing.com/th/id/OIP.aBR5HiRntJVf0emXH0XgmQHaHa?w=1920&h=1920&rs=1&pid=ImgDetMain" alt="Bike">
                        <p>Bike Price: ₹${(distance * 20).toFixed(2)}</p>
                    </div>
                    <div class="transport-option" onclick="navigateToPayment('car', ${distance * 50})">
                        <img src="https://cdn-icons-png.flaticon.com/512/730/730308.png" alt="Car">
                        <p>Car Price: ₹${(distance * 50).toFixed(2)}</p>
                    </div>
                `;
            }
        }

        function navigateToPayment(mode, price) {
            const paymentPageUrl = `payment.html?mode=${mode}&price=${price.toFixed(2)}`;
            window.location.href = paymentPageUrl;
        }

        function showSuggestions(inputElement, suggestionsId) {
            let query = inputElement.value;
            if (query.length < 3) {
                document.getElementById(suggestionsId).innerHTML = '';
                return;
            }
            L.Control.Geocoder.nominatim().geocode(query, function(results) {
                let suggestions = results.map(result => `<div onclick="selectSuggestion('${inputElement.id}', '${result.name}')">${result.name}</div>`);
                document.getElementById(suggestionsId).innerHTML = suggestions.join('');
            });
        }

        function selectSuggestion(inputId, suggestion) {
            document.getElementById(inputId).value = suggestion;
            document.getElementById(inputId + 'Suggestions').innerHTML = '';
        }
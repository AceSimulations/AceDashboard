// Handle all Bravo Airlines client actions
// TODO: Refine script

$(() => {

    // Function to build sidebar data
    function populateDepartures(destination, ident) {
        // Set SRC of destination image and update destination text
        $('#curr-destination-img').attr('src', destination.image)
        $('#city-state').text(`${destination.city}, ${destination['state-code']}`)
        $('#dest-icao').text(destination.icao)
        $('#dest-routes').text(destination.departures.length)
        // Show current departure parent (destination)
        $('#current-destination').css({ display: "block" })
        // Set content buffer to hidden
        resolveBuffer('content')
        // Update showing marker
        $('#routemap-desc-loc').text(destination.airport)
        // Edit the map personality to match destination
        loadMap({ center: destination.center, marker: true })
        // Wipe current routes
        $('#route-ctr-container').text("")
        // Display destination departure division
        $('#destination-departures').css({ display: "block" })
        // Load each destination (with its unique identifier)
        destination.departures.forEach((departure) => {
            var route = document.createElement('div')
            if (ident === departure.uuid) {
                // Change smart tool appearance
                $(route).css({ "border": "3px solid #1479FF" })
                $('#edit-icon').css({ "background-color": "#1479FF" })
                $('#rubbish-icon').css({ "background-color": "#C22929" })
                $('#json-icon').css({ "background-color": "#3BBC5B" })
                $($('.action-icon')[0]).attr('src', 'bravo/edit-selected.png')
                $($('.action-icon')[1]).attr('src', 'bravo/rubbish-selected.png')
                $($('.action-icon')[2]).attr('src', 'bravo/json-selected.png')
                // LoadMap and find matching destination
                var destinations = JSON.parse(sessionStorage.getItem('cache')).destinations
                var match = destinations.find((destination) => destination.airport === departure.arrival.airport)
                if (match) {
                    loadMap({ center: destination.center, marker: { arrival: match.center } })
                    $('#routemap-desc-loc').text(`${destination.city} - ${departure.arrival.city}`)
                };
            } else {}
            $(route).attr('id', departure.uuid).addClass('route-wrapper')
            $('#route-ctr-container').append(route)
            // Add the route event listener
            $(route).click(() => populateDepartures(destination, departure.uuid))
            // Create text element for route description
            var routeDesc = document.createElement('p')
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December']
            var departureDate = new Date(departure['departure-date'])
            $(routeDesc).addClass('route-description').html(`<span class="route-icao">${departure.arrival.icao}</span>${departure.arrival.city}, ${departure.arrival['state-code']} - ${months[departureDate.getMonth()]} ${departureDate.getDate()}, ${departureDate.getFullYear()}`)
            // Create absolute maximise image TODO: create maximize event lister to open in editor
            var expand = document.createElement('img')
            $(expand).css({ height: "30%", position: "absolute", top: "50%", right: "20px", transform: "translateY(-50%)" })
            $(expand).attr('src', 'bravo/expand.png')
            // Create and center the airplane image in each route wrapper
            var airplane = document.createElement('img')
            $(airplane).attr('src', 'bravo/flights-inactive.png')
            $(airplane).css({ width: "25px", transform: "rotate(90deg)", margin: "12px", "margin-left": "20px" })
            $(route).append(airplane).append(expand).append(routeDesc)
        })
    }

    // Function to export calendar
    function buildCalendar(exports) {
        // Set global date
        var date = new Date()
        // Clear current calendar
        $('#calendar-body').html("")
        // Build calendar with integrated elements
        var monthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December']
        $('#calendar-header').text(`${months[date.getMonth()]} ${date.getFullYear()}`)
        for (let x = 0; x < monthLength[date.getMonth()]; x++) {
            // Create calendar div
            var calendar_element = document.createElement('div')
            // Append the proper (already styled class)
            $(calendar_element).addClass('calendar-elmt')
            // Indenting the first day of the month according to month
            if (x === 0) $(calendar_element).css({ "margin-left": `calc(${monthFirstDay * 13}% + ${(monthFirstDay * 4) - (monthFirstDay * 2)}px)` })
            // Check if exports is defined and 
            if (exports && exports.find((day) => day.day === x) || exports && exports.find((day) => day.day === x) === 0) { 
                $(calendar_element).css({ border: "2px solid #1479FF" }).click((e) => {
                // Configure the click listener (localstorage already defined)
                var identifierMatch;
                var currentIdentifier = exports.find((day) => day.day === x)
                JSON.parse(sessionStorage.getItem('cache')).destinations.forEach((destination, index) => {
                    var match = destination.departures.find((departure) => departure.uuid === currentIdentifier.identifier)
                    if (match) identifierMatch = { match, index }
                });
                // Hide no-content wrapper
                $('#no-content-wrapper').css({ display: "none" })
                // Select the corresponding destination
                $('.destination').each((find) => $($('.destination')[find]).removeClass('modified'))
                // Add the blue border to the destination
                console.log($($('#destination-wrapper').children()[identifierMatch.index]).addClass('modified'))
                // populateDepartures()
                populateDepartures(JSON.parse(sessionStorage.getItem('cache')).destinations[identifierMatch.index], identifierMatch.match.uuid)
            })};
            // Checking to see if x matches today's date
            if (date.getDate() - 1 === x) {
                var txt_date = document.createElement('p')
                $(txt_date).attr('id', 'currentDayText').text(date.getDate())
                $(calendar_element).attr('id', 'currentDay').append(txt_date)
            } else {}
            // Append the element to the body
            $('#calendar-body').append(calendar_element)
        }; if (exports) resolveBuffer('calendar') /* Close the buffer wheel */
    }; buildCalendar();

    // Load the current empty map
    function loadMap(exports) {
        // Check if a marker was requested
        mapboxgl.accessToken = 'pk.eyJ1IjoiZmxpZ2h0ZHVkZTczNyIsImEiOiJjazhhbGNhN3YwajNkM2VxbjJmd2RqZzNzIn0.KOGGr-dW-HY5G1USvph9ig';
        let zoom = 1.7
        if (exports.marker) zoom = 3
        if (exports.marker.arrival) zoom = 2
        var map = new mapboxgl.Map({
            container: 'routemap',
            style: 'mapbox://styles/mapbox/light-v10',
            zoom: zoom,
            center: exports.marker && exports.marker.arrival ? [(exports.center[0] + exports.marker.arrival[0]) / 2, (exports.center[1] + exports.marker.arrival[1]) / 2] : exports.center
        });
        if (exports.marker) {
            var marker = new mapboxgl.Marker()
                .setLngLat(exports.center)
                .addTo(map)
            if (exports.marker.arrival) {
                var arrival = new mapboxgl.Marker()
                    .setLngLat(exports.marker.arrival)
                    .addTo(map)
                // Add GEOJSON line (Mapbox)
                map.on('load', function () {
                    map.addSource('route', {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'properties': {},
                                'geometry': {
                                    'type': 'LineString',
                                    'coordinates': [exports.center, exports.marker.arrival]
                                }
                            }
                        });
                    map.addLayer({
                        'id': 'route',
                        'type': 'line',
                        'source': 'route',
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        'paint': {
                            'line-color': '#3FB1CE',
                            'line-width': 4
                        }
                    });
                });
            } else {}
        } else {}
    }; loadMap({ center: [-98.5795, 39.8283], marker: false });

    // Request to grab nessesary data
    function clientConnect(callback) {
        axios.post('/client/load')
            .then(({ data }) => {
                if (!data.error) {
                    // Handle response data from the server (sort destinations)
                    sessionStorage.setItem('cache', JSON.stringify(data))
                    callback(data)
                } else throw {}
            }).catch((e) => $('.error-mask').css({ display: "block" }) )
    }

    // Function to remove buffers
    function resolveBuffer(loc) {
        var runningBuffers = $('.buffer')
        runningBuffers.each((buff) => {
            if ($(runningBuffers[buff]).data('loc') === loc) $(runningBuffers[buff]).css({ display: 'none' })
        })
    }

    // Function to start buffers
    function startBuffer(loc) {
        var runningBuffers = $('.buffer')
        runningBuffers.each((buff) => {
            if ($(runningBuffers[buff]).data('loc') === loc) $(runningBuffers[buff]).css({ display: 'block' })
        })
    }

    // onPageLoad request to clientConnect() to build calendar
    clientConnect((data) => {
        // Set the marked days (will populate with destination dates)
        var markedDays = [];
        data.destinations.forEach((destination) => {
            destination.departures.forEach((departure) => {
                // Sort by days this month
                var destinationDeparture = new Date(Date.parse(departure['departure-date']) + 86400000 /* Account for date offset */)
                if (destinationDeparture.getMonth() === new Date().getMonth()) {
                    // Export markedDays
                    markedDays.push({ day: destinationDeparture.getDate() - 1, identifier: departure.uuid })
                } else {}
            })
        }); buildCalendar(markedDays);
    })

    // Cycle through all .destination class and assign pull function
    $('.destination').each((index) => {
        var currentElement = $('.destination')[index]
        currentElement.addEventListener('click', (e) => {
            $('.destination').each((find) => $($('.destination')[find]).removeClass('modified'))
            $('#destination-departures').css({ display: "none" })
            $('#current-destination').css({ display: "none" })
            // Hide no-content wrapper
            $('#no-content-wrapper').css({ display: "none" })
            // Find content buffer
            startBuffer('content')
            // Edit icon personalities (deselected)
            $('#edit-icon').css({ "background-color": "#ECECEC" })
            $('#rubbish-icon').css({ "background-color": "#ECECEC" })
            $('#json-icon').css({ "background-color": "#ECECEC" })
            $($('.action-icon')[0]).attr('src', 'bravo/edit-unselected.png')
            $($('.action-icon')[1]).attr('src', 'bravo/rubbish-unselected.png')
            $($('.action-icon')[2]).attr('src', 'bravo/json-unselected.png')
            // Add the modified class
            $(currentElement).addClass('modified')
            // Grab the client data
            if (!sessionStorage.getItem('cache')) {
                clientConnect((data) => {
                    // Handle destination response data
                    populateDepartures(data.destinations[$(currentElement).data('index')])
                })
            } else populateDepartures(JSON.parse(sessionStorage.getItem('cache')).destinations[$(currentElement).data('index')])
        })
    })

})
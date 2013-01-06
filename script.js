ymaps.ready(function() {

    var map = new ymaps.Map("map", {
        center: [55.74, 37.61],
        zoom: 11,
        behaviors: ['default', 'scrollZoom']
    });

    map.controls
        // Кнопка изменения масштаба
        .add('zoomControl', {
            left: '10',
            top: '50'
        })
        // Список типов карты
        .add('typeSelector', {
            left: '10',
            top: '10'
        });

    for (var i = 0; i < window.metro.length; i++) {
        initStations(map, window.metro[i]);
    }

});

function initStations(map, metro) {

    var stations = metro.stations,
        color = metro.color;

    for (var i = 0; i < stations.length; i++) {

        var station = stations[i];

        map.geoObjects.add(new ymaps.Circle(
            [
                [station.lat, station.long], // Координаты центра круга
                500 // Радиус круга в метрах
            ],
            {
                hintContent: station.station
            },
            {
                fillColor: color,
                fillOpacity: 0.4,

                strokeColor: "#990066",
                strokeOpacity: 0.8,
                strokeWidth: 1
            }
        ));

    }

}
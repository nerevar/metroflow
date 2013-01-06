ymaps.ready(function() {

    Metro.init();

});

/**
 * Инициализация всей карты метро, включая:
 *   - Яндекс Карты
 *   - Схему линий
 *   - Станции метрополитена
 *
 * @return {*}
 */
Metro.init = function() {

    Metro.map.init();

    Metro.scheme
        .init()
        .show();

    Metro.lines
        .init()
        .show();

    return this;

};

/**
 * Инициализация Яндекс Карт
 * @return {*}
 */
Metro.map.init = function() {

    this.ymap = new ymaps.Map('map', {
        center: [55.74, 37.61],
        zoom: 11,
        behaviors: ['default', 'scrollZoom']
    });

    this.ymap.controls
        .add('zoomControl', {
            left: '10',
            top: '50'
        })
        .add('typeSelector', {
            left: '10',
            top: '10'
        });

    return this;

};

/**
 * Добавляет объект(ы) на карту
 * @param item
 * @return {*}
 */
Metro.map.add = function(item) {

    this.ymap.geoObjects.add(item);

    return this;

};

/**
 * Удаляет объект(ы) с карты
 * @param item
 * @return {*}
 */
Metro.map.remove = function(item) {

    this.ymap.geoObjects.remove(item);

    return this;

};

/**
 * Инициализация линий метрополитена
 * @return {*}
 */
Metro.lines.init = function() {

    var lineData,
        lineStations,
        currStation,
        collection,
        showLineStationsHandler = function() {
            Metro.map.add(this.collection);
        },
        hideLineStationsHandler = function() {
            Metro.map.remove(this.collection);
        };

    for (var i = 0, l = Metro.data.length; i < l; i++ ) {

        Metro.lines[i] = {
            show: showLineStationsHandler,
            hide: hideLineStationsHandler,
            collection: null
        };

        lineData = Metro.data[i];
        lineStations = lineData.stations;

        collection = new ymaps.GeoObjectCollection();

        for (var j = 0, sl = lineStations.length; j < sl; j++) {

            currStation = lineStations[j];

            collection.add(new ymaps.Circle(
                [
                    // Координаты центра круга
                    [currStation.lat, currStation.long],
                    // Радиус круга в метрах
                    400
                ],
                {
                    hintContent: currStation.station
                },
                {
                    fillColor: lineData.color,
                    fillOpacity: 0.7,

                    strokeColor: '#990066',
                    strokeOpacity: 0.8,
                    strokeWidth: 1
                }
            ));

        }

        Metro.lines[i].collection = collection;

    }

    return this;

};

/**
 * Показывает на карте точками все станции метрополитена
 * @return {*}
 */
Metro.lines.show = function() {

    for (var i = 0, l = Metro.data.length; i < l; i++ ) {
        Metro.lines[i].show();
    }

    return this;

};

/**
 * Убирает с карты точки станций метрополитена
 * @return {*}
 */
Metro.lines.hide = function() {

    for (var i = 0, l = Metro.data.length; i < l; i++ ) {
        Metro.lines[i].hide();
    }

    return this;

};

/**
 * Инициализация структурной схемы метро
 *
 * Формирует внутренний объект this.collection с коллекцией
 * цветных линий (YMaps Polyline), соединяющих станции метро
 *
 * @return {*}
 */
Metro.scheme.init = function() {

    var lineData,
        lineStations,
        currStation,
        nextStation;

    this.collection = new ymaps.GeoObjectCollection();
    this.visibility = false;

    for (var i = 0, l = Metro.data.length; i < l; i++ ) {

        lineData = Metro.data[i];
        lineStations = lineData.stations;

        for (var j = 0, sl = lineStations.length; j < sl; j++) {

            currStation = lineStations[j];
            nextStation = lineStations[j + 1];

            // Ответвление Выставочной и Международной от Киевской
            currStation.station == 'Международная' && (currStation = lineStations[j - 2]);

            // Замыкаем кольцевую
            currStation.station == 'Краснопресненская' && (nextStation = lineStations[0]);

            nextStation && this.collection.add(new ymaps.Polyline(
                [
                    [currStation.lat, currStation.long],
                    [nextStation.lat, nextStation.long]
                ],
                {},
                {
                    strokeWidth: 2,
                    strokeOpacity: 0.8,
                    strokeColor: lineData.color
                }
            ));
        }
    }

    return this;

};

/**
 * Показывает схему метро на карте
 * @return {*}
 */
Metro.scheme.show = function() {

    if (!this.collection)
        return this;

    this.visibility = true;

    Metro.map.add(this.collection);

    return this;

};

/**
 * Скрывает схему метро на карте
 * @return {*}
 */
Metro.scheme.hide = function () {

    if (!this.collection)
        return this;

    this.visibility = false;

    Metro.map.remove(this.collection);

    return this;

};
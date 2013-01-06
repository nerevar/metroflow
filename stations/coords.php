<?php

/**
 * Кодирует php объект в json и возвращает utf строку
 * http://forum.vingrad.ru/index.php?showtopic=218967&view=findpost&p=1983700
 * @param $a
 * @return string
 */
function array2json($a = false)
{
    if (is_null($a)) return 'null';
    if ($a === false) return 'false';
    if ($a === true) return 'true';
    if (is_scalar($a))
    {
        if (is_float($a))
        {
            $a = str_replace(",", ".", strval($a));
        }
        static $jsonReplaces = array(array("\\", "/", "\n", "\t", "\r", "\b", "\f", '"'),
            array('\\\\', '\\/', '\\n', '\\t', '\\r', '\\b', '\\f', '\"'));
        return '"' . str_replace($jsonReplaces[0], $jsonReplaces[1], $a) . '"';
    }
    $isList = true;
    for ($i = 0, reset($a); $i < count($a); $i++, next($a))
    {
        if (key($a) !== $i)
        {
            $isList = false;
            break;
        }
    }
    $result = array();
    if ($isList)
    {
        foreach ($a as $v) $result[] = array2json($v);
        return '[' . join(',', $result) . ']';
    }
    else
    {
        foreach ($a as $k => $v) $result[] = array2json($k).':'.array2json($v);
        return '{' . join(',', $result) . '}';
    }
}

$url = 'http://geocode-maps.yandex.ru/1.x/?kind=metro&results=1&format=json&geocode=';

$files = glob('*.txt');

$data = array();

foreach ($files as $line) {

    $line_name = preg_replace('#[^А-Яа-я-]#iu', '', $line);

    $stations = file($line);

    $line_stations = array();

    foreach ($stations as $station) {

        $station = trim($station);

        $request = 'Россия, Москва, ' . $line_name . ' линия, метро ' . $station;

        // Получает координаты метро используя Yandex Геокодер
        // http://api.yandex.ru/maps/doc/geocoder/desc/concepts/About.xml
        $json = json_decode(file_get_contents($url . urlencode($request)), true);

        $pos = $json['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']['Point']['pos'];

        list($long, $lat) = explode(' ', $pos);

        $line_stations[] = array (
            'station' => $station,
            'long' => $long,
            'lat' => $lat
        );

    }

    $data[] = array (
        'line' => $line_name,
        'stations' => $line_stations
    );

}

file_put_contents('stations.json', array2json($data));

print 'Done';
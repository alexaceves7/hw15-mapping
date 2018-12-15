var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.streets-basic",
accessToken: API_KEY
}).addTo(myMap);



function markerSize(mag) {
  console.log(mag*10000)
  return mag*10000;
}

function colorsMarkers(mag){
  if (mag <= 1){
    circle_color = "#7FFF00";
  }
  else if (mag > 1 && mag<= 2) {
    circle_color = "#ffff99";
  }
  else if (mag >2 && mag<= 3) {
    circle_color = "#ffcc66";
  }
  else if (mag >3 && mag <=4) {
    circle_color = "#ffaa00";
  }
  else if (mag >4 && mag <=5) {
    circle_color = "#ff751a";
  }
  else {
    circle_color = "#cc0000";
  }
  return circle_color;
}

function getColor(d) {
  return d > 5  ? '#cc0000' :
         d > 4  ? '#ff751a' :
         d > 3   ? '#ffaa00' :
         d > 2   ? '#ffcc66' :
         d > 1   ? '#ffff99' :
                    '#7FFF00';
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitude_values = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitude_values.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magnitude_values[i] + 1) + '"></i> ' +
            magnitude_values[i] + (magnitude_values[i + 1] ? '&ndash;' + magnitude_values[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

function markers(response) {
    //console.log(earthquakes)
    var features = response.features;
    //console.log(features)
    for (var i=0; i<features.length; i++){
      var location = features[i].geometry.coordinates;
      //console.log("-------------------------");
      console.log(location[1]);
      //console.log(features[i].properties.mag),
      L.circle([location[1], location[0]], {
            fillOpacity:1,
            color: 	"#000000",
            weight: 0.5, 
            fillColor: colorsMarkers(features[i].properties.mag),
            radius: markerSize(features[i].properties.mag)
        }).bindPopup("<h1>" + features[i].properties.place + "</h1><hr><h3>Magnitude: "+ features[i].properties.mag +"</h3>").addTo(myMap);
    }
};

        
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(url, markers)


$(document).ready(function() {


  var map = L.map('map').setView([42.911932, -75.772705], 7);
  L.tileLayer('http://{s}.tile.cloudmade.com/4B98C06203104602893D75D3752216A1/998/256/{z}/{x}/{y}.png', {
  //  maxZoom: 20,
  minZoom: 6.5,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
  }).addTo(map);

    //make the flyout follow the mouse
    $("#map").mousemove(function(e) {
      jQuery('#flyout').css({
        'left': e.pageX - 115,
        'top': e.pageY - jQuery(document).scrollTop() - 120
      });
    });

    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

    d3.json("ny5m.json", function(data) {
      var transform = d3.geo.transform({point: projectPoint}),
      path = d3.geo.path().projection(transform);


      var feature = g.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("class",function(d){
        console.log(d);
        if (d.properties.GEO_ID == "0400000US36") { //there is a polygon for the whole state, this classes it so we can style it differently
          return "state";
        }
      })
      .on('mouseover', function(d) {
          updateFlyout(d.properties);
      })
      .on('mouseout', function(d) {
          flyoutTimer = setTimeout(function() {
            $("#flyout").fadeOut(50);
          }, 50);
      })
      .on('click', function(d) {
           //use d.properties.NAME to build out the custom URL here
           window.location.href ='http://www.socrata.com';
      });


      map.on("viewreset", reset);
      reset();


      function reset() {
        console.log(map);

       bounds = path.bounds(data);

       var topLeft = bounds[0],
       bottomRight = bounds[1];

       svg .attr("width", bottomRight[0] - topLeft[0])
       .attr("height", bottomRight[1] - topLeft[1])
       .style("left", topLeft[0] + "px")
       .style("top", topLeft[1] + "px");

       g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

       feature.attr("d", path);

       console.log(map.center);
     }
     function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }
    function updateFlyout(d) {
      console.log(d);
      $('#flyoutCountyName').html(d.NAME)
      clearTimeout(flyoutTimer);
      $('#flyout').fadeIn(50);
    }

  });

});
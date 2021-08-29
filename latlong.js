var request = new XMLHttpRequest();

var lat = 52.855864, long = -94.324090;

var callFailed = false;
var canShowMap = false;
var nationProperties;
var names = [], descriptions = [];

let display_text = "";
let links_text = "";
var iframeLink = `https://native-land.ca/api/embed/embed.html?maps=languages&position=${lat}, ${long}`;
var apiLink = `https://native-land.ca/api/index.php?maps=languages&position=${lat},${long}`

function setLatLong() {
  lat = document.getElementById("lat").value;
  long = document.getElementById("long").value;

  executeMain(lat, long);
}

function executeMain(lat, long) {

  display_text = "";
  links_text = "";

  names = [];
  descriptions = [];

  apiLink = `https://native-land.ca/api/index.php?maps=languages&position=${lat},${long}`;

  request.open("GET", apiLink);
  request.send();

  iframeLink = `https://native-land.ca/api/embed/embed.html?maps=languages&position=${lat},${long}`;

  request.onload = () => {
    if (request.status === 200) {
      var jsonFile = JSON.parse(request.response);

      for (var i = 0; i < jsonFile.length; i++) {
        nationProperties = jsonFile[i].properties;

        names.push(nationProperties["Name"]);
        descriptions.push(nationProperties["description"]);
      }

    } else callFailed = true;

    display_text = "The ";

    for (var i = 0; i < names.length; i++) {

      display_text += ` <em>${names[i]}</em>`;

      if ((i + 2) === jsonFile.length) {
        display_text += ", and "
        display_text += ` <em>${names[i + 1]}</em>`;
        break;

      } else {
        if (jsonFile.length !== 1) display_text += ", ";
      }
    }

    if (jsonFile.length === 0) {
      canShowMap = false;
    } else {
      display_text += " have lived in your area - Check out the link below for more info about the group, their language, and their culture! Click the regions on the map above to see which native group used to live there."
      canShowMap = true;

    }

    for (var i = 0; i < descriptions.length; i++) {
      links_text += `<li><a target= "_blank" href=${descriptions[i]}>${names[i]}</a></li>`
    }


    //If api call fails:

    if (callFailed) {
      display_text = "Uh oh! You've got to allow <em>Where am I</em> to know your location!";
      links_text = "";
      iframeLink = "";

    }

    document.getElementById("locationDetails").innerHTML = display_text;
    document.getElementById("links").innerHTML = links_text;

    if (!canShowMap) {
      document.getElementById("errMessageDiv").setAttribute("style", "visibility: visible;");
      document.getElementById("LatLongContent").setAttribute("style", "visibility: hidden;");

    } else {
      document.getElementById("iframeMap").setAttribute("src", iframeLink);
      document.getElementById("errMessageDiv").setAttribute("style", "visibility: hidden;");
      document.getElementById("LatLongContent").setAttribute("style", "visibility: visible;");
    }

  }
}



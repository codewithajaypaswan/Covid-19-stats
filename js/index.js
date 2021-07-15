// @ts-nocheck
window.onload = () => {
  const input = document.querySelector("#country-input");
  input.addEventListener("input", searchCountry);
};

var corona;
var map;
var markers = [];
var infoWindow;
let short = [];

async function initMap() {
  let res = await axios.get("https://corona.lmao.ninja/v2/countries");
  corona = res.data;
  console.log(corona);
  displayInfectedCountries(corona);

  let india = { lat: 20, lng: 77 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: india,
    zoom: 5,
    styles: dayTheme,
    disableDefaultUI: true,
  });

  infoWindow = new google.maps.InfoWindow();
  showMarkers(corona);
}

function displayInfectedCountries(countries) {
  let storesHtml = "";
  countries.map((i, index) => {
    storesHtml += `
            <div id=${
              i["countryInfo"]["_id"]
            } class="store-container" onclick="clickStore('${
      i["countryInfo"]["iso2"]
    }')">
                <div class="store-info-container">
                    <div class="store-address">
                        <span>${i["country"]}</span>
                        <span></span>
                    </div>
                    <div class="store-phonenumber">
                        ${new Date(i["updated"]).toLocaleDateString("sg")}
                    </div>
                </div>
                <div class="store-number-container">
                    <div class="store-number">
                    <img src="${
                      i["countryInfo"]["flag"]
                    }" width="50px" height="30px"/>
                    </div>
                </div>
            </div>
        `;
  });
  document.querySelector(".stores-list").innerHTML = storesHtml;
}

function showMarkers(search) {
  search.map((i, index) => {
    var latlng = new google.maps.LatLng(
      i["countryInfo"]["lat"],
      i["countryInfo"]["long"]
    );
    let lastUpdated = new Date(i["updated"]).toLocaleDateString("sg");
    let country = i["country"];
    let cases = i["cases"];
    let deaths = i["deaths"];
    let recovered = i["recovered"];
    let id = i["countryInfo"]["_id"];
    let iso2 = i["countryInfo"]["iso2"];
    createMarker(
      latlng,
      lastUpdated,
      country,
      cases,
      deaths,
      recovered,
      id,
      iso2
    );
  });
}

function createMarker(
  latlng,
  lastUpdated,
  country,
  cases,
  deaths,
  recovered,
  id,
  iso2
) {
  let html = `
            <div class='marker-content'>
                <div class='marker-name'>
                    ${country}
                </div>
                <div class='marker-opentime'>
                Updated to:
                ${lastUpdated}
                </div>
                <div class='marker-corona'>
                    <div class='circle'>
                        <i class="fas fa-viruses"></i>
                    </div>
                    Total Infected: 
                    ${cases} 
                </div>
                <div class='marker-address'>
                    <div class='circle'>
                        <i class="fas fa-skull-crossbones"></i>
                    </div>
                    Total Deaths: 
                    ${deaths}
                </div>
                <div class='marker-phone'>
                    <div class='circle'>
                        <i class="fas fa-thumbs-up"></i>
                    </div>
                    Total Recovered:
                    ${recovered} 
                </div>
            </div>
    `;

  short[iso2] = html;

  var marker = new google.maps.Marker({
    map: map,
    center: latlng,
    position: latlng,
    title: country,
    label: iso2 + "",
    icon: "images/virus2.png",
  });
  google.maps.event.addListener(marker, "mouseover", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });

  markers.push(marker);
}

function clickStore(index) {
  var key = index.toString();
  let selectedMarker = markers.find(
    (i) => i.label.toLowerCase() === index.toLowerCase()
  );
  infoWindow.setContent(short[key]);
  infoWindow.open(map, selectedMarker);
}

function searchCountry() {
  let input = document.getElementById("country-input").value;
  console.log(input);
  let list = [];
  let result = corona.filter((i, index) => {
    if (i["country"].toLowerCase().includes(input.toLowerCase())) {
      list.push(index);
      return true;
      console.log(input);
    }
  });
  result.map((i, index) => {
    i["index"] = list[index];
  });
  displayInfectedCountries(result);
}

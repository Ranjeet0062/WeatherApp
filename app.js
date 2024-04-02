const API_KEY = "168771779c71f3d64106d8a88376808a";
let mytab = document.querySelector(".mytab");
let searchtab = document.querySelector(".searchtab");
let access = document.querySelector(".access");
let yourlocation = document.querySelector(".yourlocation")
let searchlocation = document.querySelector(".searchlocation");
let searchlocation2 = document.querySelector(".searchlocation2");
let form = document.querySelector(".form");
let inputcityname = document.querySelector(".inputcityname");
let accessbtn = document.querySelector(".accessbtn");
let notfound=document.querySelector(".notfound");
let currenttab = mytab;

function switchtab(clickedtab) {
    console.log(clickedtab)
    if (currenttab != clickedtab) {
        currenttab.classList.remove("tabbg");
        currenttab = clickedtab;
        currenttab.classList.add("tabbg");
        if (!searchlocation.classList.contains("active")) {
            searchlocation.classList.add("active");
            yourlocation.classList.remove("active");
            access.classList.remove("active")
        }
        else {
            notfound.classList.remove("active")

            searchlocation.classList.remove("active");
            // yourlocation.classList.add("active");

            getsessionstorge()
            searchlocation2.classList.remove("active");
        }
    }
}


form.addEventListener("submit", (e) => {
    e.preventDefault();

    fetchsearchinfocity(inputcityname.value);
})
async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}



function showPosition(position) {
    // x.innerHTML = "Latitude: " + position.coords.latitude +
    // "<br>Longitude: " + position.coords.longitude;
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };

    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
    fetchyourinfo(userCoordinates)
}
function getsessionstorge() {
    const localcoordinates = sessionStorage.getItem("userCoordinates");

    const coordinates = JSON.parse(localcoordinates);
    if (coordinates) {
        yourlocation.classList.add("active");
        access.classList.remove("active");
        fetchyourinfo(coordinates)
    } else {
        yourlocation.classList.remove("active");
        access.classList.add("active");
    }
}

async function fetchyourinfo(position) {
    let lat = position.lat;
    let lon = position.lon;


    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        if (!data.sys) {
            throw data;
        }

        renderwetheryourinfo(data);
    } catch (e) {
        console.log(e);
    }
}
async function fetchsearchinfocity(city) {
    notfound.classList.remove("active")

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        renderwethersearchinfo(data);

        inputcityname.value = "";
    } catch (e) {
        notfound.classList.add("active")
    }
    finally{
        inputcityname.value = "";

    }
}
function renderwetheryourinfo(wetherinfo) {
    let yourcityname = document.querySelector(".yourcityname");
    let yourcountryflag = document.querySelector(".yourcountryflag");
    let yourdescription = document.querySelector(".yourdescription");
    let yourwetherinfoimg = document.querySelector(".yourwetherinfoimg");
    let yourtemp = document.querySelector(".yourtemp");
    let yourwindspeed = document.querySelector(".yourwindspeed");
    let yourhumidity = document.querySelector(".yourhumidity");
    let yourcloud = document.querySelector(".yourcloud");
    searchlocation2.classList.remove("active");
    access.classList.remove("active");
    yourlocation.classList.add("active");
    yourcityname.innerText = `${wetherinfo?.name}`;
    yourcountryflag.src = `https://flagcdn.com/144x108/${wetherinfo?.sys?.country.toLowerCase()}.png`;
    yourdescription.innerText = wetherinfo?.weather?.[0]?.description;
    yourwetherinfoimg.src = `http://openweathermap.org/img/w/${wetherinfo?.weather?.[0]?.icon}.png`;
    yourtemp.innerText = `${wetherinfo?.main?.temp.toFixed(2)} °C`;
    yourwindspeed.innerText = `${wetherinfo?.wind?.speed.toFixed(2)} m/s`;
    yourhumidity.innerText = `${wetherinfo?.main?.humidity.toFixed(2)} %`;
    yourcloud.innerText = `${wetherinfo?.clouds?.all.toFixed(2)} %`;
}
function renderwethersearchinfo(wetherinfo) {
    let cityname = document.querySelector(".cityname");
    let countryflag = document.querySelector(".countryflag");
    let description = document.querySelector(".description");
    let wetherinfoimg = document.querySelector(".wetherinfoimg");
    let temp = document.querySelector(".temp");
    let windspeed = document.querySelector(".windspeed");
    let humidity = document.querySelector(".humidity");
    let cloud = document.querySelector(".cloud");
    yourlocation.classList.remove("active");
    searchlocation2.classList.add("active");
    cityname.innerText = `${wetherinfo?.name}`;
    countryflag.src = `https://flagcdn.com/144x108/${wetherinfo?.sys?.country.toLowerCase()}.png`;
    description.innerText = wetherinfo?.weather?.[0]?.description;
    wetherinfoimg.src = `http://openweathermap.org/img/w/${wetherinfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${wetherinfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${wetherinfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${wetherinfo?.main?.humidity.toFixed(2)} %`;
    cloud.innerText = `${wetherinfo?.clouds?.all.toFixed(2)} %`;
}

accessbtn.addEventListener("click", () => {
    getLocation();
})
mytab.addEventListener("click", () => {
    switchtab(mytab);
});
searchtab.addEventListener("click", () => {
    switchtab(searchtab);
});
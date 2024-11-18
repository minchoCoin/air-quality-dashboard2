let location1 = 'Pusan';
const API_KEY = config.apikey;
var location_options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 5000
}
//https://www.breeze-technologies.de/blog/air-pollution-how-to-convert-between-mgm3-%c2%b5gm3-ppm-ppb/#:~:text=The%20formula%20for%20conversion%20between%20%C2%B5g%2Fm3%20%28micrograms%20per,%3D%20molecular%20weight%20x%20concentration%20%28ppb%29%20%C3%B7%2024.45

const co_ppm = 1.15 * 1000;
const no2_ppb = 1.88;
const o3_ppb = 1.96;
const so2_ppb = 2.62;
function visualizefutureinfo(response) {

    let hour = [];
    let temp = [];
    let humidity = [];
    for (var i = 0; i < 3; ++i) {
        let forecastinfo = response.forecast.forecastday[i].hour
        forecastinfo.forEach((item, index) => {
            hour.push(item.time);
            temp.push(item.temp_c);
            humidity.push(item.humidity);
        });
    }

    const data1 = {
        labels: hour,
        datasets: [
            {
                label: 'temperature',
                data: temp,
                borderColor: 'red',

            },

        ]
    };
    const templineconfig = {
        type: 'line',
        data: data1,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'temperature forecast overtime'
                }
            }
        },
    };


    const data2 = {
        labels: hour,
        datasets: [
            {
                label: 'humidity',
                data: humidity,
                borderColor: 'blue',

            },

        ]
    };
    const humiditylineconfig = {
        type: 'line',
        data: data2,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'humidity forecast overtime'
                }
            }
        },
    };

    new Chart(document.getElementById('tempchart'), templineconfig);
    new Chart(document.getElementById('humiditychart'), humiditylineconfig);
}
function visualizeairquality(co, no2, o3, so2, pm25, pm10,gb_defra_index) {
    let mydata = [pm10, pm25, co, no2, o3, so2]
    let label = ['pm10', 'pm2.5', 'co', 'no2', 'o3', 'so2']

    let color;

    if(gb_defra_index<=3){
        color = 'green';
    }
    else if(gb_defra_index<=6){
        color='orange'
    }
    else{
        color='red'
    }

    const data = {
        labels: label,
        datasets: [
            {
                label: 'airquality',
                data: mydata,
                borderColor: color,
                backgroundColor:color
            },

        ]
    };
    const barconfig = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'levels of air quality'
                }
            }
        },
    };

    const doughnutdata = {
        labels: label,
        datasets: [
            {
                label: 'airquality',
                data: mydata,
                

            },

        ]
    };
    const doughnutconfig = {
        type: 'doughnut',
        data: doughnutdata,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Distrubute of air pollution'
            }
          }
        },
      };

    new Chart(document.getElementById('airqualitybarchart'), barconfig);
    new Chart(document.getElementById('airqualitydoughnutchart'), doughnutconfig);

}
function getfutureinfo() {
    $.ajax({
        url: `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location1}&days=3&aqi=no&alerts=no`,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            visualizefutureinfo(response);
        },
        error: function (xhr, status, error) {
            console.error('response code: ', status);
            console.error('Error:', error);
        }
    });
}

function location_success(pos) {
    location1 = `${pos.coords.latitude},${pos.coords.longitude}`
    console.log(location1)
    getcurrentinfo();
    getfutureinfo()
}

function location_err(err) {
    //alert(`Error occured while get your location(${err.code}: ${err.message}). location is set to Pusan`);
    location1 = 'auto:ip';
    getcurrentinfo();
    getfutureinfo()
}


function updatecurrentairquality(gb_defra_index) {
    $("currentairqualityicon").removeClass("fa-face-smile fa-face-meh fa-face-frown");
    if (gb_defra_index <= 3) {
        $("#currentairqualityicon").addClass('fa-face-smile');
        $("#currentairquality").text('Good Air!');
        $("#currentairqualityicon").css({ 'color': 'green' });
        $("#currentairquality").css({ 'color': 'green' });

    }
    else if (gb_defra_index <= 6) {
        $("#currentairqualityicon").addClass('fa-face-meh');
        $("#currentairquality").text('Moderate');
        $("#currentairqualityicon").css({ 'color': 'orange' });
        $("#currentairquality").css({ 'color': 'orange' });
    }
    else if(gb_defra_index<=9) {
        $("#currentairqualityicon").addClass('fa-face-frown');
        $("#currentairquality").text('Unhealthy');
        $("#currentairqualityicon").css({ 'color': 'red' });
        $("#currentairquality").css({ 'color': 'red' });
    }
    else{
        $("#currentairqualityicon").addClass('fa-face-dizzy');
        $("#currentairquality").text('Dangerous');
        $("#currentairqualityicon").css({ 'color': 'purple' });
        $("#currentairquality").css({ 'color': 'purple' });
    }
}
function updatecurrentpm(pm10,pm25){
    //https://www.airgwangsan.kr/page/?site=airmap&mn=854
    //$("#currentpm10").text(pm10);
    //$("#currentpm2_5").text(pm25);
    /*
    pm10
    good: 0-30, moderate: 31-80, bad: 81-150, very bad: 151-

    pm25
    good: 0-15, moderate: 16-50, bad: 51-100, very bad: 100-
    */
    if(pm10<=30){
        $("#currentpm10").css({'color':'blue'});
    }
    else if(pm10<=80){
        $("#currentpm10").css({'color':'green'});
    }
    else if(pm10<=150){
        $("#currentpm10").css({'color':'orange'});
    }
    else{
        $("#currentpm10").css({'color':'red'});
    }

    if(pm25<=15){
        $("#currentpm2_5").css({'color':'blue'});
    }
    else if(pm25<=50){
        $("#currentpm2_5").css({'color':'green'});
    }
    else if(pm25<=100){
        $("#currentpm2_5").css({'color':'orange'});
    }
    else{
        $("#currentpm2_5").css({'color':'red'});
    }
}
function updatecurrentdata(response) {
    let cityname = response.location.name;
    let region = response.location.region;
    let country = response.location.country;
    let last_updated = response.current.last_updated;
    let temp = response.current.temp_c;
    let is_day = response.current.is_day;
    let condition_text = response.current.condition.text;
    let condition_icon = response.current.condition.icon;
    let humidity = response.current.humidity;
    let wind_kph = response.current.wind_kph;
    let wind_dir = response.current.wind_dir;
    let feelslike_c = response.current.feelslike_c;


    let air_quality = response.current.air_quality;
    let co = Math.round(Number(air_quality.co) / co_ppm * 1000) / 1000;
    let no2 = Math.round(Number(air_quality.no2) / no2_ppb * 1000) / 1000;
    let o3 = Math.round(Number(air_quality.o3) / o3_ppb * 1000) / 1000;
    let so2 = Math.round(Number(air_quality.so2) / so2_ppb * 1000) / 1000;
    let pm25 = air_quality.pm2_5;
    let pm10 = air_quality.pm10;
    let gb_defra_index = Number(air_quality['gb-defra-index']);

    $("#currentpos").text(`${cityname}, ${country} ${last_updated}`);
    $("#currentweatherimage").attr("src", `https:${condition_icon}`);
    $("#currenttemp").html(`${temp}&deg;C`);

    $("#currentfeelslike").html(`${feelslike_c}&deg;C`);
    $("#currenthumidity").text(`${humidity}%`);
    $("#currentwind").text(`${wind_dir}. ${wind_kph}kph`);
    $("#currentpm10").text(pm10);
    $("#currentpm2_5").text(pm25);
    $("#currentco").text(co);
    $("#currentno2").text(no2);
    $("#currento3").text(o3);
    $("#currentso2").text(so2);

    updatecurrentairquality(gb_defra_index);
    updatecurrentpm(pm10,pm25);
    visualizeairquality(co, no2, o3, so2, pm25, pm10,gb_defra_index);
}

function getcurrentinfo() {
    $.ajax({
        url: `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location1}&aqi=yes`,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            updatecurrentdata(response);
        },
        error: function (xhr, status, error) {
            console.error('response code: ', status);
            console.error('Error:', error);
        }
    });
}
function getcurrentlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(location_success, location_err, location_options);
    }
    else {
        location1 = 'auto:ip';
        getcurrentinfo();
        getfutureinfo()
    }
}
getcurrentlocation();
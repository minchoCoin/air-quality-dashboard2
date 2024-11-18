let location1 = 'Pusan';

//https://www.breeze-technologies.de/blog/air-pollution-how-to-convert-between-mgm3-%c2%b5gm3-ppm-ppb/#:~:text=The%20formula%20for%20conversion%20between%20%C2%B5g%2Fm3%20%28micrograms%20per,%3D%20molecular%20weight%20x%20concentration%20%28ppb%29%20%C3%B7%2024.45

const co_ppm = 1.15 * 1000;
const no2_ppb = 1.88;
const o3_ppb = 1.96;
const so2_ppb = 2.62;
function visualizefutureinfo(hour, temp, humidity) {



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
function visualizeairquality(co2, nox, nh3, so2, voc, pm10, pm25, gb_defra_index) {
    let mydata = [pm10, pm25, co2, nox, nh3, so2, voc]
    let label = ['pm10', 'pm2.5', 'CO2', 'NOx', 'NH3', 'SO2', 'VOC']

    let color;

    if (gb_defra_index <= 3) {
        color = 'green';
    }
    else if (gb_defra_index <= 6) {
        color = 'orange'
    }
    else {
        color = 'red'
    }

    const data = {
        labels: label,
        datasets: [
            {
                label: 'airquality',
                data: mydata,
                borderColor: color,
                backgroundColor: color
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
function updatecurrentdata(cityname, country, last_updated, temp, humidity, wind_kph, wind_dir, feelslike_c, air_quality) {
    /*
    let air_quality = response.current.air_quality;
    let co = Math.round(Number(air_quality.co) / co_ppm * 1000) / 1000;
    let no2 = Math.round(Number(air_quality.no2) / no2_ppb * 1000) / 1000;
    let o3 = Math.round(Number(air_quality.o3) / o3_ppb * 1000) / 1000;
    let so2 = Math.round(Number(air_quality.so2) / so2_ppb * 1000) / 1000;
    let pm25 = air_quality.pm2_5;
    let pm10 = air_quality.pm10;
    let gb_defra_index = Number(air_quality['gb-defra-index']);
    */
    let co2 = air_quality.co2;
    let nox = air_quality.nox;
    let nh3 = air_quality.nh3;
    let so2 = air_quality.so2;
    let voc = air_quality.voc;
    let pm10 = air_quality.pm10;
    let pm25 = air_quality.pm2_5;
    let gb_defra_index = air_quality.gb_defra_index;
    $("#currentpos").text(`${cityname}, ${country} ${last_updated}`);
    //$("#currentweatherimage").attr("src", `https:${condition_icon}`);
    $("#currenttemp").html(`${temp}&deg;C`);

    $("#currentfeelslike").html(`${feelslike_c}&deg;C`);
    $("#currenthumidity").text(`${humidity}%`);
    $("#currentwind").text(`${wind_dir}. ${wind_kph}kph`);
    $("#currentpm10").text(pm10);
    $("#currentpm2_5").text(pm25);
    $("#currentco2").text(co2);
    $("#currentnox").text(nox);
    $("#currentnh3").text(nh3);
    $("#currentvoc").text(voc);
    $("#currentso2").text(so2);
    updatecurrentpm(pm10,pm25);
    updatecurrentairquality(gb_defra_index);
    visualizeairquality(co2, nox, nh3, so2, voc, pm10, pm25, gb_defra_index);
}
$(document).ready(function () {
    $('#uploadbtn').on('click', function () {
        const file = $('#csvfile')[0].files[0];
        if (file) {
            Papa.parse(file, {
                complete: function (a) {
                    //console.log(results);
                    results = a.data;
                    let current_air_quality;
                    let current_temp;
                    let current_humidity;
                    let current_hour;
                    let current_feelslike;
                    let current_wind_dir;
                    let current_wind_kph;
                    let city = results[1][1];
                    let country = results[1][2];
                    let hours=[];
                    let temperatures=[];
                    let humidities=[];

                    let featurelen = results[0].length;

                    for(var i=1;i<results.length;++i){
                        if(results[i].length!=featurelen){
                            break;
                        }
                        temperatures.push(results[i][4]);
                        humidities.push(results[i][5]);
                        hours.push(results[i][0]);
                        if(results[i][3] == "O"){
                            
                            current_temp = results[i][4];
                            current_humidity = results[i][5];
                            current_feelslike = results[i][6];
                            current_wind_dir = results[i][7];
                            current_wind_kph = results[i][8];
                            current_hour = results[i][0];
                            current_air_quality = {
                                co2: results[i][11],
                                nox: results[i][12],
                                nh3: results[i][13],
                                so2: results[i][14],
                                voc: results[i][15],
                                pm10: results[i][9],
                                pm2_5: results[i][10],
                                gb_defra_index: results[i][16]
                            }
                        }
                    }
                    updatecurrentdata(city, country, current_hour, current_temp, current_humidity, current_wind_kph, current_wind_dir, current_feelslike, current_air_quality);
                    visualizefutureinfo(hours,temperatures,humidities);
                }
            })
        }
        else {
            alert('please select a file!');
        }
    })
})
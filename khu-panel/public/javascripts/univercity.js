let positon = {};
let positionCity = {};
$(window).bind("load", function() {
    $('#dvLoading').fadeOut();
});

$(document).ready(function () {
    var map = L.map('map').setView([35.6892, 51.3890], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    L.marker([35.6892, 51.3890]).addTo(map)
        .bindPopup('یک مکان را انتخاب کنید')
        .openPopup();
    setTimeout(function(){
        map.invalidateSize()
        map.setView([35.703438504775754, 51.39533400710208], 13);
    }, 3000);

    ajaxGet(1);

    var marker;
    map.on('click', function (e) {
        if (marker)
            map.removeLayer(marker);
        console.log(e.latlng); // e is an event object (MouseEvent in this case)
        marker = L.marker(e.latlng).addTo(map);
        positon = e.latlng;
    });

    var mapE = L.map('mapE').setView([35.6892, 51.3890], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapE);


    L.marker([35.6892, 51.3890]).addTo(mapE)
        .bindPopup('یک مکان را انتخاب کنید')
        .openPopup();
    setTimeout(function(){
        mapE.invalidateSize()
        mapE.setView([35.703438504775754, 51.39533400710208], 13);
    }, 3000);


    var markerE;
    mapE.on('click', function (e) {
        if (markerE)
            mapE.removeLayer(marker);
        console.log(e.latlng); // e is an event object (MouseEvent in this case)
        markerE = L.marker(e.latlng).addTo(mapE);
        positon = e.latlng;
    });





});

function ajaxGet(page) {
    $.ajax({
        type: "GET",
        url: "/location/allProvince/" + page + "-50",
        success: function (result) {
            console.log(result)
            var table = $("#tableProvince");
            $('#help').attr('value', result.number);

            $.each(result.province, function (idx, elem) {

                table.append("<tr  class='odd gradeX'><td >" + elem.name + "</td><td  >" + elem.description + "</a></td>" + "<td style='display: none;'> " + elem._id + "</td><td><button class='btn btn-primary' onclick='editModal(this)'  data-toggle=\"modal\" data-target=\"#modalEdit\">ویرایش</button> </td><td><button class='btn btn-dark' onclick='editModal(this)'  data-toggle=\"modal\" data-target=\"#modalCity\">اضافه کردن شهر</button> </td><td><button onclick='addRowHandlers(this)' class='btn btn-danger' >مشاهده</button></td></tr>");

            });
        },
        error: function (err) {
            console.log(err)
            if (err.status === 400) {

            } else if (err.status === 401) {
                Swal.fire({
                    title: '',
                    text: "  لطفا ورود کنید",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'متوجه شدم'
                }).then((result) => {
                    location.href = '/'
                })
            } else if (err.status === 404) {
                location.href = '/error404.html'

            } else if (err.status === 403) {
                location.href = '/error403.html'
            } else {
                Swal.fire({
                    title: '',
                    text: " مشکلی در ارتباط با سرور به وجود آمده است ",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'متوجه شدم'
                }).then((result) => {
                    location.reload()
                })
            }

        }
    });
};

function saveProvince() {
    let form = new FormData()
    let object = {};
    object.name = $('#nameProvince').val();
    object.description = $('#descriptionProvince').val();
    let preLocation = {type: 'point', coordinates: [positon.lat, positon.lng]}
    console.log(object)
    form.append('name' , object.name)  ;
    form.append('description' , object.description)
    form.append('location' , JSON.stringify(preLocation))
    var input = $('#upload-photo')[0]
    const file = input.files[0]
    form.append('logo', file)
    $.ajax({
        type: "POST",
        url: "/location/addProvince",
        data: form,
        enctype: 'multipart/form-data',
        cache: false,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (result) {
            console.log(result)
            Swal.fire({
                title: '',
                text: "استان با موفقیت اضافه شد ",
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'متوجه شدم'
            }).then((result) => {
                if (result.value) {
                  location.reload()
                }
            })

        },
        error: function (err) {
            console.log(err)
            if (err.status === 400) {

            } else if (err.status === 401) {
                Swal.fire({
                    title: '',
                    text: "  لطفا ورود کنید",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'متوجه شدم'
                }).then((result) => {
                    location.href = '/'
                })
            } else if (err.status === 404) {
                location.href = '/error404.html'

            } else if (err.status === 403) {
                location.href = '/error403.html'
            } else {
                Swal.fire({
                    title: '',
                    text: " مشکلی در ارتباط با سرور به وجود آمده است ",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'متوجه شدم'
                }).then((result) => {
                    location.reload()
                })
            }

        }
    });

};

function editModal(user) {
    let id = $(user).closest('tr').find('td ').eq(2).text().trim();
    $('#id').val(id)
    $('#nameProvinceE').val($(user).closest('tr').find('td ').eq(0).text().trim())
    $('#descriptionProvinceE').val($(user).closest('tr').find('td ').eq(1).text().trim())
    $('#picProvince').css('background-image' , 'url( \' ' + 'https://www.api.boomiro.com/v1/getPhoto/city/logo/' + id + '\' )')

    var map = L.map('mapCity').setView([35.6892, 51.3890], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    L.marker([35.6892, 51.3890]).addTo(map)
        .bindPopup('یک مکان را انتخاب کنید')
        .openPopup();

    var marker;
    map.on('click', function (e) {
        if (marker)
            map.removeLayer(marker);
        console.log(e.latlng); // e is an event object (MouseEvent in this case)
        marker = L.marker(e.latlng).addTo(map);
        positionCity = e.latlng;
    });
};

function editProvince() {

    let object = {};
    object.id = $('#id').val()
    object.name = $('#nameProvinceE').val();
    object.description = $('#descriptionProvinceE').val();
    let preLocation = {type: 'point', coordinates: [positon.lat, positon.lng]}
    object.location = JSON.stringify(preLocation);    console.log(object)
    let formData = new FormData();
    formData.append('name' , object.name)
    formData.append('description' , object.description)
    formData.append('location' , object.location)
    formData.append('id' , object.id)
    var input = $('#upload-photo_1')[0]
    const file = input.files[0]
    formData.append('logo', file)
    $.ajax({
        type: "POST",
        url: "/location/editProvince",
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (result) {
            console.log(result)
            Swal.fire({
                title: '',
                text: "استان با موفقیت ویرایش شد ",
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'متوجه شدم'
            }).then((result) => {
                if (result.value) {
                    location.reload()
                }
            })

        },
        error: function (err) {
            console.log(err)
            if (err.status === 400) {

            } else if (err.status === 401) {
                Swal.fire({
                    title: '',
                    text: "  لطفا ورود کنید",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'متوجه شدم'
                }).then((result) => {
                    location.href = '/'
                })
            } else if (err.status === 404) {
                location.href = '/error404.html'

            } else if (err.status === 403) {
                location.href = '/error403.html'
            } else if (err.status) {
                Swal.fire({
                    title: '',
                    text: " مشکلی در ارتباط با سرور به وجود آمده است ",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'متوجه شدم'
                }).then((result) => {
                    location.reload()
                })
            }

        }
    });

};

function saveCity() {
    let object = {};
    object.name = $('#nameCity').val();
    object.description = $('#descriptionCity').val();
    let preLocation = {type: 'point', coordinates: [positionCity.lat, positionCity.lng]}
    object.location = JSON.stringify(preLocation);
    object.id = $('#id').val();


    console.log(object)
    $.ajax({
        type: "POST",
        url: "/location/addCity",
        data: object,
        success: function (result) {
            console.log(result)
            Swal.fire({
                title: '',
                text: "شهر با موفقیت اضافه شد ",
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'متوجه شدم'
            }).then((result) => {
                if (result.value) {
                    location.reload()
                }
            })

        },
        error: function (err) {
            console.log(err)
            if (err.status === 400) {

            } else if (err.status === 401) {
                Swal.fire({
                    title: '',
                    text: "  لطفا ورود کنید",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'متوجه شدم'
                }).then((result) => {
                    location.href = '/'
                })
            } else if (err.status === 404) {
                location.href = '/error404.html'

            } else if (err.status === 403) {
                location.href = '/error403.html'
            } else {
                Swal.fire({
                    title: '',
                    text: " مشکلی در ارتباط با سرور به وجود آمده است ",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'متوجه شدم'
                }).then((result) => {
                    location.reload()
                })
            }

        }
    });

}

function addRowHandlers() {
    var table = document.getElementById("tableProvince");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler = function (row) {
            return function () {
                var cell = row.getElementsByTagName("td")[2];
                var id = cell.innerHTML.trim();

                location.href = `/city.html?id=${id}`
            };
        };
        currentRow.onclick = createClickHandler(currentRow);
    }
}

function logout() {
    Swal.fire({
        title: '',
        text: " آیا مطمن هستید که می خواهید خارج شوید ؟",
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: 'لغو کردن',
        confirmButtonText: 'متوجه ام'
    }).then(function(result) {
        if (result.value) {

            $.ajax({
                type: "GET",
                url: "/admin/logout" ,
                success: function (result) {
                    location.href = '/'

                },
                error: function (err) {
                    console.log(err)
                    if (err.status === 400) {

                    }
                    else if (err.status === 401) {
                        Swal.fire({
                            title: '',
                            text: "  لطفا ورود کنید",
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'متوجه شدم'
                        }).then((result) => {
                            location.href = '/'
                        })
                    }
                    else if (err.status === 404) {
                        location.href = '/error404.html'

                    }
                    else if (err.status === 403) {
                        location.href = '/error403.html'
                    }
                    else {
                        Swal.fire({
                            title: '',
                            text: " مشکلی در ارتباط با سرور به وجود آمده است ",
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'متوجه شدم'
                        }).then((result) => {
                            location.reload()
                        })
                    }

                }
            })


        }
    })



}

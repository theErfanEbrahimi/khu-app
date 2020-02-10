let data;
$(window).bind("load", function() {
    $('#dvLoading').fadeOut();
});

$(document).ready(function () {
    ajaxGet(1);
    var map = L.map('map').setView([35.6892, 51.3890], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    L.marker([35.6892, 51.3890]).addTo(map)
        .bindPopup('یک مکان را انتخاب کنید')
        .openPopup();
    timeFunction()




});

function ajaxGet(page) {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let id = url.searchParams.get("id").trim();
    let object = {}
    object.id = id;
    $.ajax({
        type: "POST",
        url: "/location/allVillage/" + page + "-50",
        data: object,
        success: function (result) {
            console.log(result)
            var table = $("#tableVillage");
            $('#help').attr('value', result.number);
            data = result.number

            $.each(result.village, function (idx, elem) {

                table.append("<tr   class='odd gradeX'><td>" + elem.name + "</td><td>" + elem.description + "</a></td>" + "<td style='display: none;'> " + elem._id + "</td><td><button class='btn btn-primary' onclick='editModal(this)'  data-toggle=\"modal\" data-target=\"#modalEdit\">ویرایش</button> </td></tr>");

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


function editVillage() {

    let object = {};
    object.id = $('#id').val()
    object.name = $('#nameVillageE').val();
    object.description = $('#descriptionVillageE').val();
    console.log(object)
    object.location = {lat: 30.000, long: 50.000}
    console.log(object)
    $.ajax({
        type: "POST",
        url: "/location/editVillage",
        data: object,
        success: function (result) {
            console.log(result)
            Swal.fire({
                title: '',
                text: "روستا با موفقیت ویرایش شد ",
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
    $('#nameVillageE').val( $(user).closest('tr').find('td ').eq(0).text().trim())
    $('#descriptionVillageE').val( $(user).closest('tr').find('td ').eq(1).text().trim())

};

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

function page(user) {
    let number = $(user).html().trim();
    var table = $("#tableVillage");
    table.find("tr:gt(0)").remove();
    $('.kt-pagination__link--active').removeClass('kt-pagination__link--active')

    $(`#${number}`).addClass('kt-pagination__link--active')
    for (let i = 1; i < number; i++) {
        $(`#${i}`).removeClass('kt-pagination__link--active')

    }
    ajaxGet(number)


};

function pagination() {
    let number = parseInt(data) / 50;
    console.log(number)
    for (let i = 1; i <= Math.ceil(number); i++) {
        let page = $('#page');
        page.append('<li id=' + '\"' + i + '\"' + ' >' + '<a onclick="page(this)">' + i + '</a></li>')
        $(`#${1}`).addClass('kt-pagination__link--active')

    }


};

function timeFunction() {
    setTimeout(function () {
        pagination()
    }, 8000);
}






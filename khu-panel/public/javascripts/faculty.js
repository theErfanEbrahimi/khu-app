let positon = {};
$(window).bind("load", function() {
    $('#dvLoading').fadeOut();
});

$(document).ready(function () {
    ajaxGet(1);

});

function ajaxGet(page) {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let id = url.searchParams.get("id").trim();
    $.ajax({
        type: "GET",
        url: "/college/faculty/all/" + id  + "/" + page + "-50/" ,
        success: function (result) {
            console.log(result)
            var table = $("#tableVillage");
            $('#help').attr('value', result.number);

            $.each(result.faculty, function (idx, elem) {

                table.append("<tr  class='odd gradeX'><td >" + elem.name + "</td><td style='display: none;' >" + elem.description + "</a></td>" + "<td style='display: none;'> " + elem._id + "</td><td><button class='btn btn-primary' onclick='editModal(this)'  data-toggle=\"modal\" data-target=\"#modalEdit\">ویرایش</button> </td><td><button class='btn btn-dark' onclick='editModal(this)'  data-toggle=\"modal\" data-target=\"#modalVillage\">اضافه کردن استاد</button> </td><td><button onclick='addRowHandlers(this)' class='btn btn-danger' >مشاهده</button></td></tr>");

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

function editModal(user) {
    let id = $(user).closest('tr').find('td ').eq(2).text().trim();
    $('#id').val(id)
    $('#nameProvinceE').val($(user).closest('tr').find('td ').eq(0).text().trim())
    $('#descriptionProvinceE').val($(user).closest('tr').find('td ').eq(1).text().trim())

};

function edit() {

    let object = {};
    object.id = $('#id').val()
    object.name = $('#nameProvinceE').val();
    object.description = $('#descriptionProvinceE').val();

    let formData = new FormData();
    formData.append('name' , object.name)
    formData.append('description' , object.description)
    formData.append('id' , object.id)
    var input = $('#upload-photo_1')[0]
    const file = input.files[0]
    formData.append('logo', file)
    $.ajax({
        type: "POST",
        url: "/college/edit",
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
                text: "دانشکده با موفقیت ویرایش شد ",
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

function saveFaculty() {
    let form = new FormData()
    let object = {};
    object.name = $('#nameProvince').val();
    object.description = $('#descriptionProvince').val();
    console.log(object)
    form.append('name' , object.name)  ;
    form.append('description' , object.description)
    var input = $('#upload-photo_2')[0]
    const file = input.files[0]
    form.append('logo', file)
    form.append('collegeId' , $('#collegeId').val())

    console.log(object)
    $.ajax({
        type: "POST",
        url: "/college/faculty/add",
        data: object,
        success: function (result) {
            console.log(result)
            Swal.fire({
                title: '',
                text: "رشته با موفقیت اضافه شد ",
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
    var table = document.getElementById("tableCity");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler = function (row) {
            return function () {
                var cell = row.getElementsByTagName("td")[2];
                var id = cell.innerHTML.trim();
                $('#collegeId').val(id)

                location.href = `/faculty.html?id=${id}`
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

function saveCollege() {
    let form = new FormData()
    let object = {};
    object.name = $('#nameProvince').val();
    object.description = $('#descriptionProvince').val();
    console.log(object)
    form.append('name' , object.name)  ;
    form.append('description' , object.description)
    var input = $('#upload-photo')[0]
    const file = input.files[0]
    form.append('logo', file)
    $.ajax({
        type: "POST",
        url: "/college/add",
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
                text: "دانشکده با موفقیت اضافه شد ",
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

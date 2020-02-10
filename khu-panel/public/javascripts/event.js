let data;
$(window).bind("load", function() {
    $('#dvLoading').fadeOut();
});

$(document).ready(function () {
    var input = document.getElementById("searchText");
    input.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            search();
        }
    });
    ajaxGet(1)
    timeFunction()
     blogcategoty();

});

function ajaxGet(page) {
    $.ajax({
        type: "GET",
        url: "/event/all/" + page + "-50",
        success: function (result) {

            var table = $("#tableBlog");
            console.log(result)
            data = result.number
            table.find("tr:gt(0)").remove();

            $('#help').attr('value', result.number);
            $.each(result.blog, function (idx, elem) {
                let dateObj = new Date(elem.date);
                console.log(dateObj)

                moment.locale('en'); // default locale is en
                m = moment(dateObj.getFullYear() + "/" + parseInt(dateObj.getMonth() + 1) + "/" + parseInt(dateObj.getDay() + 3), 'YYYY/M/D');
                m.locale('fa'); // change locale for this moment instance
                if (elem.authors[0]) {
                    if (elem.active == true) {
                        table.append("<tr  class='odd gradeX'><td> " + elem.subject + "</td><td  >" + m.format('YYYY/M/D') + "</td><td  >" + elem.authors[0].fullName + "</td><td><button onclick='changeActive(this)'   class='btn btn-success disabled'> " + "فعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");
                    } else {
                        table.append("<tr class='odd gradeX'><td >" + elem.subject + "</td><td  >" + m.format('YYYY/M/D') + "</td><td >" + elem.authors[0].fullName + "</td><td><button onclick='changeActive(this)'   class='btn btn-outline-danger active'> " + "غیرفعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");

                    }
                }

                else {
                    if (elem.active == true) {
                        table.append("<tr  class='odd gradeX'><td> " + elem.subject + "</td><td  >" + m.format('YYYY/M/D') + "</td><td  >" + elem.authorsB[0].firstName + ' ' + elem.authorsB[0].lastName + "</td><td><button onclick='changeActive(this)'   class='btn btn-success disabled'> " + "فعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");
                    } else {
                        table.append("<tr class='odd gradeX'><td >" + elem.subject + "</td><td  >" + m.format('YYYY/M/D') + "</td><td >" + elem.authorsB[0].firstName + ' ' + elem.authorsB[0].lastName + "</td><td><button onclick='changeActive(this)'   class='btn btn-outline-danger active'> " + "غیرفعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");

                    }
                }

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


function addRowHandlers() {
    var table = document.getElementById("tableBlog");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler = function (row) {
            return function () {
                var cell = row.getElementsByTagName("td")[4];
                var id = cell.innerHTML.trim();

            };
        };
        currentRow.onclick = createClickHandler(currentRow);
    }
};

function editBlog() {
    var table = document.getElementById("tableBlog");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler = function (row) {
            return function () {
                var cell = row.getElementsByTagName("td")[4];
                var id = cell.innerHTML.trim();

                location.href = `/editEvent.html?id=${id}`
            };
        };
        currentRow.onclick = createClickHandler(currentRow);
    }
}

function postBlog() {
    location.href = '/newEvent.html'

}

function changeActive(user) {


    let object = {};
    let id = $(user).closest('tr').find('td ').eq(4).text().trim();
    let status = $(user).closest('tr').find('td ').eq(3).text();
    console.log(id)
    object.id = id;
    if (status.trim() === "فعال") {
        object.active = false;
        $.ajax({
            type: "POST",
            url: "/event/verification",
            data: object,
            success: function (r) {
                console.log(r)
                $(user).removeClass('btn btn-success disabled');
                $(user).addClass('btn btn-outline-danger active');
                $(user).html('غیرفعال')

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
    } else if (status.trim() === "غیرفعال") {
        object.active = true;
        $.ajax({
            type: "POST",
            url: "/event/verification",
            data: object,
            success: function () {
                $(user).removeClass('btn btn-outline-danger active');
                $(user).addClass('btn btn-success disabled');
                $(user).html('فعال')

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


};

function page(user) {
    let number = $(user).html().trim();
    var table = $("#tableResidence");
    table.find("tr:gt(0)").remove();
    $('.kt-pagination__link--active').removeClass('kt-pagination__link--active')

    $(`#${number}`).addClass('kt-pagination__link--active')
    for (let i = 1 ; i < number ; i++) {
        $(`#${i}`).removeClass('kt-pagination__link--active')

    }
    ajaxGet(number)


};

function pagination() {
    let number = parseInt(data) / 50;
    console.log(number)
    for (let i = 1; i <= Math.ceil(number); i++) {
        let page = $('#page');
        page.append('<li id=' + '\"' + i + '\"' +' >' + '<a onclick="page(this)">' + i + '</a></li>')
        $(`#${1}`).addClass('kt-pagination__link--active')

    }


};

function timeFunction() {
    setTimeout(function () {
        pagination()
    }, 3000);
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

function blogcategoty() {
    $.ajax({
        type: "GET",
        url: "/college/all/1-100",
        success: function (result) {
            console.log(result)
            let blogCategory = $('#filter')


            $.each(result.college, function (idx, elem) {
                blogCategory.append('<option value=' + `${elem._id}` + ">" + elem.name + "</option>")

            });
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

function filter() {
    let filter = $('#filter option:selected').val()
    $('#dvLoading').fadeIn()
    $.ajax({
        type: "GET",
        url: "/blog/all/" + 1 + "-50?categoryId=" + filter,
        success: function (result) {
            $('#dvLoading').fadeOut()

            var table = $("#tableBlog");
            console.log(result)
            data = result.number
            table.find("tr:gt(0)").remove();

            $('#help').attr('value', result.number);
            $.each(result.blog, function (idx, elem) {
                let dateObj = new Date(elem.date);
                console.log(dateObj)

                moment.locale('en'); // default locale is en
                m = moment(dateObj.getFullYear() + "/" + parseInt(dateObj.getMonth() + 1) + "/" + parseInt(dateObj.getDay() + 3), 'YYYY/M/D');
                m.locale('fa'); // change locale for this moment instance
                if (elem.authors[0]) {
                    if (elem.status == true) {
                        table.append("<tr  class='odd gradeX'><td> " + elem.title + "</td><td  >" + m.format('YYYY/M/D') + "</td><td  >" + elem.authors[0].fullName + "</td><td><button onclick='changeActive(this)'   class='btn btn-success disabled'> " + "فعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");
                    } else {
                        table.append("<tr class='odd gradeX'><td >" + elem.title + "</td><td  >" + m.format('YYYY/M/D') + "</td><td >" + elem.authors[0].fullName + "</td><td><button onclick='changeActive(this)'   class='btn btn-outline-danger active'> " + "غیرفعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");

                    }
                }
                else if (elem.authorsH[0]) {
                    if (elem.status == true) {
                        table.append("<tr  class='odd gradeX'><td> " + elem.title + "</td><td  >" + m.format('YYYY/M/D') + "</td><td  >" + elem.authorsH[0].firstName + ' ' + elem.authorsH[0].lastName + "</td><td><button onclick='changeActive(this)'   class='btn btn-success disabled'> " + "فعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");
                    } else {
                        table.append("<tr class='odd gradeX'><td >" + elem.title + "</td><td  >" + m.format('YYYY/M/D') + "</td><td >" + elem.authorsH[0].firstName + ' ' + elem.authorsH[0].lastName + "</td><td><button onclick='changeActive(this)'   class='btn btn-outline-danger active'> " + "غیرفعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");

                    }
                }
                else {
                    if (elem.status == true) {
                        table.append("<tr  class='odd gradeX'><td> " + elem.title + "</td><td  >" + m.format('YYYY/M/D') + "</td><td  >" + elem.authorsB[0].firstName + ' ' + elem.authorsB[0].lastName + "</td><td><button onclick='changeActive(this)'   class='btn btn-success disabled'> " + "فعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");
                    } else {
                        table.append("<tr class='odd gradeX'><td >" + elem.title + "</td><td  >" + m.format('YYYY/M/D') + "</td><td >" + elem.authorsB[0].firstName + ' ' + elem.authorsB[0].lastName + "</td><td><button onclick='changeActive(this)'   class='btn btn-outline-danger active'> " + "غیرفعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");

                    }
                }

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
}

function search() {
    let search = $('#searchText').val()
    $('#dvLoading').fadeIn()

    $.ajax({
        type: "GET",
        url: "/blog/all/" + 1 + "-50?text=" + search,
        success: function (result) {
            $('#dvLoading').fadeOut()

            var table = $("#tableBlog");
            console.log(result)
            data = result.number
            table.find("tr:gt(0)").remove();

            $('#help').attr('value', result.number);
            $.each(result.blog, function (idx, elem) {
                let dateObj = new Date(elem.date);
                console.log(dateObj)

                moment.locale('en'); // default locale is en
                m = moment(dateObj.getFullYear() + "/" + parseInt(dateObj.getMonth() + 1) + "/" + parseInt(dateObj.getDay() + 3), 'YYYY/M/D');
                m.locale('fa'); // change locale for this moment instance
                if (elem.authors[0]) {
                    if (elem.status == true) {
                        table.append("<tr  class='odd gradeX'><td> " + elem.title + "</td><td  >" + m.format('YYYY/M/D') + "</td><td  >" + elem.authors[0].fullName + "</td><td><button onclick='changeActive(this)'   class='btn btn-success disabled'> " + "فعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");
                    } else {
                        table.append("<tr class='odd gradeX'><td >" + elem.title + "</td><td  >" + m.format('YYYY/M/D') + "</td><td >" + elem.authors[0].fullName + "</td><td><button onclick='changeActive(this)'   class='btn btn-outline-danger active'> " + "غیرفعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");

                    }
                }
                else if (elem.authorsH[0]) {
                    if (elem.status == true) {
                        table.append("<tr  class='odd gradeX'><td> " + elem.title + "</td><td  >" + m.format('YYYY/M/D') + "</td><td  >" + elem.authorsH[0].firstName + ' ' + elem.authorsH[0].lastName + "</td><td><button onclick='changeActive(this)'   class='btn btn-success disabled'> " + "فعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");
                    } else {
                        table.append("<tr class='odd gradeX'><td >" + elem.title + "</td><td  >" + m.format('YYYY/M/D') + "</td><td >" + elem.authorsH[0].firstName + ' ' + elem.authorsH[0].lastName + "</td><td><button onclick='changeActive(this)'   class='btn btn-outline-danger active'> " + "غیرفعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");

                    }
                }
                else {
                    if (elem.status == true) {
                        table.append("<tr  class='odd gradeX'><td> " + elem.title + "</td><td  >" + m.format('YYYY/M/D') + "</td><td  >" + elem.authorsB[0].firstName + ' ' + elem.authorsB[0].lastName + "</td><td><button onclick='changeActive(this)'   class='btn btn-success disabled'> " + "فعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");
                    } else {
                        table.append("<tr class='odd gradeX'><td >" + elem.title + "</td><td  >" + m.format('YYYY/M/D') + "</td><td >" + elem.authorsB[0].firstName + ' ' + elem.authorsB[0].lastName + "</td><td><button onclick='changeActive(this)'   class='btn btn-outline-danger active'> " + "غیرفعال" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td>" + "<td><button onclick='editBlog()'   class='btn btn-dark'> " + "ویرایش" + "<i class='fa fa-pencil'></i></button></td><td><button type='button' class='btn btn-secondary' onclick='addRowHandlers()'>نمایش</button> </td>" + "</tr>");

                    }
                }

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
}


let data;
$(window).bind("load", function() {
    $('#dvLoading').fadeOut();
});

$(document).ready(function () {
    ajaxGet(1);
    var button = document.getElementById("selectUser");
    // const debounce = (func, delay) => {
    //     let debounceTimer
    //     return function() {
    //         const context = this
    //         const args = arguments
    //         clearTimeout(debounceTimer)
    //         debounceTimer
    //             = setTimeout(() => func.apply(context, args), delay)
    //     }
    // }
    // button.addEventListener('change', debounce(function() {
    //     alert("Hello\nNo matter how many times you" +
    //         "click the debounce button, I get " +
    //         "executed once every 3 seconds!!")
    // }, 3000));
    timeFunction()
});

function ajaxGet(page) {
    $.ajax({
        type: "GET",
        url: "/ticket/all/" + page + "-50",
        success: function (result) {
            console.log(result)
            data = result.number
            let ticket = $('#tableTicket');
            $.each(result.ticket, function (idx, elem) {
                let dateObj = new Date(elem.date);
                moment.locale('en'); // default locale is en
                m = moment(dateObj.getFullYear() + "/" + parseInt(dateObj.getMonth() + 1)  + "/" + dateObj.getDate(), 'YYYY/M/D');
                m.locale('fa'); // change locale for this moment instance
                if (elem.active == true) {

                    ticket.append("<tr  class='odd gradeX'><td>" + elem.subject + "</td><td>" + m.format('YYYY/M/D') + "</td><<td><button onclick='changeActive(this)'   class='btn btn-success''> " + " تیکت باز " + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td><td><button onclick='addRowHandlers(this)' class='btn btn-dark' >مشاهده</button></td></tr>");
                } else {
                    ticket.append("<tr  class='odd gradeX'><td>" + elem.subject + "</td><td>" + m.format('YYYY/M/D') + "</td><td><button  onclick='changeActive(this)' class='btn btn-danger  '> " + "تیکت بسته" + "</button></td>" + "<td style='display: none;'> " + elem._id + "</td><td><button onclick='addRowHandlers(this)' class='btn btn-dark' >مشاهده</button></td></tr>");

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
    var table = document.getElementById("tableTicket");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler = function (row) {
            return function () {
                var cell = row.getElementsByTagName("td")[3];
                var id = cell.innerHTML.trim();
                location.href = `/ticketProfile.html?id=${id}`

            };
        };
        currentRow.onclick = createClickHandler(currentRow);
    }
};

function changeActive(user) {
    let object = {};
    let id = $(user).closest('tr').find('td ').eq(3).text().trim();
    let status = $(user).closest('tr').find('td ').eq(2).text().trim();
    object.id = id
    console.log(status)
    if (status.trim() === "تیکت باز") {
        console.log('here')
        object.active = false;
        $.ajax({
            type: "POST",
            url: "/ticket/verification",
            data: object,
            success: function () {
                $(user).removeClass('btn btn-success ');
                $(user).addClass('btn btn-danger ');
                $(user).html("تیکت بسته" )

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
    } else if (status.trim() === "تیکت بسته") {
        object.active = true;
        $.ajax({
            type: "POST",
            url: "ticket/verification",
            data: object,
            success: function () {
                $(user).removeClass('btn btn-danger ');
                $(user).addClass('btn btn-success ');
                $(user).html(" تیکت باز " )

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

function fillDepartment() {
    $.ajax({
        type: "GET",
        url: "/ticket/department",
        success: function (result) {
            var department = $("#department");

            $.each(result, function (idx, elem) {

                department.append(
                    '<option value=' + `${elem._id}` + ">" + elem.name + "</option>")

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
    })


}

function fillUser() {
    $('#dvLoading').fadeIn()
    let role = $("#userRole option:selected").val().trim();
    let object = {role: role}
    console.log(object)
    object.text = ''
    $("#selectUser").empty() ;
    $.ajax({
        type: "POST",
        url: "/ticket/fill",
        data: object,
        success: function (result) {
            console.log(result)
            $('#dvLoading').fadeOut()

            var selectUser = $("#selectUser");

            $.each(result, function (idx, elem) {
                if (role === 'admin') {
                    selectUser.append(
                        '<option value=' + `${elem._id}` + ">" + elem.fullName + "</option>")
                } else {
                    selectUser.append(
                        '<option value=' + `${elem._id}` + ">" + elem.firstName +  ' ' + elem.lastName + "</option>")
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
    })


};

function fillAll() {
    document.getElementById('selectUser').style.display = 'none'
    let text = $("#userRole option:selected").val().trim();
    let object = {text: text}
    $.ajax({
        type: "POST",
        url: "/ticket/fill",
        data: object,
        success: function (result) {
            console.log(result)




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
    })
}

function sendTicketForAll() {
    let users = $('#selectUser').select2('val');
    let role = $("#userRole option:selected").val().trim();

    let selection = [];
    $.each(users, function (idx, elem) {
        selection.push({_id: elem})
    });
    let object = {};
    object.users = JSON.stringify(selection);
    object.text = $('#message').val();
    object.subject = $('#subject').val();
    object.departmentId = $("#department option:selected").val().trim();
    object.role = role

    $.ajax({
        type: "POST",
        url: "/ticket/sendAll",
        data: object,
        success: function (result) {
            Swal.fire({
                title: '',
                text: "تیکت با موفقیت ارسال شد ",
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

function page(user) {
    let number = $(user).html().trim();
    var table = $("#tableTicket");
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
    setTimeout(function(){ pagination() }, 3000);
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



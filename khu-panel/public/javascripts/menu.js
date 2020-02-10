


$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/admin/menu",
        success: function (result) {
            let menuUl = $('#menu');

            if (result.role === 'admin')
            {

                $('#adminName').html('سلام' + ' ' + result.admin.fullName)
                $('#username').html(result.admin.fullName)
                $('#avatarAdmin').append('<img class="kt-hidden-" alt="Pic" src=" ' + 'https://www.api.boomiro.com/v1/getPhoto/branchHead/' + result.admin._id  + ' ">')


                if (result.admin.superAdmin === true) {
                    menuUl.append("<li class=" + `\"kt-menu__item  kt-menu__item--submenu\"` + "aria-haspopup=\"true\"\n" +
                        " data-ktmenu-submenu-toggle=\"hover\"><a href=\"/event.html\"\n" +
                        " class=\"kt-menu__link kt-menu__toggle\"><i\n" +
                        "class=\"kt-menu__link-icon flaction flaticon-event-calendar-symbol\n\"></i><span\n" +
                        "class=\"kt-menu__link-text\">" + "لیست رویداد ها " + "</span></a>\n" +
                        " </li>\n")
                    menuUl.append("<li class=" + `\"kt-menu__item  kt-menu__item--submenu\"` + "aria-haspopup=\"true\"\n" +
                         " data-ktmenu-submenu-toggle=\"hover\"><a href=\"/new.html\"\n" +
                        " class=\"kt-menu__link kt-menu__toggle\"><i\n" +
                        "class=\"kt-menu__link-icon flaction flaticon2-new-email\n\"></i><span\n" +
                        "class=\"kt-menu__link-text\">" + "لیست اخبار" + "</span></a>\n" +

                        " </li>\n")
                    menuUl.append("<li class=" + `\"kt-menu__item  kt-menu__item--submenu\"` + " aria-haspopup=\"true\"\n" +
                        " data-ktmenu-submenu-toggle=\"hover\"><a href=\"/document.html\"\n" +
                        " class=\"kt-menu__link kt-menu__toggle\"><i\n" +
                        "class=\"kt-menu__link-icon flaction flaticon2-open-text-book\n\"></i><span\n" +
                        "class=\"kt-menu__link-text\">" + "لیست جزوات" + "</span></a>\n" +

                        " </li>\n")
                    menuUl.append("<li class=" + `\"kt-menu__item  kt-menu__item--submenu\"` + "aria-haspopup=\"true\"\n" +
                        " data-ktmenu-submenu-toggle=\"hover\"><a href=\"/college.html\"\n" +
                        " class=\"kt-menu__link kt-menu__toggle\"><i\n" +
                        "class=\"kt-menu__link-icon flaction flaticon2-map\"></i><span\n" +
                        "class=\"kt-menu__link-text\">" + "اطلاعات دانشگاه" + "</span></a>\n" +

                        " </li>\n")
                    menuUl.append("<li class=" + `\"kt-menu__item  kt-menu__item--submenu\"` + "aria-haspopup=\"true\"\n" +
                        " data-ktmenu-submenu-toggle=\"hover\"><a href=\"/ticket.html\"\n" +
                        " class=\"kt-menu__link kt-menu__toggle\"><i\n" +
                        "class=\"kt-menu__link-icon flaticon-twitter-logo\"></i><span\n" +
                        "class=\"kt-menu__link-text\">" + " توییت" + "</span></a>\n" +

                        " </li>\n")






                }
            }


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
    });

})
$(window).bind("load", function () {
    $('#dvLoading').fadeOut();
});

$(document).ready(function () {
    getProfile()
    var input = document.getElementById("ticketText");
    input.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            sendTicket()
        }
    });

});

function getProfile() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let id = url.searchParams.get("id").trim();
    $.ajax({
        type: "GET",
        url: "/ticket/" + id,
        success: function (result) {
            console.log(result);
            // $('#chat').scrollTop(100 , 0 )


            $('#titleName').html($('#nameTicket').text())
            let chat = $('#chat');
            $.each(result.chat, function (idx, elem1) {


                if (elem1.role !== 'Admin') {
                    chat.append(
                        "                                                        <div class=\"kt-chat__message kt-chat__message--right\">\n" +
                        "                                                            <div class=\"kt-chat__user\">\n" +
                        "                                                                <a  class=\"kt-chat__username\">" + 'کاربر ' + "</span></a>\n" +
                        "                                                                <span class=\"kt-media kt-media--circle kt-media--sm\">\n" +
                        "<img alt='image' src=\" " + "https://www.api.boomiro.com/v1/getPhoto/" + `passenger` + `/${elem1.ticketId}` + "\"" + " >" +
                        "</span>\n" +
                        "                        </div>\n" +
                        "                                                            <div class=\"kt-chat__text kt-bg-light-brand\">\n" +

                        `${elem1.text}` +


                        "                                                            </div>\n" +
                        "                                                        </div>\n"
                    )


                } else {
                    chat.append(
                        "                                                        <div class=\"kt-chat__message\">\n" +
                        "                                                            <div class=\"kt-chat__user\">\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"kt-media kt-media--circle kt-media--sm\">\n" +
                        "<img alt='image' src=\" " + "https://www.api.boomiro.com/v1/getPhoto/" + "branchHead" + `/${elem1.ticketId}` + "\"" + " >" +
                        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</span>\n" +
                        "<a  class=\"kt-chat__username\">" + " ادمین" + "</span></a>" +
                        "                                                            </div>\n" +
                        "                                                            <div class=\"kt-chat__text kt-bg-light-success\">\n" +
                        `${elem1.text}` +
                        "                                                            </div>\n" +
                        "                                                        </div>\n"
                    )
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


function sendTicket() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let id = url.searchParams.get("id").trim();
    let object = {};
    object.ticketId = id;
    object.role = 'admin';
    object.message = $('#ticketText').val();
    console.log(object)
    $.ajax({
        type: "POST",
        url: "/ticket/sendMessage",
        data: object,
        success: function (messege) {
            Swal.fire({
                title: '',
                text: "پیام با موفقیت ارسال شد ",
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'متوجه شدم'
            }).then((result) => {
                if (result.value) {
                    $('#ticketText').val('')
                    let chat = $('#chat');

                    chat.append(
                        "                                                        <div class=\"kt-chat__message\">\n" +
                        "                                                            <div class=\"kt-chat__user\">\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"kt-media kt-media--circle kt-media--sm\">\n" +
                        "<img alt='image' src=\" " + "https://www.api.boomiro.com/v1/getPhoto/" + "branchHead" + `/${object.ticketId}` + "\"" + " >" +
                        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</span>\n" +
                        "<a  class=\"kt-chat__username\">" + "ادمین " + "</span></a>" +
                        "                                                            </div>\n" +
                        "                                                            <div class=\"kt-chat__text kt-bg-light-success\">\n" +
                        `${object.message}` +
                        "                                                            </div>\n" +
                        "                                                        </div>\n"
                    )
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


function logout() {
    Swal.fire({
        title: '',
        text: " آیا مطمن هستید که می خواهید خارج شوید ؟",
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: 'لغو کردن',
        confirmButtonText: 'متوجه ام'
    }).then(function (result) {
        if (result.value) {

            $.ajax({
                type: "GET",
                url: "/admin/logout",
                success: function (result) {
                    location.href = '/'

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
    })


}

var handleMessaging = function () {
    var initChat = function (parentEl) {
        var messageListEl = KTUtil.find(parentEl, '.kt-scroll');

        if (!messageListEl) {
            return;
        }

        // initialize perfect scrollbar(see:  https://github.com/utatti/perfect-scrollbar)
        KTUtil.scrollInit(messageListEl, {
            windowScroll: true, // allow browser scroll when the scroll reaches the end of the side
            mobileNativeScroll: true,  // enable native scroll for mobile
            desktopNativeScroll: true, // disable native scroll and use custom scroll for desktop
            resetHeightOnDestroy: true,  // reset css height on scroll feature destroyed
            handleWindowResize: true, // recalculate hight on window resize
            rememberPosition: true, // remember scroll position in cookie
            height: function () {  // calculate height
                var height;

                // Mobile mode
                if (KTUtil.isInResponsiveRange('tablet-and-mobile')) {
                    return KTUtil.hasAttr(messageListEl, 'data-mobile-height') ? parseInt(KTUtil.attr(messageListEl, 'data-mobile-height')) : 300;
                }

                // Desktop mode
                if (KTUtil.isInResponsiveRange('desktop') && KTUtil.hasAttr(messageListEl, 'data-height')) {
                    return parseInt(KTUtil.attr(messageListEl, 'data-height'));
                }

                var chatEl = KTUtil.find(parentEl, '.kt-chat');
                var portletHeadEl = KTUtil.find(parentEl, '.kt-portlet > .kt-portlet__head');
                var portletBodyEl = KTUtil.find(parentEl, '.kt-portlet > .kt-portlet__body');
                var portletFootEl = KTUtil.find(parentEl, '.kt-portlet > .kt-portlet__foot');

                if (KTUtil.isInResponsiveRange('desktop')) {
                    height = KTLayout.getContentHeight();
                } else {
                    height = KTUtil.getViewPort().height;
                }

                if (chatEl) {
                    height = height - parseInt(KTUtil.css(chatEl, 'margin-top')) - parseInt(KTUtil.css(chatEl, 'margin-bottom'));
                    height = height - parseInt(KTUtil.css(chatEl, 'padding-top')) - parseInt(KTUtil.css(chatEl, 'padding-bottom'));
                }

                if (portletHeadEl) {
                    height = height - parseInt(KTUtil.css(portletHeadEl, 'height'));
                    height = height - parseInt(KTUtil.css(portletHeadEl, 'margin-top')) - parseInt(KTUtil.css(portletHeadEl, 'margin-bottom'));
                }

                if (portletBodyEl) {
                    height = height - parseInt(KTUtil.css(portletBodyEl, 'margin-top')) - parseInt(KTUtil.css(portletBodyEl, 'margin-bottom'));
                    height = height - parseInt(KTUtil.css(portletBodyEl, 'padding-top')) - parseInt(KTUtil.css(portletBodyEl, 'padding-bottom'));
                }

                if (portletFootEl) {
                    height = height - parseInt(KTUtil.css(portletFootEl, 'height'));
                    height = height - parseInt(KTUtil.css(portletFootEl, 'margin-top')) - parseInt(KTUtil.css(portletFootEl, 'margin-bottom'));
                }

                // remove additional space
                height = height - 5;

                return height;
            }
        });

        var scrollEl = KTUtil.find(parentEl, '.kt-scroll');
        var messagesEl = KTUtil.find(parentEl, '.kt-chat__messages');
        var textarea = KTUtil.find(parentEl, '.kt-chat__input textarea');

        if (textarea.value.length === 0) {
            return;
        }

        var node = document.getElementById("chat");
        KTUtil.addClass(node, 'kt-chat__message kt-chat__message--brand kt-chat__message--right');

        var html =
            '<div class="kt-chat__user">' +
            '<span class="kt-chat__datetime">Just now</span>' +
            '<a href="#" class="kt-chat__username">Jason Muller</span></a>' +
            '<span class="kt-media kt-media--circle kt-media--sm">' +
            '<img src="./assets/media/users/100_12.jpg" alt="image">' +
            '</span>' +
            '</div>' +
            '<div class="kt-chat__text kt-bg-light-brand">' +
            textarea.value
        '</div>';

        KTUtil.setHTML(node, html);
        messagesEl.appendChild(node);
        textarea.value = '';
        scrollEl.scrollTop = parseInt(KTUtil.css(messagesEl, 'height'));

        var ps;
        if (ps = KTUtil.data(scrollEl).get('ps')) {
            ps.update();
        }
    }


    return {
        // public functions
        init: function () {
            // init modal chat example
            initChat(KTUtil.getByID('kt_chat_modal'));

        },

        setup: function (element) {
            initChat(element);
        }
    };
}



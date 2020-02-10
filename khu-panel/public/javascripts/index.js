$(document).ready(function () {

});

function loginAdmin() {
    let object = {};
    object.username = $('#username').val();
    object.password = $('#password').val();

    $.ajax({
        type: "POST",
        url: "/admin/login",
        data: object,
        success: function (result) {
            console.log(result)
            window.location = '/event.html'

        },
        error: function (err) {
            console.log(err)
            if (err.status === 400) {
                Swal.fire({
                    title: '',
                    text: "نام کاربری یا رمز عبور اشتباه است",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'متوجه شدم'
                }).then((result) => {
                    location.reload()
                })
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
}












$(window).bind("load", function() {
    $('#dvLoading').fadeOut();
});

$(document).ready(function () {
    blogcategoty()

});


const BlockEmbed = Quill.import('blots/block/embed');

class ImageBlot extends BlockEmbed {
    static create(value) {
        let node = super.create();
        node.setAttribute('alt', value.name);
        node.setAttribute('name', value.name);
        node.setAttribute('src', value.url);
        node.setAttribute('style', 'max-height:500px;');
        return node;
    }

    static value(node) {
        return node.getAttribute('src');
    }
}

ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';

class VideoBlot extends BlockEmbed {
    static create(url) {
        let node = super.create();
        node.setAttribute('src', url);
        node.setAttribute('id', "test");
        node.setAttribute('controls', "");
        node.setAttribute('preload', "none");
        node.setAttribute('style', 'margin:0 auto; display:block; max-height:400px;');
        // node.setAttribute('display', 'block');
        return node;
    }

    static formats(node) {
        let format = {};
        format.style = node.getAttribute('style');
        // format.display = node.getAttribute('display');
        return format;
    }

    static value(node) {
        return node.getAttribute('src');
    }

    format(name, value) {

        super.format(name, value);
    }
}

VideoBlot.blotName = 'video';
VideoBlot.className = 'videoUpload';
VideoBlot.tagName = 'video';

Quill.register(ImageBlot);
Quill.register(VideoBlot)

// class VideoBlot extends BlockEmbed {
//     static create(value) {
//         let node = super.create();
//         node.setAttribute('src', value.url);
//         // Set non-format related attributes with static values
//         node.setAttribute('frameborder', '0');
//         node.setAttribute('allowfullscreen', true);
//         return node;
//     }
//
//     static value(node) {
//         return node.getAttribute('src');
//     }
//
// }
//
// VideoBlot.blotName = 'video';
// VideoBlot.tagName = 'iframe';
// Quill.register(VideoBlot);


var editor = new Quill('#editor', {
    modules: {
        toolbar: '#toolbar'
    },
    placeholder: 'چیزی تایپ کنید...',
    theme: 'snow',


});

function uploadPhoto() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
        const file = input.files[0];

        // file type is only image.
        if (/^image\//.test(file.type)) {
            this.imageSaveToServer(file);
        }
        else {
            console.warn('You could only upload images.');
        }
    };

}

function imageSaveToServer(file) {
    const fd = new FormData();
    fd.append('image', file);
    $.ajax({
        type: "POST",
        url: "/new/upload/photo",
        data: fd,
        enctype: 'multipart/form-data',
        cache: false,
        dataType: 'json',
        contentType: false,
        processData: false,
        xhr: function () {
            $('#upload-photo-progress').prop('hidden', false)
            var xhr = new window.XMLHttpRequest()
            xhr.upload.addEventListener('progress', function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = (evt.loaded / evt.total) * 100
                    //Do something with upload progress here
                    $('#upload-photo-progress div').css('width', percentComplete + '%')
                }
            }, false)
            return xhr
        },
        success: function (result) {
            let  url = "http://localhost:3005/upload/cover/" + result.address;
            this.prog = 0
            console.log("inje")

            let range = editor.getSelection(true);

            editor.insertText(range.index, '\n', Quill.sources.USER);
            editor.insertEmbed(range.index + 1, 'image', {
                name: result.name,
                url: url
            }, Quill.sources.USER);
            editor.setSelection(range.index + 2, Quill.sources.SILENT);

            $('#upload-photo-progress').prop('hidden', true)
            $('#upload-photo-progress div').css('width', 25 + '%')


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

}


function savePost() {
    let form = new FormData();

    let title = $('#title').val();

    let object = {

    };
    object.title = title;
    var contents = editor.getContents();
    // console.log(contents);
    let type = 'text';
    let index = 0;
    let charFeatures = [];
    let str = "";
    let post = [];
    contents.ops.forEach((item) => {
        let insert = item.insert;
        console.log(item)
        if (insert.image) {
            type = "image";
            str = insert.image;
            post.push({
                index,
                content: str,
                charFeatures,
                type
            });
            index++;
            charFeatures = [];
            str = "";
            type = "text";
        }
        else if (insert.video) {

            type = "video";
            str = insert.video;
            post.push({
                index,
                content: str,
                charFeatures,
                type
            });
            index++;
            charFeatures = [];
            str = "";
            type = "text";
        }
        else if (insert.file) {
            if (item.attributes.name) {
                charFeatures.push({
                    name: item.attributes.name
                })
            }
            type = "file";
            str = insert.file;
            post.push({
                index,
                content: str,
                charFeatures,
                type
            });
            index++;
            charFeatures = [];
            str = "";
            type = "text";
        }
        else if (insert.audio) {
            if (item.attributes.name) {
                charFeatures.push({
                    name: item.attributes.name
                })
            }
            type = "audio";
            str = insert.audio;
            post.push({
                index,
                content: str,
                charFeatures,
                type
            });
            index++;
            charFeatures = [];
            str = "";
            type = "text";
        }
        else {

            if (item.attributes) {
                if (insert === '\n') {
                    //bullet or text align
                    
					// if (item.attributes.align && item.attributes.list) {
                    //     charFeatures.push({
                    //         start: str.length,
                    //         length: insert.length,
                    //         type: item.attributes.align + "/" + item.attributes.list
                    //     })
					//
                    // }
                    // else if (item.attributes.align) {
                    //     charFeatures.push({
                    //         start: str.length,
                    //         length: insert.length,
                    //         type: item.attributes.align
                    //     })
                    // }
                    // else {
					//
                    //     charFeatures.push({
                    //         start: str.length,
                    //         length: insert.length,
                    //         type: item.attributes.list
                    //     })
                    // }
					
					if (item.attributes.align && item.attributes.list) {
						type = item.attributes.align + "/" + item.attributes.list
					} else if (item.attributes.align) {
						type = item.attributes.align
					} else {
						type = item.attributes.list
					}
                }
                else {
                    if(item.attributes.bold && item.attributes.link){
                        charFeatures.push({
                            start: str.length,
                            length: insert.length,
                            type: "linkBold",
                            link: item.attributes.link
                        })
                    }
                    else if (item.attributes.bold) {
                        charFeatures.push({
                            start: str.length,
                            length: insert.length,
                            type: "bold"
                        })
                    }
                    else if (item.attributes.link) {
                        charFeatures.push({
                            start: str.length,
                            length: insert.length,
                            type: "link",
                            link: item.attributes.link
                        })

                    }
                }
            }
            if (insert === '\n') {
                post.push({
                    index,
                    content: str,
                    charFeatures,
                    type
                });
                index++;
                charFeatures = [];
                str = "";
                type = "text";
            }
            else {
                if (insert.includes('\n')) {
                    var arr = insert.split('\n');
                    for (var i = 0; i < arr.length; i++) {
                        if (i === arr.length - 1) {
                            str = str + arr[i]
                        }
                        else {
                            str = str + arr[i]
                            post.push({
                                index,
                                content: str,
                                charFeatures,
                                type
                            });
                            index++;
                            charFeatures = [];
                            str = "";
                            type = "text";
                        }
                    }
                }
                else {
                    str = str + insert;

                }
            }
        }

    });
    console.log(post)



    object.body = JSON.stringify(post)

    form.append('title', title);
    form.append('categoryId', $('#blogType').val())
    form.append('body', JSON.stringify(post));
    var input1 = $('#upload-photo')[0]
    const file1 = input1.files[0]
    form.append('cover', file1)
    $.ajax({
        type: "POST",
        url: "/event/add",
        data: form,
        enctype: 'multipart/form-data',
        cache: false,
        dataType: 'json',
        contentType: false,
        processData: false,

        success: function () {
            Swal.fire({
                title: '',
                text: " ویکی با موقیت اضافه شد ",
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'متوجه شدم'
            }).then((result) => {
                if (result.value) {
                    location.href = '/blog.html'
                }
            })
        },
        error: function (err) {
            console.log(err)
            if (err.status === 400) {
                Swal.fire({
                    title: '',
                    text: " ایمیل و شماره تلفن یا کد ملی  تکراری است",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'متوجه شدم'
                }).then((result) => {
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
            else if (err.status === 500) {
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

function blogcategoty() {
    $.ajax({
        type: "GET",
        url: "/college/all/1-100",
        success: function (result) {
            console.log(result)
            let blogCategory = $('#blogType')


            $.each(result.college, function (idx, elem) {
                blogCategory.append('<option value=' + `${elem._id}` + ">" + elem.name + "</option>")

            });
        },
        error: function (e) {
            console.log("ERROR: ", e);
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



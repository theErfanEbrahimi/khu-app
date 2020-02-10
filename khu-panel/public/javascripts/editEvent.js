let positon = {};
$(window).bind("load", function () {
    $('#dvLoading').fadeOut();
});

$(document).ready(function () {


    getProfile();
    blogcategoty()
});

const BlockEmbed = Quill.import('blots/block/embed');

class ImageBlot extends BlockEmbed {
    static create(value) {
        let node = super.create();
        node.setAttribute('alt', value.name);
        node.setAttribute('name', value.name);
        node.setAttribute('src', value.url);
        node.setAttribute('style', 'max-height:500px; align: center');
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


var editor = new Quill('#editor', {
    modules: {
        toolbar: {
            container: "#toolbar" // Selector for toolbar container

        }
    },
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
        } else {
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

function getProfile() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let id = url.searchParams.get("id").trim();

    let ops = [];
    $.ajax({
        type: "GET",
        url: "/event/" + id,
        success: function (result) {
            console.log(result)
            //
            // $.each(result[0].body, function (idx, elem) {
            //     let object = {};
            //     object.insert = elem.content;
            //     let attributes = {};
            //     console.log(elem)
            //     if (elem.type === 'text') {
            //         $.each(result[0].body[idx].charFeatures, function (idx, elm1) {
            //             if (elm1.type === 'bold') {
            //                 attributes = {bold: true}
            //                 object.attributes = attributes;
            //             } else if (elm1.type === 'right') {
            //                 ops.push({insert: "\n", attributes: {align: "right", direction: "rtl"}})
            //             }
            //             if (elem.content === "") {
            //                 ops.push({insert: "\n"})
            //
            //             }
            //         })
            //         ops.push(object)
            //     } else if (elem.type === 'image') {
            //         console.log("inje")
            //
            //         let range = editor.getSelection(true);
            //         console.log(range)
            //         console.log(Quill.sources.USER)
            //         editor.insertText(range.index, '\n', Quill.sources.USER);
            //         editor.insertEmbed(range.index + 1, 'image', {
            //             name: 'name',
            //             url: elem.content
            //         }, Quill.sources.USER);
            //         editor.setSelection(range.index + 2, Quill.sources.SILENT);
            //         // console.log(elem.content)
            //         // ops.push({
            //         //     insert: {image: elem.content},
            //         //     attributes: {alt: "Lab Octocat"}
            //         // })
            //         // editor.insertEmbed(0, 'image', elem.content);
            //
            //
            //     } else if (elem.type === 'video') {
            //         ops.push({
            //             insert: {video: elem.content},
            //             attributes: {
            //                 width: 800,
            //                 height: 200
            //             }
            //         })
            //     }
            //
            //
            // });
            // // editor.setContents(ops)
            // console.log(editor.getContents())
            parseDelta(result[0].body)
            $('#title').val(result[0].title)



            // $('#coverEdit').css('background-image', 'url( \' ' + 'https://www.api.boomiro.com/v1/getPhoto/cover/' + result[0]._id + '\' )')

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

function savePost() {
    let form = new FormData()
    let url_string = window.location.href;
    let url = new URL(url_string);
    let id = url.searchParams.get("id").trim();
    form.append('id', id)
    let title = $('#title').val();
    form.append('title', title)


    let object = {

    };
    object.title = title;
    object.id = id
    var contents = editor.getContents();
    console.log(contents);
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
        } else if (insert.video) {

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
        } else if (insert.file) {
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
        } else if (insert.audio) {
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
        } else {

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
                } else {
                    if (item.attributes.bold && item.attributes.link) {
                        charFeatures.push({
                            start: str.length,
                            length: insert.length,
                            type: "linkBold",
                            link: item.attributes.link
                        })
                    } else if (item.attributes.bold) {
                        charFeatures.push({
                            start: str.length,
                            length: insert.length,
                            type: "bold"
                        })
                    } else if (item.attributes.link) {
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
            } else {
                if (insert.includes('\n')) {
                    var arr = insert.split('\n');
                    for (var i = 0; i < arr.length; i++) {
                        if (i === arr.length - 1) {
                            str = str + arr[i]
                        } else {
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
                } else {
                    str = str + insert;

                }
            }
        }

    });
    console.log(post)
    form.append('body', JSON.stringify(post))
    form.append('categoryId', $('#blogType').val())
    var input1 = $('#upload-photo')[0]
    const file1 = input1.files[0]
    form.append('cover', file1)


    $.ajax({
        type: "POST",
        url: "/event/edit",
        data: form,
        enctype: 'multipart/form-data',
        cache: false,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function () {
            Swal.fire({
                title: '',
                text: "پست با موفقیت ویرایش شد ",
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'تایید'
            }).then((result) => {
                if (result.value) {
                    location.href = '/event.html'
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


function parseDelta(post) {
    post.map((elem, index) => {
        let range = editor.getSelection(true);
        editor.format('align', 'right');
        if (elem.charFeatures.length === 0) {
            if (elem.content === '') {
                editor.insertText(range.index, '\n', Quill.sources.USER);
                editor.setSelection(range.index + 1, Quill.sources.SILENT);
            } else {
                if (elem.type === 'image') {
                    editor.insertEmbed(range.index, 'image', {
                        name: 'test',
                        url: elem.content
                    }, Quill.sources.USER);
                    editor.setSelection(range.index + 1, Quill.sources.SILENT);

                } else if (elem.type === 'text') {
                    editor.insertText(range.index, elem.content, Quill.sources.USER);
                    editor.insertText(range.index + elem.content.length, '\n', Quill.sources.USER);
                    editor.setSelection(range.index + elem.content.length + 1, Quill.sources.SILENT);
                } else if (elem.type === 'video') {
                    editor.insertEmbed(range.index, 'video', elem.content);
                    editor.setSelection(range.index + elem.content.length + 1, Quill.sources.SILENT);


                } else if (elem.type === 'right') {
                    editor.insertText(range.index, elem.content, Quill.sources.USER);
                    editor.insertText(range.index + elem.content.length, '\n', Quill.sources.USER);
                    editor.setSelection(range.index + elem.content.length + 1, Quill.sources.SILENT);
                } else if (elem.type === 'right/bullet') {
                    editor.insertText(range.index, elem.content, Quill.sources.USER);
                    editor.formatLine(1, 1, 'list', 'right/bullet');
                    editor.insertText(range.index + elem.content.length, '\n', Quill.sources.USER);
                    editor.setSelection(range.index + elem.content.length + 1, Quill.sources.SILENT);
                }
                else  {
                    editor.insertText(range.index, elem.content, Quill.sources.USER);
                    editor.insertText(range.index + elem.content.length, '\n', Quill.sources.USER);
                    editor.setSelection(range.index + elem.content.length + 1, Quill.sources.SILENT);

                }
            }
        } else {
            var features = elem.charFeatures;

            editor.insertText(range.index, elem.content, Quill.sources.USER);
            editor.insertText(range.index + elem.content.length, '\n', Quill.sources.USER);

            features.map((feature) => {
                var start = range.index + Number(feature.start);
                var end = Number(feature.length);
                if (feature.type === 'link') {
                    editor.formatText(start, end, 'link', feature.link);
                } else {
                    editor.formatText(start, end, 'bold', true);
                }
            });

            editor.setSelection(range.index + elem.content.length + 1, Quill.sources.SILENT);
        }
    });
    let range1 = editor.getSelection(true);
    editor.deleteText(range1.index - 1, 1);
    console.log(editor.getContents())
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

function uploadVideo() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();
    console.log('sdfsdf')

    // Listen upload local image and save to server
    input.onchange = () => {
        const file = input.files[0];

        // file type is only image.
        if (/^video\//.test(file.type)) {
            console.log('inji')
            videoSaveToServer(file);
        } else {
            console.warn('You could only upload images.');
        }
    };

}


function videoSaveToServer(file) {
    const fd = new FormData();
    fd.append('video', file);
    $.ajax({
        type: "POST",
        url: "/blog/upload/video",
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
            console.log(url)
            url = "https://www.api.boomiro.com/v1/stream/video/" + result.address;
            // this.prog = 0
            console.log("inje")
            let range = editor.getSelection(true);
            editor.insertText(range.index, '\n', Quill.sources.USER);
            editor.insertEmbed(range.index, 'video', url, Quill.sources.USER);
            editor.formatText(range.index + 1, 1, {height: '400', width: '400'});
            editor.setSelection(range.index + 1, Quill.sources.SILENT);
            $('#upload-photo-progress').prop('hidden', true)
            $('#upload-photo-progress div').css('width', 25 + '%')


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


//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', 'http://localhost:3001/blog/upload/video', true);
//     xhr.onload = () => {
//         console.log(xhr)
//         if (xhr.status === 200) {
//             // this is callback data: url
//             var url = JSON.parse(xhr.responseText);
//             console.log(url)
//             url = "https://localhost:3001/uploads/video/" + url.filename;
//             // this.prog = 0
//             console.log("inje")
//             let range = editor.getSelection(true);
//
//             editor.insertText(range.index, '\n', Quill.sources.USER);
//             editor.insertEmbed(range.index, 'video', url, Quill.sources.USER);
//             editor.formatText(range.index + 1, 1, {height: '400', width: '400'});
//             editor.setSelection(range.index + 1, Quill.sources.SILENT);
//             // $('#test').html('<source src="' + url + '" type="video/mp4">')
//         }
//     };
//     xhr.send(fd);
// }
}

function deleteBlog() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let id = url.searchParams.get("id").trim();
    Swal.fire({
        title: '',
        text: " آیا مطمن هستید که می خواهید  این پست را حذف کنید ؟",
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: 'لغو کردن',
        confirmButtonText: 'متوجه ام'
    }).then(function (result) {
        if (result.value) {
            let object = {}
            object.id = id
            $.ajax({
                type: "POST",
                url: "/blog/remove",
                data: object,
                success: function (result) {
                    Swal.fire({
                        title: '',
                        text: "پست با موفقیت حذف شد ",
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'تایید'
                    }).then((result) => {
                        if (result.value) {
                            location.href = '/blog.html'
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
            })


        }
    })
}


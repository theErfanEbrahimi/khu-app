"use strict";

// Class definition
var KTProjectsAdd = function () {
    // Base elements
    var formEl;
    var validator;
    var wizard;


    // Private functions
    var initWizard = function () {
        // Initialize form wizard
        wizard = new KTWizard('kt_projects_add', {
            startStep: 1, // initial active step number
            clickableSteps: true  // allow step clicking
        });

        // Validation before going to next page
        wizard.on('beforeNext', function (wizardObj) {
            if (validator.form() !== true) {
                wizardObj.stop();  // don't go to the next step
            }
        })

        // Change event
        wizard.on('change', function (wizard) {
            KTUtil.scrollTop();
        });
    }

    var initValidation = function () {
        validator = formEl.validate({
            // Validate only visible fields
            ignore: ":hidden",

            // Validation rules
            rules: {
                // Step 1
                name: {
                    required: true
                },
                description: {
                    required: true
                },
                numberDay: {
                    required: true
                },
                capacity: {
                    required: true

                },
                unitPrice: {
                    required: true
                },
                reductionPrice: {
                    required: true

                }



            },
            messages: {
                name: "پر کردن این بخش ضروری است",
                description: "پر کردن این بخش ضروری است"
                ,
                capacity:  "پر کردن این بخش ضروری است"
                ,
                roomNum: "پر کردن این بخش ضروری است"
                ,
                unitPrice: "پر کردن این بخش ضروری است",
                permission:  "پر کردن این بخش ضروری است",
                parking:"پر کردن این بخش ضروری است" ,
                reductionPrice:"پر کردن این بخش ضروری است" ,
                address: "پر کردن این بخش ضروری است" ,
                numberDay:"پر کردن این بخش ضروری است" ,
                permissionNumber: "پر کردن این بخش ضروری است" ,
                expireDate: "پر کردن این بخش ضروری است",
                gradeResidence:"پر کردن این بخش ضروری است"

            },


            // Display error
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();

                swal.fire({
                    "title": "",
                    "text": "لطفا فیلد های ناقص را پر کنید ",
                    "type": "error",
                    "buttonStyling": false,
                    "confirmButtonClass": "btn btn-brand btn-sm btn-bold",
                    "confirmButtonText": 'متوجه شدم '
                });
            },

            // Submit valid form
            submitHandler: function (form) {

            }
        });


    }







    return {
        // public functions
        init: function () {
            formEl = $('#kt_projects_add_form_tour');

            initWizard();
            initValidation();
            // initSubmit();
        }
    };
}();

jQuery(document).ready(function () {
    KTProjectsAdd.init();
});

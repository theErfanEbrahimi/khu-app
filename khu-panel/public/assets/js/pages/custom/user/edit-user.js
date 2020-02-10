"use strict";

// Class definition
var KTUserEdit = function () {
	// Base elements
	var avatar;
	var avatar1;
	var avatar2;
	var avatar3;
	var avatar4;
	var avatar5;



	var initUserForm = function() {
		avatar = new KTAvatar('kt_user_edit_avatar');
		avatar1 = new KTAvatar('kt_user_edit_avatar_1');
		avatar2 = new KTAvatar('kt_user_edit_avatar_2');
		avatar3 = new KTAvatar('kt_user_edit_avatar_3');
		avatar4 = new KTAvatar('kt_user_edit_avatar_4');
		avatar5 = new KTAvatar('kt_user_edit_avatar_5');

	}	

	return {
		// public functions
		init: function() {
			initUserForm(); 
		}
	};
}();

jQuery(document).ready(function() {	
	KTUserEdit.init();
});
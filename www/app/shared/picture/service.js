angular.module('app')
.factory('pictureService', pictureService);

pictureService.$inject = [
  '$cordovaCamera'
];
function pictureService($cordovaCamera) {
  return {
		original: function(){
			var options = {
				quality: 100,
			      destinationType: 0,
			      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			      allowEdit: false,
			      encodingType: Camera.EncodingType.JPEG,
			      popoverOptions: CameraPopoverOptions,
			      saveToPhotoAlbum: false,
				  	correctOrientation:true
			};
			return $cordovaCamera.getPicture(options);
		},
		custom: function(origin){
			origin = (!origin || origin > 2) ? 0 : origin;
			var options = {
				quality: 100,
				destinationType: 0,
				sourceType: origin,
				allowEdit: false,
				encodingType: Camera.EncodingType.JPEG,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false,
				correctOrientation:true
			};
			return $cordovaCamera.getPicture(options);
		}
	};
}

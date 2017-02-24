app.component('slider', {
	bindings: {
		imagesArr: '='
	},
	templateUrl: 'partials/slider.html',
	controller: function(){
		this.$onInit = function(){
			this.images = [];
			for (var i = 0; i < this.imagesArr.length; i++) {
				var imgObj = {};
				imgObj.src = this.imagesArr[i];
				imgObj.visible = false
				this.images.push(imgObj);
			}
		}
		

	}
})
app.component('hotel', {
	bindings: {
		hotelObj: '='
	},
	templateUrl: 'partials/hotel.html',
	controller: ['HotelSvc', '$state', function(HotelSvc, $state){
		this.$onInit = function(){
			var start = formatDate(this.hotelObj.date_start);
			var end = formatDate(this.hotelObj.date_end);
			this.hotel = this.hotelObj;
			this.hotel.date_start = start;
			this.hotel.date_end = end;
			this.sliderImages = [];
			for (var i = 0; i < this.hotel.images.length; i++) {
				var imgObj = {};
				imgObj.src = this.hotel.images[i];
				imgObj.visible = false
				this.sliderImages.push(imgObj);
			}
			this.sliderImages[0].visible = true;
		}
		var that = this;
		var formatDate = function(date) {
			var d = new Date(date);
			return d.toLocaleDateString('de-DE');
		}

		this.toggler = function(){
			var reviewFlag = false;
			var reviewWrapper = {
				class: ''
			}
			var toggler = {
				class: '',
				string: 'Show reviews'
			}
			var updateReviewWrapper = function(className) {
				reviewWrapper.class = className
			}

			var updateToggler = function(className, string) {
				toggler.class = className;
				toggler.string = string
			}
			var showReview = function(hotelId){
				if(!reviewFlag) {
					HotelSvc.getReview(hotelId).then(function(res){
						that.reviews = res.data;
						reviewFlag = true;
						updateReviewWrapper('b-hotel__reviews-wrapper--open');
						updateToggler('b-toggler--success', 'Close reviews')

					})
				} else {
					reviewFlag = false;
					updateReviewWrapper('');
					updateToggler('', 'Show reviews');
				}
			}
			return {
			 	showReview: showReview,
			 	reviewWrapper: reviewWrapper,
			 	toggler: toggler,
			 	reviewFlag: reviewFlag
			 }
		}()

		this.slides = function(){
			var slidePosition = 0;
			var move = function(){
				for (var i = 0; i < that.sliderImages.length; i++) {
					that.sliderImages[i].visible = false;
				}
				that.sliderImages[slidePosition].visible = true;
			}
			var moveRight = function(){
				if(slidePosition < that.sliderImages.length - 1) {
					slidePosition++
				} else {
					slidePosition = 0;
				}
				move();
			}
			var moveLeft = function(){
				if(slidePosition > 0) {
					slidePosition--;
				}
				move();
			}
			return {
				next: moveRight,
				prev: moveLeft
			}
		}();
	}]
})
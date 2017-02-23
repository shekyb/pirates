app.component('hotel', {
	bindings: {
		hotelObj: '='
	},
	templateUrl: 'partials/hotel.html',
	controller: function(HotelSvc, $state){
		var that = this;
		this.$onInit = function(){
			var start = formatDate(this.hotelObj.date_start);
			var end = formatDate(this.hotelObj.date_end);
			this.hotel = this.hotelObj;
			this.hotel.date_start = start;
			this.hotel.date_end = end;
			this.reviewFlag = false;
			this.toggleString = 'Show reviews'
		}
		var formatDate = function(date) {
			var d = new Date(date);
			return d.toLocaleDateString('de-DE');
		}

		this.toggleReview = function(hotelId) {
			if(!this.reviewFlag) {
				HotelSvc.getReview(hotelId).then(function(res){
					that.reviews = res.data;
					that.reviewFlag = true;
					that.toggleString = 'Close reviews'
				})
			} else {
				this.reviewFlag = false;
				this.toggleString = 'Show reviews';
			}
			
		}

	}
})
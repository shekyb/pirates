app.service('HotelSvc', ['$http', function($http){
	var svc = this;

	svc.getHotels = function() {
		return $http.get('http://fake-hotel-api.herokuapp.com/api/hotels?count=5').then(function(res){
			return res;
		}).catch(function(res){
			return res;
		});
	}

	svc.getReview = function(hotelId) {
		return $http.get('http://fake-hotel-api.herokuapp.com/api/reviews?hotel_id=' + hotelId);
	}
	
}])
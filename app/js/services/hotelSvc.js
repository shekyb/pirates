app.service('HotelSvc', ['$http', function($http){
	var svc = this;

	svc.getHotels = function() {
		return $http.get('http://fake-hotel-api.herokuapp.com/api/hotels?count=5&no_error=1');
	}

	svc.getReview = function(hotelId) {
		return $http.get('http://fake-hotel-api.herokuapp.com/api/reviews?hotel_id=' + hotelId);
	}
	
}])
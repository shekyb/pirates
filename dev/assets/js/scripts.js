var app = angular.module('app', ['ui.router', 'ConsoleLogger']).run(['PrintToConsole', function(PrintToConsole) {
    PrintToConsole.active = false;
}]);

app.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider){
	$stateProvider.state('home', {
		name: 'home',
		url: '/',
		templateUrl: 'partials/home.html',
		controller: function($scope, $state, HotelSvc){
			$scope.hotels;
			$scope.getHotels = function() {
				HotelSvc.getHotels().then(function(res){
					$scope.hotels = res.data;
					$state.go('home.hotels');
				});
				
			}
			
		}
	}).state('home.hotels', {
		name: 'home.hotels',
		template: '<hotel ng-repeat="hotel in hotels" hotel-obj="hotel"></hotel>',
		controller: function($scope){

		}
	})
	
	$locationProvider.html5Mode(true);
}])

//slider
//TODO adjust for multiples and end of slide
var d = document;
var wrap = d.querySelector('.b-image');
var items = d.querySelector('.b-image__wrapper');
var itemCount = d.querySelectorAll('.b-image__container').length;
var scroller = d.querySelector('.b-image__scroller');
var pos = 0;
//var transform = Modernizr.prefixed('transform');

function setTransform() {
  items.style.transform = 'translate3d(' + (-pos * items.offsetWidth) + 'px,0,0)';
}

function prev() {
  pos = Math.max(pos - 1, 0);
  setTransform();
}

function next() {
  pos = Math.min(pos + 1, itemCount - 1);
  setTransform();
}
angular.module("ConsoleLogger", [])
.factory("PrintToConsole", ["$rootScope", function ($rootScope) {
    var handler = { active: false };
    handler.toggle = function () { handler.active = !handler.active; };
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (handler.active) {
            console.log("$stateChangeStart --- event, toState, toParams, fromState, fromParams");
            console.log(arguments);
        };
    });
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        if (handler.active) {
            console.log("$stateChangeError --- event, toState, toParams, fromState, fromParams, error");
            console.log(arguments);
        };
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (handler.active) {
            console.log("$stateChangeSuccess --- event, toState, toParams, fromState, fromParams");
            console.log(arguments);
        };
    });
    $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
        if (handler.active) {
            console.log("$viewContentLoading --- event, viewConfig");
            console.log(arguments);
        };
    });
    $rootScope.$on('$viewContentLoaded', function (event) {
        if (handler.active) {
            console.log("$viewContentLoaded --- event");
            console.log(arguments);
        };
    });
    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
        if (handler.active) {
            console.log("$stateNotFound --- event, unfoundState, fromState, fromParams");
            console.log(arguments);
        };
    });
    return handler;
}]);
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
app.component('review', {
	bindings: {
		reviewObj: '='
	},
	templateUrl: 'partials/review.html',
	controller: function(){
		this.$onInit = function(){
			this.review = this.reviewObj;
		}
	}
})
app.service('HotelSvc', ['$http', function($http){
	var svc = this;

	svc.getHotels = function() {
		return $http.get('http://fake-hotel-api.herokuapp.com/api/hotels?count=5&no_error=1');
	}

	svc.getReview = function(hotelId) {
		return $http.get('http://fake-hotel-api.herokuapp.com/api/reviews?hotel_id=' + hotelId);
	}
	
}])
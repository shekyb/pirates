var app = angular.module('app', ['ui.router']);

app.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider){
	$stateProvider.state('home', {
		name: 'home',
		url: '/',
		templateUrl: 'partials/home.html',
		controller: function($scope, $state, HotelSvc){
			$scope.hotels;
			$scope.getHotels = function() {
				HotelSvc.getHotels().then(function(res){
					if(res.status !== 500) {
						$scope.hotels = res.data;
						$state.go('home.hotels');
					} else {
						$scope.error = res.data.error;
						$state.go('home.error')
					}
					
				});
				
			}
			$scope.toggler = function(){
				var togglerButton = {
					string: 'Load hotels',
					class: ''
				}
				var wrapper = {
					class: 'b-wrapper--half'
				}

				var background = {
					class: ''
				}
				var updateToggler = function(string, className){
					togglerButton.string = string;
					togglerButton.class = className;
				}
				var updateWrapper = function(className) {
					wrapper.class = className
				}
				var updateBackground = function(className){
					background.class = className;
				}
				var showHotels = function(){
					updateToggler('Loading', 'b-button--loading');
					HotelSvc.getHotels().then(function(res){
						if(res.status !== 500) {
							$scope.hotels = res.data;
							updateToggler('Load another set', 'b-button--success');
							updateWrapper('');
							updateBackground('b-background--gradient');
							$state.go('home.hotels');
						} else {
							$scope.error = res.data.error;
							updateWrapper('');
							updateToggler('Try again', 'b-button--error');
							updateBackground('b-background--gradient');
							$state.go('home.error')
						}
						
					});
				}
				return {
					getHotels: showHotels,
					togglerButton: togglerButton,
					wrapper: wrapper,
					background: background
				}
			}();
			
		}
	}).state('home.hotels', {
		name: 'home.hotels',
		template: '<hotel ng-repeat="hotel in hotels" hotel-obj="hotel"></hotel>',
		controller: function($scope){

		}
	}).state('home.error', {
		name: 'home.error',
		template: '<div class="b-error"><p class="b-error__text">{{error}}</p></div>',
		controller: function() {

		}
	})
	
	$locationProvider.html5Mode(true);
}])
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
		this.$onInit = function(){
			var start = formatDate(this.hotelObj.date_start);
			var end = formatDate(this.hotelObj.date_end);
			this.hotel = this.hotelObj;
			this.hotel.date_start = start;
			this.hotel.date_end = end;
			this.reviewFlag = false;
			this.toggleString = 'Show reviews';
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

		this.toggler = function(){
			var tg = this;
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
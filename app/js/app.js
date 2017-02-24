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
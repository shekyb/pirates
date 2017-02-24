var app = angular.module('app', ['ui.router']);

app.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider){
	//define states of the app
	$stateProvider.state('home', {
		name: 'home',
		url: '/',
		templateUrl: 'partials/home.html',
		controller: ['$scope', '$state', 'HotelSvc', function($scope, $state, HotelSvc){
			//declare empty hotels array and attach it to $scope
			$scope.hotels;
			/*
				@function toggler
				@description performs all updates needed when the load hotels button in the view is clicked
				@return object with public methods
			*/
			$scope.toggler = function(){
				//object for buttons string and class
				var togglerButton = {
					string: 'Load hotels',
					class: ''
				}
				//object for reviews wrapper class
				var wrapper = {
					class: 'b-wrapper--half'
				}
				//object for background class
				var background = {
					class: ''
				}
				/*
					@function updateToggler
					@params string - string for the button text
							className - name of the class that should be added to the button
					@description this function updates the togglerButton object with new values
				*/
				var updateToggler = function(string, className){
					togglerButton.string = string;
					togglerButton.class = className;
				}
				/*
					@function updateWrapper
					@params	className - name of the class that should be added to the reviews wrapper
					@description this function updates the wrapper object with new values for class property
				*/
				var updateWrapper = function(className) {
					wrapper.class = className
				}
				/*
					@function updateBackground
					@params	className - name of the class that should be added to the background
					@description this function updates the background object with new values for class property
				*/
				var updateBackground = function(className){
					background.class = className;
				}
				/*
					@function showHotels
					
					@description this function runs the HotelSvc.getHotels(), updates the elements in the view (button, wrapper and background) and moves to apropriate state depending on the response from the HotelSvc.
				*/
				var showHotels = function(){
					//before the call is made update button to loading state
					updateToggler('Loading', 'b-button--loading');
					//make the call
					HotelSvc.getHotels().then(function(res){
						//call is successfull and we got the data
						if(res.status !== 500) {
							//push the data to the hotels in scope
							$scope.hotels = res.data;
							//update view
							updateToggler('Load another set', 'b-button--success');
							updateWrapper('');
							updateBackground('b-background--gradient');
							//acitvate the home.hotels state
							$state.go('home.hotels');
						} else {
							//we got an error, so attach it to the error in scope
							$scope.error = res.data.error;
							//update the view
							updateWrapper('');
							updateToggler('Try again', 'b-button--error');
							updateBackground('b-background--gradient');
							//activate the home.error state
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
			
		}]
	}).state('home.hotels', {
		name: 'home.hotels',
		//hotel is a component in js/components
		template: '<hotel ng-repeat="hotel in hotels" hotel-obj="hotel"></hotel>'
	}).state('home.error', {
		name: 'home.error',
		template: '<div class="b-error"><p class="b-error__text">{{error}}</p></div>'
	})
	
	$locationProvider.html5Mode(true);
}])
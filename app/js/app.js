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
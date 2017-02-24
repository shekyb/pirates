app.component('hotel', {
	bindings: {
		hotelObj: '='
	},
	templateUrl: 'partials/hotel.html',
	controller: ['HotelSvc', '$state', function(HotelSvc, $state){
		this.$onInit = function(){
			//format start and end date of the offer to German locale string
			var start = formatDate(this.hotelObj.date_start);
			var end = formatDate(this.hotelObj.date_end);
			//attach hotelObj we got from binding to the hotel in the scope
			this.hotel = this.hotelObj;
			//override start and end dates with formated ones
			this.hotel.date_start = start;
			this.hotel.date_end = end;
			//create sliderImages array from the hotel object by creating an object for each, storing the url to src property and setting visible to false, and push the object to the sliderImages
			this.sliderImages = [];
			for (var i = 0; i < this.hotel.images.length; i++) {
				var imgObj = {};
				imgObj.src = this.hotel.images[i];
				imgObj.visible = false
				this.sliderImages.push(imgObj);
			}
			//set the first image of the sliderImages to true
			this.sliderImages[0].visible = true;
		}
		var that = this;
		/*
			@function formatDate
			@param	date - string, parsable by Date.parse()
			@return string
		*/
		var formatDate = function(date) {
			//create a new Date object with passed string
			var d = new Date(date);
			//return formated do German locale string
			return d.toLocaleDateString('de-DE');
		}
		/*
			@function toggler()
			@description	performs all updates needed when the show reviews button in the view is clicked
			@return			object with public methods
		*/
		this.toggler = function(){
			//flag for determinig if the review trey is open or not
			var reviewFlag = false;
			//object review wrapper class
			var reviewWrapper = {
				class: ''
			}
			//object for toglle button
			var toggler = {
				class: '',
				string: 'Show reviews'
			}
			/*
				@function updateReviewWrapper
				@param className - string, name of the class to be set as prop of reviewWrapper object
			*/
			var updateReviewWrapper = function(className) {
				reviewWrapper.class = className
			}
			/*
				@function updateToggler
				@param 	className - string, name of the class to be set as prop of toggler object
						string - string, string for the button text
			*/
			var updateToggler = function(className, string) {
				toggler.class = className;
				toggler.string = string;
			}
			/*
				@function showReview
				@param	hotelId - string, id of the hotel for which we are fetching the reviews
				@description	this function runs the HotelSvc.getReview(), updates the elements in the view (button, review wrapper) and sets the reviewFlag, when show reviews is clicked in the view
			*/
			var showReview = function(hotelId){
				//if review trey is closed
				if(!reviewFlag) {
					//fetch the reviews
					HotelSvc.getReview(hotelId).then(function(res){
						//assign responce to scope reviews
						that.reviews = res.data;
						//set the flag to true
						reviewFlag = true;
						//update view elements
						updateReviewWrapper('b-hotel__reviews-wrapper--open');
						updateToggler('b-toggler--success', 'Close reviews')

					})
				} else {
					//case for closing the review trey
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
		/* 
			@function slides
			@description	this funciton is responsible for moving trough slides of each hotel
			@return	object with public methods
		*/
		this.slides = function(){
			//set the slidePosition to 0
			var slidePosition = 0;
			/*
				@function 	move
				@description	first sets visible property of all images to false and then gets the slide image at the slidePosition index in the sliderImages array and sets visibility to true. in view images are shown based on this property
			*/
			var move = function(){
				for (var i = 0; i < that.sliderImages.length; i++) {
					that.sliderImages[i].visible = false;
				}
				that.sliderImages[slidePosition].visible = true;
			}
			/*
				@function moveRight()
				@description increments the slidePosition and calls move()
			*/
			var moveRight = function(){
				if(slidePosition < that.sliderImages.length - 1) {
					slidePosition++
				} else {
					slidePosition = 0;
				}
				move();
			}
			/*
				@function moveLeft()
				@description decrements the slidePosition and calls move()
			*/
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
app.component('review', {
	bindings: {
		reviewObj: '='
	},
	templateUrl: 'partials/review.html',
	controller: function(){
		this.$onInit = function(){
			//set the object we got from the binding to the review in scope
			this.review = this.reviewObj;
		}
	}
})
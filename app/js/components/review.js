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
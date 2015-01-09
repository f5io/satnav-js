(function() {

	window.onload = function() {
		// Satnav({
		// 	html5 : false,
		// 	force : true
		// })
		// 	.navigate({
		// 		path : '/?{filter}/?{page}',
		// 		directions : function(params) {
		// 			console.log('directions received');
		// 			console.log(params);
		// 		}
		// 	})
		// 	.change(function(params, old) {
		// 		console.log('change event heard');
		// 		setTimeout(function() {
		// 			Satnav.resolve();
		// 		}, 2000);
		// 		return this.defer;
		// 	})
		// 	.otherwise('/')
		// 	.go();
		Satnav({
			html5: true,
			matchAll: true
		})
		.change(function(hash) {
			console.log(hash);
		})
		.go();
	};

})();
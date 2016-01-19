'use strict';

module.exports = {

	randString: function(strlen){
		return Math.random().toString(36).substr(2,strlen);
	}

};
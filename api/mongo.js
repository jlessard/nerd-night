var MongoClient = require('mongodb').MongoClient,
		mubsub = require('mubsub'),
		Q = require('kew');

module.exports = function(){

	var connect = function(){
		var deferred = Q.defer();

		var url = 'mongodb://nerdnight:nerdnight@ds043262.mongolab.com:43262/nerdnight';
		// Use connect method to connect to the Server
		MongoClient.connect(url, function(err, db) {
		  if(err) deferred.reject(err);
		  else {
		  	console.log("Connected correctly to server");
		  	deferred.resolve(db);
		  }
		});

		return deferred.promise;
	};

	return {

		insert: function(collection, obj){
			var deferred = Q.defer();

			connect().then(function(db){
				db.collection(collection).insertOne(obj, function(err, result){
					db.close();
					if(err) deferred.reject(err);
					else deferred.resolve(result.ops[0]);
				});
			});

			return deferred.promise;
		},

		find: function(collection, obj){
			var deferred = Q.defer();

			if(!obj) obj = {};

			connect().then(function(db){
				db.collection(collection).find(obj)
				.toArray(function(err, docs){
					db.close();
					if(err) deferred.reject(err);
					else deferred.resolve(docs);
				});
			});

			return deferred.promise;
		},

		update: function(collection, obj, updateObj){
			var deferred = Q.defer();

			if(!obj) obj = {};

			console.log('updating coll', collection);
			connect().then(function(db){
				db.collection(collection).updateOne(obj, { $set: updateObj }, function(err, result){
					db.close();
					console.log('err', err);
					if(err) deferred.reject(err);
					else deferred.resolve(result);
				});
			});

			return deferred.promise;
		},

		push: function(collection, obj, updateObj){
			var deferred = Q.defer();

			if(!obj) obj = {};

			console.log('pushing', collection, obj, updateObj);
			connect().then(function(db){
				db.collection(collection).updateOne(obj, { $push: updateObj }, { upsert: true }, function(err, result){
					db.close();
					console.log('err', err);
					if(err) deferred.reject(err);
					else deferred.resolve(result);
				});
			});

			return deferred.promise;
		}

		// subscribe: function(collection, io, messageType){
		// 	var deferred = Q.defer();

		// 	connect().then(function(db){
		// 		console.log('subscribing to', collection);
		// 		db.collection(collection).find({}, {tailable:true, awaitdata:true, numberOfRetries:-1}).sort({ $natural: 1 }).each(function(err, doc) {
	 //        console.log('subscribe doc', collection, err);
	 //        console.log('sending to', doc.key, messageType);
	 //        // send message to client
	 //        io.to(doc.key).emit(messageType,doc);
	 //      })
		// 	});

		// 	return deferred.promise;
		// }
	
	}

};
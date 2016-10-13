var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var Favorites = require('../models/favorites');

var Verify    = require('./verify'); //require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')

.get(Verify.verifyOrdinaryUser,function (req, res, next) {

    Favorites.findOne({"postedBy":req.decoded._id})
	.populate('postedBy dishes')
        .exec(function (err, favorite) {
        	if (err) throw err;
        	res.json(favorite);
    	});

})

.post(Verify.verifyOrdinaryUser,function (req, res, next) {

	//We look for the favorite document that belong to the connected user
    Favorites.findOne({"postedBy": req.decoded._id}, function (err, favorite) {
		 if (err) throw err;

		// Favorite.findOne will find the favorites document of the connected user
		// if it doesn't exist then we must create it
		if(favorite == null){

			Favorites.create(req.body, function (err, favorite) {
        		if (err) throw err;
				favorite.postedBy = req.decoded._id;//_doc

				favorite.dishes.push(req.body._id);

        		favorite.save(function (err, favorite) {
            		if (err) throw err;
            			console.log('New favorites dish document created!');
						res.json(favorite);
        			});
        	});


		}else{


			if (favorite.dishes.indexOf(req.body._id) == -1){
				favorite.dishes.push(req.body._id);
			}
			//I don't add the dish if it already exists but I save anyway the document to update its dates
        	favorite.save(function (err, favorite) {
            	if (err) throw err;
            		console.log('Updated Favorites!');
            		res.json(favorite);
        		});
		}

    });
})

.delete(Verify.verifyOrdinaryUser,function (req, res, next) {
    Favorites.remove({"postedBy":req.decoded._id}, function (err, resp) {//req.decoded._doc._id
        if (err) throw err;
        res.json(resp);
    });
});



favoriteRouter.route('/:favoriteId')
.delete(Verify.verifyOrdinaryUser,function (req, res, next) {

    Favorites.findOne({"postedBy": req.decoded._id},function(err, favorite){

		if (err) throw err;

		if (favorite != null){

			var pos = favorite.dishes.indexOf(req.params.favoriteId);

			if(pos != -1 ){


				var ary = favorite.dishes.filter(function(i) {
					return i != req.params.favoriteId
				});
				favorite.dishes = ary;

				favorite.save(function (err, favorite) {
            			if (err) throw err;
            			console.log('Deleted Favorites!');
            			res.json(favorite);
        			});

			}else{

				res.json(favorite);
			}
		}
    })
})



module.exports = favoriteRouter;

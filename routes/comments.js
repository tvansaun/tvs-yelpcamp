const express    = require("express"),
	  router     = express.Router({mergeParams: true}),
	  Campground = require("../models/campground"),
	  Comment    = require("../models/comment"),
	  middleware = require("../middleware");

//NEW COMMENT
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(error, foundCamp){
		if(error){
			console.log(error);
		}
		else{
			res.render("comments/new", {campground: foundCamp});
		}
	});	
});

//CREATE COMMENT
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(error, foundCamp){
		if(error){
			req.flash("error", "Something went wrong");
			console.log(error);
		}
		else{
			Comment.create(req.body.comment, function(error, newComment){
				if(error){
					console.log(error);
				}
				else{
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					foundCamp.comments.push(newComment);
					foundCamp.save();
					req.flash("success", "Successfully Created Comment");
					res.redirect("/campgrounds/" + foundCamp._id);
				}
			});
			
		}
	});
});

//EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(error, foundComment){
		if(error){
			res.redirect("back");
		}
		else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});			
		}
	});
});


//UPDATE COMMENT
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
		if(error){
			res.redirect("back");
		}
		else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(error){
		if(error){
			res.redirect("back");
		}
		else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;
var Post       = require('../posts/postModel.js');
var Comment    = require('./commentModel.js');

module.exports = {

  getComments: function (request, response, next) {
    Comment.find({ 'post' : request.post._id }, function (err, lesComments) {
      if (err) {
        return response.send(err);
      }
      response.json(lesComments);
    });
  },

  getNumberOfComments: function (request, response, next) {
    Comment.find({ 'post': request.post._id },
      function (err, comments) {
        if (err) {
          return response.send(err);
        }
        response.json(comments.length);
    });
  },

  newComment: function (request, response, next) {
   var comment = new Comment(request.body);
   comment.post = request.post;
   comment.author = request.body.author;
   comment.body = request.body.body;
   comment.created = request.body.created;
   
   comment.save(function (err, comment) {
     if (err) { 
       return next(err);
     }
     // The request body contains a whole post ... ?
     request.post.comments.push(comment);

     request.post.save(function(err, post) {
       if (err) { 
         return next(err); 
       }

       response.json(comment);
     });
   });
 },

  deleteComment: function (request, response, next) {
    Comment.remove({
      _id: request.params.comment
    }, function (err, post) {
      if (err) {
        return response.send(err);
      }
      response.json({ message: 'Successfully deleted' });
    });
    },

  addToVotes: function (request, response, next) {
    console.log('req: ', request.body);
    Comment.findOne({
      _id: request.params.comment
    })
    .exec(function (err, foundComm) {
      if (err) {
        next(new Error(err)); 
      }
      console.log('foundComm: ',foundComm);
      console.log('votes: ', foundComm.votes);
      foundComm.votes.addToSet(request.body.user);
      foundComm.save();
      console.log('votes: ', foundComm.votes);
      response.status(202).send(foundComm.votes);
    });
    
  }
  // TODO
  //function ( request, response, next ) {
  //   var comment = new Post.comments.push(request.body);

  //   comment.save(function(err) {
  //     if (err) {
  //       return response.send(err);
  //     }

  //     response.send({ message: 'Post added!'});
  //   });
  // }
};

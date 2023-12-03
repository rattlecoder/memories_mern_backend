const PostMessage = require("../models/postMessage");
const mongoose = require("mongoose");

//fetch all posts
const getPosts = async (req, res) => {
      const {page} = req.query;
      try {
        const LIMIT = 6;
        const startIndex = (Number(page)-1)*LIMIT;  //get starting index of every page
        const total = await PostMessage.countDocuments({}); //total no of docments
        //getting newest post with limit while skipping other pages
        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        //console.log(Number(page));
        res.status(201).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT) });  
      } catch (error) {
        res.status(404).json({ message: error.message});
      }
};

//fetch post for a single Id
const getPost = async (req, res) => {
  const {id} = req.params;
  try {
    const post = await PostMessage.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error});
  }
};

//fetch posts by search
const getPostsBySearch = async (req, res) => {
    // query -> /posts/search?searchQuery=sq&tags=tg
    const {searchQuery,tags} = req.query;
    try {
        const title = new RegExp(searchQuery,'i');
        const posts = await PostMessage.find({ $or: [ {title}, {tags: { $in: tags.split(',') } } ] });
        //console.log(tags.split(','));
        res.json({data:posts});
    } catch (error) {
        console.log(error.message);
    }
}

//create a post
const createPost = async (req, res) => {
  //const {title,creator,message,tags,selectedFile} = req.body;
  const post = req.body;
  try {
    const newPost = await PostMessage.create({ ...post, creator: req.userId });
    res.status(201).json(newPost);  
  } catch (error) {
    res.status(404).json({ message: error.message});
  }
};

//update a post
const updatePost = async (req, res) => {
  const {id: _id} = req.params;
  const post = req.body;
  
  if(!mongoose.Types.ObjectId.isValid(_id)){
      res.status(404).send('No post with that id');
  }
  
  const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, { new: true } );
  res.json(updatedPost);
};

//delete a post
const deletePost = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(404).send('No post with that id');
    }

    await PostMessage.findByIdAndDelete(id);
    res.json({message:'Post deleted successfully'});
}

//like a post
const likePost = async (req, res) => {
  const { id } = req.params;

  if(!req.userId){
      return res.json({message: 'Unauthenticated'});
  }

  if(!mongoose.Types.ObjectId.isValid(id)){
    res.status(404).send('No post with that id');
  }

  const thePost = await PostMessage.findById(id);

  const ind = thePost.likes.findIndex((id) => id === String(req.userId));
  if(ind===-1){
      //like the post
      thePost.likes.push(String(req.userId));
  }
  else{
    //unlike the post
    thePost.likes = thePost.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, thePost,{new:true});
  res.json(updatedPost);
};

//comment on a post
const commentPost = async (req,res) => {
    const {id} = req.params;
    const {commentBody} = req.body;
    try {
        const post = await PostMessage.findById(id);
        post.comments.push(commentBody);
        const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new:true});
        res.json(updatedPost);
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
  getPosts,
  getPost,
  getPostsBySearch,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost
};

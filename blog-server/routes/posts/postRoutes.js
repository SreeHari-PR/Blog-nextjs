// src/routes/post.routes.js
const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postController');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/create', authMiddleware, postController.createPost);
router.get('/', postController.getPosts);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;
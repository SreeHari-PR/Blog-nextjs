// src/routes/post.routes.js
const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postController');
const authMiddleware = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadsMiddleware');

router.post('/create', authMiddleware, upload.single('image'), postController.createPost);
router.get('/', postController.getPosts);
router.put('/:id', authMiddleware, upload.single('image'), postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;
import { Request, Response } from 'express';
import { ForumPost, ForumReply } from '../models';

export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { title, content } = req.body;

    const post = await ForumPost.create({
      title,
      content,
      userId
    });

    await post.populate({
      path: 'userId',
      select: 'name email'
    });

    res.status(201).json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating post'
    });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await ForumPost.find()
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .sort({ createdAt: -1 });

    // Get replies for each post
    const postsWithReplies = await Promise.all(
      posts.map(async (post) => {
        const replies = await ForumReply.find({ postId: post._id })
          .populate({
            path: 'userId',
            select: 'name email'
          })
          .sort({ createdAt: 1 });
        
        return {
          ...post.toObject(),
          replies
        };
      })
    );

    res.json({
      status: 'success',
      data: { posts: postsWithReplies }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching posts'
    });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await ForumPost.findById(id)
      .populate({
        path: 'userId',
        select: 'name email'
      });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    const replies = await ForumReply.find({ postId: id })
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .sort({ createdAt: 1 });

    const postWithReplies = {
      ...post.toObject(),
      replies
    };

    res.json({
      status: 'success',
      data: { post: postWithReplies }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching post'
    });
  }
};

export const createReply = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { content } = req.body;

    const reply = await ForumReply.create({
      content,
      userId,
      postId: id
    });

    await reply.populate({
      path: 'userId',
      select: 'name email'
    });

    res.status(201).json({
      status: 'success',
      data: { reply }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating reply'
    });
  }
};

export const voteReply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'up' or 'down'

    const reply = await ForumReply.findById(id);

    if (!reply) {
      return res.status(404).json({
        status: 'error',
        message: 'Reply not found'
      });
    }

    if (voteType === 'up') {
      reply.upvotes += 1;
    } else if (voteType === 'down') {
      reply.downvotes += 1;
    }

    const updatedReply = await reply.save();

    res.json({
      status: 'success',
      data: { reply: updatedReply }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error voting on reply'
    });
  }
}; 
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserFriends = require('../models/UserFriends');
const { Op } = require('sequelize');

async function calculateFriendshipDistance(userId, targetId) {
    // Early exit if the user is looking for themselves
    if (userId === targetId) {
      return 0;
    }
  
    // Initialize the queue for BFS and the set of visited nodes
    let queue = [{ userId, distance: 0 }];
    let visited = new Set();
  
    while (queue.length > 0) {
      const current = queue.shift();
      const { userId: currentUserId, distance } = current;
  
      // Check if the current user has already been visited
      if (visited.has(currentUserId)) {
        continue;
      }
      visited.add(currentUserId);
  
      // Fetch the friends of the current user
      const friends = await UserFriends.findAll({
        where: {
          [Op.or]: [
            { user_id: currentUserId },
            { friend_id: currentUserId }
          ]
        }
      });
  
      // Iterate over the friends and check if the target is a friend
      for (let friend of friends) {
        const friendId = (friend.user_id === currentUserId) ? friend.friend_id : friend.user_id;
        
        if (friendId === targetId) {
          return distance + 1;
        }
  
        // Enqueue the friend for BFS if not visited
        if (!visited.has(friendId)) {
          queue.push({ userId: friendId, distance: distance + 1 });
        }
      }
    }
  
    // If no path is found, return -1 indicating no connection
    return -1;
}

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

router.get('/', async (req, res) => {
    console.log('Fetching all users');
  try {
    const users = await User.findAll();
    console.log('Fetched users:', users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.update(req.body, { where: { id: req.params.id } });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

router.post('/friends', async (req, res) => {
  try {
    const { user_id, friend_id } = req.body;

    // Ensure user_id and friend_id are provided and not the same
    if (!user_id || !friend_id || user_id === friend_id) {
      return res.status(400).json({ error: 'Invalid user IDs provided' });
    }

    // Check if both users exist
    const user = await User.findByPk(user_id);
    const friend = await User.findByPk(friend_id);
    if (!user || !friend) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    // Check if the friendship already exists to avoid duplicates
    const existingFriendship = await UserFriends.findOne({
      where: {
        user_id: user_id,
        friend_id: friend_id,
      },
    });
    
    if (existingFriendship) {
      return res.status(400).json({ error: 'Friendship already exists' });
    }

    // Create a new friendship record
    const newFriendship = await UserFriends.create({
      user_id: user_id,
      friend_id: friend_id,
      since: new Date(),
    });

    res.status(201).json({
      message: 'Friendship created successfully',
      friendship: newFriendship,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create friendship' });
  }
});

router.get('/friends/:userId/distance/:friendId', async (req, res) => {
    const { userId, friendId } = req.params;
  
    try {
      // Calculate the degree of separation using BFS
      const distance = await calculateFriendshipDistance(parseInt(userId), parseInt(friendId));
  
      if (distance === -1) {
        return res.status(404).json({ error: 'No connection found between these users' });
      }
  
      res.json({ distance });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

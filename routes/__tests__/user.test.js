const request = require('supertest');
const express = require('express');
const sequelize = require('../../config/db');
const User = require('../../models/User');
const UserFriends = require('../../models/UserFriends');
const userRoute = require('../../routes/user');

const app = express();
app.use(express.json());
app.use('/api', userRoute);

describe('UserFriends Model and Friend Distance API Tests', () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // Clear all data before each test to ensure isolation
    try {
        await UserFriends.destroy({ where: {} });
        await User.destroy({ where: {} });
    } catch (error) {
      console.error('Error clearing test data:', error);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('should create a friendship between two users', async () => {
    const user1 = await User.create({ name: 'Alice', email: 'alice@example.com' });
    const user2 = await User.create({ name: 'Bob', email: 'bob@example.com' });
    
    const friendship = await UserFriends.create({ user_id: user1.id, friend_id: user2.id });
    
    expect(friendship).toBeDefined();
    expect(friendship.user_id).toBe(user1.id);
    expect(friendship.friend_id).toBe(user2.id);
  });

  test('should calculate direct friend distance as 1', async () => {
    const user1 = await User.create({ name: 'Alice', email: 'alice@example.com' });
    const user2 = await User.create({ name: 'Bob', email: 'bob@example.com' });
    await UserFriends.create({ user_id: user1.id, friend_id: user2.id });

    const response = await request(app).get(`/api/friends/${user1.id}/distance/${user2.id}`);
    expect(response.status).toBe(200);
    expect(response.body.distance).toBe(1);
  });

  test('should calculate 2nd-degree friend distance as 2', async () => {
    const user1 = await User.create({ name: 'Alice', email: 'alice@example.com' });
    const user2 = await User.create({ name: 'Bob', email: 'bob@example.com' });
    const user3 = await User.create({ name: 'Charlie', email: 'charlie@example.com' });
    await UserFriends.create({ user_id: user1.id, friend_id: user2.id });
    await UserFriends.create({ user_id: user2.id, friend_id: user3.id });

    const response = await request(app).get(`/api/friends/${user1.id}/distance/${user3.id}`);
    expect(response.status).toBe(200);
    expect(response.body.distance).toBe(2);
  });

  test('should return 404 when no connection is found', async () => {
    const user1 = await User.create({ name: 'Alice', email: 'alice@example.com' });
    const user2 = await User.create({ name: 'Bob', email: 'bob@example.com' });
    const user3 = await User.create({ name: 'Charlie', email: 'charlie@example.com' });

    const response = await request(app).get(`/api/friends/${user1.id}/distance/${user3.id}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No connection found between these users');
  });
});

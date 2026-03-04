/**
 * Mock User Data
 * In production, this would come from an API with proper backend validation.
 */

export const mockUsers = [
  {
    id: '1',
    username: 'demouser',
    email: 'demo@example.com',
    password: 'Demo@12345', // Hashed in production
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

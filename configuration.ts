export default () => ({
    database: {
      adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
      adminPassword: process.env.ADMIN_PASSWORD || 'AdminPassword123!'
    }
  });
  
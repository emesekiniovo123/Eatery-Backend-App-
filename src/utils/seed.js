// require('dotenv').config();

// const mongoose = require('mongoose');
// const connectDB = require('../config/db');

// const User = require('../models/User');
// const Food = require('../models/Food');

// // =====================================
// // Prevent Production Seeding
// // =====================================
// if (process.env.NODE_ENV === 'production') {
//   console.error('❌ Seeding is disabled in production.');
//   process.exit(1);
// }

// // =====================================
// // Seed Database
// // =====================================
// const seedDatabase = async () => {
//   try {
//     if (!process.env.MONGO_URI) {
//       throw new Error('MONGO_URI is not defined.');
//     }

//     console.log('🔌 Connecting to database...');

//     await connectDB();

//     console.log('🗑 Clearing existing data...');

//     await Promise.all([
//       User.deleteMany({}),
//       Food.deleteMany({}),
//     ]);

//     console.log('👤 Creating users...');

//     const users = await User.create([
//       {
//         fullName: 'Admin User',
//         email: 'admin@eatery.com',
//         password: 'admin1234',
//         role: 'admin',
//         address: 'Head Office',
//       },
//       {
//         fullName: 'Customer User',
//         email: 'customer@eatery.com',
//         password: 'customer1234',
//         role: 'customer',
//         address: '123 Main Street',
//       },
//     ]);

//     const [admin, customer] = users;

//     console.log('🍔 Creating menu items...');

//     await Food.insertMany([
//       {
//         name: 'Classic Burger',
//         description: 'Juicy grilled beef burger with lettuce and tomato',
//         category: 'Burgers',
//         image: '/uploads/burger.jpg',
//         price: 12.5,
//         available: true,
//         ingredients: [
//           'beef',
//           'bun',
//           'lettuce',
//           'tomato',
//         ],
//         preparationTime: 15,
//         ratings: 4.7,
//       },
//       {
//         name: 'Veggie Pizza',
//         description: 'Fresh vegetables on a cheesy pizza base',
//         category: 'Pizza',
//         image: '/uploads/pizza.jpg',
//         price: 14,
//         available: true,
//         ingredients: [
//           'cheese',
//           'tomato',
//           'bell pepper',
//           'onion',
//         ],
//         preparationTime: 20,
//         ratings: 4.5,
//       },
//       {
//         name: 'Chicken Shawarma',
//         description: 'Grilled chicken wrapped with fresh vegetables',
//         category: 'Wraps',
//         image: '/uploads/shawarma.jpg',
//         price: 9.99,
//         available: true,
//         ingredients: [
//           'chicken',
//           'tortilla',
//           'lettuce',
//           'tomato',
//           'onion',
//         ],
//         preparationTime: 12,
//         ratings: 4.8,
//       },
//       {
//         name: 'Fried Rice',
//         description: 'Nigerian-style fried rice with chicken',
//         category: 'Rice',
//         image: '/uploads/fried-rice.jpg',
//         price: 11.5,
//         available: true,
//         ingredients: [
//           'rice',
//           'carrots',
//           'peas',
//           'chicken',
//         ],
//         preparationTime: 18,
//         ratings: 4.6,
//       },
//     ]);

//     console.log('\n✅ Database seeded successfully!\n');

//     console.table([
//       {
//         Role: 'Admin',
//         Email: admin.email,
//         Password: 'admin1234',
//       },
//       {
//         Role: 'Customer',
//         Email: customer.email,
//         Password: 'customer1234',
//       },
//     ]);
//   } catch (error) {
//     console.error('\n❌ Database seeding failed.\n');
//     console.error(error);
//     process.exitCode = 1;
//   } finally {
//     await mongoose.connection.close();
//     console.log('\n Database connection closed.\n');
//   }
// };

// // =====================================
// // Run Seeder
// // =====================================
// seedDatabase();





// ...existing code...
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Food = require('../models/Food');

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined.');
    }

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured.');
    }

    console.log('🔌 Connecting to database...');
    await connectDB();

    console.log('🗑 Clearing existing data...');
    await Promise.all([User.deleteMany({}), Food.deleteMany({})]);

    console.log('👤 Creating users...');
    const users = await User.create([
      {
        fullName: 'Admin User',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        address: 'Head Office',
      },
      {
        fullName: 'Customer User',
        email: 'customer@eatery.com',
        password: 'customer1234',
        role: 'customer',
        address: '123 Main Street',
      },
    ]);

    const [admin, customer] = users;

    console.log('🍔 Creating menu items...');
    await Food.insertMany([
      {
        name: 'Classic Burger',
        description: 'Juicy grilled beef burger with lettuce and tomato',
        category: 'Burgers',
        image: '/uploads/burger.jpg',
        price: 12.5,
        available: true,
        ingredients: ['beef', 'bun', 'lettuce', 'tomato'],
        preparationTime: 15,
        ratings: 4.7,
      },
      {
        name: 'Veggie Pizza',
        description: 'Fresh vegetables on a cheesy pizza base',
        category: 'Pizza',
        image: '/uploads/pizza.jpg',
        price: 14,
        available: true,
        ingredients: ['cheese', 'tomato', 'bell pepper', 'onion'],
        preparationTime: 20,
        ratings: 4.5,
      },
      {
        name: 'Chicken Shawarma',
        description: 'Grilled chicken wrapped with fresh vegetables',
        category: 'Wraps',
        image: '/uploads/shawarma.jpg',
        price: 9.99,
        available: true,
        ingredients: ['chicken', 'tortilla', 'lettuce', 'tomato', 'onion'],
        preparationTime: 12,
        ratings: 4.8,
      },
      {
        name: 'Fried Rice',
        description: 'Nigerian-style fried rice with chicken',
        category: 'Rice',
        image: '/uploads/fried-rice.jpg',
        price: 11.5,
        available: true,
        ingredients: ['rice', 'carrots', 'peas', 'chicken'],
        preparationTime: 18,
        ratings: 4.6,
      },
      {
        name: 'Jollof Rice',
        description: 'Flavorful Nigerian jollof rice with tomato and spices',
        category: 'Rice',
        image: '/uploads/jollof-rice.jpg',
        price: 13.5,
        available: true,
        ingredients: ['rice', 'tomato', 'pepper', 'onion', 'chicken'],
        preparationTime: 20,
        ratings: 4.9,
      },
      {
        name: 'Egusi Soup',
        description: 'Traditional Nigerian melon soup served with swallows',
        category: 'Soup',
        image: '/uploads/egusi-soup.jpg',
        price: 15,
        available: true,
        ingredients: ['egusi', 'spinach', 'meat', 'stock'],
        preparationTime: 25,
        ratings: 4.8,
      },
      {
        name: 'Amala',
        description: 'Soft amala served with ewedu and gbegiri',
        category: 'Swallow',
        image: '/uploads/amala.jpg',
        price: 10,
        available: true,
        ingredients: ['yam flour', 'ewedu', 'gbegiri'],
        preparationTime: 15,
        ratings: 4.7,
      },
      {
        name: 'Suya',
        description: 'Spiced grilled meat skewer from Nigerian street food',
        category: 'Grill',
        image: '/uploads/suya.jpg',
        price: 14.5,
        available: true,
        ingredients: ['beef', 'spices', 'pepper'],
        preparationTime: 18,
        ratings: 4.9,
      },
      {
        name: 'Moi Moi',
        description: 'Steamed bean pudding with peppers and onions',
        category: 'Beans',
        image: '/uploads/moi-moi.jpg',
        price: 8.5,
        available: true,
        ingredients: ['beans', 'pepper', 'onion', 'egg'],
        preparationTime: 12,
        ratings: 4.6,
      },
      {
        name: 'Poundo Yam',
        description: 'Smooth pounded yam served with soup',
        category: 'Swallow',
        image: '/uploads/poundo-yam.jpg',
        price: 9.5,
        available: true,
        ingredients: ['yam', 'hot water'],
        preparationTime: 10,
        ratings: 4.7,
      },
      {
        name: 'Eba',
        description: 'Cassava dough meal perfect with soups and stews',
        category: 'Swallow',
        image: '/uploads/eba.jpg',
        price: 8,
        available: true,
        ingredients: ['cassava flour', 'hot water'],
        preparationTime: 8,
        ratings: 4.5,
      },
      {
        name: 'Pepper Soup',
        description: 'Spicy Nigerian pepper soup made with meat or fish',
        category: 'Soup',
        image: '/uploads/pepper-soup.jpg',
        price: 12,
        available: true,
        ingredients: ['meat', 'pepper', 'spices', 'stock'],
        preparationTime: 16,
        ratings: 4.8,
      },
      {
        name: 'Plantain',
        description: 'Fried ripe plantain served as a popular side dish',
        category: 'Side',
        image: '/uploads/plantain.jpg',
        price: 7,
        available: true,
        ingredients: ['plantain', 'oil', 'salt'],
        preparationTime: 9,
        ratings: 4.6,
      },
      {
        name: 'Akara',
        description: 'Crispy bean fritters traditionally enjoyed as a snack',
        category: 'Snack',
        image: '/uploads/akara.jpg',
        price: 6.5,
        available: true,
        ingredients: ['beans', 'onion', 'pepper'],
        preparationTime: 11,
        ratings: 4.5,
      },
    ]);

    console.log('\n✅ Database seeded successfully!\n');
    console.table([
      { Role: 'Admin', Email: admin.email },
      { Role: 'Customer', Email: customer.email },
    ]);

    return 0;
  } catch (error) {
    console.error('\n❌ Database seeding failed.\n', error);
    return 1;
  } finally {
    try {
      if (mongoose.connection && mongoose.connection.readyState) {
        await mongoose.connection.close();
        console.log('\n🔒 Database connection closed.\n');
      }
    } catch (e) {
      console.warn('Failed to close DB connection:', e.message);
    }
  }
};

// Run only when executed directly (do not run on require)
if (require.main === module) {
  if (['production', 'prod'].includes((process.env.NODE_ENV || '').toLowerCase())) {
    console.error('❌ Seeding is disabled in production.');
    process.exit(1);
  }

  (async () => {
    const code = await seedDatabase();
    process.exitCode = code;
    process.exit(process.exitCode);
  })();
}

module.exports = { seedDatabase };
// ...existing code...

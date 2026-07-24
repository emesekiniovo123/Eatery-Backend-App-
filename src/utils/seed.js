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

    console.log('🔌 Connecting to database...');
    await connectDB();

    console.log('🗑 Clearing existing data...');
    await Promise.all([User.deleteMany({}), Food.deleteMany({})]);

    console.log('👤 Creating users...');
    const users = await User.create([
      {
        fullName: 'Admin User',
        email: 'admin@eatery.com',
        password: 'admin1234',
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
    ]);

    console.log('\n✅ Database seeded successfully!\n');
    console.table([
      { Role: 'Admin', Email: admin.email, Password: 'admin1234' },
      { Role: 'Customer', Email: customer.email, Password: 'customer1234' },
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
  if (process.env.NODE_ENV === 'production') {
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

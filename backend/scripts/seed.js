require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Lead = require('../src/models/Lead');
const connectDB = require('../src/config/db');

const stages = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
const statuses = ['Active', 'Inactive', 'Pending'];

const generateLeads = (count) => {
    const leads = [];

    for (let i = 0; i < count; i++) {
        // Distribute leads across days 01 to 13 of the current month
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = (i % 13) + 1; // Days 1 to 13
        const hour = Math.floor(Math.random() * 24);
        const minute = Math.floor(Math.random() * 60);
        const second = Math.floor(Math.random() * 60);

        const createdDate = new Date(year, month, day, hour, minute, second);


        leads.push({
            name: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            phone: faker.phone.number(),
            company: faker.company.name(),
            stage: faker.helpers.arrayElement(stages),
            status: faker.helpers.arrayElement(statuses),
            notes: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.6 }) || '',
            createdAt: createdDate
        });
    }


    return leads;
};

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('Clearing existing leads...');
        await Lead.deleteMany({});

        const leadCount = 750; // Generate 750 leads
        console.log(`Generating ${leadCount} dummy leads...`);
        const leads = generateLeads(leadCount);

        console.log('Inserting leads into database...');
        await Lead.insertMany(leads);

        console.log(`✓ Successfully seeded ${leadCount} leads!`);

        // Show statistics
        const stats = await Lead.aggregate([
            {
                $group: {
                    _id: '$stage',
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('\nLeads by stage:');
        stats.forEach(stat => {
            console.log(`  ${stat._id}: ${stat.count}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();

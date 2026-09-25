const initialData = require('./initialData');
const bcrypt = require('bcryptjs');

// Hash password for default users
const hashedPassword = bcrypt.hashSync('password123', 10);

const defaultUsers = [
    {
        _id: 'user_admin_001',
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@cosmeticsshop.com',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '00000000',
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: 'user_client_002',
        firstName: 'Client',
        lastName: 'Nature',
        email: 'client@cosmeticsshop.com',
        password: hashedPassword,
        role: 'CUSTOMER',
        phone: '12345678',
        addresses: [{
            type: 'Domicile',
            street: '123 Avenue Habib Bourguiba',
            city: 'Tunis',
            postalCode: '1000',
            isDefault: true
        }],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

class InMemoryStore {
    constructor() {
        this.products = JSON.parse(JSON.stringify(initialData.allProducts));
        this.categories = JSON.parse(JSON.stringify(initialData.categories));
        this.brands = JSON.parse(JSON.stringify(initialData.brands));
        this.packs = JSON.parse(JSON.stringify(initialData.packs));
        this.stores = JSON.parse(JSON.stringify(initialData.stores));
        this.advertisements = JSON.parse(JSON.stringify(initialData.initialAdvertisements));
        this.promotions = JSON.parse(JSON.stringify(initialData.promotions));
        this.offersConfig = JSON.parse(JSON.stringify(initialData.offersConfig));
        this.blogPosts = JSON.parse(JSON.stringify(initialData.blogPosts));
        this.users = [...defaultUsers];
        this.orders = [];
        this.contactMessages = [];
        this.reviews = [];
        this.chats = [];
    }

    findUserByEmail(email) {
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    findUserById(id) {
        return this.users.find(u => String(u._id) === String(id));
    }

    addUser(userData) {
        const newUser = {
            _id: `user_${Date.now()}`,
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.users.push(newUser);
        return newUser;
    }
}

const inMemoryStore = new InMemoryStore();

module.exports = inMemoryStore;

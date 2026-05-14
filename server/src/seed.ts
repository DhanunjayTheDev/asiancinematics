import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from './config';
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';
import Service from './models/Service';
import Order from './models/Order';
import Inquiry from './models/Inquiry';
import SiteVisit from './models/SiteVisit';
import Address from './models/Address';
import ServiceTicket from './models/ServiceTicket';
import { logger } from './utils/logger';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri);
    logger.info('Connected to MongoDB for seeding');

    // Optional: Clear existing data (uncomment if you want fresh data each time)
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Service.deleteMany({});
    await Order.deleteMany({});
    await Inquiry.deleteMany({});
    await SiteVisit.deleteMany({});
    await Address.deleteMany({});
    await ServiceTicket.deleteMany({});
    logger.info('Cleared existing data');

    // Seed Users
    const hashedPassword = await bcrypt.hash('Test@123456', 12);

    const users = await User.insertMany(
      [
        {
          name: 'Praveen Kumar Yougi',
          email: 'admin@pravaraworldtech.com',
          phone: '9849697886',
          password: hashedPassword,
          role: 'super_admin',
          isActive: true,
        },
        {
          name: 'Support Staff',
          email: 'support@pravaraworldtech.com',
          phone: '9966167886',
          password: hashedPassword,
          role: 'support',
          isActive: true,
        },
        {
          name: 'Rajesh Kumar',
          email: 'customer1@example.com',
          phone: '9876543212',
          password: hashedPassword,
          role: 'customer',
          isActive: true,
        },
        {
          name: 'Priya Sharma',
          email: 'customer2@example.com',
          phone: '9876543213',
          password: hashedPassword,
          role: 'customer',
          isActive: true,
        },
        {
          name: 'Arjun Field Tech',
          email: 'freelancer1@example.com',
          phone: '9876543214',
          password: hashedPassword,
          role: 'freelancer',
          isActive: true,
        },
        {
          name: 'Rahul Technician',
          email: 'employee@pravaraworldtech.com',
          phone: '9951114381',
          password: hashedPassword,
          role: 'employee',
          isActive: true,
        },
        {
          name: 'Suresh Nair',
          email: 'customer3@example.com',
          phone: '9876543216',
          password: hashedPassword,
          role: 'customer',
          isActive: true,
        },
        {
          name: 'Venkat Field Tech',
          email: 'freelancer2@example.com',
          phone: '8143550515',
          password: hashedPassword,
          role: 'freelancer',
          isActive: true,
        },
      ]
    );
    logger.info(`✓ Seeded ${users.length} users`);

    // Seed Categories
    const categories = await Category.insertMany([
      {
        name: 'Home Theatre & AV',
        slug: 'home-theatre',
        description: 'Premium home cinema systems, AV receivers, projectors, and acoustic solutions',
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Decoratives & Stretch Ceiling',
        slug: 'decoratives',
        description: 'Stretch ceiling systems, star ceilings, and premium interior decorative solutions',
        sortOrder: 2,
        isActive: true,
      },
      {
        name: 'Epoxy Flooring',
        slug: 'epoxy',
        description: 'High-durability 3D epoxy and metallic epoxy flooring for residential and commercial spaces',
        sortOrder: 3,
        isActive: true,
      },
      {
        name: 'Smart Home & Automation',
        slug: 'home-automation',
        description: 'Smart home automation, IoT devices, smart lighting, and climate control',
        sortOrder: 4,
        isActive: true,
      },
      {
        name: 'Security & CCTV',
        slug: 'security',
        description: 'IP CCTV cameras, NVR systems, access control, and alarm systems',
        sortOrder: 5,
        isActive: true,
      },
      {
        name: 'Networking',
        slug: 'networking',
        description: 'Structured cabling, Wi-Fi solutions, network switches, and fiber optics',
        sortOrder: 6,
        isActive: true,
      },
      {
        name: 'Lighting Solutions',
        slug: 'lighting',
        description: 'Architectural LED lighting, ambient lighting, and smart lighting systems',
        sortOrder: 7,
        isActive: true,
      },
      {
        name: 'Tensile & Structural',
        slug: 'tensile-structural',
        description: 'Tensile fabric structures, carport shades, amphitheatre canopies, and architectural facades',
        sortOrder: 8,
        isActive: true,
      },
    ]);
    logger.info(`✓ Seeded ${categories.length} categories`);

    // Seed Products
    const products = await Product.insertMany([
      {
        name: 'Yamaha RX-V6A AV Receiver',
        slug: 'yamaha-rx-v6a-av-receiver',
        description: 'Yamaha 7.2-channel AV receiver with Dolby Atmos, DTS:X, 8K HDMI, and MusicCast multi-room audio. Perfect for home theatre setup.',
        shortDescription: '7.2ch Dolby Atmos AV Receiver',
        price: 62000,
        comparePrice: 72000,
        category: categories[0]._id,
        stock: 8,
        sku: 'YAM-RXV6A-001',
        isActive: true,
        isFeatured: true,
        tags: ['yamaha', 'av receiver', 'dolby atmos', 'home theatre'],
        specifications: {
          channels: '7.2',
          power: '100W per channel',
          hdmi: '8K/60Hz',
          formats: 'Dolby Atmos, DTS:X',
        },
      },
      {
        name: 'Epson EH-TW7100 4K Projector',
        slug: 'epson-eh-tw7100-4k-projector',
        description: 'Epson 4K PRO-UHD laser projector with 3000 lumens brightness, HDR10, and 100,000 hours lamp life. Ideal for dedicated home theatres.',
        shortDescription: '4K PRO-UHD Home Theatre Projector',
        price: 145000,
        comparePrice: 165000,
        category: categories[0]._id,
        stock: 5,
        sku: 'EPS-TW7100-001',
        isActive: true,
        isFeatured: true,
        tags: ['epson', '4k projector', 'laser', 'home theatre'],
        specifications: {
          resolution: '4K PRO-UHD',
          brightness: '3000 lumens',
          contrast: '1,200,000:1',
          lampLife: '100,000 hours',
        },
      },
      {
        name: 'Hikvision DS-2CD2143G2 4MP IP Camera',
        slug: 'hikvision-4mp-ip-camera',
        description: 'Hikvision 4MP AcuSense fixed dome IP camera with IR 40m, H.265+, and deep learning-based false alarm reduction.',
        shortDescription: '4MP AcuSense Dome IP Camera',
        price: 3800,
        comparePrice: 4500,
        category: categories[4]._id,
        stock: 50,
        sku: 'HIK-2CD2143-001',
        isActive: true,
        isFeatured: false,
        tags: ['hikvision', 'ip camera', 'cctv', '4mp', 'dome'],
        specifications: {
          resolution: '4MP (2560×1440)',
          irRange: '40m',
          codec: 'H.265+/H.265',
          features: 'AcuSense, Deep Learning',
        },
      },
      {
        name: 'Lutron Caseta Smart Dimmer Kit',
        slug: 'lutron-caseta-smart-dimmer',
        description: 'Lutron Caseta wireless smart dimmer starter kit with SmartBridge Pro, 2 dimmers, and Pico remote. Works with Alexa, Google, Apple HomeKit.',
        shortDescription: 'Smart Home Dimmer Starter Kit',
        price: 18500,
        comparePrice: 22000,
        category: categories[3]._id,
        stock: 15,
        sku: 'LUT-CASETA-KIT-001',
        isActive: true,
        isFeatured: true,
        tags: ['lutron', 'smart dimmer', 'home automation', 'smart lighting'],
        specifications: {
          protocol: 'ClearConnect RF',
          compatibility: 'Alexa, Google, HomeKit',
          includes: 'SmartBridge Pro + 2 Dimmers + Pico Remote',
        },
      },
      {
        name: 'Ubiquiti UniFi AP-6-Pro Wi-Fi 6 Access Point',
        slug: 'ubiquiti-unifi-ap6-pro',
        description: 'Ubiquiti UniFi 6 Pro Wi-Fi 6 access point with 2.4/5 GHz, 4x4 MU-MIMO, and up to 300 connected clients. Enterprise-grade for homes and offices.',
        shortDescription: 'WiFi 6 Enterprise Access Point',
        price: 14500,
        comparePrice: 17000,
        category: categories[5]._id,
        stock: 20,
        sku: 'UBI-UAP6PRO-001',
        isActive: true,
        isFeatured: false,
        tags: ['ubiquiti', 'wifi 6', 'access point', 'networking'],
        specifications: {
          standard: '802.11ax (Wi-Fi 6)',
          bands: 'Dual Band 2.4/5 GHz',
          maxClients: '300+',
          poe: 'PoE+ required',
        },
      },
      {
        name: 'Acoustic Panel Set – 12 Pieces',
        slug: 'acoustic-panel-set-12',
        description: 'Premium high-density fibre acoustic panels in fabric finish for home theatre rooms, recording studios, and media rooms. Set of 12 panels (600x600mm).',
        shortDescription: 'Premium Acoustic Wall Panels Set of 12',
        price: 8500,
        comparePrice: 11000,
        category: categories[0]._id,
        stock: 30,
        sku: 'ACOU-PANEL-12-001',
        isActive: true,
        isFeatured: false,
        tags: ['acoustic panels', 'soundproofing', 'home theatre', 'recording studio'],
        specifications: {
          size: '600 x 600 x 50mm',
          material: 'High-density fibre + fabric',
          nrc: '0.85 NRC rating',
          quantity: '12 panels per set',
        },
      },
    ]);
    logger.info(`✓ Seeded ${products.length} products`);

    // Seed Services
    const services = await Service.insertMany([
      {
        name: 'Home Theatre Design & Installation',
        slug: 'home-theatre-installation',
        description: 'Complete turnkey home theatre design and installation including acoustic treatment, projector/screen setup, AV calibration, and ambient lighting.',
        shortDescription: 'Turnkey home theatre design & install',
        price: 150000,
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Stretch Ceiling & Star Ceiling Installation',
        slug: 'stretch-ceiling-installation',
        description: 'Professional stretch ceiling and fibre optic star ceiling installation with LED effects, custom designs, and premium finishes.',
        shortDescription: 'Stretch & star ceiling installation',
        price: 45000,
        sortOrder: 2,
        isActive: true,
      },
      {
        name: 'Epoxy Flooring Service',
        slug: 'epoxy-flooring-service',
        description: 'Premium 3D metallic epoxy flooring service for homes and commercial spaces. Includes surface preparation, design consultation, and application.',
        shortDescription: 'Professional epoxy flooring installation',
        price: 120,
        sortOrder: 3,
        isActive: true,
      },
      {
        name: 'Smart Home Automation Setup',
        slug: 'smart-home-automation-setup',
        description: 'End-to-end smart home setup including smart lighting, climate control, security integration, and voice assistant configuration.',
        shortDescription: 'Complete smart home automation',
        price: 80000,
        sortOrder: 4,
        isActive: true,
      },
      {
        name: 'CCTV & Security System Installation',
        slug: 'cctv-security-installation',
        description: 'Professional installation of IP CCTV systems, access control, alarm systems, and remote monitoring setup for homes and businesses.',
        shortDescription: 'CCTV & security systems installation',
        price: 25000,
        sortOrder: 5,
        isActive: true,
      },
      {
        name: 'Tensile Structure Design & Installation',
        slug: 'tensile-structure-installation',
        description: 'Custom tensile fabric structure design and installation including structural engineering, fabric selection, and site installation.',
        shortDescription: 'Tensile structure design & install',
        price: 200000,
        sortOrder: 6,
        isActive: true,
      },
      {
        name: 'Annual Maintenance Contract (AMC)',
        slug: 'annual-maintenance-contract',
        description: 'Comprehensive annual maintenance contract covering all installed systems AV, smart home, security, and networking.',
        shortDescription: 'Annual maintenance for all systems',
        price: 18000,
        sortOrder: 7,
        isActive: true,
      },
    ]);
    logger.info(`✓ Seeded ${services.length} services`);

    // Seed Addresses
    const addresses = await Address.insertMany([
      {
        user: users[2]._id,
        label: 'Home',
        fullName: 'Rajesh Kumar',
        phone: '9876543212',
        addressLine1: '12-3-456, Jubilee Hills',
        addressLine2: 'Road No. 45',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        country: 'India',
        isDefault: true,
      },
      {
        user: users[3]._id,
        label: 'Office',
        fullName: 'Priya Sharma',
        phone: '9876543213',
        addressLine1: '8-2-293, Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        country: 'India',
        isDefault: true,
      },
    ]);
    logger.info(`✓ Seeded ${addresses.length} addresses`);

    // Seed Orders (with varied statuses and dates for charts)
    const pastDate = (daysAgo: number) => {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      return d;
    };

    const orders = await Order.insertMany([
      {
        orderNumber: 'ORD-2026-001',
        user: users[2]._id,
        items: [
          { product: products[0]._id, name: products[0].name, price: products[0].price, quantity: 1 },
          { product: products[5]._id, name: products[5].name, price: products[5].price, quantity: 2 },
        ],
        shippingAddress: { fullName: 'Rajesh Kumar', phone: '9876543212', addressLine1: '12-3-456, Jubilee Hills', addressLine2: 'Road No. 45', city: 'Hyderabad', state: 'Telangana', pincode: '500033', country: 'India' },
        subtotal: 79000, shippingCost: 500, tax: 14220, totalAmount: 93720,
        status: 'pending', paymentMethod: 'COD', paymentStatus: 'pending',
        assignedTo: users[1]._id,
        createdAt: pastDate(2),
      },
      {
        orderNumber: 'ORD-2026-002',
        user: users[3]._id,
        items: [
          { product: products[3]._id, name: products[3].name, price: products[3].price, quantity: 1 },
        ],
        shippingAddress: { fullName: 'Priya Sharma', phone: '9876543213', addressLine1: '8-2-293, Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034', country: 'India' },
        subtotal: 18500, shippingCost: 0, tax: 3330, totalAmount: 21830,
        status: 'confirmed', paymentMethod: 'online', paymentStatus: 'paid', paymentId: 'PAY-2026-001',
        createdAt: pastDate(5),
      },
      {
        orderNumber: 'ORD-2026-003',
        user: users[6]._id,
        items: [
          { product: products[1]._id, name: products[1].name, price: products[1].price, quantity: 1 },
          { product: products[4]._id, name: products[4].name, price: products[4].price, quantity: 2 },
        ],
        shippingAddress: { fullName: 'Suresh Nair', phone: '9876543216', addressLine1: '3rd Floor, DLF Building, Gachibowli', city: 'Hyderabad', state: 'Telangana', pincode: '500032', country: 'India' },
        subtotal: 174000, shippingCost: 0, tax: 31320, totalAmount: 205320,
        status: 'delivered', paymentMethod: 'online', paymentStatus: 'paid', paymentId: 'PAY-2026-002',
        createdAt: pastDate(15),
      },
      {
        orderNumber: 'ORD-2026-004',
        user: users[2]._id,
        items: [
          { product: products[2]._id, name: products[2].name, price: products[2].price, quantity: 4 },
        ],
        shippingAddress: { fullName: 'Rajesh Kumar', phone: '9876543212', addressLine1: '12-3-456, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033', country: 'India' },
        subtotal: 15200, shippingCost: 0, tax: 2736, totalAmount: 17936,
        status: 'delivered', paymentMethod: 'COD', paymentStatus: 'paid',
        assignedTo: users[5]._id,
        createdAt: pastDate(25),
      },
      {
        orderNumber: 'ORD-2026-005',
        user: users[3]._id,
        items: [
          { product: products[5]._id, name: products[5].name, price: products[5].price, quantity: 3 },
        ],
        shippingAddress: { fullName: 'Priya Sharma', phone: '9876543213', addressLine1: '8-2-293, Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034', country: 'India' },
        subtotal: 25500, shippingCost: 0, tax: 4590, totalAmount: 30090,
        status: 'cancelled', paymentMethod: 'online', paymentStatus: 'failed',
        cancelReason: 'Customer changed their mind',
        createdAt: pastDate(10),
      },
      {
        orderNumber: 'ORD-2026-006',
        user: users[6]._id,
        items: [
          { product: products[3]._id, name: products[3].name, price: products[3].price, quantity: 1 },
          { product: products[4]._id, name: products[4].name, price: products[4].price, quantity: 1 },
          { product: products[2]._id, name: products[2].name, price: products[2].price, quantity: 2 },
        ],
        shippingAddress: { fullName: 'Suresh Nair', phone: '9876543216', addressLine1: '3rd Floor, DLF Building, Gachibowli', city: 'Hyderabad', state: 'Telangana', pincode: '500032', country: 'India' },
        subtotal: 40600, shippingCost: 0, tax: 7308, totalAmount: 47908,
        status: 'shipped', paymentMethod: 'online', paymentStatus: 'paid', paymentId: 'PAY-2026-003',
        assignedTo: users[5]._id,
        createdAt: pastDate(1),
      },
      {
        orderNumber: 'ORD-2026-007',
        user: users[2]._id,
        items: [
          { product: products[0]._id, name: products[0].name, price: products[0].price, quantity: 1 },
        ],
        shippingAddress: { fullName: 'Rajesh Kumar', phone: '9876543212', addressLine1: '12-3-456, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033', country: 'India' },
        subtotal: 62000, shippingCost: 0, tax: 11160, totalAmount: 73160,
        status: 'delivered', paymentMethod: 'online', paymentStatus: 'paid', paymentId: 'PAY-2026-004',
        createdAt: pastDate(40),
      },
    ]);
    logger.info(`✓ Seeded ${orders.length} orders`);

    // Seed Inquiries
    const inquiries = await Inquiry.insertMany([
      {
        user: users[2]._id,
        name: 'Rajesh Kumar',
        email: 'customer1@example.com',
        phone: '9876543212',
        subject: 'Home Theatre Setup – Jubilee Hills Villa',
        message: 'I want to set up a dedicated home theatre room of 20x15x10 ft. Need complete AV, acoustic treatment, and stretch ceiling. Budget is flexible for quality.',
        budget: '3,00,000 - 5,00,000',
        requirements: 'Dolby Atmos 7.1.4 setup, 4K laser projector, 12ft screen, acoustic panels, star ceiling',
        status: 'new',
        source: 'website',
        assignedTo: users[1]._id,
      },
      {
        name: 'Suresh Reddy',
        email: 'suresh@example.com',
        phone: '9876543220',
        subject: 'Smart Home Automation – New Construction',
        message: 'Building a new 4BHK home in Gachibowli. Looking for complete smart home automation including lighting, climate, security and AV integration.',
        budget: '5,00,000 - 10,00,000',
        status: 'contacted',
        source: 'whatsapp',
        assignedTo: users[1]._id,
      },
      {
        name: 'Kiran Enterprises',
        email: 'kiran@enterprise.com',
        phone: '9876543221',
        subject: 'Tensile Shade Structure – IT Park Parking',
        message: 'Need tensile parking shade structure for 150 vehicle capacity. IT Park Madhapur. Please provide design and quotation.',
        status: 'new',
        source: 'email',
      },
      {
        name: 'Dr. Anil Verma',
        email: 'anil@clinic.com',
        phone: '9876543222',
        subject: 'CCTV System – Multi-Clinic Setup',
        message: 'Need IP CCTV system for 3 clinic locations in Hyderabad. Total approximately 60 cameras. NVR-based with remote monitoring.',
        budget: '2,00,000 - 3,00,000',
        status: 'qualified',
        source: 'phone',
        assignedTo: users[5]._id,
      },
    ]);
    logger.info(`✓ Seeded ${inquiries.length} inquiries`);

    // Seed Site Visits
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 10);

    const siteVisits = await SiteVisit.insertMany([
      {
        user: users[2]._id,
        date: futureDate,
        timeSlot: '10:00 AM - 12:00 PM',
        location: {
          address: '12-3-456, Road No. 45, Jubilee Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500033',
        },
        purpose: 'Home theatre room measurement and acoustic survey',
        notes: 'Measure room dimensions, check walls/ceiling for acoustic treatment, assess electrical layout',
        status: 'confirmed',
        assignedTo: users[4]._id,
      },
      {
        user: users[3]._id,
        date: futureDate2,
        timeSlot: '2:00 PM - 4:00 PM',
        location: {
          address: '8-2-293, Banjara Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500034',
        },
        purpose: 'Smart home retrofit survey – existing 3BHK',
        status: 'scheduled',
      },
    ]);
    logger.info(`✓ Seeded ${siteVisits.length} site visits`);

    // Seed Service Tickets
    const serviceTickets = await ServiceTicket.insertMany([
      {
        ticketNumber: 'TKT-2026-001',
        user: users[2]._id,
        service: services[0]._id,
        subject: 'Home theatre installation – projector alignment issue',
        description: 'After installation, the projector image is slightly off-center. Need technician to re-align lens and recalibrate.',
        status: 'open',
        priority: 'medium',
        assignedTo: users[1]._id,
      },
      {
        ticketNumber: 'TKT-2026-002',
        user: users[3]._id,
        service: services[3]._id,
        subject: 'Smart lighting scene not saving via app',
        description: 'Created custom lighting scenes in the automation app but they reset after power cycle. Firmware issue likely.',
        status: 'in_progress',
        priority: 'high',
        assignedTo: users[4]._id,
      },
      {
        ticketNumber: 'TKT-2026-003',
        user: users[6]._id,
        service: services[4]._id,
        subject: 'CCTV camera showing blank footage at night',
        description: 'Camera 4 (backyard) shows no IR illumination after dark. Other cameras working fine. Possible IR LED failure.',
        status: 'open',
        priority: 'high',
        assignedTo: users[7]._id,
      },
      {
        ticketNumber: 'TKT-2026-004',
        user: users[2]._id,
        service: services[6]._id,
        subject: 'Annual AMC renewal – all systems',
        description: 'AMC renewal for home theatre, smart home, and CCTV systems expiring next month.',
        status: 'resolved',
        priority: 'low',
        assignedTo: users[1]._id,
      },
    ]);
    logger.info(`✓ Seeded ${serviceTickets.length} service tickets`);

    logger.info('✓ Database seeding completed successfully!');
    logger.info('---');
    logger.info('Test Credentials:');
    logger.info('Admin:      admin@pravaraworldtech.com / Test@123456');
    logger.info('Employee:   employee@pravaraworldtech.com / Test@123456');
    logger.info('Support:    support@pravaraworldtech.com / Test@123456');
    logger.info('Freelancer: freelancer1@example.com / Test@123456');
    logger.info('Customer:   customer1@example.com / Test@123456');

    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run if this is the main module
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;

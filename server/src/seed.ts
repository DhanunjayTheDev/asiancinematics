import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Service from './models/Service';
import Category from './models/Category';
import Product from './models/Product';
import Order from './models/Order';
import Inquiry from './models/Inquiry';
import SiteVisit from './models/SiteVisit';
import Address from './models/Address';
import ServiceTicket from './models/ServiceTicket';
import Notification from './models/Notification';
import AuditLog from './models/AuditLog';
import ServiceRequest from './models/ServiceRequest';
import Registration from './models/Registration';
import Deal from './models/Deal';
import { logger } from './utils/logger';

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info('Connected to MongoDB for seeding');

    // Clear ALL collections
    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Inquiry.deleteMany({}),
      SiteVisit.deleteMany({}),
      Address.deleteMany({}),
      ServiceTicket.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
      ServiceRequest.deleteMany({}),
      Registration.deleteMany({}),
      Deal.deleteMany({}),
    ]);
    logger.info('✓ Cleared all collections');

    // ── Admin user ──────────────────────────────────────────────
    const admin = await User.create({
      name: 'Praveen Kumar Yougi',
      email: 'aabhivarsh@gmail.com',
      phone: '9849697886',
      password: 'Praveen@84',
      role: 'super_admin',
      isActive: true,
    });
    logger.info(`✓ Admin: ${admin.email}`);

    // ── Categories ──────────────────────────────────────────────
    const categories = await Category.insertMany([
      { name: 'Home Theatre & AV',          slug: 'home-theatre',      description: 'Premium home cinema systems, AV receivers, projectors and acoustic solutions', sortOrder: 1, isActive: true },
      { name: 'Decoratives & Stretch Ceiling', slug: 'decoratives',    description: 'Stretch ceiling systems, star ceilings and premium interior decorative solutions', sortOrder: 2, isActive: true },
      { name: 'Epoxy Flooring',             slug: 'epoxy',             description: 'High-durability 3D epoxy and metallic epoxy flooring for residential and commercial spaces', sortOrder: 3, isActive: true },
      { name: 'Smart Home & Automation',    slug: 'home-automation',   description: 'Smart home automation, IoT devices, smart lighting and climate control', sortOrder: 4, isActive: true },
      { name: 'Security & CCTV',            slug: 'security',          description: 'IP CCTV cameras, NVR systems, access control and alarm systems', sortOrder: 5, isActive: true },
      { name: 'Networking',                 slug: 'networking',        description: 'Structured cabling, Wi-Fi solutions, network switches and fiber optics', sortOrder: 6, isActive: true },
      { name: 'Lighting Solutions',         slug: 'lighting',          description: 'Architectural LED lighting, ambient lighting and smart lighting systems', sortOrder: 7, isActive: true },
      { name: 'Tensile & Structural',       slug: 'tensile-structural',description: 'Tensile fabric structures, carport shades, amphitheatre canopies and architectural facades', sortOrder: 8, isActive: true },
    ]);
    logger.info(`✓ ${categories.length} categories seeded`);

    // ── Services ────────────────────────────────────────────────
    const services = await Service.insertMany([
      {
        name: 'Security Systems',
        slug: 'security-systems',
        description: 'Advanced protection solutions built for total peace of mind. We design, supply and install complete security ecosystems for homes, businesses and large-scale properties.',
        shortDescription: 'CCTV, alarm & access control installations',
        price: 25000,
        sortOrder: 1,
        isActive: true,
        emoji: '🔐',
        badge: 'Security',
        accentColor: 'blue',
        features: [
          'CCTV Surveillance Systems',
          'Intrusion Alarm Systems',
          'Solar Fencing Solutions',
          'Remote Monitoring & Mobile Access',
        ],
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=60',
      },
      {
        name: 'Smart Home Automation',
        slug: 'smart-home-automation',
        description: 'Control your space with intelligence and ease. End-to-end smart home setup including smart lighting, climate control, security integration, and voice assistant configuration.',
        shortDescription: 'Complete home automation & IoT setup',
        price: 80000,
        sortOrder: 2,
        isActive: true,
        emoji: '🏡',
        badge: 'Automation',
        accentColor: 'cyan',
        features: [
          'Smart Lighting & Scene Control',
          'Curtain & Blind Automation',
          'Smart Gate & Door Access',
          'Centralized App-Based Control',
        ],
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&auto=format&fit=crop&q=60',
      },
      {
        name: 'Home Theatre & Audio Solutions',
        slug: 'home-theatre-audio',
        description: 'Bring cinematic excellence into your home. Complete turnkey home theatre design and installation including acoustic treatment, projector/screen setup, AV calibration, and ambient lighting.',
        shortDescription: 'Turnkey home cinema design & installation',
        price: 150000,
        sortOrder: 3,
        isActive: true,
        emoji: '🎬',
        badge: 'Cinema',
        accentColor: 'orange',
        features: [
          'Customized Home Theatre Rooms',
          'Living Room Cinema Setups',
          'Dolby Atmos & Surround Sound Systems',
          'Acoustic Treatment & Soundproofing',
        ],
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=60',
      },
      {
        name: 'Interior & Decorative Designs',
        slug: 'interior-decorative-designs',
        description: 'Where aesthetics meet innovation. Transform ordinary spaces into extraordinary environments with our premium stretch ceiling systems, star ceilings, epoxy flooring, and decorative concepts.',
        shortDescription: 'Stretch ceiling, epoxy flooring & decoratives',
        price: 45000,
        sortOrder: 4,
        isActive: true,
        emoji: '🎨',
        badge: 'Interior',
        accentColor: 'purple',
        features: [
          'Stretch Ceilings',
          'Galaxy Star Lighting Designs',
          'Premium Wall & Ceiling Finishes',
          'Customized Decorative Concepts',
        ],
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=60',
      },
      {
        name: 'Lighting Solutions',
        slug: 'lighting-solutions',
        description: 'Perfect lighting for every mood and purpose. Architectural and decorative LED lighting systems for ambiance, energy efficiency, and smart control.',
        shortDescription: 'Smart & architectural lighting installations',
        price: 30000,
        sortOrder: 5,
        isActive: true,
        emoji: '💡',
        badge: 'Lighting',
        accentColor: 'yellow',
        features: [
          'Smart Lighting Systems',
          'Architectural & Ambient Lighting',
          'Decorative Lighting Installations',
          'Energy-Efficient Solutions',
        ],
        image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&auto=format&fit=crop&q=60',
      },
      {
        name: 'Structural Works',
        slug: 'structural-works',
        description: 'Strong, stylish, and built to last. Custom tensile fabric structure design and installation including pergolas, car parking sheds, amphitheatre canopies, and fabrication works.',
        shortDescription: 'Tensile structures & custom fabrication',
        price: 200000,
        sortOrder: 6,
        isActive: true,
        emoji: '🏗',
        badge: 'Structural',
        accentColor: 'amber',
        features: [
          'Pergolas & Outdoor Structures',
          'Car Parking Sheds',
          'Tensile Fabric Canopies',
          'Custom Fabrication Works',
        ],
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=60',
      },
      {
        name: 'Design Drawings & Planning',
        slug: 'design-drawings-planning',
        description: 'Precision-driven planning for perfect execution. We create detailed technical drawings and plans ensuring every installation is mapped out perfectly before work begins.',
        shortDescription: '📊 Plan smart. Execute perfectly.',
        sortOrder: 7,
        isActive: true,
        emoji: '📐',
        badge: 'Design',
        accentColor: 'purple',
        features: [
          '2D Layout Drawings (Home Theatre, Security, Automation)',
          'Electrical & Wiring Schematics',
          'Structural & Installation Planning',
          'Custom Room Design Concepts',
        ],
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&auto=format&fit=crop&q=60',
      },
      {
        name: '3D Rendering & Visualization',
        slug: '3d-rendering-visualization',
        description: 'Experience your project before execution. Photorealistic 3D renders and visualizations help you see exactly what your space will look like before a single nail is driven.',
        shortDescription: '✨ See it. Feel it. Approve it before execution.',
        sortOrder: 8,
        isActive: true,
        emoji: '🖥️',
        badge: 'Rendering',
        accentColor: 'purple',
        features: [
          'Photorealistic 3D Interior Renders',
          'Home Theatre Visualization',
          'Lighting & Acoustic Simulation',
          'Client Presentation Designs',
        ],
        image: 'https://images.unsplash.com/photo-1616596969059-de6b7a5af37f?w=700&auto=format&fit=crop&q=60',
      },
      {
        name: 'Annual Maintenance Contract (AMC)',
        slug: 'annual-maintenance-contract',
        description: 'Comprehensive annual maintenance contract covering all installed systems — AV, smart home, security, and networking.',
        shortDescription: 'Annual maintenance for all systems',
        price: 18000,
        sortOrder: 9,
        isActive: true,
        emoji: '🛠',
        badge: 'AMC',
        accentColor: 'green',
        features: [
          'Scheduled Preventive Maintenance',
          'Priority Response for Breakdowns',
          'Covers AV, Smart Home & Security',
          'Annual System Health Report',
        ],
      },
    ]);
    logger.info(`✓ ${services.length} services seeded`);

    logger.info('');
    logger.info('✓ Seeding complete');
    logger.info(`  Admin : aabhivarsh@gmail.com / Praveen@84`);
    logger.info(`  Categories : ${categories.length}`);
    logger.info(`  Services   : ${services.length}`);

    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;

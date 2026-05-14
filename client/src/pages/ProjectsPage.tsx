import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiCalendar, FiTag, FiArrowRight, FiGrid, FiList } from 'react-icons/fi';
import api from '../lib/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  completedDate: string;
  images: string[];
  tags: string[];
  client?: string;
  featured: boolean;
}

const categories = ['All', 'Home Theatre', 'Stretch Ceiling', 'Epoxy Flooring', 'Smart Home', 'CCTV & Security', 'Tensile Structure', 'Lighting'];

const demoProjects: Project[] = [
  { _id: '1', title: 'Luxury Home Theatre – Jubilee Hills', description: 'Complete 7.1 Dolby Atmos home theatre with acoustic treatment, stretch ceiling, and ambient lighting for a premium residence.', category: 'Home Theatre', location: 'Hyderabad', completedDate: '2025-12', images: [], tags: ['Dolby Atmos', 'Acoustic Panels', 'Stretch Ceiling'], client: 'Private Residence', featured: true },
  { _id: '2', title: 'Star Ceiling – Banjara Hills Villa', description: 'Stunning fibre optic star ceiling installation across master bedroom and living room with dynamic LED effects.', category: 'Stretch Ceiling', location: 'Hyderabad', completedDate: '2025-11', images: [], tags: ['Star Ceiling', 'Fibre Optic', 'LED Effects'], client: 'Villa Project', featured: true },
  { _id: '3', title: '3D Metallic Epoxy – Commercial Showroom', description: 'Premium 3D metallic epoxy flooring across 2500 sq ft commercial showroom with custom design patterns.', category: 'Epoxy Flooring', location: 'Bangalore', completedDate: '2025-10', images: [], tags: ['Metallic Epoxy', '3D Design', 'Commercial'], client: 'Retail Showroom', featured: false },
  { _id: '4', title: 'Complete Smart Home – Gachibowli', description: 'Full home automation including smart lighting, climate control, security system, and voice-controlled entertainment.', category: 'Smart Home', location: 'Hyderabad', completedDate: '2025-09', images: [], tags: ['Home Automation', 'Smart Lighting', 'IoT'], client: 'Private Villa', featured: true },
  { _id: '5', title: 'Tensile Carport Shade – IT Park', description: 'Large-span PVDF tensile carport shading structure for 200+ vehicles at a major IT Park in Hyderabad.', category: 'Tensile Structure', location: 'Hyderabad', completedDate: '2025-08', images: [], tags: ['PVDF Fabric', 'Large Span', 'Carport'], client: 'IT Campus', featured: false },
  { _id: '6', title: 'IP CCTV System – Apartment Complex', description: '128-camera IP CCTV system with AI analytics, NVR storage, and remote monitoring for a 500-unit apartment complex.', category: 'CCTV & Security', location: 'Chennai', completedDate: '2025-07', images: [], tags: ['IP CCTV', 'AI Analytics', '128 Cameras'], client: 'Residential Complex', featured: false },
];

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>(demoProjects);
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = activeCategory === 'All' ? projects : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Projects | Pravara World Tech</title>
      </Helmet>

      {/* Hero */}
      <section className="py-20 px-6 text-center border-b border-yellow-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase mb-4 block">Portfolio</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our <span className="text-yellow-400">Projects</span></h1>
          <p className="text-gray-400 text-lg">
            Explore our completed projects across India from luxury home theatres to large tensile structures.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-6 border-b border-gray-800 sticky top-[73px] z-10 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-400'}`}>
              <FiGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-400'}`}>
              <FiList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <div key={project._id} className="bg-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all group">
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-gray-600 text-sm">Project Image</span>
                    {project.featured && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 bg-yellow-400 text-black rounded-full">Featured</span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-semibold text-yellow-400 px-2 py-0.5 bg-yellow-400/10 rounded-full">{project.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">{project.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><FiMapPin className="w-3 h-3 text-yellow-400" /> {project.location}</span>
                      <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3 text-yellow-400" /> {project.completedDate}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((project) => (
                <div key={project._id} className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6 hover:border-yellow-500/50 transition-all flex gap-6">
                  <div className="w-32 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-700 text-xs">Image</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold text-yellow-400 px-2 py-0.5 bg-yellow-400/10 rounded-full">{project.category}</span>
                      {project.featured && <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-400 text-black rounded-full">Featured</span>}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-400 mb-3 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><FiMapPin className="w-3 h-3 text-yellow-400" /> {project.location}</span>
                      <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3 text-yellow-400" /> {project.completedDate}</span>
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-800 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Inquiry CTA */}
      <section className="py-16 px-6 text-center border-t border-yellow-500/20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Have a Project in Mind?</h2>
          <p className="text-gray-400 mb-8">Share your requirements and get a free consultation from our team of experts.</p>
          <Link to="/inquiry" className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-colors">
            Submit Project Inquiry <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;

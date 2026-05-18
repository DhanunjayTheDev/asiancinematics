import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiMessageSquare, FiThumbsUp, FiClock, FiTag, FiSearch, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const categories = [
  { name: 'Home Theatre', icon: '🎬', count: 24, desc: 'Setup tips, equipment reviews, calibration help' },
  { name: 'Smart Home', icon: '🏠', count: 18, desc: 'Automation, IoT devices, integrations' },
  { name: 'Security & CCTV', icon: '🔐', count: 15, desc: 'Installation guides, camera recommendations' },
  { name: 'Acoustic & Soundproofing', icon: '🎵', count: 12, desc: 'Room treatment, acoustic panels, material advice' },
  { name: 'Stretch Ceiling & Decor', icon: '✨', count: 9, desc: 'Design ideas, installation tips, material comparison' },
  { name: 'Epoxy Flooring', icon: '🏗', count: 7, desc: 'DIY vs professional, cost estimates, materials' },
  { name: 'Tensile Structures', icon: '⛺', count: 11, desc: 'Structural design, fabric selection, maintenance' },
  { name: 'General Discussion', icon: '💬', count: 31, desc: 'Industry news, project showcases, Q&A' },
];

const threads = [
  { id: 1, title: 'Best 4K projector under ₹2L for a 15ft screen?', category: 'Home Theatre', author: 'Rajesh K.', time: '2h ago', replies: 12, likes: 8, pinned: true },
  { id: 2, title: 'Dolby Atmos vs DTS:X – Which is better for Indian content?', category: 'Home Theatre', author: 'Anil M.', time: '5h ago', replies: 7, likes: 14, pinned: false },
  { id: 3, title: 'Star ceiling installation in Bangalore – my experience', category: 'Stretch Ceiling & Decor', author: 'Priya S.', time: '1d ago', replies: 19, likes: 34, pinned: false },
  { id: 4, title: 'Smart home on a budget – best affordable automation?', category: 'Smart Home', author: 'Kiran T.', time: '2d ago', replies: 23, likes: 41, pinned: false },
  { id: 5, title: 'Metallic 3D epoxy flooring – cost per sq ft in Hyderabad?', category: 'Epoxy Flooring', author: 'Suresh B.', time: '3d ago', replies: 6, likes: 11, pinned: false },
  { id: 6, title: 'Hikvision vs Dahua for outdoor IP cameras', category: 'Security & CCTV', author: 'Venkat R.', time: '4d ago', replies: 31, likes: 22, pinned: false },
];

const ForumsPage = () => {
  const [searchQ, setSearchQ] = useState('');
  const { isAuthenticated } = useAuthStore();

  const filtered = threads.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQ.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Forums | Pravara World Tech Community</title>
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[340px] flex items-center border-b border-yellow-500/20 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1400&auto=format&fit=crop&q=60"
          alt="Pravara Forums Community"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/78" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left">
              <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase mb-4 block">Community</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Pravara <span className="text-yellow-400">Forums</span>
              </h1>
              <p className="text-gray-300 text-lg mb-6 max-w-xl">
                Connect with professionals and enthusiasts. Ask questions, share experiences, and learn from the community.
              </p>
              <div className="relative max-w-lg">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search discussions..."
                  className="w-full bg-black/60 backdrop-blur border border-yellow-500/30 rounded-full px-5 pl-11 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: '2,400+', label: 'Members' },
                { value: '1,200+', label: 'Discussions' },
                { value: '8,500+', label: 'Replies' },
                { value: '50+', label: 'Cities' },
              ].map((s) => (
                <div key={s.label} className="bg-black/50 backdrop-blur border border-yellow-500/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-400">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Categories */}
            <div>
              <h2 className="text-xl font-bold mb-5">Forum Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <div key={cat.name} className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 hover:border-yellow-500/40 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xl">{cat.icon}</span>
                      <h3 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">{cat.name}</h3>
                      <span className="ml-auto text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{cat.count} threads</span>
                    </div>
                    <p className="text-xs text-gray-500 pl-9">{cat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Threads */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">Recent Discussions</h2>
                {isAuthenticated ? (
                  <button className="px-4 py-2 bg-yellow-400 text-black text-xs font-bold rounded-full hover:bg-yellow-300 transition-colors">
                    + New Thread
                  </button>
                ) : (
                  <Link to="/login" className="px-4 py-2 bg-gray-800 text-gray-300 text-xs font-semibold rounded-full hover:bg-gray-700 transition-colors flex items-center gap-1">
                    <FiLock className="w-3 h-3" /> Login to Post
                  </Link>
                )}
              </div>

              <div className="space-y-3">
                {filtered.map((thread) => (
                  <div key={thread.id} className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 hover:border-yellow-500/40 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {thread.pinned && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-yellow-400 text-black rounded">PINNED</span>}
                          <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">{thread.category}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors mb-2">{thread.title}</h3>
                        <div className="flex items-center gap-4 text-[11px] text-gray-500">
                          <span>by <span className="text-gray-400">{thread.author}</span></span>
                          <span className="flex items-center gap-1"><FiClock className="w-3 h-3" />{thread.time}</span>
                          <span className="flex items-center gap-1"><FiMessageSquare className="w-3 h-3" />{thread.replies} replies</span>
                          <span className="flex items-center gap-1"><FiThumbsUp className="w-3 h-3" />{thread.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-base font-bold mb-4">Community Stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'Members', value: '2,400+' },
                  { label: 'Discussions', value: '1,200+' },
                  { label: 'Replies', value: '8,500+' },
                  { label: 'Cities', value: '50+' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{stat.label}</span>
                    <span className="text-yellow-400 font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Join CTA */}
            {!isAuthenticated && (
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center">
                <h3 className="text-base font-bold mb-2">Join the Community</h3>
                <p className="text-xs text-gray-400 mb-4">Create an account to post, reply, and connect with fellow enthusiasts.</p>
                <Link to="/register" className="block w-full py-2.5 bg-yellow-400 text-black font-bold rounded-xl text-sm hover:bg-yellow-300 transition-colors mb-2">
                  Register Free
                </Link>
                <Link to="/login" className="block w-full py-2.5 bg-gray-800 text-gray-300 font-semibold rounded-xl text-sm hover:bg-gray-700 transition-colors">
                  Login
                </Link>
              </div>
            )}

            {/* Popular Tags */}
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2"><FiTag className="w-4 h-4 text-yellow-400" />Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['home theatre', 'projector', 'smart lighting', 'CCTV', 'stretch ceiling', 'epoxy', 'automation', 'Dolby Atmos', 'tensile', 'security'].map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 bg-gray-800 text-gray-400 rounded-full hover:bg-yellow-400/10 hover:text-yellow-400 transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumsPage;

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { FiMessageSquare, FiThumbsUp, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '../components/Button';

const FORUM_CATEGORIES = ['Home Theatre', 'Smart Home', 'Security & CCTV', 'Acoustic & Soundproofing', 'Stretch Ceiling & Decor', 'Epoxy Flooring', 'Tensile Structures', 'General Discussion'];

const ForumsPage = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [filterCat, setFilterCat] = useState('All');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    setThreads([
      { _id: '1', title: 'Best 4K projector under ₹2L for a 15ft screen?', category: 'Home Theatre', author: 'Rajesh K.', time: '2h ago', replies: 12, likes: 8, pinned: true, visible: true },
      { _id: '2', title: 'Dolby Atmos vs DTS:X – Which is better for Indian content?', category: 'Home Theatre', author: 'Anil M.', time: '5h ago', replies: 7, likes: 14, pinned: false, visible: true },
      { _id: '3', title: 'Star ceiling installation in Bangalore – my experience', category: 'Stretch Ceiling & Decor', author: 'Priya S.', time: '1d ago', replies: 19, likes: 34, pinned: false, visible: true },
      { _id: '4', title: 'Smart home on a budget – best affordable automation?', category: 'Smart Home', author: 'Kiran T.', time: '2d ago', replies: 23, likes: 41, pinned: false, visible: true },
      { _id: '5', title: 'Spam post – test', category: 'General Discussion', author: 'Unknown User', time: '3d ago', replies: 0, likes: 0, pinned: false, visible: false },
    ]);
  }, []);

  const filtered = threads.filter(t => {
    if (filterCat !== 'All' && t.category !== filterCat) return false;
    if (filterStatus === 'visible') return t.visible;
    if (filterStatus === 'hidden') return !t.visible;
    return true;
  });

  const handleToggleVisible = (id: string) => {
    setThreads((prev) => prev.map((t) => t._id === id ? { ...t, visible: !t.visible } : t));
    toast.success('Visibility updated');
  };

  const handleTogglePin = (id: string) => {
    setThreads((prev) => prev.map((t) => t._id === id ? { ...t, pinned: !t.pinned } : t));
    toast.success('Pin status updated');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this thread?')) return;
    setThreads((prev) => prev.filter((t) => t._id !== id));
    toast.success('Thread deleted');
  };

  return (
    <>
      <Helmet><title>Forums | Admin – Pravara World Tech</title></Helmet>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Forums Management</h1>
            <p className="text-sm text-gray-400 mt-0.5">Moderate community threads and discussions</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-xs">{threads.length} Threads</span>
            <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs">{threads.filter(t => t.visible).length} Visible</span>
            <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs">{threads.filter(t => !t.visible).length} Hidden</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex flex-wrap gap-1.5">
            {['All', ...FORUM_CATEGORIES].map((cat) => (
              <Button
                key={cat}
                onClick={() => setFilterCat(cat)}
                variant={filterCat === cat ? 'primary' : 'secondary'}
                size="sm"
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {['all', 'visible', 'hidden'].map((s) => (
              <Button
                key={s}
                onClick={() => setFilterStatus(s)}
                variant={filterStatus === s ? 'primary' : 'secondary'}
                size="sm"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">Thread</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">Author</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">Stats</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((t) => (
                <tr key={t._id} className={`hover:bg-gray-800/50 transition-colors ${!t.visible ? 'opacity-60' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {t.pinned && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-yellow-400 text-black rounded">PINNED</span>}
                      <span className="text-[10px] text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">{t.category}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{t.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{t.time}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">{t.author}</td>
                  <td className="px-5 py-4">
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1"><FiMessageSquare className="w-3 h-3" />{t.replies} replies</div>
                      <div className="flex items-center gap-1"><FiThumbsUp className="w-3 h-3" />{t.likes} likes</div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${t.visible ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                      {t.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleTogglePin(t._id)}
                        variant={t.pinned ? 'success' : 'secondary'}
                        size="sm"
                        title={t.pinned ? 'Unpin' : 'Pin'}
                      >
                        📌
                      </Button>
                      <Button
                        onClick={() => handleToggleVisible(t._id)}
                        variant="secondary"
                        size="sm"
                        title={t.visible ? 'Hide' : 'Show'}
                      >
                        {t.visible ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                      </Button>
                      <Button
                        onClick={() => handleDelete(t._id)}
                        variant="danger"
                        size="sm"
                        title="Delete"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500">No threads found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ForumsPage;

const Loading = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3" />
    <p className="text-sm text-gray-400">{text}</p>
  </div>
);

export default Loading;

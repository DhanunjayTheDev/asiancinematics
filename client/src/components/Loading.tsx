const Loading = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-10 h-10 border-4 border-blue-900/30 border-t-yellow-400 rounded-full animate-spin" />
    <p className="mt-4 text-gray-400 text-sm">{text}</p>
  </div>
);

export default Loading;

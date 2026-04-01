const Loading = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-3" />
    <p className="text-sm text-gray-500">{text}</p>
  </div>
);

export default Loading;

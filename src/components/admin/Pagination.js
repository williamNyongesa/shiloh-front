const Pagination = () => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button className="p-2 rounded-lg bg-blue-500 text-white">1</button>
      <button className="p-2 rounded-lg bg-gray-300 text-gray-700">2</button>
      <button className="p-2 rounded-lg bg-gray-300 text-gray-700">3</button>
      <button className="p-2 rounded-lg bg-gray-300 text-gray-700">...</button>
      <button className="p-2 rounded-lg bg-gray-300 text-gray-700">Next</button>
    </div>
  );
};

export default Pagination;

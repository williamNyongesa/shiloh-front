
const DashboardCard = ({ title, value, color, icon }) => {
  return (
    <div className={`flex items-center justify-between p-6 rounded-lg shadow ${color}`}>
      <div className="flex flex-col items-center">
        <h2 className="text-white font-semibold text-xl">{value}</h2>
        <p className="bg-white text-center px-2">{title}</p>
      </div>
      <div className="text-white text-4xl">
        <span className="material-icons">{icon}</span>
      </div>
    </div>
  );
};

export default DashboardCard;

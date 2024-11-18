import React from "react";

const StudentDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <div className="flex items-center gap-4">
            <img
              src="https://via.placeholder.com/50"
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p>Welcome</p>
              <p className="font-semibold">Ramkumar K</p>
              <p className="text-sm text-gray-400">Student</p>
            </div>
          </div>
        </div>
        <nav className="mt-6">
          <ul>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Dashboard</li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4">
          <h1 className="text-center text-xl font-semibold">WELCOME TO SHILOH</h1>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Courses To Do", count: 29 },
              { label: "Overdue Courses", count: 6 },
              { label: "Completed Courses", count: 1 },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded shadow text-center"
              >
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Rewards and Certificates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-bold mb-2">Reward</h2>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gray-300"
                  ></div>
                ))}
              </div>
              <button className="mt-4 text-blue-500">View All</button>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-bold mb-2">Certificates</h2>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gray-300"
                  ></div>
                ))}
              </div>
              <button className="mt-4 text-blue-500">View All</button>
            </div>
          </div>

          {/* Courses Section */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between border-b pb-2 mb-4">
              <h2 className="font-bold">Courses</h2>
              <button className="text-blue-500">View All</button>
            </div>
            {[
              { title: "Basics of HTML", progress: 13 },
              { title: "Angular in Steps", progress: 73 },
              { title: "Bootstrap Foundation", progress: 60 },
            ].map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-4"
              >
                <div>
                  <p className="font-semibold">{course.title}</p>
                  <p className="text-sm text-gray-500">
                    Lorem ipsum is simply dummy text.
                  </p>
                  <div className="w-full bg-gray-200 h-2 rounded mt-2">
                    <div
                      className="bg-green-500 h-2 rounded"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <button className="text-blue-500">Continue</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;

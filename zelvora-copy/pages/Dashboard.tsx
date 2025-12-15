import React from 'react';
import { PlayCircle, Clock, FileCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const history = [
    { id: 1, role: 'Senior Frontend Dev', date: 'Oct 24, 2023', score: 58, status: 'Completed' },
    { id: 2, role: 'Product Manager', date: 'Oct 20, 2023', score: 0, status: 'In Progress' },
    { id: 3, role: 'React Developer', date: 'Oct 15, 2023', score: 72, status: 'Completed' },
  ];

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Welcome back, Alex.</h1>
                <p className="text-slate-400 text-sm">Pro Plan Active • Next billing Nov 1</p>
            </div>
            <Link to="/interview" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-sm text-sm font-semibold transition-colors flex items-center">
                <PlayCircle className="h-4 w-4 mr-2" /> Start New Interview
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
                <p className="text-slate-400 text-sm font-medium uppercase">Interviews Taken</p>
                <p className="text-3xl font-bold text-white mt-2">12</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
                <p className="text-slate-400 text-sm font-medium uppercase">Avg. Score</p>
                <p className="text-3xl font-bold text-emerald-500 mt-2">64%</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
                <p className="text-slate-400 text-sm font-medium uppercase">Top Weakness</p>
                <p className="text-xl font-bold text-white mt-2">System Design</p>
            </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white">Recent Activity</h3>
                <a href="#" className="text-emerald-500 text-sm hover:underline">View All</a>
            </div>
            <div className="divide-y divide-slate-800">
                {history.map((item) => (
                    <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors group">
                        <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                {item.status === 'Completed' ? <FileCheck className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="text-white font-medium">{item.role}</p>
                                <p className="text-slate-500 text-xs">{item.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            {item.status === 'Completed' && (
                                <div className="text-right">
                                    <span className={`text-lg font-bold ${item.score >= 70 ? 'text-emerald-500' : item.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                        {item.score}%
                                    </span>
                                    <p className="text-slate-600 text-xs">Score</p>
                                </div>
                            )}
                             <Link to="/reports" className="text-slate-400 group-hover:text-white">
                                <ChevronRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

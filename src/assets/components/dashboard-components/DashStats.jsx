import React, { useEffect, useState } from 'react';
import { useUser } from '../../context-api/user-context/UseUser';
import { useQuote } from '../../context-api/Request-quote-context/UseQuote';
import Spinner from '../Spinner';

function DashStats() {
  const { getAllUsers, loading: userLoading, isSuperAdmin, isAdmin, user } = useUser();
  const { quotes, loading: quoteLoading } = useQuote();
  const [stats, setStats] = useState({
    totalUsers: 0,
    superAdmins: 0,
    admins: 0,
    customers: 0,
    users: 0,
    totalQuotes: 0,
    myQuotes: 0,
    myPending: 0,
    myCompleted: 0,
  });

  // Fetch users ONCE on mount
  useEffect(() => {
    const fetchStats = async () => {
      const users = await getAllUsers();
      setStats(prev => ({
        ...prev,
        totalUsers: users ? users.length : 0,
        superAdmins: users ? users.filter(u => u.role === 'super admin').length : 0,
        admins: users ? users.filter(u => u.role === 'admin').length : 0,
        customers: users ? users.filter(u => u.role === 'customer').length : 0,
        users: users ? users.filter(u => u.role === 'user').length : 0,
      }));
    };
    fetchStats();
    // eslint-disable-next-line
  }, []);

  // Update quotes count when quotes or user changes
  useEffect(() => {
    let myQuotes = 0, myPending = 0, myCompleted = 0;
    if (user && quotes && (user.role === 'user' || user.role === 'customer')) {
      const userQuotes = quotes.filter(q => q.email === user.email);
      myQuotes = userQuotes.length;
      myPending = userQuotes.filter(q => q.status === 'Pending').length;
      myCompleted = userQuotes.filter(q => q.status === 'Completed' || q.status === 'Done').length;
    }
    setStats(prev => ({
      ...prev,
      totalQuotes: quotes ? quotes.length : 0,
      myQuotes,
      myPending,
      myCompleted,
    }));
  }, [quotes, user]);

  if (userLoading || quoteLoading) {
    return <Spinner />;
  }

  return (
    <>
      {(isSuperAdmin || isAdmin) ? (
        <>
          {user && (
            <div className="col-span-3 text-xl font-semibold mb-2 md:mb-2 mt-3 px-4 lg:px-5">
              <p className='font-semibold'>Welcome {user.name || user.email || 'User'}!</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <StatCard label="Total Users" value={stats.totalUsers} color="bg-blue-600" />
            <StatCard label="Super Admins" value={stats.superAdmins} color="bg-purple-700" />
            <StatCard label="Admins" value={stats.admins} color="bg-indigo-600" />
            <StatCard label="Customers" value={stats.customers} color="bg-green-600" />
            <StatCard label="Users" value={stats.users} color="bg-yellow-500" />
            <StatCard label="Quotes Received" value={stats.totalQuotes} color="bg-pink-600" />
          </div>
        </>
      ) : (user && user.role === 'customer') ? (
        <>
          <div className="col-span-3 text-xl font-semibold mb-2 md:mb-2 mt-3 px-4 lg:px-5">
            <p className='font-semibold'>Welcome {user.name || user.email || 'Customer'}!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <StatCard label="My Quotes" value={stats.myQuotes} color="bg-blue-600" />
            <StatCard label="Pending Quotes" value={stats.myPending} color="bg-yellow-500" />
            <StatCard label="Completed Quotes" value={stats.myCompleted} color="bg-green-600" />
          </div>
        </>
      ) : (user && user.role === 'user') ? (
        <>
          <div className="col-span-3 text-xl font-semibold mb-2 md:mb-2 mt-3 px-4 lg:px-5">
            <p className='font-semibold'>Welcome {user.name || user.email || 'User'}!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <StatCard label="My Quotes" value={stats.myQuotes} color="bg-blue-600" />
            <StatCard label="Pending Quotes" value={stats.myPending} color="bg-yellow-500" />
            <StatCard label="Completed Quotes" value={stats.myCompleted} color="bg-green-600" />
          </div>
        </>
      ) : null}
    </>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl shadow-lg p-6 flex flex-col items-center ${color} text-white`}>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-lg font-medium">{label}</div>
    </div>
  );
}

export default DashStats;
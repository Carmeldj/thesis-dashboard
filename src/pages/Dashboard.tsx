import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { usersAPI, shopsAPI } from "../services/api";
import { Users, Store, CheckCircle, XCircle } from "lucide-react";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStreamers: 0,
    verifiedStreamers: 0,
    pendingStreamers: 0,
    totalShops: 0,
    activeShops: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, streamers, shops] = await Promise.all([
          usersAPI.findAll(),
          usersAPI.findAllStreamers(),
          shopsAPI.findAll(),
        ]);

        const verifiedStreamers = streamers.filter((s) => s.is_verified).length;
        const activeShops = shops.filter((s) => s.isActive).length;

        setStats({
          totalUsers: users.length,
          totalStreamers: streamers.length,
          verifiedStreamers,
          pendingStreamers: streamers.length - verifiedStreamers,
          totalShops: shops.length,
          activeShops,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Streamers",
      value: stats.totalStreamers,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Verified Streamers",
      value: stats.verifiedStreamers,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Pending Streamers",
      value: stats.pendingStreamers,
      icon: XCircle,
      color: "bg-orange-500",
    },
    {
      title: "Total Shops",
      value: stats.totalShops,
      icon: Store,
      color: "bg-indigo-500",
    },
    {
      title: "Active Shops",
      value: stats.activeShops,
      icon: CheckCircle,
      color: "bg-teal-500",
    },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-xl text-slate-600 dark:text-slate-400">
            Loading dashboard...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Overview of your platform statistics
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-600 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg shadow-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">
                {card.title}
              </h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

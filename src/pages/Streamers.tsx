import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { usersAPI } from "../services/api";
import type { User } from "../types";
import {
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

export const Streamers = () => {
  const [streamers, setStreamers] = useState<User[]>([]);
  const [filteredStreamers, setFilteredStreamers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "verified" | "pending"
  >("all");
  const [selectedStreamer, setSelectedStreamer] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchStreamers();
  }, []);

  useEffect(() => {
    filterStreamers();
  }, [streamers, searchTerm, filterStatus]);

  const fetchStreamers = async () => {
    try {
      const data = await usersAPI.findAllStreamers();
      setStreamers(data);
    } catch (error) {
      console.error("Error fetching streamers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterStreamers = () => {
    let filtered = streamers;

    // Filter by status
    if (filterStatus === "verified") {
      filtered = filtered.filter((s) => s.is_verified);
    } else if (filterStatus === "pending") {
      filtered = filtered.filter((s) => !s.is_verified);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStreamers(filtered);
  };

  const handleVerifyStreamer = async (id: string, isVerified: boolean) => {
    setIsUpdating(true);
    try {
      await usersAPI.update(id, { is_verified: isVerified });
      setStreamers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_verified: isVerified } : s))
      );
      setSelectedStreamer(null);
    } catch (error) {
      console.error("Error updating streamer:", error);
      alert("Failed to update streamer verification status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-xl text-slate-400">Loading streamers...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Streamers Management
        </h1>
        <p className="text-slate-400 mb-6">
          Validate and manage streamer accounts
        </p>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 text-slate-100 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-slate-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-slate-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 bg-slate-900 border border-slate-600 text-slate-100 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="all">All Streamers</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-4">
            <p className="text-slate-400 text-sm">Total Streamers</p>
            <p className="text-2xl font-bold text-slate-100">
              {streamers.length}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-4">
            <p className="text-slate-400 text-sm">Verified</p>
            <p className="text-2xl font-bold text-green-400">
              {streamers.filter((s) => s.is_verified).length}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-4">
            <p className="text-slate-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-orange-400">
              {streamers.filter((s) => !s.is_verified).length}
            </p>
          </div>
        </div>

        {/* Streamers List */}
        <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden">
          {filteredStreamers.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No streamers found matching your criteria
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Streamer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                  {filteredStreamers.map((streamer) => (
                    <tr key={streamer.id} className="hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10">
                            {streamer.image ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={`${import.meta.env.VITE_API_BASE_URL}${
                                  streamer.image
                                }`}
                                alt={streamer.username || streamer.email}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <span className="text-indigo-400 font-medium">
                                  {(streamer.username ||
                                    streamer.firstname ||
                                    streamer.email)[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-100">
                              {streamer.firstname && streamer.lastname
                                ? `${streamer.firstname} ${streamer.lastname}`
                                : streamer.username || "N/A"}
                            </div>
                            <div className="text-sm text-slate-400">
                              @{streamer.username || "no-username"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-200 flex items-center gap-1">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {streamer.email}
                        </div>
                        {streamer.phoneNumber && (
                          <div className="text-sm text-slate-400 flex items-center gap-1">
                            <Phone className="w-4 h-4 text-slate-500" />
                            {streamer.phoneNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            streamer.is_verified
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                          }`}
                        >
                          {streamer.is_verified ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(streamer.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedStreamer(streamer)}
                          className="text-indigo-400 hover:text-indigo-300 mr-4"
                        >
                          View Details
                        </button>
                        {!streamer.is_verified && (
                          <button
                            onClick={() =>
                              handleVerifyStreamer(streamer.id, true)
                            }
                            disabled={isUpdating}
                            className="text-green-400 hover:text-green-300 disabled:opacity-50"
                          >
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedStreamer && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-100">
                    Streamer Details
                  </h2>
                  <button
                    onClick={() => setSelectedStreamer(null)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {selectedStreamer.image ? (
                      <img
                        className="h-20 w-20 rounded-full object-cover"
                        src={selectedStreamer.image}
                        alt={
                          selectedStreamer.username || selectedStreamer.email
                        }
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <span className="text-indigo-400 font-medium text-2xl">
                          {(selectedStreamer.username ||
                            selectedStreamer.email)[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-slate-100">
                        {selectedStreamer.firstname && selectedStreamer.lastname
                          ? `${selectedStreamer.firstname} ${selectedStreamer.lastname}`
                          : selectedStreamer.username || "N/A"}
                      </h3>
                      <p className="text-slate-400">
                        @{selectedStreamer.username || "no-username"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium text-slate-200">
                        {selectedStreamer.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium text-slate-200">
                        {selectedStreamer.phoneNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Role</p>
                      <p className="font-medium text-slate-200">
                        {selectedStreamer.role || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      <p
                        className={`font-medium ${
                          selectedStreamer.is_verified
                            ? "text-green-400"
                            : "text-orange-400"
                        }`}
                      >
                        {selectedStreamer.is_verified ? "Verified" : "Pending"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Followers</p>
                      <p className="font-medium text-slate-200">
                        {selectedStreamer.followers?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Following</p>
                      <p className="font-medium text-slate-200">
                        {selectedStreamer.following?.length || 0}
                      </p>
                    </div>
                  </div>

                  {selectedStreamer.bio && (
                    <div>
                      <p className="text-sm text-slate-500">Bio</p>
                      <p className="font-medium text-slate-200">
                        {selectedStreamer.bio}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    {!selectedStreamer.is_verified ? (
                      <button
                        onClick={() =>
                          handleVerifyStreamer(selectedStreamer.id, true)
                        }
                        disabled={isUpdating}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Verify Streamer
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleVerifyStreamer(selectedStreamer.id, false)
                        }
                        disabled={isUpdating}
                        className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                      >
                        <XCircle className="w-5 h-5" />
                        Revoke Verification
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedStreamer(null)}
                      className="flex-1 bg-slate-700 text-slate-200 py-2 px-4 rounded-md hover:bg-slate-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

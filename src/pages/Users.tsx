import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { usersAPI } from "../services/api";
import type { User } from "../types";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldCheck,
  UserCircle,
  Trash2,
} from "lucide-react";

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "streamer" | "user">(
    "all"
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]);

  const fetchUsers = async () => {
    try {
      const data = await usersAPI.findAll();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (filterRole === "streamer") {
      filtered = filtered.filter((u) => u.isStreamer);
    } else if (filterRole === "user") {
      filtered = filtered.filter((u) => !u.isStreamer);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      await usersAPI.remove(selectedUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setSelectedUser(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateUserRole = async (
    id: string,
    role: string,
    isStreamer: boolean
  ) => {
    setIsUpdating(true);
    try {
      await usersAPI.update(id, { role, isStreamer });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role, isStreamer } : u))
      );
      if (selectedUser?.id === id) {
        setSelectedUser({ ...selectedUser, role, isStreamer });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user role");
    } finally {
      setIsUpdating(false);
    }
  };

  // Check if user can be made a streamer (must have an inactive shop)
  const canBecomeStreamer = (user: User) => {
    return user.shop && !user.shop.isActive;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-xl text-slate-400">Loading users...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Users Management
        </h1>
        <p className="text-slate-400 mb-6">Manage all platform users</p>

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
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="px-4 py-2 bg-slate-900 border border-slate-600 text-slate-100 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="all">All Users</option>
                <option value="streamer">Streamers</option>
                <option value="user">Regular Users</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-4">
            <p className="text-slate-400 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-slate-100">{users.length}</p>
          </div>
          <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-4">
            <p className="text-slate-400 text-sm">Streamers</p>
            <p className="text-2xl font-bold text-purple-400">
              {users.filter((u) => u.isStreamer).length}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-4">
            <p className="text-slate-400 text-sm">Regular Users</p>
            <p className="text-2xl font-bold text-blue-400">
              {users.filter((u) => !u.isStreamer).length}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-4">
            <p className="text-slate-400 text-sm">Verified</p>
            <p className="text-2xl font-bold text-green-400">
              {users.filter((u) => u.is_verified).length}
            </p>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No users found matching your criteria
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Role
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
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10">
                            {user.image ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={`${import.meta.env.VITE_API_BASE_URL}${
                                  user.image
                                }`}
                                alt={user.username || user.email}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <span className="text-indigo-400 font-medium">
                                  {(user.username ||
                                    user.firstname ||
                                    user.email)[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-100">
                              {user.firstname && user.lastname
                                ? `${user.firstname} ${user.lastname}`
                                : user.username || "N/A"}
                            </div>
                            <div className="text-sm text-slate-400">
                              @{user.username || "no-username"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-200 flex items-center gap-1">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {user.email}
                        </div>
                        {user.phoneNumber && (
                          <div className="text-sm text-slate-400 flex items-center gap-1">
                            <Phone className="w-4 h-4 text-slate-500" />
                            {user.phoneNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isStreamer
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {user.isStreamer ? (
                            <span className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Streamer
                            </span>
                          ) : user.role === "admin" ? (
                            <span className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Admin
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <UserCircle className="w-3 h-3" />
                              User
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.is_verified
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {user.is_verified ? (
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            "Unverified"
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-100">
                    User Details
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setShowDeleteConfirm(false);
                    }}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {selectedUser.image ? (
                      <img
                        className="h-20 w-20 rounded-full object-cover"
                        src={`${import.meta.env.VITE_API_BASE_URL}${
                          selectedUser.image
                        }`}
                        alt={selectedUser.username || selectedUser.email}
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <span className="text-indigo-400 font-medium text-2xl">
                          {(selectedUser.username ||
                            selectedUser.email)[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-slate-100">
                        {selectedUser.firstname && selectedUser.lastname
                          ? `${selectedUser.firstname} ${selectedUser.lastname}`
                          : selectedUser.username || "N/A"}
                      </h3>
                      <p className="text-slate-400">
                        @{selectedUser.username || "no-username"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium text-slate-200">
                        {selectedUser.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium text-slate-200">
                        {selectedUser.phoneNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Current Role</p>
                      <p className="font-medium text-slate-200">
                        {selectedUser.isStreamer ? "Streamer" : "User"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      <p
                        className={`font-medium ${
                          selectedUser.is_verified
                            ? "text-green-400"
                            : "text-slate-400"
                        }`}
                      >
                        {selectedUser.is_verified ? "Verified" : "Unverified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Followers</p>
                      <p className="font-medium text-slate-200">
                        {selectedUser.followers?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Following</p>
                      <p className="font-medium text-slate-200">
                        {selectedUser.following?.length || 0}
                      </p>
                    </div>
                  </div>

                  {selectedUser.bio && (
                    <div>
                      <p className="text-sm text-slate-500">Bio</p>
                      <p className="font-medium text-slate-200">
                        {selectedUser.bio}
                      </p>
                    </div>
                  )}

                  {selectedUser.shop && (
                    <div className="border-t border-slate-700 pt-4">
                      <p className="text-sm text-slate-500 mb-2">Shop</p>
                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-slate-200">
                            {selectedUser.shop.name || "Unnamed Shop"}
                          </p>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              selectedUser.shop.isActive
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                            }`}
                          >
                            {selectedUser.shop.isActive ? "Active" : "Pending"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">
                          {selectedUser.shop.email}
                        </p>
                        <p className="text-sm text-slate-400">
                          {selectedUser.shop.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {!showDeleteConfirm ? (
                    <div className="space-y-3 pt-4">
                      {/* {!selectedUser.isStreamer &&
                        !canBecomeStreamer(selectedUser) && (
                          <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
                            <p className="text-yellow-400 text-sm">
                              <strong>Note:</strong> This user can only be made
                              a streamer if they have a shop pending activation.
                            </p>
                          </div>
                        )} */}
                      <div className="flex gap-3">
                        {!selectedUser.isStreamer ? (
                          <button
                            onClick={() =>
                              handleUpdateUserRole(
                                selectedUser.id,
                                "streamer",
                                true
                              )
                            }
                            disabled={
                              isUpdating || !canBecomeStreamer(selectedUser)
                            }
                            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                            title={
                              !canBecomeStreamer(selectedUser)
                                ? "User must have a shop pending activation"
                                : ""
                            }
                          >
                            <Shield className="w-5 h-5" />
                            Make Streamer
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleUpdateUserRole(
                                selectedUser.id,
                                "user",
                                false
                              )
                            }
                            disabled={isUpdating}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                          >
                            <UserCircle className="w-5 h-5" />
                            Make Regular User
                          </button>
                        )}
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                        >
                          <Trash2 className="w-5 h-5" />
                          Delete User
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-slate-700 pt-4">
                      <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg mb-4">
                        <p className="text-red-400 font-medium mb-2">
                          Are you sure you want to delete this user?
                        </p>
                        <p className="text-slate-400 text-sm">
                          This action cannot be undone. All user data will be
                          permanently removed.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleDeleteUser}
                          disabled={isUpdating}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isUpdating ? "Deleting..." : "Confirm Delete"}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 bg-slate-700 text-slate-200 py-2 px-4 rounded-md hover:bg-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

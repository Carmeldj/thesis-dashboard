import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { shopsAPI, usersAPI } from "../services/api";
import type { Shop } from "../types";
import {
  Store,
  CheckCircle,
  XCircle,
  Search,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";

export const Shops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    filterShops();
  }, [shops, searchTerm, filterStatus]);

  const fetchShops = async () => {
    try {
      const data = await shopsAPI.findAll();
      setShops(data);
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterShops = () => {
    let filtered = shops;

    // Filter by status
    if (filterStatus === "active") {
      filtered = filtered.filter((s) => s.isActive);
    } else if (filterStatus === "inactive") {
      filtered = filtered.filter((s) => !s.isActive);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredShops(filtered);
  };

  const handleToggleShopStatus = async (
    id: string,
    userId: string,
    isActive: boolean
  ) => {
    setIsUpdating(true);
    try {
      await shopsAPI.update(id, { isActive });
      await usersAPI.update(userId, { isStreamer: isActive });
      setShops((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive } : s))
      );
      setSelectedShop(null);
    } catch (error) {
      console.error("Error updating shop:", error);
      alert("Failed to update shop status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-xl text-slate-600 dark:text-slate-400">Loading shops...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Shops Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Manage and activate shop accounts</p>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600 dark:text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-slate-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Store className="text-slate-600 dark:text-slate-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="all">All Shops</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm">Total Shops</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{shops.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-400">
              {shops.filter((s) => s.isActive).length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm">Inactive</p>
            <p className="text-2xl font-bold text-orange-400">
              {shops.filter((s) => !s.isActive).length}
            </p>
          </div>
        </div>

        {/* Shops Grid */}
        {filteredShops.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-600 dark:text-slate-400">
            No shops found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-600 transition overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
                        <Store className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                          {shop.name || "Unnamed Shop"}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            shop.isActive
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-slate-700 text-slate-300 border border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {shop.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="truncate">{shop.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{shop.phone}</span>
                    </div>
                    {shop.website && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Globe className="w-4 h-4 shrink-0" />
                        <a
                          href={shop.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:underline truncate"
                        >
                          {shop.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 mb-2">Owner</p>
                    <p className="text-sm font-medium text-slate-200">
                      {shop.user?.firstname && shop.user?.lastname
                        ? `${shop.user.firstname} ${shop.user.lastname}`
                        : shop.user?.username || shop.user?.email || "N/A"}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedShop(shop)}
                    className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedShop && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Shop Details
                  </h2>
                  <button
                    onClick={() => setSelectedShop(null)}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20">
                      <Store className="w-12 h-12 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                        {selectedShop.name || "Unnamed Shop"}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">IFU: {selectedShop.ifu}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium text-slate-200">
                        {selectedShop.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium text-slate-200">
                        {selectedShop.phone}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="font-medium text-slate-200">
                        {selectedShop.address}
                      </p>
                    </div>
                    {selectedShop.website && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-slate-500">Website</p>
                        <a
                          href={selectedShop.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-400 hover:underline"
                        >
                          {selectedShop.website}
                        </a>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      <p
                        className={`font-medium ${
                          selectedShop.isActive
                            ? "text-green-400"
                            : "text-slate-400"
                        }`}
                      >
                        {selectedShop.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <p className="text-sm text-slate-500 mb-2">Shop Owner</p>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <p className="font-medium text-slate-200">
                        {selectedShop.user?.firstname &&
                        selectedShop.user?.lastname
                          ? `${selectedShop.user.firstname} ${selectedShop.user.lastname}`
                          : selectedShop.user?.username || "N/A"}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {selectedShop.user?.email}
                      </p>
                      {selectedShop.user?.phoneNumber && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedShop.user.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    {!selectedShop.isActive ? (
                      <button
                        onClick={() =>
                          handleToggleShopStatus(
                            selectedShop.id,
                            selectedShop.user!.id,
                            true
                          )
                        }
                        disabled={isUpdating}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Activate Shop
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleToggleShopStatus(
                            selectedShop.id,
                            selectedShop.user!.id,
                            false
                          )
                        }
                        disabled={isUpdating}
                        className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                      >
                        <XCircle className="w-5 h-5" />
                        Deactivate Shop
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedShop(null)}
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

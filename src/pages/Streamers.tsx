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
          <div className="text-xl text-slate-600">Chargement des streamers...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Gestion des Streamers
        </h1>
        <p className="text-slate-600 mb-6">
          Valider et gérer les comptes streamers
        </p>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, pseudo ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-slate-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-slate-600 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="all">Tous les Streamers</option>
                <option value="verified">Vérifiés</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-4">
            <p className="text-slate-600 text-sm">Total Streamers</p>
            <p className="text-2xl font-bold text-slate-900">
              {streamers.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-4">
            <p className="text-slate-600 text-sm">Vérifiés</p>
            <p className="text-2xl font-bold text-green-600">
              {streamers.filter((s) => s.is_verified).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-4">
            <p className="text-slate-600 text-sm">En attente</p>
            <p className="text-2xl font-bold text-orange-600">
              {streamers.filter((s) => !s.is_verified).length}
            </p>
          </div>
        </div>

        {/* Streamers List */}
        <div className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
          {filteredStreamers.length === 0 ? (
            <div className="p-8 text-center text-slate-600">
              Aucun streamer trouvé correspondant à vos critères
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Streamer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Inscrit le
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredStreamers.map((streamer) => (
                    <tr key={streamer.id} className="hover:bg-slate-50">
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
                                <span className="text-indigo-600 font-medium">
                                  {(streamer.username ||
                                    streamer.firstname ||
                                    streamer.email)[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {streamer.firstname && streamer.lastname
                                ? `${streamer.firstname} ${streamer.lastname}`
                                : streamer.username || "N/A"}
                            </div>
                            <div className="text-sm text-slate-600">
                              @{streamer.username || "sans-pseudo"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-700 flex items-center gap-1">
                          <Mail className="w-4 h-4 text-slate-600" />
                          {streamer.email}
                        </div>
                        {streamer.phoneNumber && (
                          <div className="text-sm text-slate-600 flex items-center gap-1">
                            <Phone className="w-4 h-4 text-slate-500" />
                            {streamer.phoneNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            streamer.is_verified
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-orange-100 text-orange-700 border border-orange-200"
                          }`}
                        >
                          {streamer.is_verified ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Vérifié
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              En attente
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(streamer.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedStreamer(streamer)}
                          className="text-indigo-600 hover:text-indigo-800 mr-4"
                        >
                          Voir Détails
                        </button>
                        {!streamer.is_verified && (
                          <button
                            onClick={() =>
                              handleVerifyStreamer(streamer.id, true)
                            }
                            disabled={isUpdating}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                          >
                            Vérifier
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
            <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Détails du Streamer
                  </h2>
                  <button
                    onClick={() => setSelectedStreamer(null)}
                    className="text-slate-600 hover:text-slate-800"
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
                      <h3 className="text-xl font-semibold text-slate-900">
                        {selectedStreamer.firstname && selectedStreamer.lastname
                          ? `${selectedStreamer.firstname} ${selectedStreamer.lastname}`
                          : selectedStreamer.username || "N/A"}
                      </h3>
                      <p className="text-slate-600">
                        @{selectedStreamer.username || "sans-pseudo"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium text-slate-700">
                        {selectedStreamer.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Téléphone</p>
                      <p className="font-medium text-slate-700">
                        {selectedStreamer.phoneNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Rôle</p>
                      <p className="font-medium text-slate-700">
                        {selectedStreamer.role || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Statut</p>
                      <p
                        className={`font-medium ${
                          selectedStreamer.is_verified
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {selectedStreamer.is_verified ? "Vérifié" : "En attente"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Abonnés</p>
                      <p className="font-medium text-slate-700">
                        {selectedStreamer.followers?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Abonnements</p>
                      <p className="font-medium text-slate-700">
                        {selectedStreamer.following?.length || 0}
                      </p>
                    </div>
                  </div>

                  {selectedStreamer.bio && (
                    <div>
                      <p className="text-sm text-slate-500">Bio</p>
                      <p className="font-medium text-slate-700">
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
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Vérifier le Streamer
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleVerifyStreamer(selectedStreamer.id, false)
                        }
                        disabled={isUpdating}
                        className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                      >
                        <XCircle className="w-5 h-5" />
                        Révoquer la Vérification
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedStreamer(null)}
                      className="flex-1 bg-slate-200 text-slate-700 py-2 px-4 rounded-md hover:bg-slate-300"
                    >
                      Fermer
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

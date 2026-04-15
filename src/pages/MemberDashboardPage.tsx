import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { publicationService, Publication } from "@/services/publicationService";
import { toast } from "sonner";

export default function MemberDashboardPage() {
  const { user, signOut } = useAuth();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      const data = await publicationService.getPublished();
      setPublications(data);
    } catch (error) {
      console.error("Error loading publications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pub: Publication) => {
    if (pub.file_url) {
      window.open(pub.file_url, '_blank');
      await publicationService.incrementDownloads(pub.id);
    }
  };

  return (
    <div className="pt-[78px] min-h-screen bg-nasmed-off-white">
      {/* Header */}
      <div className="bg-nasmed-navy py-12 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl text-white mb-2">
                Welcome, {user?.full_name || user?.email}
              </h1>
              <p className="text-white/60">
                {user?.membership_type || "Member"} Dashboard
              </p>
            </div>
            <button
              onClick={signOut}
              className="bg-white/10 text-white py-2 px-5 rounded-lg text-sm font-medium hover:bg-white/20 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-green">
            <div className="text-2xl mb-2">📚</div>
            <div className="font-heading text-2xl font-bold text-nasmed-navy">{publications.length}</div>
            <div className="text-sm text-nasmed-text-muted">Available Publications</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-mid-blue">
            <div className="text-2xl mb-2">👥</div>
            <div className="font-heading text-2xl font-bold text-nasmed-navy">Active</div>
            <div className="text-sm text-nasmed-text-muted">Membership Status</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-amber-500">
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-heading text-2xl font-bold text-nasmed-navy">CPD</div>
            <div className="text-sm text-nasmed-text-muted">Available Credits</div>
          </div>
        </div>

        {/* Publications */}
        <div className="bg-white rounded-[14px] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl text-nasmed-navy">Latest Publications</h2>
            <Link to="/publications" className="text-nasmed-green text-sm font-medium hover:underline">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-nasmed-green border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : publications.length === 0 ? (
            <div className="text-center py-12 text-nasmed-text-muted">
              No publications available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publications.slice(0, 6).map(pub => (
                <div key={pub.id} className="border border-nasmed-gray-light rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <span className="bg-nasmed-mid-blue/10 text-nasmed-mid-blue text-xs px-2 py-1 rounded">
                      {pub.type}
                    </span>
                    <span className="text-xs text-nasmed-text-muted">{pub.downloads} downloads</span>
                  </div>
                  <h3 className="font-bold text-nasmed-navy mb-2">{pub.title}</h3>
                  <p className="text-sm text-nasmed-text-muted mb-3 line-clamp-2">{pub.description}</p>
                  <button
                    onClick={() => handleDownload(pub)}
                    className="text-nasmed-green text-sm font-medium hover:underline"
                  >
                    {pub.file_url ? "Download →" : "Read More →"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          <div className="bg-white rounded-[14px] p-6 shadow-sm">
            <h3 className="font-heading text-lg text-nasmed-navy mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/membership" className="flex items-center gap-3 text-nasmed-text-muted hover:text-nasmed-navy">
                <span>📋</span> Update Profile
              </Link>
              <Link to="/publications" className="flex items-center gap-3 text-nasmed-text-muted hover:text-nasmed-navy">
                <span>📚</span> Browse Publications
              </Link>
              <Link to="/contact" className="flex items-center gap-3 text-nasmed-text-muted hover:text-nasmed-navy">
                <span>✉️</span> Contact Support
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-[14px] p-6 shadow-sm">
            <h3 className="font-heading text-lg text-nasmed-navy mb-4">Upcoming Events</h3>
            <div className="text-center py-4 text-nasmed-text-muted">
              No upcoming events scheduled.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
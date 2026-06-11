import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import logo from "@/assets/nasmed-logo.png";
import authService from "@/lib/authService";
import supabase from "@/lib/supabaseClient";
import html2canvas from "html2canvas";
import emailjs from "@emailjs/browser";
import { CertificateFrame } from "@/components/MembershipCertificate";
import applicationService, { Application } from "@/services/applicationService";
import userService from "@/services/userService";
import publicationService, { Publication } from "@/services/publicationService";
import transactionService from "@/services/transactionService";
import newsService, { NewsPost, NewsEvent, Poster } from "@/services/newsService";
import eventRegistrationService, { EventRegistration } from "@/services/eventRegistrationService";
import subscriptionService, { Subscription as DbSubscription } from "@/services/subscriptionService";

// ── Display types matching existing JSX field references ──
interface DisplayApp {
  id: string; name: string; email: string; prof: string; tier: string;
  state: string; date: string; status: string; phone: string; altEmail: string;
  qualifications: string; workplace: string;
  referee1: { name: string; email: string; mobile: string };
  referee2: { name: string; email: string; mobile: string };
  statement: string; payment: string; submitted: string;
  receiptUrl?: string; receiptName?: string;
}

interface DisplayMember {
  id: string;   // member_number (for display)
  _dbId: string; // Supabase UUID (for DB ops)
  name: string; username: string; email: string; password: string;
  prof: string; tier: string; state: string; joined: string;
  status: string; position: string; mustChange: boolean;
}

interface DisplayPub {
  id: string; title: string; type: string; date: string;
  downloads: number; status: string; access: string; price: string; fileName: string;
}

interface DisplayTxn {
  id: string; ref: string; member: string; email: string; tier: string;
  amount: string; currency: string; method: string; status: string;
  description: string; date: string; type: string;
  receiptUrl?: string; receiptName?: string;
}

interface DisplayEventReg {
  id: string; eventTitle: string; name: string; email: string;
  organisation: string; duesStatus: string; fee: string;
  paymentStatus: string; paymentRef: string; paymentMethod: string;
  status: string; date: string; receiptUrl: string; notes: string;
}

function toDisplayApp(a: Application): DisplayApp {
  return {
    id: a.id,
    name: a.full_name,
    email: a.email,
    prof: a.profession || "",
    tier: a.membership_type || "",
    state: a.state || "",
    date: new Date(a.created_at).toLocaleDateString("en-GB"),
    status: a.status,
    phone: a.phone || "",
    altEmail: "",
    qualifications: a.qualifications || "",
    workplace: a.workplace || "",
    referee1: { name: a.referee1_name || "", email: a.referee1_email || "", mobile: a.referee1_phone || "" },
    referee2: { name: a.referee2_name || "", email: a.referee2_email || "", mobile: a.referee2_phone || "" },
    statement: a.statement || "",
    payment: a.payment_status === "paid" ? "Paid" : "Pending",
    submitted: new Date(a.created_at).toLocaleDateString("en-GB"),
    receiptUrl: (a as unknown as Record<string, string>).payment_receipt_url || undefined,
  };
}

function toDisplayMember(p: ReturnType<typeof Object.assign>): DisplayMember {
  return {
    id: p.member_number || p.id,
    _dbId: p.id,
    name: p.full_name || "",
    username: p.username || "",
    email: p.email || "",
    password: "nasmed2024!",
    prof: p.profession || p.membership_type || "",
    tier: p.membership_type || "",
    state: p.state || "",
    joined: p.created_at ? new Date(p.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
    status: p.status || "active",
    position: p.position || "",
    mustChange: p.must_change_password ?? false,
  };
}

function toDisplayPub(p: Record<string, unknown>): DisplayPub {
  const createdAt = p.created_at as string | undefined;
  const fileUrl = p.file_url as string | undefined;
  return {
    id: p.id as string,
    title: (p.title as string) || "",
    type: (p.type as string) || "",
    date: createdAt ? new Date(createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
    downloads: (p.downloads as number) || 0,
    status: (p.status as string) || "draft",
    access: (p.access as string) || "free",
    price: (p.price as string) || "",
    fileName: (p.file_name as string) || (fileUrl ? fileUrl.split("/").pop() || "" : ""),
  };
}

function toDisplayTxn(t: Record<string, unknown>): DisplayTxn {
  const createdAt = t.created_at as string | undefined;
  return {
    id: t.id as string,
    ref: (t.payment_ref as string) || "",
    member: (t.member_name as string) || "",
    email: (t.email as string) || "",
    tier: (t.membership_type as string) || "",
    amount: (t.amount as string) || "",
    currency: (t.currency as string) || "NGN",
    method: (t.payment_method as string) || "",
    status: (t.status as string) || "pending",
    description: (t.description as string) || "",
    date: createdAt ? new Date(createdAt).toLocaleDateString("en-GB") : "",
    type: (t.type as string) || "membership",
    receiptUrl: (t.receipt_url as string) || undefined,
    receiptName: (t.receipt_name as string) || undefined,
  };
}

function toDisplayEventReg(r: EventRegistration): DisplayEventReg {
  const receiptUrl = r.notes?.startsWith("Receipt: ") ? r.notes.slice("Receipt: ".length).trim() : "";
  return {
    id: r.id,
    eventTitle: r.event_title,
    name: r.full_name,
    email: r.email,
    organisation: r.organisation || "—",
    duesStatus: r.dues_status === "member" ? "Paid-up member" : "Non-dues-paying",
    fee: r.registration_fee === 0 ? "Free" : `₦${r.registration_fee.toLocaleString("en-NG")}`,
    paymentStatus: r.payment_status,
    paymentRef: r.payment_ref || "—",
    paymentMethod: r.payment_method || "—",
    status: r.status,
    date: new Date(r.created_at).toLocaleDateString("en-GB"),
    receiptUrl,
    notes: r.notes || "",
  };
}

const TIER_AMOUNTS: Record<string, string> = {
  "Fellow (FNASMED)": "₦250,000",
  "Individual Member": "₦25,000",
  "Associate Member": "₦150,000",
  "Student Membership": "₦2,500",
  "International Membership": "$50",
};

const nigerianStates = [
  "Abuja (FCT)", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

type DisplaySubscription = { id: string; member: string; tier: string; start: string; expiry: string; status: string; amount: string };

const LOCAL_ADMIN_PASSWORD = "nasmed@admin2024";

export default function AdminPage() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [localAuth, setLocalAuth] = useState(() => sessionStorage.getItem("nasmed_admin") === "1");
  const [localPw, setLocalPw] = useState("");
  const [localErr, setLocalErr] = useState("");

  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [applications, setApplications] = useState<DisplayApp[]>([]);
  const [members, setMembers] = useState<DisplayMember[]>([]);
  const [publications, setPublications] = useState<DisplayPub[]>([]);
  const [transactions, setTransactions] = useState<DisplayTxn[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<DisplayEventReg[]>([]);
  const [viewRegModal, setViewRegModal] = useState<DisplayEventReg | null>(null);
  const [regReplyText, setRegReplyText] = useState("");
  const [dbSubscriptions, setDbSubscriptions] = useState<DbSubscription[]>([]);
  const [appsTab, setAppsTab] = useState<"membership" | "events">("membership");
  const [search, setSearch] = useState("");

  // Map DB subscriptions to display shape, resolving member name from loaded members
  const subscriptions: DisplaySubscription[] = dbSubscriptions.map(s => {
    const memberRecord = members.find(m => m._dbId === s.member_id);
    return {
      id: s.id,
      member: memberRecord?.name || s.member_id || "—",
      tier: s.tier || memberRecord?.tier || "—",
      start: s.start_date ? new Date(s.start_date).toLocaleDateString("en-GB") : "—",
      expiry: s.expiry_date ? new Date(s.expiry_date).toLocaleDateString("en-GB") : "—",
      status: s.status || "active",
      amount: s.amount || TIER_AMOUNTS[s.tier ?? ""] || "—",
    };
  });

  const confirmedNGN = transactions
    .filter(t => t.status === "confirmed" && t.currency === "NGN")
    .reduce((sum, t) => sum + (parseFloat((t.amount || "0").replace(/[^0-9.]/g, "")) || 0), 0);
  const revenueLabel = confirmedNGN >= 1_000_000
    ? `₦${(confirmedNGN / 1_000_000).toFixed(1)}M confirmed`
    : confirmedNGN > 0
    ? `₦${confirmedNGN.toLocaleString()} confirmed`
    : "No confirmed payments yet";

  const [viewApp, setViewApp] = useState<DisplayApp | null>(null);
  const [viewTxn, setViewTxn] = useState<DisplayTxn | null>(null);
  const [deletingTxnId, setDeletingTxnId] = useState<string | null>(null);
  const [afFname, setAfFname] = useState("");
  const [afLname, setAfLname] = useState("");
  const [afEmail, setAfEmail] = useState("");
  const [afPhone, setAfPhone] = useState("");
  const [afProf, setAfProf] = useState("");
  const [afTier, setAfTier] = useState("Professional Member");
  const [afState, setAfState] = useState("");
  const [pubTitle, setPubTitle] = useState("");
  const [pubType, setPubType] = useState("Guidelines");
  const [pubContent, setPubContent] = useState("");
  const [pubAccess, setPubAccess] = useState("free");
  const [pubPrice, setPubPrice] = useState("");
  const [pubFile, setPubFile] = useState<File | null>(null);
  const [editMember, setEditMember] = useState<DisplayMember | null>(null);
  const [txnTypeFilter, setTxnTypeFilter] = useState<"all" | "membership" | "contribution" | "event_registration">("all");

  // News & Events state
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [npTitle, setNpTitle] = useState("");
  const [npDesc, setNpDesc] = useState("");
  const [npCat, setNpCat] = useState("update");
  const [npCatLabel, setNpCatLabel] = useState("UPDATE");
  const [npDateLabel, setNpDateLabel] = useState("");
  const [npReadTime, setNpReadTime] = useState("3 min read");
  const [evTitle, setEvTitle] = useState("");
  const [evDesc, setEvDesc] = useState("");
  const [evLocation, setEvLocation] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evCtaText, setEvCtaText] = useState("Register");
  const [evCtaStyle, setEvCtaStyle] = useState<"filled" | "outline">("filled");
  const [evRegistrationFee, setEvRegistrationFee] = useState("0");
  const [evBodyContent, setEvBodyContent] = useState("");
  const [evFlierFile, setEvFlierFile] = useState<File | null>(null);
  const [evFlierPreview, setEvFlierPreview] = useState<string | null>(null);

  // Posters state
  const [posters, setPosters] = useState<Poster[]>([]);
  const [posterTitle, setPosterTitle] = useState("");
  const [posterDesc, setPosterDesc] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [editPoster, setEditPoster] = useState<Poster | null>(null);
  const [eposterTitle, setEposterTitle] = useState("");
  const [eposterDesc, setEposterDesc] = useState("");

  const canAccess = localAuth || (!loading && isAdmin);

  const [approvedCreds, setApprovedCreds] = useState<{ name: string; username: string; nasmedEmail: string; memberNumber: string; password: string } | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [certToSend, setCertToSend] = useState<{ name: string; certNumber: string; date: string; tier: string; email: string } | null>(null);

  // Edit news post
  const [editPost, setEditPost] = useState<NewsPost | null>(null);
  const [epTitle, setEpTitle] = useState("");
  const [epDesc, setEpDesc] = useState("");
  const [epCat, setEpCat] = useState("update");
  const [epCatLabel, setEpCatLabel] = useState("UPDATE");
  const [epDateLabel, setEpDateLabel] = useState("");
  const [epReadTime, setEpReadTime] = useState("3 min read");

  const openEditPost = (p: NewsPost) => {
    setEditPost(p);
    setEpTitle(p.title);
    setEpDesc(p.description);
    setEpCat(p.category);
    setEpCatLabel(p.category_label);
    setEpDateLabel(p.date_label || "");
    setEpReadTime(p.read_time || "3 min read");
  };

  const saveEditPost = async () => {
    if (!editPost) return;
    if (!epTitle.trim()) { toast.error("Title is required."); return; }
    try {
      await newsService.updatePost(editPost.id, { title: epTitle, description: epDesc, category: epCat, category_label: epCatLabel, date_label: epDateLabel, read_time: epReadTime });
      setNewsPosts(prev => prev.map(x => x.id === editPost.id ? { ...x, title: epTitle, description: epDesc, category: epCat, category_label: epCatLabel, date_label: epDateLabel, read_time: epReadTime } : x));
      setEditPost(null);
      toast.success("Post updated.");
    } catch { toast.error("Failed to update post."); }
  };

  // Edit event
  const [editEvent, setEditEvent] = useState<NewsEvent | null>(null);
  const [eeTitle, setEeTitle] = useState("");
  const [eeDesc, setEeDesc] = useState("");
  const [eeLocation, setEeLocation] = useState("");
  const [eeDate, setEeDate] = useState("");
  const [eeCtaText, setEeCtaText] = useState("Register");
  const [eeCtaStyle, setEeCtaStyle] = useState<"filled" | "outline">("filled");
  const [eeFee, setEeFee] = useState("0");
  const [eeBody, setEeBody] = useState("");
  const [eeFlierUrl, setEeFlierUrl] = useState("");
  const [eeFlierFile, setEeFlierFile] = useState<File | null>(null);
  const [eeFlierPreview, setEeFlierPreview] = useState<string | null>(null);

  const openEditEvent = (ev: NewsEvent) => {
    setEditEvent(ev);
    setEeTitle(ev.title);
    setEeDesc(ev.description);
    setEeLocation(ev.location || "");
    setEeDate(ev.event_date ? ev.event_date.slice(0, 10) : "");
    setEeCtaText(ev.cta_text);
    setEeCtaStyle(ev.cta_style);
    setEeFee(String(ev.registration_fee || 0));
    setEeBody(ev.body_content || "");
    setEeFlierUrl(ev.flier_url || "");
    setEeFlierFile(null);
    setEeFlierPreview(null);
  };

  const saveEditEvent = async () => {
    if (!editEvent) return;
    if (!eeTitle.trim()) { toast.error("Title is required."); return; }
    const d = eeDate ? new Date(eeDate) : null;
    try {
      let flierUrl = eeFlierUrl;
      if (eeFlierFile) {
        flierUrl = await newsService.uploadEventFlier(eeFlierFile);
      }
      const updates: Partial<NewsEvent> = {
        title: eeTitle, description: eeDesc, location: eeLocation,
        event_date: eeDate || undefined,
        day_label: d ? String(d.getDate()).padStart(2, "0") : editEvent.day_label,
        month_label: d ? d.toLocaleString("en-US", { month: "short" }).toUpperCase() : editEvent.month_label,
        cta_text: eeCtaText, cta_style: eeCtaStyle,
        registration_fee: Number(eeFee) || 0,
        body_content: eeBody || undefined,
        flier_url: flierUrl || undefined,
      };
      await newsService.updateEvent(editEvent.id, updates);
      setNewsEvents(prev => prev.map(x => x.id === editEvent.id ? { ...x, ...updates } : x));
      setEditEvent(null);
      toast.success("Event updated.");
    } catch { toast.error("Failed to update event."); }
  };

  // Edit publication
  const [editPubItem, setEditPubItem] = useState<DisplayPub | null>(null);
  const [epubTitle, setEpubTitle] = useState("");
  const [epubType, setEpubType] = useState("Guidelines");
  const [epubContent, setEpubContent] = useState("");
  const [epubAccess, setEpubAccess] = useState("free");
  const [epubPrice, setEpubPrice] = useState("");

  const openEditPub = (p: DisplayPub) => {
    setEditPubItem(p);
    setEpubTitle(p.title);
    setEpubType(p.type);
    setEpubContent("");
    setEpubAccess(p.access);
    setEpubPrice(p.price);
  };

  const saveEditPub = async () => {
    if (!editPubItem) return;
    if (!epubTitle.trim()) { toast.error("Title is required."); return; }
    try {
      await publicationService.update(editPubItem.id, {
        title: epubTitle,
        type: epubType as Publication["type"],
        description: epubContent || undefined,
        access: epubAccess,
        price: epubAccess === "paid" ? epubPrice : undefined,
      });
      setPublications(prev => prev.map(x => x.id === editPubItem.id ? { ...x, title: epubTitle, type: epubType, access: epubAccess, price: epubPrice } : x));
      setEditPubItem(null);
      toast.success("Publication updated.");
    } catch { toast.error("Failed to update publication."); }
  };

  // Certificate email effect
  useEffect(() => {
    if (!certToSend) return;
    const timer = setTimeout(async () => {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;
      if (!serviceId || !templateId || !publicKey) {
        toast.info("EmailJS not configured — certificate not emailed.");
        setCertToSend(null);
        return;
      }
      try {
        const el = document.getElementById("admin-cert-hidden");
        if (!el) throw new Error("cert element missing");
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#fff" });
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        await emailjs.send(serviceId, templateId, {
          to_email: certToSend.email,
          member_name: certToSend.name,
          cert_number: certToSend.certNumber,
          membership_type: certToSend.tier,
          issue_date: certToSend.date,
          certificate_image: imageData,
        }, publicKey);
        toast.success(`Membership certificate emailed to ${certToSend.email}`);
      } catch {
        toast.error("Could not send certificate email — check EmailJS config.");
      } finally {
        setCertToSend(null);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [certToSend]);

  // Real-time data loading
  useEffect(() => {
    if (!canAccess) return;

    const loadAll = () => {
      applicationService.getAll().then(data => setApplications(data.map(toDisplayApp))).catch(() => {});
      userService.getAll().then(data => setMembers(data.filter(p => p.role === "member").map(toDisplayMember))).catch(() => {});
      publicationService.getAll().then(data => setPublications(data.map(d => toDisplayPub(d as unknown as Record<string, unknown>)))).catch(() => {});
      transactionService.getAll().then(data => setTransactions(data.map(d => toDisplayTxn(d as unknown as Record<string, unknown>)))).catch(() => {});
      newsService.getAllPostsAdmin().then(data => setNewsPosts(data)).catch(() => {});
      newsService.getAllEventsAdmin().then(data => setNewsEvents(data)).catch(() => {});
      newsService.getAllPostersAdmin().then(data => setPosters(data)).catch(() => {});
      eventRegistrationService.getAll().then(data => setEventRegistrations(data.map(toDisplayEventReg))).catch(() => {});
      subscriptionService.getAll().then(data => setDbSubscriptions(data)).catch(() => {});
    };

    loadAll();

    const appSub = applicationService.subscribeToChanges(() => {
      applicationService.getAll().then(data => setApplications(data.map(toDisplayApp))).catch(() => {});
    });
    const memberSub = userService.subscribeToChanges(() => {
      userService.getAll().then(data => setMembers(data.filter(p => p.role === "member").map(toDisplayMember))).catch(() => {});
    });
    const pubSub = publicationService.subscribeToChanges(() => {
      publicationService.getAll().then(data => setPublications(data.map(d => toDisplayPub(d as unknown as Record<string, unknown>)))).catch(() => {});
    });
    const txnSub = transactionService.subscribeToChanges(() => {
      transactionService.getAll().then(data => setTransactions(data.map(d => toDisplayTxn(d as unknown as Record<string, unknown>)))).catch(() => {});
    });
    const newsSub = newsService.subscribeToPostChanges(() => {
      newsService.getAllPostsAdmin().then(data => setNewsPosts(data)).catch(() => {});
    });
    const eventSub = newsService.subscribeToEventChanges(() => {
      newsService.getAllEventsAdmin().then(data => setNewsEvents(data)).catch(() => {});
    });
    const posterSub = newsService.subscribeToPosterChanges(() => {
      newsService.getAllPostersAdmin().then(data => setPosters(data)).catch(() => {});
    });
    const evRegSub = eventRegistrationService.subscribeToChanges(() => {
      eventRegistrationService.getAll().then(data => setEventRegistrations(data.map(toDisplayEventReg))).catch(() => {});
    });
    const subSub = subscriptionService.subscribeToChanges(() => {
      subscriptionService.getAll().then(data => setDbSubscriptions(data)).catch(() => {});
    });

    return () => {
      supabase.removeChannel(appSub);
      supabase.removeChannel(memberSub);
      supabase.removeChannel(pubSub);
      supabase.removeChannel(txnSub);
      supabase.removeChannel(newsSub);
      supabase.removeChannel(eventSub);
      supabase.removeChannel(evRegSub);
      supabase.removeChannel(subSub);
      supabase.removeChannel(posterSub);
    };
  }, [canAccess]);

  if (!canAccess && !loading) {
    const handleLocalLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (localPw === LOCAL_ADMIN_PASSWORD) {
        sessionStorage.setItem("nasmed_admin", "1");
        setLocalAuth(true);
        setLocalErr("");
      } else {
        setLocalErr("Incorrect password. Please try again.");
      }
    };

    return (
      <div className="pt-[78px] min-h-screen bg-nasmed-off-white flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 w-full max-w-[400px] shadow-xl text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="font-heading text-nasmed-navy text-[24px] mb-1">Admin Portal</h2>
          <p className="text-nasmed-text-muted text-sm mb-7">Enter your admin password to continue.</p>
          <form onSubmit={handleLocalLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={localPw}
              onChange={e => setLocalPw(e.target.value)}
              placeholder="Admin password"
              className="py-3 px-4 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
              autoFocus
            />
            {localErr && <p className="text-red-500 text-xs">{localErr}</p>}
            <button type="submit" className="bg-nasmed-green text-white border-none py-3 px-6 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen message="Verifying admin access..." size="medium" />;
  }

  if (!canAccess) {
    return (
      <div className="pt-[78px] min-h-screen bg-nasmed-off-white flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 w-full max-w-[440px] shadow-xl text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="font-heading text-nasmed-navy text-[26px] mb-2">Access Denied</h2>
          <p className="text-nasmed-text-muted text-sm mb-6">You do not have admin privileges.</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left text-xs">
            <strong>Debug Info:</strong><br/>
            Email: {user?.email}<br/>
            Role: {user?.role || 'No role set'}<br/>
            isAdmin: {isAdmin ? 'Yes' : 'No'}<br/>
            User ID: {user?.id}
          </div>
          <button
            onClick={() => signOut()}
            className="bg-nasmed-green text-white border-none py-3 px-6 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const handleAction = async (id: string, action: string) => {
    const newStatus = action === "approve" ? "approved" : "rejected";

    if (action === "approve") {
      const app = applications.find(a => a.id === id);
      if (app) {
        setApprovingId(id);
        const alreadyApproved = applications.filter(a => a.status === "approved").length;
        const year = new Date().getFullYear().toString().slice(2);
        const seq = (42 + alreadyApproved + 1).toString().padStart(4, "0");
        const memberNumber = `NASMED/${year}/${seq}`;
        const username = await authService.generateUniqueUsername(app.name);
        const nasmedEmail = `${username}@nasmed.com`;
        await authService.activateMember(app.email, username, memberNumber, "Member", app.tier);
        setApprovedCreds({ name: app.name, username, nasmedEmail, memberNumber, password: "nasmed2024!" });
        const newMember: DisplayMember = {
          id: memberNumber,
          _dbId: "",
          name: app.name,
          username,
          email: app.email,
          password: "nasmed2024!",
          prof: app.prof,
          tier: app.tier,
          state: app.state,
          joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          status: "active",
          position: "Member",
          mustChange: true,
        };
        setMembers(prev => prev.some(m => m.email === app.email) ? prev : [newMember, ...prev]);
        setApprovingId(null);
        const certDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();
        setCertToSend({ name: app.name, certNumber: memberNumber, date: certDate, tier: app.tier, email: app.email });
        toast.success(`${app.name} approved! Sending membership certificate to ${app.email}…`);
      }
    }

    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (viewApp?.id === id) setViewApp(prev => prev ? { ...prev, status: newStatus } : null);
    applicationService.updateStatus(id, newStatus as "approved" | "rejected").catch(() => {});
    if (action !== "approve") toast.success("Application rejected & member notified.");
  };

  const addMember = async () => {
    if (!afFname || !afLname) { toast.error("Please fill in required fields."); return; }
    const defaultPassword = "nasmed2024!";
    const name = `${afFname} ${afLname}`;
    const username = (afFname + "." + afLname).toLowerCase().replace(/\s+/g, "");
    try {
      const { error } = await authService.signUpMember(
        afEmail, defaultPassword, name, afTier, username, "", "",
      );
      if (error && !error.toLowerCase().includes("already registered")) {
        toast.error(`Failed to create member account: ${error}`);
        return;
      }
      toast.success(`Member ${name} registered! They can log in with their email and 'nasmed2024!'.`);
      setAfFname(""); setAfLname(""); setAfEmail(""); setAfPhone(""); setAfProf("");
    } catch {
      toast.error("Failed to register member.");
    }
  };

  const handleConfirmTransaction = async (txnId: string) => {
    try {
      await transactionService.updateStatus(txnId, "confirmed");
      setTransactions(prev => prev.map(t => t.id === txnId ? { ...t, status: "confirmed" } : t));
      toast.success("Payment confirmed successfully!");
    } catch {
      toast.error("Failed to confirm transaction.");
    }
  };

  const handleDeleteTransaction = async (id: string, memberName: string) => {
    setDeletingTxnId(id);
  };

  const txnEmailSubject = (txn: DisplayTxn, type: "approve" | "reject" | "followup") => {
    if (type === "approve") return encodeURIComponent(`NASMED Payment Confirmed — Ref: ${txn.ref || "N/A"}`);
    if (type === "reject") return encodeURIComponent(`Re: NASMED Payment Submission — Action Required`);
    return encodeURIComponent(`NASMED Payment Follow-up — Ref: ${txn.ref || "N/A"}`);
  };

  const txnEmailBody = (txn: DisplayTxn, type: "approve" | "reject" | "followup") => {
    const name = txn.member || "Member";
    const amount = `${txn.amount} ${txn.currency}`;
    const ref = txn.ref || "N/A";
    if (type === "approve") return encodeURIComponent(`Dear ${name},\n\nWe are pleased to confirm that your payment of ${amount} (Reference: ${ref}) has been successfully verified and approved.\n\nYour NASMED account will be updated accordingly. Thank you for your prompt payment.\n\nBest regards,\nNASMED Secretariat`);
    if (type === "reject") return encodeURIComponent(`Dear ${name},\n\nThank you for submitting your payment of ${amount} (Reference: ${ref}).\n\nUnfortunately, we were unable to verify this payment. This may be due to:\n- Incorrect account details used\n- Payment amount discrepancy\n- Receipt not matching our records\n\nPlease review and resubmit your payment or contact us for assistance.\n\nBest regards,\nNASMED Secretariat`);
    return encodeURIComponent(`Dear ${name},\n\nWe are following up on your payment of ${amount} (Reference: ${ref}).\n\nPlease ensure you have uploaded a valid receipt for verification.\n\nBest regards,\nNASMED Secretariat`);
  };

  const regEmailTemplates = {
    missingReceipt: (r: DisplayEventReg) =>
      `Dear ${r.name},\n\nThank you for registering for ${r.eventTitle}.\n\nWe noticed that your registration (Reference: ${r.paymentRef}) does not have a proof of payment attached. To complete your registration, please log in and upload your payment receipt at:\n\nhttps://nasmed.ng/news\n\nBank Details:\nBank: Union Bank\nAccount Name: Nigerian Association of Sports Medicine\nAccount Number: 0227297914\n\nRegistration Fee: ${r.fee}\n\nPlease upload your receipt as soon as possible so we can confirm your spot.\n\nFor assistance, contact us at info@nasmed.org.\n\nBest regards,\nNASMED Secretariat`,

    notApproved: (r: DisplayEventReg) =>
      `Dear ${r.name},\n\nThank you for your interest in ${r.eventTitle}.\n\nAfter reviewing your registration, we are unable to approve it at this time. This may be due to one of the following reasons:\n- Proof of payment not attached\n- Payment amount does not match the required fee (${r.fee})\n- Payment reference could not be verified\n- Incomplete registration details\n\nPlease review the above, make the necessary corrections, and resubmit your registration at nasmed.ng/news.\n\nIf you believe this is an error, please contact us at info@nasmed.org with your payment reference and we will assist you.\n\nWe apologise for any inconvenience.\n\nBest regards,\nNASMED Secretariat`,

    approved: (r: DisplayEventReg) =>
      `Dear ${r.name},\n\nWe are pleased to confirm that your registration for ${r.eventTitle} has been successfully verified and approved.\n\nYour participation is confirmed. Event access details (Zoom link, agenda, etc.) will be sent to you closer to the event date.\n\nThank you for registering, and we look forward to your active participation.\n\nBest regards,\nNASMED Secretariat`,

    followUp: (r: DisplayEventReg) =>
      `Dear ${r.name},\n\nThis is a follow-up regarding your registration for ${r.eventTitle} (Reference: ${r.paymentRef}).\n\nYour registration is currently pending and requires attention before it can be processed.\n\nPlease take the necessary action and revert to us at info@nasmed.org at your earliest convenience.\n\nThank you.\n\nBest regards,\nNASMED Secretariat`,
  };

  const deleteMember = async (dbId: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      try {
        await userService.delete(dbId);
        setMembers(prev => prev.filter(m => m._dbId !== dbId));
        toast.success("Member deleted successfully");
      } catch {
        toast.error("Failed to delete member.");
      }
    }
  };

  const saveMember = async () => {
    if (!editMember) return;
    try {
      if (editMember._dbId) {
        await userService.update(editMember._dbId, {
          full_name: editMember.name,
          profession: editMember.prof,
          membership_type: editMember.tier,
          state: editMember.state,
          position: editMember.position,
          status: editMember.status as "active" | "inactive" | "suspended",
        });
      }
      setMembers(prev => prev.map(m => m._dbId === editMember._dbId ? editMember : m));
      setEditMember(null);
      toast.success("Member updated successfully");
    } catch {
      toast.error("Failed to update member.");
    }
  };

  const addPublication = async () => {
    if (!pubTitle) { toast.error("Please enter a title."); return; }
    if (pubAccess === "paid" && !pubPrice) { toast.error("Please enter a price for paid publications."); return; }
    try {
      const pub = await publicationService.create({
        title: pubTitle,
        type: pubType as "Guidelines" | "Journal" | "Protocol" | "Research" | "Newsletter" | "Report",
        description: pubContent,
        status: "published",
      }, pubFile || undefined);
      await publicationService.update(pub.id, {
        access: pubAccess,
        price: pubAccess === "paid" ? pubPrice : "",
        file_name: pubFile?.name || "",
      } as Parameters<typeof publicationService.update>[1]);
      const dispPub = toDisplayPub({
        ...pub,
        access: pubAccess,
        price: pubAccess === "paid" ? pubPrice : "",
        file_name: pubFile?.name || "",
      } as unknown as Record<string, unknown>);
      setPublications(prev => [dispPub, ...prev]);
      toast.success(`Publication "${pubTitle}" created!`);
      setPubTitle(""); setPubContent(""); setPubPrice(""); setPubFile(null); setPubAccess("free");
    } catch {
      toast.error("Failed to create publication.");
    }
  };

  const deletePublication = async (id: string) => {
    if (confirm("Are you sure you want to delete this publication?")) {
      try {
        await publicationService.delete(id);
        setPublications(prev => prev.filter(p => p.id !== id));
        toast.success("Publication deleted");
      } catch {
        toast.error("Failed to delete publication.");
      }
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending: "bg-amber-500/15 text-amber-600",
      approved: "bg-nasmed-green/15 text-nasmed-green",
      rejected: "bg-red-500/15 text-red-600",
      active: "bg-nasmed-mid-blue/10 text-nasmed-mid-blue",
      expired: "bg-red-500/15 text-red-600",
      published: "bg-nasmed-green/15 text-nasmed-green",
      draft: "bg-amber-500/15 text-amber-600",
      free: "bg-emerald-500/15 text-emerald-600",
      paid: "bg-amber-500/15 text-amber-600",
      subscribed: "bg-nasmed-mid-blue/10 text-nasmed-mid-blue",
    };
    return <span className={`py-1 px-2.5 rounded-full text-[11px] font-bold tracking-wide capitalize ${map[s] || ""}`}>{s}</span>;
  };

  const pendingCount = applications.filter(a => a.status === "pending").length;
  const approvedCount = applications.filter(a => a.status === "approved").length;

  const sidebarItems = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "applications", icon: "📋", label: "Applications" },
    { key: "members", icon: "👥", label: "Members" },
    { key: "publications", icon: "📚", label: "Publications" },
    { key: "news", icon: "📰", label: "News & Events" },
    { key: "subscriptions", icon: "💳", label: "Subscriptions" },
    { key: "transactions", icon: "💰", label: "Transactions" },
    { key: "credentials", icon: "🔑", label: "Credentials" },
  ];

  const filterRows = (rows: unknown[], keys: string[]) => {
    if (!search) return rows;
    const s = search.toLowerCase();
    return rows.filter(r => keys.some(k => String((r as Record<string, unknown>)[k] || "").toLowerCase().includes(s)));
  };

  const field = (label: string, value: string) => (
    <div className="flex flex-col gap-1 p-4 border border-nasmed-gray-light rounded-lg bg-nasmed-off-white/40">
      <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-nasmed-text-muted">{label}</span>
      <span className="text-[14px] font-medium text-nasmed-navy">{value || "—"}</span>
    </div>
  );

  return (
    <div className="pt-[78px] bg-nasmed-off-white min-h-screen">
      <div className="flex min-h-[calc(100vh-78px)]">

        {/* Sidebar */}
        <div
          className={`bg-nasmed-navy hidden md:flex flex-col flex-shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out ${sidebarCollapsed ? "w-[64px]" : "w-[240px]"}`}
        >
          {/* Header + toggle */}
          <div className={`flex items-center border-b border-white/10 py-5 flex-shrink-0 ${sidebarCollapsed ? "justify-center px-3" : "justify-between px-5"}`}>
            {!sidebarCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <h3 className="text-white text-[14px] font-bold leading-tight">NASMED Admin</h3>
                <p className="text-white/40 text-[11px] mt-0.5">Management Portal</p>
              </div>
            )}
            <button
              type="button"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setSidebarCollapsed(v => !v)}
              className="w-7 h-7 rounded-lg bg-white/10 border-none text-white cursor-pointer flex items-center justify-center hover:bg-white/25 transition-colors flex-shrink-0 text-[13px]"
            >
              {sidebarCollapsed ? "»" : "«"}
            </button>
          </div>

          {/* Nav items */}
          <ul className="list-none py-3 flex-1">
            {sidebarItems.map(item => (
              <li key={item.key}>
                <button
                  type="button"
                  title={sidebarCollapsed ? item.label : undefined}
                  onClick={() => { setActiveSection(item.key); setSearch(""); }}
                  className={`w-full flex items-center py-2.5 cursor-pointer transition-all border-none bg-transparent text-left whitespace-nowrap ${sidebarCollapsed ? "justify-center px-0 gap-0" : "gap-2.5 px-5"} text-[13px] font-medium ${activeSection === item.key ? "bg-white/10 text-white border-l-[3px] border-nasmed-green-light" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                >
                  <span className="text-[16px] w-5 text-center flex-shrink-0">{item.icon}</span>
                  {!sidebarCollapsed && <span className="overflow-hidden">{item.label}</span>}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                title={sidebarCollapsed ? "Sign Out" : undefined}
                onClick={() => { sessionStorage.removeItem("nasmed_admin"); setLocalAuth(false); if (user) signOut(); }}
                className={`w-full flex items-center py-2.5 text-white/60 text-[13px] font-medium cursor-pointer border-none bg-transparent text-left hover:bg-white/5 hover:text-white transition-colors mt-6 whitespace-nowrap ${sidebarCollapsed ? "justify-center px-0 gap-0" : "gap-2.5 px-5"}`}
              >
                <span className="text-[16px] w-5 text-center flex-shrink-0">🚪</span>
                {!sidebarCollapsed && <span>Sign Out</span>}
              </button>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-6 md:p-9 overflow-x-hidden">

          {/* ── Dashboard ── */}
          {activeSection === "dashboard" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Dashboard Overview</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">Welcome back. Here's a summary of NASMED activity.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-9">
                {[
                  { num: members.length.toLocaleString(), label: "Total Members", trend: `${members.length} registered`, color: "border-nasmed-mid-blue" },
                  { num: String(pendingCount), label: "Pending Applications", trend: "Needs Review", color: "border-nasmed-green", trendColor: "text-amber-500" },
                  { num: String(eventRegistrations.filter(r => r.status === "pending").length), label: "Event Registrations", trend: `${eventRegistrations.length} total`, color: "border-amber-500", trendColor: "text-amber-500" },
                  { num: String(subscriptions.filter(s => s.status === "active").length), label: "Active Subscriptions", trend: revenueLabel, color: "border-nasmed-green", trendColor: "text-nasmed-green" },
                ].map((c, i) => (
                  <div key={i} className={`bg-white rounded-xl p-6 shadow-sm border-t-4 ${c.color}`}>
                    <div className="font-heading text-[32px] font-bold text-nasmed-navy leading-none">{c.num}</div>
                    <div className="text-[13px] text-nasmed-text-muted mt-1">{c.label}</div>
                    <div className={`text-xs font-semibold mt-2 ${c.trendColor || "text-nasmed-green"}`}>{c.trend}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-9">
                <button type="button" onClick={() => { setActiveSection("applications"); setAppsTab("membership"); }} className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-green hover:shadow-md transition-all text-left">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-bold text-nasmed-navy">Review Applications</div>
                  <div className="text-sm text-nasmed-text-muted">{pendingCount} membership · {eventRegistrations.filter(r => r.status === "pending").length} event pending</div>
                </button>
                <button onClick={() => setActiveSection("publications")} className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-mid-blue hover:shadow-md transition-all text-left">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="font-bold text-nasmed-navy">Create Publication</div>
                  <div className="text-sm text-nasmed-text-muted">Add new content</div>
                </button>
                <button onClick={() => setActiveSection("members")} className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-amber-500 hover:shadow-md transition-all text-left">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-bold text-nasmed-navy">Manage Members</div>
                  <div className="text-sm text-nasmed-text-muted">{members.length} total</div>
                </button>
              </div>

              {/* Recent Activity — live from applications + event registrations */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <h3 className="text-base font-bold text-nasmed-navy mb-5">Recent Activity</h3>
                {(() => {
                  const appItems = applications.map(a => ({
                    key: "app-" + a.id,
                    icon: "📝",
                    label: "New membership application",
                    sub: `${a.name} · ${a.tier}`,
                    date: a.date,
                    badge: a.status,
                    onClick: () => { setActiveSection("applications"); setAppsTab("membership"); },
                  }));
                  const regItems = eventRegistrations.map(r => ({
                    key: "reg-" + r.id,
                    icon: "📅",
                    label: "Event registration",
                    sub: `${r.name} · ${r.eventTitle}`,
                    date: r.date,
                    badge: r.status,
                    onClick: () => { setActiveSection("applications"); setAppsTab("events"); },
                  }));
                  const combined = [...appItems, ...regItems]
                    .sort((a, b) => {
                      const parse = (d: string) => {
                        const [day, month, year] = d.split("/");
                        return new Date(`${year}-${month}-${day}`).getTime();
                      };
                      return parse(b.date) - parse(a.date);
                    })
                    .slice(0, 6);

                  return combined.length > 0 ? (
                    <div className="space-y-3">
                      {combined.map(item => (
                        <button
                          type="button"
                          key={item.key}
                          onClick={item.onClick}
                          className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-nasmed-off-white transition-all text-left"
                        >
                          <div className="w-10 h-10 bg-nasmed-off-white rounded-full flex items-center justify-center text-lg flex-shrink-0">{item.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-nasmed-navy">{item.label}</div>
                            <div className="text-xs text-nasmed-text-muted truncate">{item.sub}</div>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="text-xs text-nasmed-text-muted">{item.date}</span>
                            {statusBadge(item.badge)}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-nasmed-text-muted text-center py-6">No recent activity.</p>
                  );
                })()}
              </div>
            </>
          )}

          {/* ── Applications ── */}
          {activeSection === "applications" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Applications & Registrations</h2>
              <p className="text-nasmed-text-muted text-sm mb-5">Review and process all incoming membership applications and event registrations.</p>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                {([
                  { key: "membership", label: "Membership Applications", count: applications.length },
                  { key: "events",     label: "Event Registrations",      count: eventRegistrations.length },
                ] as { key: "membership" | "events"; label: string; count: number }[]).map(tab => (
                  <button
                    type="button"
                    key={tab.key}
                    onClick={() => { setAppsTab(tab.key); setSearch(""); }}
                    className={`py-2 px-5 rounded-lg text-[13px] font-semibold border-[1.5px] cursor-pointer transition-all ${appsTab === tab.key ? "bg-nasmed-mid-blue text-white border-nasmed-mid-blue" : "bg-white text-nasmed-text-muted border-nasmed-gray-light hover:border-nasmed-mid-blue hover:text-nasmed-mid-blue"}`}
                  >
                    {tab.label}
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-[11px] ${appsTab === tab.key ? "bg-white/20 text-white" : "bg-nasmed-gray-light text-nasmed-text-muted"}`}>{tab.count}</span>
                  </button>
                ))}
              </div>

              {/* ── Membership Applications Tab ── */}
              {appsTab === "membership" && (
                <div className="bg-white rounded-[14px] p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-nasmed-navy">All Membership Applications</h3>
                    <input value={search} onChange={e => setSearch(e.target.value)} className="py-2 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[220px] focus:border-nasmed-mid-blue" placeholder="Search by name, email..." />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead><tr>{["Name", "Email", "Tier", "State", "Date", "Payment", "Status", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                      <tbody>
                        {(filterRows(applications, ["name", "email", "prof", "tier"]) as DisplayApp[]).map(a => (
                          <tr key={a.id} className="hover:bg-nasmed-off-white border-b border-nasmed-gray-light/30 last:border-0">
                            <td className="py-3 px-3 text-[13px] font-semibold">{a.name}</td>
                            <td className="py-3 px-3 text-[13px]">{a.email}</td>
                            <td className="py-3 px-3 text-[13px]">{a.tier}</td>
                            <td className="py-3 px-3 text-[13px]">{a.state}</td>
                            <td className="py-3 px-3 text-[13px]">{a.date}</td>
                            <td className="py-3 px-3">
                              <span className={`py-1 px-2 rounded-full text-[11px] font-bold ${a.payment === "Paid" ? "bg-nasmed-green/15 text-nasmed-green" : "bg-gray-100 text-gray-500"}`}>
                                {a.payment}
                              </span>
                            </td>
                            <td className="py-3 px-3">{statusBadge(a.status)}</td>
                            <td className="py-3 px-3">
                              <div className="flex gap-1.5 items-center">
                                <button type="button" onClick={() => setViewApp(a)} className="bg-nasmed-mid-blue text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80">View</button>
                                {a.status === "pending" && <>
                                  <button type="button" onClick={() => handleAction(a.id, "approve")} disabled={approvingId === a.id} className="bg-nasmed-green text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-nasmed-green-light disabled:opacity-50">{approvingId === a.id ? "…" : "✓"}</button>
                                  <button type="button" onClick={() => handleAction(a.id, "reject")} disabled={!!approvingId} className="bg-red-500 text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600 disabled:opacity-50">✗</button>
                                </>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {applications.length === 0 && (
                      <div className="text-center py-10 text-nasmed-text-muted text-[13px]">No membership applications yet.</div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Event Registrations Tab ── */}
              {appsTab === "events" && (
                <div className="bg-white rounded-[14px] p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                    <h3 className="text-base font-bold text-nasmed-navy">All Event Registrations</h3>
                    <input value={search} onChange={e => setSearch(e.target.value)} className="py-1.5 px-3 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[200px] focus:border-nasmed-mid-blue" placeholder="Search name, email…" />
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-nasmed-gray-light">
                    <table className="border-collapse" style={{ minWidth: "700px", width: "100%" }}>
                      <thead>
                        <tr className="bg-nasmed-off-white">
                          {["Name", "Event", "Dues", "Fee", "Payment", "Status", "Actions"].map(h => (
                            <th key={h} className="text-left py-2 px-2.5 text-[11px] font-semibold text-nasmed-text-muted tracking-wide uppercase border-b border-nasmed-gray-light whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(filterRows(eventRegistrations, ["name", "email", "eventTitle", "organisation"]) as DisplayEventReg[]).map(r => (
                          <tr key={r.id} className="hover:bg-nasmed-off-white border-b border-nasmed-gray-light/30 last:border-0">
                            <td className="py-2.5 px-2.5 text-[12px]">
                              <div className="font-semibold text-nasmed-navy leading-tight">{r.name}</div>
                              <div className="text-nasmed-text-muted text-[11px] truncate max-w-[140px]">{r.email}</div>
                            </td>
                            <td className="py-2.5 px-2.5 text-[12px] max-w-[160px]">
                              <div className="truncate text-nasmed-navy" title={r.eventTitle}>{r.eventTitle}</div>
                              <div className="text-nasmed-text-muted text-[11px]">{r.date}</div>
                            </td>
                            <td className="py-2.5 px-2.5">
                              <span className={`py-0.5 px-2 rounded-full text-[10px] font-bold whitespace-nowrap ${r.duesStatus === "Paid-up member" ? "bg-nasmed-green/15 text-nasmed-green" : "bg-amber-500/15 text-amber-600"}`}>
                                {r.duesStatus === "Paid-up member" ? "Member" : "Non-dues"}
                              </span>
                            </td>
                            <td className="py-2.5 px-2.5 text-[12px] font-semibold whitespace-nowrap">{r.fee}</td>
                            <td className="py-2.5 px-2.5">{statusBadge(r.paymentStatus)}</td>
                            <td className="py-2.5 px-2.5">{statusBadge(r.status)}</td>
                            <td className="py-2.5 px-2.5">
                              <div className="flex gap-1 items-center flex-nowrap">
                                <button
                                  type="button"
                                  onClick={() => { setViewRegModal(r); setRegReplyText(""); }}
                                  className="bg-nasmed-mid-blue text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80"
                                >👁 View</button>
                                {r.status === "pending" && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await eventRegistrationService.updateStatus(r.id, "confirmed");
                                        setEventRegistrations(prev => prev.map(x => x.id === r.id ? { ...x, status: "confirmed" } : x));
                                        toast.success(`Registration confirmed for ${r.name}`);
                                      }}
                                      className="bg-nasmed-green text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-nasmed-green-light"
                                    >✓ Confirm</button>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await eventRegistrationService.updateStatus(r.id, "cancelled");
                                        setEventRegistrations(prev => prev.map(x => x.id === r.id ? { ...x, status: "cancelled" } : x));
                                        toast.success(`Registration cancelled for ${r.name}`);
                                      }}
                                      className="bg-red-500 text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600"
                                    >✗ Cancel</button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {eventRegistrations.length === 0 && (
                      <div className="text-center py-10 text-nasmed-text-muted text-[13px]">No event registrations yet.</div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Members ── */}
          {activeSection === "members" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Active Members</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">View and manage all currently registered NASMED members.</p>
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-nasmed-navy">Member Directory</h3>
                  <input value={search} onChange={e => setSearch(e.target.value)} className="py-2 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[220px] focus:border-nasmed-mid-blue" placeholder="Search members..." />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead><tr>{["ID", "Name", "Profession", "Tier", "State", "Joined", "Status", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {(filterRows(members, ["name", "prof", "tier"]) as DisplayMember[]).map(m => (
                        <tr key={m._dbId || m.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[11px] font-mono">{m.id}</td>
                          <td className="py-3 px-3 text-[13px] font-semibold">{m.name}</td>
                          <td className="py-3 px-3 text-[13px]">{m.prof}</td>
                          <td className="py-3 px-3 text-[13px]">{m.tier}</td>
                          <td className="py-3 px-3 text-[13px]">{m.state}</td>
                          <td className="py-3 px-3 text-[13px]">{m.joined}</td>
                          <td className="py-3 px-3">{statusBadge(m.status)}</td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => setEditMember(m)} className="bg-nasmed-mid-blue text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80">Edit</button>
                              <button onClick={() => deleteMember(m._dbId || m.id)} className="bg-red-500 text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600">🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {members.length === 0 && (
                    <div className="text-center py-10 text-nasmed-text-muted text-[13px]">No members yet. Use the Credentials section to initialize accounts.</div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Publications ── */}
          {activeSection === "publications" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Publications</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">Create, manage and publish content for NASMED members.</p>

              {/* Create New Publication */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm mb-8">
                <h3 className="text-base font-bold text-nasmed-navy mb-5">Create New Publication</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Title <span className="text-red-600">*</span></label>
                    <input type="text" value={pubTitle} onChange={e => setPubTitle(e.target.value)} placeholder="Publication title" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Type</label>
                    <select value={pubType} onChange={e => setPubType(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue">
                      <option>Guidelines</option>
                      <option>Journal</option>
                      <option>Protocol</option>
                      <option>Research</option>
                      <option>Newsletter</option>
                      <option>Report</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Description / Abstract</label>
                    <textarea value={pubContent} onChange={e => setPubContent(e.target.value)} placeholder="Enter description or abstract..." className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue min-h-[100px]" />
                  </div>

                  {/* Document Upload */}
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Document / File</label>
                    <label className={`flex items-center gap-3 py-3 px-4 border-[1.5px] border-dashed rounded-lg cursor-pointer transition-all ${pubFile ? "border-nasmed-green bg-nasmed-green/5" : "border-nasmed-gray-light hover:border-nasmed-mid-blue hover:bg-nasmed-off-white"}`}>
                      <span className="text-xl">{pubFile ? "📄" : "📁"}</span>
                      <div className="flex-1 min-w-0">
                        {pubFile
                          ? <><p className="text-sm font-semibold text-nasmed-navy truncate">{pubFile.name}</p><p className="text-xs text-nasmed-text-muted">{(pubFile.size / 1024).toFixed(0)} KB</p></>
                          : <><p className="text-sm text-nasmed-text-muted">Click to upload PDF, Word, or other document</p><p className="text-xs text-nasmed-text-muted">PDF, DOC, DOCX, PPT up to 50MB</p></>
                        }
                      </div>
                      {pubFile && <button type="button" onClick={e => { e.preventDefault(); setPubFile(null); }} className="text-red-400 hover:text-red-600 text-lg leading-none border-none bg-transparent cursor-pointer">✕</button>}
                      <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={e => setPubFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>

                  {/* Access Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Access Type <span className="text-red-600">*</span></label>
                    <div className="flex gap-3 flex-wrap">
                      {[
                        { value: "free", label: "Free", icon: "🔓", desc: "Anyone can access" },
                        { value: "paid", label: "Paid", icon: "💳", desc: "One-time purchase" },
                        { value: "subscribed", label: "Members Only", icon: "🔐", desc: "Active subscribers" },
                      ].map(opt => (
                        <label key={opt.value} className={`flex-1 min-w-[140px] flex items-start gap-2.5 p-3.5 rounded-lg border-[1.5px] cursor-pointer transition-all ${pubAccess === opt.value ? "border-nasmed-mid-blue bg-nasmed-mid-blue/5" : "border-nasmed-gray-light hover:border-nasmed-mid-blue/40"}`}>
                          <input type="radio" name="pubAccess" value={opt.value} checked={pubAccess === opt.value} onChange={() => setPubAccess(opt.value)} className="mt-0.5 accent-nasmed-mid-blue" />
                          <div>
                            <div className="text-[13px] font-semibold text-nasmed-navy">{opt.icon} {opt.label}</div>
                            <div className="text-[11px] text-nasmed-text-muted">{opt.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price — only shown for paid */}
                  {pubAccess === "paid" && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold text-nasmed-navy">Price <span className="text-red-600">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nasmed-text-muted text-sm font-medium">₦</span>
                        <input type="text" value={pubPrice} onChange={e => setPubPrice(e.target.value)} placeholder="e.g. 2,500" className="w-full py-2.5 pl-8 pr-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={addPublication} className="bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all mt-5">Publish →</button>
              </div>

              {/* Existing Publications */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-nasmed-navy">All Publications</h3>
                  <input value={search} onChange={e => setSearch(e.target.value)} className="py-2 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[220px] focus:border-nasmed-mid-blue" placeholder="Search publications..." />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead><tr>{["ID", "Title", "Type", "Access", "Price", "File", "Date", "Downloads", "Status", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {(filterRows(publications, ["title", "type", "access"]) as DisplayPub[]).map(p => (
                        <tr key={p.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[11px] font-mono">{p.id.slice(0, 8)}…</td>
                          <td className="py-3 px-3 text-[13px] font-semibold max-w-[180px] truncate">{p.title}</td>
                          <td className="py-3 px-3 text-[13px]">{p.type}</td>
                          <td className="py-3 px-3">{statusBadge(p.access)}</td>
                          <td className="py-3 px-3 text-[13px] font-medium">{p.access === "paid" && p.price ? `₦${p.price}` : "—"}</td>
                          <td className="py-3 px-3 text-[12px] max-w-[120px] truncate">{p.fileName ? <span title={p.fileName} className="flex items-center gap-1 text-nasmed-mid-blue">📄 {p.fileName}</span> : <span className="text-nasmed-text-muted">—</span>}</td>
                          <td className="py-3 px-3 text-[13px]">{p.date}</td>
                          <td className="py-3 px-3 text-[13px]">{p.downloads}</td>
                          <td className="py-3 px-3">{statusBadge(p.status)}</td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => openEditPub(p)} className="bg-nasmed-mid-blue text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80">Edit</button>
                              <button onClick={() => deletePublication(p.id)} className="bg-red-500 text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600">🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {publications.length === 0 && (
                    <div className="text-center py-10 text-nasmed-text-muted text-[13px]">No publications yet.</div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── News & Events ── */}
          {activeSection === "news" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">News & Events</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">Manage all news posts and upcoming events shown on the public website.</p>

              {/* Create News Post */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm mb-8">
                <h3 className="text-base font-bold text-nasmed-navy mb-5">Create News Post</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Title <span className="text-red-600">*</span></label>
                    <input type="text" value={npTitle} onChange={e => setNpTitle(e.target.value)} placeholder="Post title" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Description</label>
                    <textarea value={npDesc} onChange={e => setNpDesc(e.target.value)} placeholder="Short description or summary..." className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue min-h-[80px]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Category</label>
                    <select title="Category" value={npCat} onChange={e => { setNpCat(e.target.value); setNpCatLabel(e.target.value.toUpperCase()); }} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue">
                      <option value="conference">Conference</option>
                      <option value="research">Research</option>
                      <option value="update">Update</option>
                      <option value="governance">Governance</option>
                      <option value="milestones">Milestones</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Category Label (display)</label>
                    <input type="text" value={npCatLabel} onChange={e => setNpCatLabel(e.target.value)} placeholder="e.g. ANNUAL CONFERENCE" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Date Label</label>
                    <input type="text" value={npDateLabel} onChange={e => setNpDateLabel(e.target.value)} placeholder="e.g. Jul 2024" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Read Time</label>
                    <input type="text" value={npReadTime} onChange={e => setNpReadTime(e.target.value)} placeholder="e.g. 3 min read" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!npTitle.trim()) { toast.error("Title is required."); return; }
                    try {
                      const post = await newsService.createPost({ title: npTitle, description: npDesc, category: npCat, category_label: npCatLabel, date_label: npDateLabel, read_time: npReadTime, published: true });
                      setNewsPosts(prev => [post, ...prev]);
                      setNpTitle(""); setNpDesc(""); setNpCat("update"); setNpCatLabel("UPDATE"); setNpDateLabel(""); setNpReadTime("3 min read");
                      toast.success("News post published!");
                    } catch { toast.error("Failed to create post."); }
                  }}
                  className="bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all mt-5"
                >Publish Post →</button>
              </div>

              {/* Existing News Posts */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm mb-8">
                <h3 className="text-base font-bold text-nasmed-navy mb-5">All News Posts ({newsPosts.length})</h3>
                {newsPosts.length === 0 ? (
                  <div className="text-center py-8 text-nasmed-text-muted text-[13px]">No news posts yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead><tr>{["Title", "Category", "Date", "Status", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                      <tbody>
                        {newsPosts.map(p => (
                          <tr key={p.id} className="hover:bg-nasmed-off-white border-b border-nasmed-gray-light/30 last:border-0">
                            <td className="py-3 px-3 text-[13px] font-semibold max-w-[260px] truncate">{p.title}</td>
                            <td className="py-3 px-3"><span className="py-1 px-2 rounded-full text-[11px] font-bold bg-nasmed-mid-blue/10 text-nasmed-mid-blue">{p.category_label}</span></td>
                            <td className="py-3 px-3 text-[13px] text-nasmed-text-muted">{p.date_label || "—"}</td>
                            <td className="py-3 px-3">{statusBadge(p.published ? "published" : "draft")}</td>
                            <td className="py-3 px-3">
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditPost(p)}
                                  className="bg-nasmed-mid-blue text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80"
                                >Edit</button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await newsService.updatePost(p.id, { published: !p.published });
                                    setNewsPosts(prev => prev.map(x => x.id === p.id ? { ...x, published: !x.published } : x));
                                  }}
                                  className={`border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80 ${p.published ? "bg-amber-500 text-white" : "bg-nasmed-green text-white"}`}
                                >{p.published ? "Unpublish" : "Publish"}</button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!confirm("Delete this post?")) return;
                                    await newsService.deletePost(p.id);
                                    setNewsPosts(prev => prev.filter(x => x.id !== p.id));
                                    toast.success("Post deleted.");
                                  }}
                                  className="bg-red-500 text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600"
                                >🗑</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Create Event */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm mb-8">
                <h3 className="text-base font-bold text-nasmed-navy mb-5">Create Event</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Title <span className="text-red-600">*</span></label>
                    <input type="text" value={evTitle} onChange={e => setEvTitle(e.target.value)} placeholder="Event title" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Description</label>
                    <input type="text" value={evDesc} onChange={e => setEvDesc(e.target.value)} placeholder="Short description" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Location</label>
                    <input type="text" value={evLocation} onChange={e => setEvLocation(e.target.value)} placeholder="e.g. Abuja, FCT" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Event Date</label>
                    <input type="date" value={evDate} onChange={e => setEvDate(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">CTA Button Text</label>
                    <input type="text" value={evCtaText} onChange={e => setEvCtaText(e.target.value)} placeholder="Register / Book Now / Join Free" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Button Style</label>
                    <select title="Button Style" value={evCtaStyle} onChange={e => setEvCtaStyle(e.target.value as "filled" | "outline")} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue">
                      <option value="filled">Filled (Green)</option>
                      <option value="outline">Outline</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Registration Fee (₦) — 0 for free</label>
                    <input type="number" min="0" value={evRegistrationFee} onChange={e => setEvRegistrationFee(e.target.value)} placeholder="e.g. 10000" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Full Event Content (body)</label>
                    <textarea rows={6} value={evBodyContent} onChange={e => setEvBodyContent(e.target.value)} placeholder="Paste full event announcement, programme schedule, etc." className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue resize-y" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Event Flier / Poster Image (optional)</label>
                    <label className={`flex items-center gap-3 py-3 px-4 border-[1.5px] border-dashed rounded-lg cursor-pointer transition-all ${evFlierFile ? "border-nasmed-green bg-nasmed-green/5" : "border-nasmed-gray-light hover:border-nasmed-mid-blue hover:bg-nasmed-off-white"}`}>
                      <span className="text-xl">{evFlierFile ? "🖼️" : "📁"}</span>
                      <div className="flex-1 min-w-0">
                        {evFlierFile
                          ? <><p className="text-sm font-semibold text-nasmed-navy truncate">{evFlierFile.name}</p><p className="text-xs text-nasmed-text-muted">{(evFlierFile.size / 1024).toFixed(0)} KB</p></>
                          : <><p className="text-sm text-nasmed-text-muted">Click to upload event flier</p><p className="text-xs text-nasmed-text-muted">JPG, PNG, WEBP up to 10MB</p></>
                        }
                      </div>
                      {evFlierFile && <button type="button" onClick={e => { e.preventDefault(); setEvFlierFile(null); setEvFlierPreview(null); }} className="text-red-400 hover:text-red-600 text-lg leading-none border-none bg-transparent cursor-pointer">✕</button>}
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const f = e.target.files?.[0] || null;
                        setEvFlierFile(f);
                        if (f) { const r = new FileReader(); r.onload = ev => setEvFlierPreview(ev.target?.result as string); r.readAsDataURL(f); }
                        else setEvFlierPreview(null);
                      }} />
                    </label>
                    {evFlierPreview && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-nasmed-gray-light w-full max-w-[200px]">
                        <img src={evFlierPreview} alt="Flier preview" className="w-full object-contain max-h-[280px]" />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!evTitle.trim()) { toast.error("Title is required."); return; }
                    const d = evDate ? new Date(evDate) : null;
                    try {
                      let flierUrl: string | undefined;
                      if (evFlierFile) {
                        flierUrl = await newsService.uploadEventFlier(evFlierFile);
                      }
                      const ev = await newsService.createEvent({
                        title: evTitle, description: evDesc, location: evLocation,
                        event_date: evDate || undefined,
                        day_label: d ? String(d.getDate()).padStart(2, "0") : "",
                        month_label: d ? d.toLocaleString("en-US", { month: "short" }).toUpperCase() : "",
                        cta_text: evCtaText, cta_style: evCtaStyle,
                        registration_fee: Number(evRegistrationFee) || 0,
                        body_content: evBodyContent || undefined,
                        flier_url: flierUrl,
                        published: true,
                      });
                      setNewsEvents(prev => [...prev, ev]);
                      setEvTitle(""); setEvDesc(""); setEvLocation(""); setEvDate(""); setEvCtaText("Register"); setEvCtaStyle("filled");
                      setEvRegistrationFee("0"); setEvBodyContent(""); setEvFlierFile(null); setEvFlierPreview(null);
                      toast.success("Event created!");
                    } catch { toast.error("Failed to create event."); }
                  }}
                  className="bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all mt-5"
                >Add Event →</button>
              </div>

              {/* ── Posters ── */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm mb-8">
                <h3 className="text-base font-bold text-nasmed-navy mb-5">Upload Poster</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Title (optional)</label>
                    <input type="text" value={posterTitle} onChange={e => setPosterTitle(e.target.value)} placeholder="e.g. Annual Conference 2025" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Caption (optional)</label>
                    <input type="text" value={posterDesc} onChange={e => setPosterDesc(e.target.value)} placeholder="Short caption or context" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nasmed-navy">Poster Image <span className="text-red-600">*</span></label>
                    <label className={`flex items-center gap-3 py-3 px-4 border-[1.5px] border-dashed rounded-lg cursor-pointer transition-all ${posterFile ? "border-nasmed-green bg-nasmed-green/5" : "border-nasmed-gray-light hover:border-nasmed-mid-blue hover:bg-nasmed-off-white"}`}>
                      <span className="text-xl">{posterFile ? "🖼️" : "📁"}</span>
                      <div className="flex-1 min-w-0">
                        {posterFile
                          ? <><p className="text-sm font-semibold text-nasmed-navy truncate">{posterFile.name}</p><p className="text-xs text-nasmed-text-muted">{(posterFile.size / 1024).toFixed(0)} KB</p></>
                          : <><p className="text-sm text-nasmed-text-muted">Click to upload poster image</p><p className="text-xs text-nasmed-text-muted">JPG, PNG, WEBP up to 10MB</p></>
                        }
                      </div>
                      {posterFile && <button type="button" onClick={e => { e.preventDefault(); setPosterFile(null); setPosterPreview(null); }} className="text-red-400 hover:text-red-600 text-lg leading-none border-none bg-transparent cursor-pointer">✕</button>}
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const f = e.target.files?.[0] || null;
                        setPosterFile(f);
                        if (f) { const r = new FileReader(); r.onload = ev => setPosterPreview(ev.target?.result as string); r.readAsDataURL(f); }
                        else setPosterPreview(null);
                      }} />
                    </label>
                    {posterPreview && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-nasmed-gray-light w-full max-w-[320px]">
                        <img src={posterPreview} alt="Poster preview" className="w-full object-contain max-h-[240px]" />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!posterFile) { toast.error("Please select an image file."); return; }
                    try {
                      const poster = await newsService.createPoster({ title: posterTitle || undefined, description: posterDesc || undefined, published: true, image_url: "" }, posterFile);
                      setPosters(prev => [poster, ...prev]);
                      setPosterTitle(""); setPosterDesc(""); setPosterFile(null); setPosterPreview(null);
                      toast.success("Poster uploaded!");
                    } catch (err) { toast.error(`Failed to upload poster: ${(err as Error)?.message || err}`); }
                  }}
                  className="bg-nasmed-green text-white border-none py-3 px-8 rounded-lg text-[15px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all mt-5"
                >Upload Poster →</button>
              </div>

              {/* Existing Posters */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm mb-8">
                <h3 className="text-base font-bold text-nasmed-navy mb-5">All Posters ({posters.length})</h3>
                {posters.length === 0 ? (
                  <div className="text-center py-8 text-nasmed-text-muted text-[13px]">No posters uploaded yet.</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {posters.map(p => (
                      <div key={p.id} className="rounded-xl border border-nasmed-gray-light overflow-hidden bg-nasmed-off-white/40 flex flex-col">
                        <div className="relative">
                          <img src={p.image_url} alt={p.title || "Poster"} className="w-full object-cover aspect-[3/4]" />
                          <span className={`absolute top-2 right-2 py-0.5 px-2 rounded-full text-[10px] font-bold ${p.published ? "bg-nasmed-green text-white" : "bg-amber-500 text-white"}`}>
                            {p.published ? "Live" : "Hidden"}
                          </span>
                        </div>
                        <div className="p-3 flex flex-col gap-1.5 flex-1">
                          <p className="text-[13px] font-semibold text-nasmed-navy truncate">{p.title || <span className="text-nasmed-text-muted italic font-normal">No title</span>}</p>
                          <p className="text-[11px] text-nasmed-text-muted truncate">{p.description || <span className="italic">No caption</span>}</p>
                          <div className="flex gap-1.5 mt-auto pt-1">
                            <button
                              type="button"
                              title="Edit title & caption"
                              onClick={() => { setEditPoster(p); setEposterTitle(p.title || ""); setEposterDesc(p.description || ""); }}
                              className="bg-nasmed-mid-blue text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80"
                            >✏️</button>
                            <button
                              type="button"
                              title={p.published ? "Hide from website" : "Show on website"}
                              onClick={async () => {
                                await newsService.updatePoster(p.id, { published: !p.published });
                                setPosters(prev => prev.map(x => x.id === p.id ? { ...x, published: !x.published } : x));
                              }}
                              className={`flex-1 border-none py-1 px-2 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80 ${p.published ? "bg-amber-500 text-white" : "bg-nasmed-green text-white"}`}
                            >{p.published ? "Hide" : "Show"}</button>
                            <button
                              type="button"
                              title="Delete poster"
                              onClick={async () => {
                                if (!confirm("Delete this poster?")) return;
                                await newsService.deletePoster(p.id);
                                setPosters(prev => prev.filter(x => x.id !== p.id));
                                toast.success("Poster deleted.");
                              }}
                              className="bg-red-500 text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600"
                            >🗑</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Existing Events */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <h3 className="text-base font-bold text-nasmed-navy mb-5">All Events ({newsEvents.length})</h3>
                {newsEvents.length === 0 ? (
                  <div className="text-center py-8 text-nasmed-text-muted text-[13px]">No events yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead><tr>{["Title", "Location", "Date", "CTA", "Status", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                      <tbody>
                        {newsEvents.map(ev => (
                          <tr key={ev.id} className="hover:bg-nasmed-off-white border-b border-nasmed-gray-light/30 last:border-0">
                            <td className="py-3 px-3 text-[13px] font-semibold max-w-[220px] truncate">{ev.title}</td>
                            <td className="py-3 px-3 text-[13px]">{ev.location || "—"}</td>
                            <td className="py-3 px-3 text-[13px] font-mono">{ev.day_label} {ev.month_label}</td>
                            <td className="py-3 px-3 text-[13px]">{ev.cta_text}</td>
                            <td className="py-3 px-3">{statusBadge(ev.published ? "published" : "draft")}</td>
                            <td className="py-3 px-3">
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditEvent(ev)}
                                  className="bg-nasmed-mid-blue text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80"
                                >Edit</button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await newsService.updateEvent(ev.id, { published: !ev.published });
                                    setNewsEvents(prev => prev.map(x => x.id === ev.id ? { ...x, published: !x.published } : x));
                                  }}
                                  className={`border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80 ${ev.published ? "bg-amber-500 text-white" : "bg-nasmed-green text-white"}`}
                                >{ev.published ? "Unpublish" : "Publish"}</button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!confirm("Delete this event?")) return;
                                    await newsService.deleteEvent(ev.id);
                                    setNewsEvents(prev => prev.filter(x => x.id !== ev.id));
                                    toast.success("Event deleted.");
                                  }}
                                  className="bg-red-500 text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600"
                                >🗑</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Subscriptions ── */}
          {activeSection === "subscriptions" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Subscriptions</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">Manage member subscriptions and renewals.</p>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
                <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-green">
                  <div className="font-heading text-[28px] font-bold text-nasmed-navy">{subscriptions.filter(s => s.status === "active").length}</div>
                  <div className="text-[13px] text-nasmed-text-muted">Active Subscriptions</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-red-500">
                  <div className="font-heading text-[28px] font-bold text-nasmed-navy">{subscriptions.filter(s => s.status === "expired").length}</div>
                  <div className="text-[13px] text-nasmed-text-muted">Expired</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-nasmed-mid-blue">
                  <div className="font-heading text-[28px] font-bold text-nasmed-navy">₦{(subscriptions.filter(s => s.status === "active").length * 35000).toLocaleString()}</div>
                  <div className="text-[13px] text-nasmed-text-muted">Monthly Revenue (est.)</div>
                </div>
              </div>

              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-nasmed-navy">All Subscriptions</h3>
                  <input value={search} onChange={e => setSearch(e.target.value)} className="py-2 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[220px] focus:border-nasmed-mid-blue" placeholder="Search..." />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead><tr>{["ID", "Member", "Tier", "Start Date", "Expiry Date", "Amount", "Status", "Actions"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {(filterRows(subscriptions, ["member", "tier"]) as DisplaySubscription[]).map(s => (
                        <tr key={s.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[11px] font-mono">{s.id}</td>
                          <td className="py-3 px-3 text-[13px] font-semibold">{s.member}</td>
                          <td className="py-3 px-3 text-[13px]">{s.tier}</td>
                          <td className="py-3 px-3 text-[13px]">{s.start}</td>
                          <td className="py-3 px-3 text-[13px]">{s.expiry}</td>
                          <td className="py-3 px-3 text-[13px] font-medium">{s.amount}</td>
                          <td className="py-3 px-3">{statusBadge(s.status)}</td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => toast.info(`Renewing ${s.member}`)} className="bg-nasmed-green text-white border-none py-1 px-3 rounded text-[11px] font-semibold cursor-pointer hover:bg-nasmed-green-light">Renew</button>
                              <button onClick={() => toast.info(`Sending reminder to ${s.member}`)} className="bg-nasmed-mid-blue text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80">✉️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ── Transactions ── */}
          {activeSection === "transactions" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Transactions</h2>
              <p className="text-nasmed-text-muted text-sm mb-5">All payment records — membership registrations, event fees and additional contributions.</p>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {([
                  { key: "all",                label: "All Transactions",       count: transactions.length },
                  { key: "membership",         label: "Membership",             count: transactions.filter(t => t.type === "membership").length },
                  { key: "event_registration", label: "Event Registrations",    count: transactions.filter(t => t.type === "event_registration").length },
                  { key: "contribution",       label: "Contributions",          count: transactions.filter(t => t.type === "contribution").length },
                ] as { key: "all" | "membership" | "contribution" | "event_registration"; label: string; count: number }[]).map(tab => (
                  <button
                    type="button"
                    key={tab.key}
                    onClick={() => { setTxnTypeFilter(tab.key); setSearch(""); }}
                    className={`py-2 px-5 rounded-lg text-[13px] font-semibold border-[1.5px] cursor-pointer transition-all ${txnTypeFilter === tab.key ? "bg-nasmed-mid-blue text-white border-nasmed-mid-blue" : "bg-white text-nasmed-text-muted border-nasmed-gray-light hover:border-nasmed-mid-blue hover:text-nasmed-mid-blue"}`}
                  >
                    {tab.label}
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-[11px] ${txnTypeFilter === tab.key ? "bg-white/20 text-white" : "bg-nasmed-gray-light text-nasmed-text-muted"}`}>{tab.count}</span>
                  </button>
                ))}
              </div>

              {/* Bank Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div className="bg-white rounded-[14px] p-6 shadow-sm border-t-4 border-nasmed-mid-blue">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-bold tracking-[1.5px] uppercase bg-nasmed-mid-blue/10 text-nasmed-mid-blue px-2.5 py-1 rounded-full">Naira Account (NGN)</span>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between"><span className="text-nasmed-text-muted">Account Name</span><span className="font-bold text-nasmed-navy">NASMED</span></div>
                    <div className="flex justify-between"><span className="text-nasmed-text-muted">Account Number</span><span className="font-bold text-nasmed-navy tracking-widest">0227297914</span></div>
                    <div className="flex justify-between"><span className="text-nasmed-text-muted">Bank</span><span className="font-bold text-nasmed-navy">Union Bank of Nigeria</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-[14px] p-6 shadow-sm border-t-4 border-amber-500">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-bold tracking-[1.5px] uppercase bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">Dollar Account (USD)</span>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between"><span className="text-nasmed-text-muted">Account Name</span><span className="font-bold text-nasmed-navy">NASMED</span></div>
                    <div className="flex justify-between"><span className="text-nasmed-text-muted">Account Number</span><span className="font-bold text-nasmed-navy tracking-widest">0227342474</span></div>
                    <div className="flex justify-between"><span className="text-nasmed-text-muted">Bank</span><span className="font-bold text-nasmed-navy">Union Bank of Nigeria</span></div>
                  </div>
                </div>
              </div>

              {/* Summary cards */}
              {(() => {
                const pending = transactions.filter(t => t.status === "awaiting_confirmation");
                const confirmed = transactions.filter(t => t.status === "confirmed");
                const contributions = transactions.filter(t => t.type === "contribution");
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Total Payments", value: transactions.length, color: "border-nasmed-mid-blue" },
                      { label: "Awaiting Confirmation", value: pending.length, color: "border-amber-500" },
                      { label: "Confirmed", value: confirmed.length, color: "border-nasmed-green" },
                      { label: "Contributions", value: contributions.length, color: "border-purple-500" },
                    ].map(c => (
                      <div key={c.label} className={`bg-white rounded-xl p-4 shadow-sm border-t-4 ${c.color}`}>
                        <div className="text-2xl font-bold text-nasmed-navy">{c.value}</div>
                        <div className="text-[12px] text-nasmed-text-muted mt-0.5">{c.label}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Transaction Records */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <h3 className="text-base font-bold text-nasmed-navy">
                    {txnTypeFilter === "all" ? "All Payment Records" : txnTypeFilter === "membership" ? "Membership Payments" : txnTypeFilter === "event_registration" ? "Event Registration Payments" : "Contribution Payments"}
                  </h3>
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => { transactionService.getAll().then(data => setTransactions(data.map(d => toDisplayTxn(d as unknown as Record<string, unknown>)))).catch(() => {}); }}
                      className="text-[12px] text-nasmed-mid-blue border border-nasmed-mid-blue/30 py-1 px-3 rounded cursor-pointer bg-transparent hover:bg-nasmed-mid-blue/5"
                    >↻ Refresh</button>
                    <input value={search} onChange={e => setSearch(e.target.value)} className="py-2 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] outline-none w-[180px] focus:border-nasmed-mid-blue" placeholder="Search..." />
                  </div>
                </div>

                {(() => {
                  const filtered = transactions
                    .filter(t => txnTypeFilter === "all" || t.type === txnTypeFilter)
                    .filter(t => !search || ["member","email","tier","ref","description"].some(k => String((t as unknown as Record<string,unknown>)[k]||"").toLowerCase().includes(search.toLowerCase())));
                  return filtered.length === 0 ? (
                    <div className="text-center py-12 text-nasmed-text-muted text-[13px]">No transactions found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            {["Reference", "Member", "Category", "Amount", "Method", "Description", "Receipt", "Status", "Date", "Action"].map(h => (
                              <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map(t => (
                            <tr key={t.id} className="hover:bg-nasmed-off-white border-b border-nasmed-gray-light/40 last:border-0">
                              <td className="py-3 px-3 text-[11px] font-mono text-nasmed-text-muted">{t.ref || "—"}</td>
                              <td className="py-3 px-3">
                                <div className="text-[13px] font-semibold text-nasmed-navy">{t.member || "—"}</div>
                                <div className="text-[11px] text-nasmed-text-muted">{t.email}</div>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`py-0.5 px-2 rounded-full text-[10px] font-bold ${t.type === "contribution" ? "bg-purple-500/10 text-purple-700" : t.type === "event_registration" ? "bg-green-500/10 text-green-700" : "bg-nasmed-mid-blue/10 text-nasmed-mid-blue"}`}>
                                  {t.type === "contribution" ? "Contribution" : t.type === "event_registration" ? "Event Reg" : "Membership"}
                                </span>
                                <div className="text-[12px] text-nasmed-text-muted mt-0.5">{t.tier || "—"}</div>
                              </td>
                              <td className="py-3 px-3 text-[13px] font-bold text-nasmed-navy whitespace-nowrap">{t.amount || "—"} <span className="text-[11px] font-normal text-nasmed-text-muted">{t.currency}</span></td>
                              <td className="py-3 px-3">
                                <span className={`py-1 px-2 rounded-full text-[11px] font-bold ${t.method === "Paystack" ? "bg-[#0BA4DB]/10 text-[#0993c5]" : "bg-amber-500/10 text-amber-700"}`}>
                                  {t.method || "—"}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-[12px] text-nasmed-text-muted max-w-[140px] truncate" title={t.description}>
                                {t.description || "—"}
                              </td>
                              <td className="py-3 px-3">
                                {t.receiptUrl ? (
                                  <a href={t.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-nasmed-mid-blue hover:underline whitespace-nowrap">
                                    {(t.receiptName || "receipt").endsWith(".pdf") ? "📋 PDF" : "🖼️ Image"}
                                  </a>
                                ) : (
                                  <span className="text-[11px] text-nasmed-text-muted">None</span>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                {statusBadge(t.status === "confirmed" ? "approved" : t.status === "awaiting_confirmation" ? "pending" : t.status)}
                              </td>
                              <td className="py-3 px-3 text-[12px] text-nasmed-text-muted whitespace-nowrap">{t.date || "—"}</td>
                              <td className="py-3 px-3">
                                <div className="flex gap-1.5 items-center flex-wrap">
                                  {/* Preview */}
                                  <button
                                    type="button"
                                    onClick={() => setViewTxn(t)}
                                    className="bg-nasmed-mid-blue text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:opacity-80"
                                    title="Preview record"
                                  >👁 View</button>
                                  {/* Confirm */}
                                  {t.status === "awaiting_confirmation" && (
                                    <button
                                      type="button"
                                      onClick={() => handleConfirmTransaction(t.id)}
                                      className="bg-nasmed-green text-white border-none py-1 px-2.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-nasmed-green-light whitespace-nowrap"
                                      title="Confirm payment"
                                    >✓</button>
                                  )}
                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTransaction(t.id, t.member)}
                                    className="bg-red-500 text-white border-none py-1 px-2 rounded text-[11px] font-semibold cursor-pointer hover:bg-red-600"
                                    title="Delete record"
                                  >🗑</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          {/* ── Credentials ── */}
          {activeSection === "credentials" && (
            <>
              <h2 className="font-heading text-[26px] text-nasmed-navy mb-1.5">Member Credentials</h2>
              <p className="text-nasmed-text-muted text-sm mb-7">View and manage member login credentials for the Member Portal.</p>

              <div className="bg-white rounded-[14px] p-6 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead><tr>{["ID", "Name", "Position", "Username", "Password", "Must Change", "Status"].map(h => <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-nasmed-text-muted tracking-wide uppercase border-b-2 border-nasmed-gray-light">{h}</th>)}</tr></thead>
                    <tbody>
                      {members.map(m => (
                        <tr key={m._dbId || m.id} className="hover:bg-nasmed-off-white">
                          <td className="py-3 px-3 text-[11px] font-mono">{m.id}</td>
                          <td className="py-3 px-3 text-[13px] font-semibold">{m.name}</td>
                          <td className="py-3 px-3 text-xs text-nasmed-text-muted">{m.position || m.prof}</td>
                          <td className="py-3 px-3"><code className="bg-nasmed-off-white py-0.5 px-2 rounded text-xs">{m.username}</code></td>
                          <td className="py-3 px-3"><code className="bg-nasmed-off-white py-0.5 px-2 rounded text-xs">{m.password}</code></td>
                          <td className="py-3 px-3"><span className={`text-[11px] font-bold ${m.mustChange ? "text-amber-600" : "text-nasmed-green"}`}>{m.mustChange ? "YES" : "No"}</span></td>
                          <td className="py-3 px-3">{statusBadge(m.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {members.length === 0 && (
                    <div className="text-center py-10 text-nasmed-text-muted text-[13px]">No member accounts yet. Click "Initialize All Accounts" above.</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Application Review Modal */}
      {viewApp && (
        <div className="fixed inset-0 bg-black/60 z-[3000] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setViewApp(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-[760px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-nasmed-gray-light flex-shrink-0">
              <h2 className="font-heading text-nasmed-navy text-[17px] font-bold">Application Review — {viewApp.name}</h2>
              <button onClick={() => setViewApp(null)} className="w-8 h-8 rounded-full border border-nasmed-gray-light bg-white text-nasmed-text-muted flex items-center justify-center text-lg cursor-pointer hover:bg-nasmed-off-white">✕</button>
            </div>
            <div className="flex items-center gap-3 px-7 py-3.5 border-b border-nasmed-gray-light bg-nasmed-off-white/60 flex-shrink-0">
              <span className={`flex items-center gap-1.5 py-1 px-3 rounded-full text-[12px] font-bold border ${viewApp.status === "pending" ? "border-amber-400 text-amber-600" : viewApp.status === "approved" ? "border-nasmed-green text-nasmed-green" : "border-red-400 text-red-600"}`}>
                {viewApp.status.charAt(0).toUpperCase() + viewApp.status.slice(1)}
              </span>
              <span className="py-1 px-3 rounded-full text-[12px] font-bold border border-nasmed-mid-blue text-nasmed-mid-blue">{viewApp.tier}</span>
              <span className={`py-1 px-3 rounded-full text-[12px] font-bold border ${viewApp.payment === "Paid" ? "border-nasmed-green text-nasmed-green" : "border-amber-400 text-amber-600"}`}>
                {viewApp.payment === "Paid" ? "✓ Paid" : "⏳ Pending"}
              </span>
            </div>
            <div className="overflow-y-auto flex-1 px-7 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {field("Full Name", viewApp.name)}
                {field("Email", viewApp.email)}
                {field("Phone", viewApp.phone)}
                {field("State", viewApp.state)}
                {field("Profession", viewApp.prof)}
                {field("Qualifications", viewApp.qualifications)}
                {field("Workplace", viewApp.workplace)}
              </div>
              <div className="mt-6">
                <p className="text-[11px] font-bold tracking-[2px] uppercase text-nasmed-mid-blue mb-3">Candidate Statement</p>
                <div className="border border-nasmed-gray-light rounded-lg p-4 bg-nasmed-off-white/40 text-sm">{viewApp.statement}</div>
              </div>

              {/* Payment Receipt */}
              <div className="mt-6">
                <p className="text-[11px] font-bold tracking-[2px] uppercase text-nasmed-mid-blue mb-3">Payment Receipt</p>
                {viewApp.receiptUrl ? (
                  <div className="border border-nasmed-green/30 rounded-lg p-4 bg-nasmed-green/5 flex items-center gap-4">
                    <span className="text-3xl">{(viewApp.receiptName || "").endsWith(".pdf") ? "📋" : "🖼️"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-nasmed-navy truncate">{viewApp.receiptName || "Payment Receipt"}</p>
                      <p className="text-[11px] text-nasmed-green font-semibold mt-0.5">Receipt submitted by applicant</p>
                    </div>
                    <a
                      href={viewApp.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 bg-nasmed-navy text-white text-[12px] font-semibold py-2 px-4 rounded-lg hover:opacity-90 no-underline"
                    >
                      {(viewApp.receiptName || "").endsWith(".pdf") ? "Open PDF" : "View Image"}
                    </a>
                  </div>
                ) : (
                  <div className="border border-nasmed-gray-light rounded-lg p-4 bg-nasmed-off-white/40 text-[13px] text-nasmed-text-muted">
                    No receipt uploaded yet.
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 px-7 py-4 border-t border-nasmed-gray-light bg-white">
              <button onClick={() => setViewApp(null)} className="py-3 px-6 rounded-lg border border-nasmed-gray-light text-nasmed-navy text-[14px] font-semibold cursor-pointer hover:bg-nasmed-off-white bg-white">Close</button>
              {viewApp.status === "pending" && (
                <>
                  <button onClick={async () => { await handleAction(viewApp.id, "approve"); setViewApp(null); }} disabled={!!approvingId} className="flex-1 py-3 rounded-lg bg-nasmed-green text-white border-none text-[14px] font-bold cursor-pointer hover:bg-nasmed-green-light disabled:opacity-50">{approvingId === viewApp.id ? "Approving…" : "✓ Approve"}</button>
                  <button onClick={() => { handleAction(viewApp.id, "reject"); setViewApp(null); }} disabled={!!approvingId} className="flex-1 py-3 rounded-lg bg-red-500 text-white border-none text-[14px] font-bold cursor-pointer hover:bg-red-600 disabled:opacity-50">✗ Reject</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approved Credentials Modal */}
      {approvedCreds && (
        <div className="fixed inset-0 bg-black/70 z-[4000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[480px] shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue p-7 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="font-heading text-white text-[20px] mb-1">Application Approved</h2>
              <p className="text-white/70 text-[13px]">{approvedCreds.name} is now an active member</p>
            </div>
            <div className="p-7 flex flex-col gap-4">
              <p className="text-[13px] text-nasmed-text-muted text-center">Share these login credentials with the member. They will be required to change their password on first login.</p>
              <div className="bg-nasmed-off-white rounded-xl p-5 flex flex-col gap-3 border border-nasmed-gray-light">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-nasmed-text-muted">Member No.</span>
                  <code className="text-[13px] font-mono font-bold text-nasmed-navy">{approvedCreds.memberNumber}</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-nasmed-text-muted">Username</span>
                  <code className="text-[13px] font-mono font-bold text-nasmed-navy">{approvedCreds.username}</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-nasmed-text-muted">NASMED ID</span>
                  <code className="text-[13px] font-mono font-bold text-nasmed-mid-blue">{approvedCreds.nasmedEmail}</code>
                </div>
                <div className="flex justify-between items-center border-t border-nasmed-gray-light pt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-nasmed-text-muted">Default Password</span>
                  <code className="text-[13px] font-mono font-bold text-amber-600">{approvedCreds.password}</code>
                </div>
              </div>
              <button
                onClick={() => {
                  const text = `NASMED Member Login Credentials\n\nMember No: ${approvedCreds.memberNumber}\nUsername: ${approvedCreds.username}\nNASMED ID: ${approvedCreds.nasmedEmail}\nPassword: ${approvedCreds.password}\n\nPlease log in at the NASMED Member Portal and change your password on first sign-in.`;
                  navigator.clipboard?.writeText(text);
                  toast.success("Credentials copied to clipboard!");
                }}
                className="w-full py-2.5 rounded-lg border border-nasmed-gray-light text-nasmed-navy text-[13px] font-semibold bg-white cursor-pointer hover:bg-nasmed-off-white"
              >
                Copy Credentials
              </button>
              <button
                onClick={() => setApprovedCreds(null)}
                className="w-full py-3 rounded-lg bg-nasmed-green text-white border-none text-[14px] font-bold cursor-pointer hover:bg-nasmed-green-light"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Transaction Preview Modal ── */}
      {viewTxn && (
        <div className="fixed inset-0 bg-black/65 z-[3500] flex items-center justify-center p-4 overflow-y-auto" onClick={e => { if (e.target === e.currentTarget) setViewTxn(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-[620px] my-6 shadow-2xl overflow-hidden flex flex-col">

            {/* Header */}
            <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue p-6 relative">
              <button type="button" onClick={() => setViewTxn(null)} className="absolute top-4 right-5 bg-white/15 border-none text-white w-8 h-8 rounded-full text-lg cursor-pointer flex items-center justify-center hover:bg-white/25">✕</button>
              <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-3">💰 Payment Record</span>
              <h2 className="font-heading text-white text-[20px]">{viewTxn.member || "—"}</h2>
              <p className="text-white/65 text-[13px] mt-1">{viewTxn.email}</p>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-5 overflow-y-auto">

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
                {[
                  { label: "Amount",         value: `${viewTxn.amount} ${viewTxn.currency}` },
                  { label: "Payment Method", value: viewTxn.method || "—" },
                  { label: "Reference",      value: viewTxn.ref || "—" },
                  { label: "Date",           value: viewTxn.date || "—" },
                  { label: "Category",       value: viewTxn.type === "event_registration" ? "Event Registration" : viewTxn.type === "contribution" ? "Contribution" : "Membership" },
                  { label: "Tier / Event",   value: viewTxn.tier || "—" },
                ].map(row => (
                  <div key={row.label}>
                    <p className="text-[11px] font-bold text-nasmed-text-muted uppercase tracking-wide mb-0.5">{row.label}</p>
                    <p className="font-semibold text-nasmed-navy break-all">{row.value}</p>
                  </div>
                ))}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-nasmed-text-muted uppercase tracking-wide">Status:</span>
                {statusBadge(viewTxn.status === "confirmed" ? "approved" : viewTxn.status === "awaiting_confirmation" ? "pending" : viewTxn.status)}
              </div>

              {/* Description */}
              {viewTxn.description && (
                <div className="bg-nasmed-off-white rounded-xl px-4 py-3 text-[13px] text-nasmed-text-muted">
                  <span className="font-semibold text-nasmed-navy">Note: </span>{viewTxn.description}
                </div>
              )}

              {/* Receipt section */}
              <div>
                <p className="text-[12px] font-bold text-nasmed-navy uppercase tracking-wide mb-2">Payment Receipt</p>
                {viewTxn.receiptUrl ? (
                  <div className="border-2 border-nasmed-green/40 rounded-xl overflow-hidden bg-nasmed-green/5">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-nasmed-green/20">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{/\.pdf$/i.test(viewTxn.receiptName || "") ? "📋" : "🖼️"}</span>
                        <div>
                          <p className="text-[13px] font-semibold text-nasmed-green">✓ Receipt Attached</p>
                          <p className="text-[11px] text-nasmed-text-muted truncate max-w-[260px]">{viewTxn.receiptName || "receipt"}</p>
                        </div>
                      </div>
                      <a
                        href={viewTxn.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] font-semibold text-nasmed-mid-blue bg-nasmed-mid-blue/10 hover:bg-nasmed-mid-blue/20 py-1.5 px-3 rounded-lg transition-colors"
                      >
                        {/\.pdf$/i.test(viewTxn.receiptName || "") ? "Open PDF ↗" : "Full Size ↗"}
                      </a>
                    </div>
                    {/\.(jpg|jpeg|png|gif|webp)$/i.test(viewTxn.receiptName || viewTxn.receiptUrl || "") && (
                      <div className="p-3 bg-white">
                        <img src={viewTxn.receiptUrl} alt="Payment receipt" className="w-full max-h-64 object-contain rounded-lg border border-nasmed-gray-light" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-red-200 rounded-xl px-4 py-3 bg-red-50 flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="text-[13px] font-semibold text-red-700">No Receipt Attached</p>
                      <p className="text-[11px] text-red-500">Member has not uploaded a proof of payment. Consider sending a follow-up email.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-nasmed-gray-light bg-nasmed-off-white flex flex-wrap gap-2 justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {viewTxn.status === "awaiting_confirmation" && (
                  <button
                    type="button"
                    onClick={async () => { await handleConfirmTransaction(viewTxn.id); setViewTxn(prev => prev ? { ...prev, status: "confirmed" } : null); }}
                    className="bg-nasmed-green text-white border-none py-2 px-4 rounded-lg text-[13px] font-semibold cursor-pointer hover:bg-nasmed-green-light"
                  >✓ Approve Payment</button>
                )}
                {viewTxn.status === "awaiting_confirmation" && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await transactionService.updateStatus(viewTxn.id, "rejected");
                        setTransactions(prev => prev.map(t => t.id === viewTxn.id ? { ...t, status: "rejected" } : t));
                        setViewTxn(prev => prev ? { ...prev, status: "rejected" } : null);
                        toast.success("Payment rejected.");
                      } catch { toast.error("Failed to update status."); }
                    }}
                    className="bg-red-500 text-white border-none py-2 px-4 rounded-lg text-[13px] font-semibold cursor-pointer hover:bg-red-600"
                  >✗ Reject</button>
                )}
                <a
                  href={`mailto:${viewTxn.email}?subject=${txnEmailSubject(viewTxn, "approve")}&body=${txnEmailBody(viewTxn, "approve")}`}
                  className="bg-nasmed-mid-blue text-white py-2 px-4 rounded-lg text-[13px] font-semibold hover:opacity-80 transition-opacity no-underline inline-block"
                >✉ Approval Email</a>
                <a
                  href={`mailto:${viewTxn.email}?subject=${txnEmailSubject(viewTxn, "reject")}&body=${txnEmailBody(viewTxn, "reject")}`}
                  className="bg-amber-500 text-white py-2 px-4 rounded-lg text-[13px] font-semibold hover:opacity-80 transition-opacity no-underline inline-block"
                >✉ Rejection Email</a>
                {!viewTxn.receiptUrl && (
                  <a
                    href={`mailto:${viewTxn.email}?subject=${txnEmailSubject(viewTxn, "followup")}&body=${txnEmailBody(viewTxn, "followup")}`}
                    className="bg-purple-500 text-white py-2 px-4 rounded-lg text-[13px] font-semibold hover:opacity-80 transition-opacity no-underline inline-block"
                  >✉ Follow-up Email</a>
                )}
              </div>
              <button type="button" onClick={() => setViewTxn(null)} className="bg-transparent border border-nasmed-gray-light text-nasmed-text-muted py-2 px-4 rounded-lg text-[13px] cursor-pointer hover:border-nasmed-mid-blue hover:text-nasmed-mid-blue">Close</button>
            </div>

          </div>
        </div>
      )}

      {/* ── Delete Transaction Confirmation ── */}
      {deletingTxnId && (
        <div className="fixed inset-0 bg-black/60 z-[4000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl overflow-hidden">
            <div className="p-6 text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-heading text-nasmed-navy text-[18px] font-bold mb-2">Delete Payment Record?</h3>
              <p className="text-nasmed-text-muted text-[13px] mb-5">This will permanently remove the record and cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingTxnId(null)}
                  className="flex-1 py-2.5 rounded-lg border border-nasmed-gray-light text-nasmed-navy text-[13px] font-semibold bg-white cursor-pointer hover:bg-nasmed-off-white"
                >Cancel</button>
                <button
                  type="button"
                  onClick={async () => {
                    const id = deletingTxnId;
                    setDeletingTxnId(null);
                    try {
                      await transactionService.delete(id);
                      setTransactions(prev => prev.filter(x => x.id !== id));
                      if (viewTxn?.id === id) setViewTxn(null);
                      toast.success("Record deleted.");
                    } catch (err) {
                      toast.error(`Delete failed: ${err instanceof Error ? err.message : "Unknown error"}`);
                    }
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-red-500 text-white border-none text-[13px] font-bold cursor-pointer hover:bg-red-600"
                >Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editMember && (
        <div className="fixed inset-0 bg-black/60 z-[3000] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setEditMember(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-[500px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-nasmed-gray-light">
              <h2 className="font-heading text-nasmed-navy text-lg font-bold">Edit Member</h2>
              <button onClick={() => setEditMember(null)} className="w-8 h-8 rounded-full border border-nasmed-gray-light bg-white text-nasmed-text-muted flex items-center justify-center cursor-pointer hover:bg-nasmed-off-white">✕</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Full Name</label>
                  <input type="text" value={editMember.name} onChange={e => setEditMember({...editMember, name: e.target.value})} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Profession</label>
                  <input type="text" value={editMember.prof} onChange={e => setEditMember({...editMember, prof: e.target.value})} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Tier</label>
                  <select value={editMember.tier} onChange={e => setEditMember({...editMember, tier: e.target.value})} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm">
                    <option>Associate Member</option>
                    <option>Individual Member</option>
                    <option>Fellow (FNASMED)</option>
                    <option>Student Membership</option>
                    <option>International Membership</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">State</label>
                  <input type="text" value={editMember.state} onChange={e => setEditMember({...editMember, state: e.target.value})} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Position</label>
                  <input type="text" value={editMember.position} onChange={e => setEditMember({...editMember, position: e.target.value})} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Status</label>
                  <select value={editMember.status} onChange={e => setEditMember({...editMember, status: e.target.value})} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm">
                    <option>active</option>
                    <option>inactive</option>
                    <option>suspended</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-nasmed-gray-light">
              <button onClick={() => setEditMember(null)} className="py-2.5 px-5 rounded-lg border border-nasmed-gray-light text-nasmed-navy text-[14px] font-semibold bg-white cursor-pointer hover:bg-nasmed-off-white">Cancel</button>
              <button onClick={saveMember} className="flex-1 py-2.5 rounded-lg bg-nasmed-green text-white border-none text-[14px] font-bold cursor-pointer hover:bg-nasmed-green-light">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit News Post Modal ── */}
      {editPost && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[540px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-nasmed-gray-light">
              <h3 className="font-heading text-[18px] font-bold text-nasmed-navy">Edit News Post</h3>
              <button onClick={() => setEditPost(null)} className="text-nasmed-text-muted hover:text-nasmed-navy text-xl leading-none bg-transparent border-none cursor-pointer">✕</button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Title <span className="text-red-600">*</span></label>
                <input type="text" value={epTitle} onChange={e => setEpTitle(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Description</label>
                <textarea value={epDesc} onChange={e => setEpDesc(e.target.value)} rows={3} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue resize-y" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Category</label>
                  <select value={epCat} onChange={e => { setEpCat(e.target.value); setEpCatLabel(e.target.value.toUpperCase()); }} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue">
                    <option value="conference">Conference</option>
                    <option value="research">Research</option>
                    <option value="update">Update</option>
                    <option value="governance">Governance</option>
                    <option value="milestones">Milestones</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Category Label</label>
                  <input type="text" value={epCatLabel} onChange={e => setEpCatLabel(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Date Label</label>
                  <input type="text" value={epDateLabel} onChange={e => setEpDateLabel(e.target.value)} placeholder="e.g. Jul 2025" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Read Time</label>
                  <input type="text" value={epReadTime} onChange={e => setEpReadTime(e.target.value)} placeholder="3 min read" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-nasmed-gray-light">
              <button onClick={() => setEditPost(null)} className="py-2.5 px-5 rounded-lg border border-nasmed-gray-light text-nasmed-navy text-[14px] font-semibold bg-white cursor-pointer hover:bg-nasmed-off-white">Cancel</button>
              <button onClick={saveEditPost} className="flex-1 py-2.5 rounded-lg bg-nasmed-green text-white border-none text-[14px] font-bold cursor-pointer hover:bg-nasmed-green-light">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Event Modal ── */}
      {editEvent && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-nasmed-gray-light">
              <h3 className="font-heading text-[18px] font-bold text-nasmed-navy">Edit Event</h3>
              <button onClick={() => setEditEvent(null)} className="text-nasmed-text-muted hover:text-nasmed-navy text-xl leading-none bg-transparent border-none cursor-pointer">✕</button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Title <span className="text-red-600">*</span></label>
                <input type="text" value={eeTitle} onChange={e => setEeTitle(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Description</label>
                <input type="text" value={eeDesc} onChange={e => setEeDesc(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Location</label>
                  <input type="text" value={eeLocation} onChange={e => setEeLocation(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Event Date</label>
                  <input type="date" value={eeDate} onChange={e => setEeDate(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">CTA Button Text</label>
                  <input type="text" value={eeCtaText} onChange={e => setEeCtaText(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Button Style</label>
                  <select value={eeCtaStyle} onChange={e => setEeCtaStyle(e.target.value as "filled" | "outline")} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue">
                    <option value="filled">Filled (Green)</option>
                    <option value="outline">Outline</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Registration Fee (₦)</label>
                  <input type="number" min="0" value={eeFee} onChange={e => setEeFee(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Full Event Content (body)</label>
                <textarea rows={5} value={eeBody} onChange={e => setEeBody(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue resize-y" />
              </div>

              {/* Flier upload */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-nasmed-navy">Event Flier / Poster Image</label>
                {eeFlierUrl && !eeFlierFile && (
                  <div className="flex items-start gap-3 p-3 bg-nasmed-off-white rounded-lg border border-nasmed-gray-light">
                    <img src={eeFlierUrl} alt="Current flier" className="w-16 h-20 object-cover rounded-lg border border-nasmed-gray-light flex-shrink-0" />
                    <div className="flex flex-col gap-1 flex-1">
                      <p className="text-[12px] font-semibold text-nasmed-navy">Current flier</p>
                      <button type="button" onClick={() => setEeFlierUrl("")} className="text-red-500 text-[12px] font-semibold bg-transparent border-none cursor-pointer text-left hover:text-red-700">Remove flier</button>
                    </div>
                  </div>
                )}
                <label className={`flex items-center gap-3 py-3 px-4 border-[1.5px] border-dashed rounded-lg cursor-pointer transition-all ${eeFlierFile ? "border-nasmed-green bg-nasmed-green/5" : "border-nasmed-gray-light hover:border-nasmed-mid-blue hover:bg-nasmed-off-white"}`}>
                  <span className="text-xl">{eeFlierFile ? "🖼️" : "📁"}</span>
                  <div className="flex-1 min-w-0">
                    {eeFlierFile
                      ? <><p className="text-sm font-semibold text-nasmed-navy truncate">{eeFlierFile.name}</p><p className="text-xs text-nasmed-text-muted">{(eeFlierFile.size / 1024).toFixed(0)} KB</p></>
                      : <><p className="text-sm text-nasmed-text-muted">{eeFlierUrl ? "Upload new flier (replaces current)" : "Click to upload event flier"}</p><p className="text-xs text-nasmed-text-muted">JPG, PNG, WEBP up to 10MB</p></>
                    }
                  </div>
                  {eeFlierFile && <button type="button" onClick={e => { e.preventDefault(); setEeFlierFile(null); setEeFlierPreview(null); }} className="text-red-400 hover:text-red-600 text-lg leading-none border-none bg-transparent cursor-pointer">✕</button>}
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    const f = e.target.files?.[0] || null;
                    setEeFlierFile(f);
                    if (f) { const r = new FileReader(); r.onload = ev => setEeFlierPreview(ev.target?.result as string); r.readAsDataURL(f); }
                    else setEeFlierPreview(null);
                  }} />
                </label>
                {eeFlierPreview && (
                  <div className="mt-1 rounded-lg overflow-hidden border border-nasmed-gray-light w-full max-w-[180px]">
                    <img src={eeFlierPreview} alt="New flier preview" className="w-full object-contain max-h-[240px]" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-nasmed-gray-light">
              <button onClick={() => setEditEvent(null)} className="py-2.5 px-5 rounded-lg border border-nasmed-gray-light text-nasmed-navy text-[14px] font-semibold bg-white cursor-pointer hover:bg-nasmed-off-white">Cancel</button>
              <button onClick={saveEditEvent} className="flex-1 py-2.5 rounded-lg bg-nasmed-green text-white border-none text-[14px] font-bold cursor-pointer hover:bg-nasmed-green-light">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Event Registration Detail Modal ── */}
      {viewRegModal && (
        <div
          className="fixed inset-0 bg-black/65 z-[300] flex items-start justify-center p-5 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) setViewRegModal(null); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-[580px] my-8 shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-br from-nasmed-navy to-nasmed-mid-blue px-7 py-5 flex items-start justify-between">
              <div>
                <span className="inline-block bg-nasmed-green/25 text-nasmed-green-light text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded mb-2">Registration Details</span>
                <h3 className="font-heading text-white text-[18px] leading-snug">{viewRegModal.eventTitle}</h3>
              </div>
              <button onClick={() => setViewRegModal(null)} className="bg-white/15 border-none text-white w-8 h-8 rounded-full text-lg cursor-pointer flex items-center justify-center hover:bg-white/25 flex-shrink-0 mt-1">✕</button>
            </div>

            <div className="p-7 flex flex-col gap-5">

              {/* Status badges */}
              <div className="flex gap-2 flex-wrap">
                {statusBadge(viewRegModal.status)}
                {statusBadge(viewRegModal.paymentStatus)}
              </div>

              {/* Registrant info */}
              <div className="bg-nasmed-off-white rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-nasmed-text-muted mb-0.5">Full Name</p>
                  <p className="text-[14px] font-semibold text-nasmed-navy">{viewRegModal.name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-nasmed-text-muted mb-0.5">Email</p>
                  <p className="text-[14px] text-nasmed-navy break-all">{viewRegModal.email}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-nasmed-text-muted mb-0.5">Organisation</p>
                  <p className="text-[14px] text-nasmed-navy">{viewRegModal.organisation}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-nasmed-text-muted mb-0.5">Registered</p>
                  <p className="text-[14px] text-nasmed-navy">{viewRegModal.date}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-nasmed-text-muted mb-0.5">Dues Status</p>
                  <p className="text-[14px] text-nasmed-navy">{viewRegModal.duesStatus}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-nasmed-text-muted mb-0.5">Registration Fee</p>
                  <p className="text-[14px] font-bold text-nasmed-navy">{viewRegModal.fee}</p>
                </div>
              </div>

              {/* Payment info */}
              <div className="bg-nasmed-off-white rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-nasmed-text-muted mb-0.5">Payment Method</p>
                  <p className="text-[14px] text-nasmed-navy">{viewRegModal.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-nasmed-text-muted mb-0.5">Payment Reference</p>
                  <p className="text-[14px] font-mono text-nasmed-navy break-all">{viewRegModal.paymentRef}</p>
                </div>
              </div>

              {/* Proof of payment */}
              {viewRegModal.receiptUrl ? (
                <div className="flex flex-col gap-3">
                  <p className="text-[13px] font-bold text-nasmed-navy">Proof of Payment</p>
                  {/\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(viewRegModal.receiptUrl) ? (
                    <a href={viewRegModal.receiptUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <img
                        src={viewRegModal.receiptUrl}
                        alt="Payment receipt"
                        className="w-full max-h-[340px] object-contain rounded-xl border border-nasmed-gray-light shadow-sm hover:shadow-md transition-shadow"
                      />
                      <p className="text-[12px] text-nasmed-mid-blue mt-1.5 text-center">Click image to open full size ↗</p>
                    </a>
                  ) : (
                    <a
                      href={viewRegModal.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-nasmed-off-white border border-nasmed-gray-light rounded-xl hover:bg-nasmed-mid-blue/5 transition-colors"
                    >
                      <span className="text-3xl">📄</span>
                      <div>
                        <p className="text-[13px] font-semibold text-nasmed-navy">View Receipt Document</p>
                        <p className="text-[12px] text-nasmed-mid-blue">Click to open in new tab ↗</p>
                      </div>
                    </a>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-xl">⚠️</span>
                  <p className="text-[13px] text-amber-700 font-medium">No proof of payment attached to this registration.</p>
                </div>
              )}

              {/* ── Email Response Composer ── */}
              <div className="border border-nasmed-gray-light rounded-xl overflow-hidden">
                <div className="bg-nasmed-off-white px-4 py-3 border-b border-nasmed-gray-light">
                  <p className="text-[13px] font-bold text-nasmed-navy">✉ Send Response to Registrant</p>
                  <p className="text-[11px] text-nasmed-text-muted mt-0.5">Compose a custom message or use a quick template. This will open your email client with the message pre-filled.</p>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {/* Quick template buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setRegReplyText(regEmailTemplates.missingReceipt(viewRegModal))}
                      className="py-1.5 px-3 rounded-lg border-[1.5px] border-amber-400 text-amber-700 bg-amber-50 text-[11px] font-semibold cursor-pointer hover:bg-amber-100 transition-colors"
                    >⚠ Missing Proof of Payment</button>
                    <button
                      type="button"
                      onClick={() => setRegReplyText(regEmailTemplates.notApproved(viewRegModal))}
                      className="py-1.5 px-3 rounded-lg border-[1.5px] border-red-300 text-red-700 bg-red-50 text-[11px] font-semibold cursor-pointer hover:bg-red-100 transition-colors"
                    >✗ Registration Not Approved</button>
                    <button
                      type="button"
                      onClick={() => setRegReplyText(regEmailTemplates.approved(viewRegModal))}
                      className="py-1.5 px-3 rounded-lg border-[1.5px] border-nasmed-green/50 text-nasmed-green bg-nasmed-green/5 text-[11px] font-semibold cursor-pointer hover:bg-nasmed-green/10 transition-colors"
                    >✓ Registration Approved</button>
                    <button
                      type="button"
                      onClick={() => setRegReplyText(regEmailTemplates.followUp(viewRegModal))}
                      className="py-1.5 px-3 rounded-lg border-[1.5px] border-nasmed-mid-blue/40 text-nasmed-mid-blue bg-nasmed-mid-blue/5 text-[11px] font-semibold cursor-pointer hover:bg-nasmed-mid-blue/10 transition-colors"
                    >↩ General Follow-up</button>
                    {regReplyText && (
                      <button
                        type="button"
                        onClick={() => setRegReplyText("")}
                        className="py-1.5 px-3 rounded-lg border-[1.5px] border-nasmed-gray-light text-nasmed-text-muted bg-white text-[11px] font-semibold cursor-pointer hover:border-red-300 hover:text-red-500 transition-colors"
                      >✕ Clear</button>
                    )}
                  </div>

                  {/* Compose area */}
                  <textarea
                    value={regReplyText}
                    onChange={e => setRegReplyText(e.target.value)}
                    rows={6}
                    placeholder="Type your message here, or click a template above to pre-fill…"
                    className="w-full py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-[13px] text-nasmed-navy outline-none focus:border-nasmed-mid-blue resize-y leading-relaxed"
                  />

                  {/* Send button */}
                  <a
                    href={regReplyText.trim() ? `mailto:${viewRegModal.email}?subject=${encodeURIComponent(`NASMED Event Registration — ${viewRegModal.eventTitle}`)}&body=${encodeURIComponent(regReplyText)}` : "#"}
                    onClick={e => { if (!regReplyText.trim()) { e.preventDefault(); toast.error("Please type a message before sending."); } }}
                    className={`flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg text-[13px] font-semibold no-underline transition-all ${regReplyText.trim() ? "bg-nasmed-mid-blue text-white hover:opacity-85 cursor-pointer" : "bg-nasmed-gray-light text-nasmed-text-muted cursor-not-allowed"}`}
                  >
                    ✉ Send Email to {viewRegModal.name}
                  </a>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                {viewRegModal.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={async () => {
                        await eventRegistrationService.updateStatus(viewRegModal.id, "confirmed");
                        setEventRegistrations(prev => prev.map(x => x.id === viewRegModal.id ? { ...x, status: "confirmed" } : x));
                        setViewRegModal(prev => prev ? { ...prev, status: "confirmed" } : null);
                        toast.success(`Registration confirmed for ${viewRegModal.name}`);
                      }}
                      className="flex-1 bg-nasmed-green text-white border-none py-2.5 rounded-lg text-[14px] font-bold cursor-pointer hover:bg-nasmed-green-light transition-all"
                    >✓ Confirm Registration</button>
                    <button
                      type="button"
                      onClick={async () => {
                        await eventRegistrationService.updateStatus(viewRegModal.id, "cancelled");
                        setEventRegistrations(prev => prev.map(x => x.id === viewRegModal.id ? { ...x, status: "cancelled" } : x));
                        setViewRegModal(prev => prev ? { ...prev, status: "cancelled" } : null);
                        toast.success(`Registration cancelled for ${viewRegModal.name}`);
                      }}
                      className="bg-red-500 text-white border-none py-2.5 px-5 rounded-lg text-[14px] font-bold cursor-pointer hover:bg-red-600 transition-all"
                    >✗ Cancel</button>
                  </>
                )}
                {viewRegModal.status !== "pending" && (
                  <button
                    type="button"
                    onClick={() => setViewRegModal(null)}
                    className="flex-1 py-2.5 rounded-lg border border-nasmed-gray-light text-nasmed-navy text-[14px] font-semibold bg-white cursor-pointer hover:bg-nasmed-off-white"
                  >Close</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Poster Modal ── */}
      {editPoster && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setEditPoster(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-[480px] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-nasmed-gray-light">
              <h3 className="font-heading text-nasmed-navy text-[16px] font-bold">Edit Poster</h3>
              <button onClick={() => setEditPoster(null)} className="w-8 h-8 rounded-full border border-nasmed-gray-light bg-white text-nasmed-text-muted flex items-center justify-center text-lg cursor-pointer hover:bg-nasmed-off-white">✕</button>
            </div>
            <div className="p-6 flex gap-5">
              <img src={editPoster.image_url} alt="Poster" className="w-24 h-32 object-cover rounded-lg border border-nasmed-gray-light flex-shrink-0" />
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Title</label>
                  <input
                    type="text"
                    value={eposterTitle}
                    onChange={e => setEposterTitle(e.target.value)}
                    placeholder="e.g. Annual Conference 2025"
                    className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue"
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Caption</label>
                  <textarea
                    value={eposterDesc}
                    onChange={e => setEposterDesc(e.target.value)}
                    placeholder="Short caption or context shown below the poster"
                    rows={3}
                    className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-5 border-t border-nasmed-gray-light">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await newsService.updatePoster(editPoster.id, { title: eposterTitle || undefined, description: eposterDesc || undefined });
                    setPosters(prev => prev.map(x => x.id === editPoster.id ? { ...x, title: eposterTitle || undefined, description: eposterDesc || undefined } : x));
                    setEditPoster(null);
                    toast.success("Poster updated.");
                  } catch { toast.error("Failed to update poster."); }
                }}
                className="bg-nasmed-green text-white border-none py-2.5 px-6 rounded-lg text-[14px] font-semibold cursor-pointer hover:bg-nasmed-green-light transition-all"
              >Save Changes</button>
              <button type="button" onClick={() => setEditPoster(null)} className="bg-nasmed-gray-light text-nasmed-navy border-none py-2.5 px-5 rounded-lg text-[14px] font-semibold cursor-pointer hover:bg-gray-200 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Publication Modal ── */}
      {editPubItem && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[540px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-nasmed-gray-light">
              <h3 className="font-heading text-[18px] font-bold text-nasmed-navy">Edit Publication</h3>
              <button onClick={() => setEditPubItem(null)} className="text-nasmed-text-muted hover:text-nasmed-navy text-xl leading-none bg-transparent border-none cursor-pointer">✕</button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Title <span className="text-red-600">*</span></label>
                <input type="text" value={epubTitle} onChange={e => setEpubTitle(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Type</label>
                <select value={epubType} onChange={e => setEpubType(e.target.value)} className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue">
                  <option>Guidelines</option>
                  <option>Journal</option>
                  <option>Protocol</option>
                  <option>Research</option>
                  <option>Newsletter</option>
                  <option>Report</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-nasmed-navy">Description / Abstract</label>
                <textarea value={epubContent} onChange={e => setEpubContent(e.target.value)} rows={3} placeholder="Leave blank to keep existing description" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue resize-y" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-nasmed-navy">Access Type</label>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { value: "free", label: "Free", icon: "🔓" },
                    { value: "paid", label: "Paid", icon: "💳" },
                    { value: "subscribed", label: "Members Only", icon: "🔐" },
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border-[1.5px] cursor-pointer transition-all ${epubAccess === opt.value ? "border-nasmed-mid-blue bg-nasmed-mid-blue/5" : "border-nasmed-gray-light hover:border-nasmed-mid-blue/40"}`}>
                      <input type="radio" name="epubAccess" value={opt.value} checked={epubAccess === opt.value} onChange={() => setEpubAccess(opt.value)} className="accent-nasmed-mid-blue" />
                      <span className="text-[13px] font-semibold text-nasmed-navy">{opt.icon} {opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {epubAccess === "paid" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nasmed-navy">Price (₦)</label>
                  <input type="text" value={epubPrice} onChange={e => setEpubPrice(e.target.value)} placeholder="e.g. 2500" className="py-2.5 px-3.5 border-[1.5px] border-nasmed-gray-light rounded-lg text-sm outline-none focus:border-nasmed-mid-blue" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-nasmed-gray-light">
              <button onClick={() => setEditPubItem(null)} className="py-2.5 px-5 rounded-lg border border-nasmed-gray-light text-nasmed-navy text-[14px] font-semibold bg-white cursor-pointer hover:bg-nasmed-off-white">Cancel</button>
              <button onClick={saveEditPub} className="flex-1 py-2.5 rounded-lg bg-nasmed-green text-white border-none text-[14px] font-bold cursor-pointer hover:bg-nasmed-green-light">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden certificate frame used for email capture */}
      {certToSend && (
        <div style={{ position: "fixed", left: "-9999px", top: 0, visibility: "hidden", pointerEvents: "none" }}>
          <div id="admin-cert-hidden">
            <CertificateFrame
              memberName={certToSend.name}
              certNumber={certToSend.certNumber}
              date={certToSend.date}
              membershipType={certToSend.tier}
            />
          </div>
        </div>
      )}
    </div>
  );
}

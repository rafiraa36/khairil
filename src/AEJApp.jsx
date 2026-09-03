import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Users,
  Building2,
  Menu,
  X,
  Plus,
  Pencil,
  Trash2,
  Search,
  ShieldCheck,
  Newspaper,
  Image as ImageIcon,
  Trophy,
  CalendarDays,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  Inbox,
  ArrowRight,
} from "lucide-react";

/* ============================================================
   AEJ MANAGEMENT SYSTEM
   Aliyah Education Journalist
   MAN 2 Deli Serdang

   Phase 1:
   - Landing page
   - Login
   - Role system
   - Dashboard
   - Kelola anggota
   - Divisi
   - Profil
   - Pengaturan password
   - LocalStorage
   ============================================================ */


/* ============================================================
   DATA
   ============================================================ */

const DIVISIONS_SEED = [
  {
    id: "artistik",
    name: "Artistik",
    desc: "Desain grafis, ilustrasi, dan identitas visual AEJ.",
  },
  {
    id: "dokumentasi",
    name: "Dokumentasi",
    desc: "Fotografi dan videografi setiap kegiatan sekolah.",
  },
  {
    id: "bahasa",
    name: "Bahasa",
    desc: "Penyuntingan bahasa dan pengembangan naskah.",
  },
  {
    id: "liputan",
    name: "Liputan",
    desc: "Peliputan berita dan reportase lapangan.",
  },
  {
    id: "redaktur",
    name: "Redaktur",
    desc: "Penyuntingan akhir dan tata kelola penerbitan.",
  },
];

const ROLE_LABEL = {
  anggota: "Anggota",
  ketua_umum: "Ketua Umum",
  pembina: "Pembina",
};


/* ============================================================
   SIMPLE HASH
   Catatan:
   Ini hanya untuk demo/prototype.
   Untuk production gunakan backend + bcrypt/Argon2.
   ============================================================ */

function simpleHash(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;

  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);

    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);

  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return (
    4294967296 * (2097151 & h2) +
    (h1 >>> 0)
  ).toString(36);
}


/* ============================================================
   SEED USERS
   ============================================================ */

const SEED_USERS = [
  {
    id: "u-pembina",
    username: "pembina.aej",
    password: simpleHash("Pembina#2026"),
    role: "pembina",
    name: "Pembina AEJ",
    division: null,
    jabatan: "Pembina AEJ",
    status: "aktif",
    createdAt: "2026-07-01",
  },

  {
    id: "u-ketua",
    username: "ketua.aej",
    password: simpleHash("Ketua#2026"),
    role: "ketua_umum",
    name: "Ketua Umum AEJ",
    division: "redaktur",
    jabatan: "Ketua Umum",
    status: "aktif",
    createdAt: "2026-07-01",
  },

  {
    id: "u-a1",
    username: "anggota.artistik",
    password: simpleHash("Anggota#2026"),
    role: "anggota",
    name: "Anggota Divisi Artistik",
    division: "artistik",
    jabatan: "Anggota",
    status: "aktif",
    createdAt: "2026-07-02",
  },

  {
    id: "u-a2",
    username: "anggota.dokumentasi",
    password: simpleHash("Anggota#2026"),
    role: "anggota",
    name: "Anggota Divisi Dokumentasi",
    division: "dokumentasi",
    jabatan: "Anggota",
    status: "aktif",
    createdAt: "2026-07-02",
  },

  {
    id: "u-a3",
    username: "anggota.bahasa",
    password: simpleHash("Anggota#2026"),
    role: "anggota",
    name: "Anggota Divisi Bahasa",
    division: "bahasa",
    jabatan: "Anggota",
    status: "aktif",
    createdAt: "2026-07-02",
  },

  {
    id: "u-a4",
    username: "anggota.liputan",
    password: simpleHash("Anggota#2026"),
    role: "anggota",
    name: "Anggota Divisi Liputan",
    division: "liputan",
    jabatan: "Anggota",
    status: "aktif",
    createdAt: "2026-07-02",
  },
];


/* ============================================================
   STORAGE
   ============================================================ */

const STORAGE_KEYS = {
  users: "aej_users",
  divisions: "aej_divisions",
  session: "aej_session",
};

async function storageGet(key) {
  try {
    if (
      typeof window !== "undefined" &&
      window.storage &&
      typeof window.storage.get === "function"
    ) {
      const result = await window.storage.get(key, true);

      return result?.value ?? null;
    }

    return localStorage.getItem(key);
  } catch (error) {
    console.error("Storage GET error:", error);
    return null;
  }
}

async function storageSet(key, value) {
  try {
    if (
      typeof window !== "undefined" &&
      window.storage &&
      typeof window.storage.set === "function"
    ) {
      await window.storage.set(key, value, true);
      return true;
    }

    localStorage.setItem(key, value);

    return true;
  } catch (error) {
    console.error("Storage SET error:", error);
    return false;
  }
}

async function storageDelete(key) {
  try {
    if (
      typeof window !== "undefined" &&
      window.storage &&
      typeof window.storage.delete === "function"
    ) {
      await window.storage.delete(key, true);
      return true;
    }

    localStorage.removeItem(key);

    return true;
  } catch (error) {
    console.error("Storage DELETE error:", error);
    return false;
  }
}


async function dbGetUsers() {
  try {
    const value = await storageGet(STORAGE_KEYS.users);

    if (!value) return null;

    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

async function dbSaveUsers(users) {
  return storageSet(
    STORAGE_KEYS.users,
    JSON.stringify(users)
  );
}


async function dbGetDivisions() {
  try {
    const value = await storageGet(
      STORAGE_KEYS.divisions
    );

    if (!value) return null;

    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

async function dbSaveDivisions(divisions) {
  return storageSet(
    STORAGE_KEYS.divisions,
    JSON.stringify(divisions)
  );
}


async function dbGetSession() {
  try {
    const value = await storageGet(
      STORAGE_KEYS.session
    );

    if (!value) return null;

    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function dbSaveSession(userId) {
  return storageSet(
    STORAGE_KEYS.session,
    JSON.stringify({
      userId,
    })
  );
}

async function dbClearSession() {
  return storageDelete(
    STORAGE_KEYS.session
  );
}


/* ============================================================
   TOAST
   ============================================================ */

function Toast({ toasts, onClose }) {
  return (
    <div className="aej-toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="aej-toast"
          style={{
            borderLeftColor:
              toast.type === "error"
                ? "#B3261E"
                : toast.type === "warn"
                ? "#C9A227"
                : "#0F1B3D",
          }}
        >
          <div style={{ flex: 1 }}>
            <p className="aej-toast-title">
              {toast.title}
            </p>

            {toast.desc && (
              <p className="aej-toast-desc">
                {toast.desc}
              </p>
            )}
          </div>

          <button
            className="aej-toast-close"
            onClick={() => onClose(toast.id)}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}


/* ============================================================
   CONFIRM DIALOG
   ============================================================ */

function ConfirmDialog({
  open,
  title,
  desc,
  confirmLabel = "Ya, lanjutkan",
  danger,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="aej-overlay"
      onClick={onCancel}
    >
      <div
        className="aej-dialog"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="aej-confirm-content">
          <div
            className="aej-confirm-icon"
            style={{
              background: danger
                ? "#FBEAEA"
                : "#FBF3DA",
            }}
          >
            <AlertTriangle
              size={18}
              color={
                danger
                  ? "#B3261E"
                  : "#8A6D0B"
              }
            />
          </div>

          <div>
            <h3 className="aej-dialog-title">
              {title}
            </h3>

            <p className="aej-dialog-desc">
              {desc}
            </p>
          </div>
        </div>

        <div className="aej-dialog-actions">
          <button
            className="aej-btn-ghost"
            onClick={onCancel}
          >
            Batal
          </button>

          <button
            className={
              danger
                ? "aej-btn-danger"
                : "aej-btn-primary"
            }
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


/* ============================================================
   EMPTY STATE
   ============================================================ */

function EmptyState({
  icon: Icon = Inbox,
  title,
  desc,
}) {
  return (
    <div className="aej-empty">
      <Icon
        size={28}
        color="#9AA3B5"
      />

      <p className="aej-empty-title">
        {title}
      </p>

      {desc && (
        <p className="aej-empty-desc">
          {desc}
        </p>
      )}
    </div>
  );
}


/* ============================================================
   AVATAR
   ============================================================ */

function Avatar({
  name,
  size = 40,
}) {
  const initials = (
    name || "?"
  )
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="aej-avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  );
}


/* ============================================================
   STATUS
   ============================================================ */

function StatusPill({ status }) {
  const active = status === "aktif";

  return (
    <span
      className={
        active
          ? "aej-status-active"
          : "aej-status-inactive"
      }
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}


/* ============================================================
   LANDING PAGE
   ============================================================ */

function LandingPage({
  onLoginClick,
  divisions,
}) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const navItems = [
    "Beranda",
    "Tentang AEJ",
    "Struktur",
    "Divisi",
    "Berita",
    "Karya",
    "Prestasi",
    "Agenda",
    "Galeri",
  ];

  const scrollTo = (id) => {
    setMenuOpen(false);

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <div className="aej-landing">

      {/* NAVBAR */}
      <header className="aej-nav">
        <div className="aej-nav-inner">

          <div
            className="aej-brand"
            onClick={() =>
              scrollTo("beranda")
            }
          >
            <span className="aej-brand-mark">
              AEJ
            </span>

            <span className="aej-brand-text">
              Management System
            </span>
          </div>

          <nav className="aej-nav-links">
            {navItems.map((item) => (
              <button
                key={item}
                className="aej-nav-link"
                onClick={() =>
                  scrollTo(
                    item
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "-"
                      )
                  )
                }
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            className="aej-btn-gold"
            onClick={onLoginClick}
          >
            Login
          </button>

          <button
            className="aej-burger"
            onClick={() =>
              setMenuOpen(
                (value) => !value
              )
            }
          >
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="aej-mobile-menu">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() =>
                  scrollTo(
                    item
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "-"
                      )
                  )
                }
              >
                {item}
              </button>
            ))}

            <button
              className="aej-btn-gold"
              onClick={onLoginClick}
            >
              Login
            </button>
          </div>
        )}
      </header>


      {/* HERO */}
      <section
        id="beranda"
        className="aej-hero"
      >
        <div className="aej-hero-diagonal" />

        <div className="aej-hero-inner">

          <div>
            <p className="aej-hero-kicker">
              Aliyah Education Journalist
              {" · "}
              MAN 2 Deli Serdang
            </p>

            <h1 className="aej-hero-title">
              AEJ Management
              <br />
              System
            </h1>

            <p className="aej-hero-sub">
              Aliyah Education Journalist
              MAN 2 Deli Serdang
            </p>

            <p className="aej-hero-desc">
              Platform digital untuk
              mendukung kegiatan
              jurnalistik, pelatihan,
              kreativitas, kolaborasi,
              dan pengelolaan organisasi
              AEJ.
            </p>

            <button
              className="aej-btn-gold aej-btn-lg"
              onClick={onLoginClick}
            >
              LOGIN ANGGOTA
              <ArrowRight size={16} />
            </button>
          </div>


          <div className="aej-hero-visual">

            <div className="aej-hero-card">
              <Newspaper
                size={20}
                color="#0F1B3D"
              />

              <div className="aej-hero-lines">
                <span />
                <span />
                <span
                  style={{
                    width: "60%",
                  }}
                />
              </div>
            </div>

            <div
              className="aej-hero-card"
              style={{
                marginTop: 18,
                marginLeft: 34,
              }}
            >
              <ImageIcon
                size={20}
                color="#0F1B3D"
              />

              <div className="aej-hero-lines">
                <span
                  style={{
                    width: "80%",
                  }}
                />
                <span />
              </div>
            </div>

            <div
              className="aej-hero-card"
              style={{
                marginTop: 18,
              }}
            >
              <Trophy
                size={20}
                color="#0F1B3D"
              />

              <div className="aej-hero-lines">
                <span
                  style={{
                    width: "70%",
                  }}
                />

                <span
                  style={{
                    width: "40%",
                  }}
                />
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* TENTANG */}
      <section
        id="tentang-aej"
        className="aej-section"
      >
        <h2 className="aej-section-title">
          Tentang AEJ
        </h2>

        <p className="aej-section-body">
          Aliyah Education Journalist
          (AEJ) adalah organisasi
          jurnalistik siswa MAN 2 Deli
          Serdang yang mewadahi minat
          siswa pada dunia tulis-menulis,
          fotografi, desain, dan
          pemberitaan sekolah. Melalui
          pelatihan rutin dan penugasan
          lapangan, anggota AEJ dibina
          untuk menghasilkan karya
          jurnalistik yang berkualitas
          sekaligus membangun kerja sama
          tim lintas divisi.
        </p>
      </section>


      {/* STRUKTUR */}
      <section
        id="struktur"
        className="aej-section aej-section-alt"
      >
        <h2 className="aej-section-title">
          Struktur Organisasi
        </h2>

        <div className="aej-struktur">

          <div className="aej-struktur-node aej-struktur-top">
            Pembina
          </div>

          <div className="aej-struktur-connector" />

          <div className="aej-struktur-node aej-struktur-top">
            Ketua Umum
          </div>

          <div className="aej-struktur-connector" />

          <div className="aej-struktur-row">
            {divisions.map((division) => (
              <div
                key={division.id}
                className="aej-struktur-node"
              >
                {division.name}
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* DIVISI */}
      <section
        id="divisi"
        className="aej-section"
      >
        <h2 className="aej-section-title">
          Divisi
        </h2>

        <div className="aej-grid">
          {divisions.map((division) => (
            <div
              key={division.id}
              className="aej-div-card"
            >
              <h3>
                {division.name}
              </h3>

              <p>
                {division.desc}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* PUBLIC SECTIONS */}
      {[
        {
          id: "berita",
          title: "Berita",
          icon: Newspaper,
          desc: "Berita dari kegiatan AEJ akan tampil di sini setelah dipublikasikan.",
        },
        {
          id: "karya",
          title: "Karya",
          icon: ImageIcon,
          desc: "Karya anggota yang disetujui akan ditampilkan di halaman ini.",
        },
        {
          id: "prestasi",
          title: "Prestasi",
          icon: Trophy,
          desc: "Prestasi AEJ dan anggota akan tercatat dan tampil di sini.",
        },
        {
          id: "agenda",
          title: "Agenda",
          icon: CalendarDays,
          desc: "Jadwal kegiatan AEJ akan tampil di sini.",
        },
        {
          id: "galeri",
          title: "Galeri",
          icon: ImageIcon,
          desc: "Dokumentasi visual kegiatan AEJ akan tampil di sini.",
        },
      ].map((section) => (
        <section
          id={section.id}
          key={section.id}
          className="aej-section aej-section-alt"
        >
          <h2 className="aej-section-title">
            {section.title}
          </h2>

          <EmptyState
            icon={section.icon}
            title="Belum ada data"
            desc={section.desc}
          />
        </section>
      ))}


      {/* FOOTER */}
      <footer className="aej-footer">
        <p className="aej-footer-title">
          ALIYAH EDUCATION JOURNALIST
        </p>

        <p className="aej-footer-sub">
          MAN 2 Deli Serdang
        </p>
      </footer>

    </div>
  );
}


/* ============================================================
   LOGIN MODAL
   ============================================================ */

function LoginModal({
  onClose,
  onLogin,
  loading,
  error,
}) {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const submit = () => {
    onLogin(username, password);
  };

  return (
    <div
      className="aej-overlay"
      onClick={onClose}
    >
      <div
        className="aej-dialog"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <button
          className="aej-dialog-close"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <div className="aej-login-header">
          <div className="aej-brand-mark">
            AEJ
          </div>

          <h2>
            Login Anggota
          </h2>

          <p>
            Masuk dengan akun AEJ kamu
          </p>
        </div>


        <label className="aej-label">
          Username
        </label>

        <input
          className="aej-input"
          value={username}
          onChange={(event) =>
            setUsername(
              event.target.value
            )
          }
          placeholder="mis. anggota.artistik"
          autoFocus
        />


        <label
          className="aej-label"
          style={{ marginTop: 12 }}
        >
          Password
        </label>

        <div className="aej-password-wrap">
          <input
            className="aej-input"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            placeholder="••••••••"
            onKeyDown={(event) => {
              if (
                event.key === "Enter"
              ) {
                submit();
              }
            }}
          />

          <button
            type="button"
            className="aej-input-eye"
            onClick={() =>
              setShowPassword(
                (value) => !value
              )
            }
          >
            {showPassword ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        </div>


        {error && (
          <p className="aej-login-error">
            {error}
          </p>
        )}


        <button
          className="aej-btn-primary aej-btn-full"
          disabled={loading}
          onClick={submit}
        >
          {loading ? (
            <>
              <Loader2
                size={16}
                className="aej-spin"
              />
              Memproses...
            </>
          ) : (
            "Masuk"
          )}
        </button>


        <div className="aej-demo-box">
          <p>
            <strong>
              Akun demo:
            </strong>
          </p>

          <p>
            Pembina — pembina.aej /
            Pembina#2026
          </p>

          <p>
            Ketua Umum — ketua.aej /
            Ketua#2026
          </p>

          <p>
            Anggota — anggota.artistik /
            Anggota#2026
          </p>
        </div>

      </div>
    </div>
  );
}


/* ============================================================
   SIDEBAR
   ============================================================ */

function Sidebar({
  role,
  active,
  onSelect,
  open,
  onClose,
}) {
  const menu = {
    anggota: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "profil",
        label: "Profil Saya",
        icon: User,
      },
      {
        id: "pengaturan",
        label: "Pengaturan",
        icon: Settings,
      },
    ],

    ketua_umum: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "anggota",
        label: "Kelola Anggota",
        icon: Users,
      },
      {
        id: "divisi",
        label: "Divisi",
        icon: Building2,
      },
      {
        id: "profil",
        label: "Profil Saya",
        icon: User,
      },
      {
        id: "pengaturan",
        label: "Pengaturan",
        icon: Settings,
      },
    ],

    pembina: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "anggota",
        label: "Data Anggota",
        icon: Users,
      },
      {
        id: "divisi",
        label: "Divisi",
        icon: Building2,
      },
      {
        id: "profil",
        label: "Profil Saya",
        icon: User,
      },
      {
        id: "pengaturan",
        label: "Pengaturan",
        icon: Settings,
      },
    ],
  }[role] || [];

  return (
    <>
      {open && (
        <div
          className="aej-sidebar-scrim"
          onClick={onClose}
        />
      )}

      <aside
        className={
          "aej-sidebar" +
          (open
            ? " aej-sidebar-open"
            : "")
        }
      >
        <div className="aej-sidebar-brand">
          <span className="aej-brand-mark aej-brand-mark-sm">
            AEJ
          </span>

          <span className="aej-sidebar-title">
            Management System
          </span>
        </div>

        <nav className="aej-sidebar-nav">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={
                  "aej-side-link" +
                  (active === item.id
                    ? " aej-side-link-active"
                    : "")
                }
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}


/* ============================================================
   TOPBAR
   ============================================================ */

function Topbar({
  user,
  onBurger,
  onLogout,
}) {
  return (
    <div className="aej-topbar">

      <button
        className="aej-burger aej-burger-dark"
        onClick={onBurger}
      >
        <Menu size={22} />
      </button>

      <div style={{ flex: 1 }} />

      <div className="aej-topbar-right">

        <div className="aej-topbar-user">
          <p>
            {user.name}
          </p>

          <span>
            {ROLE_LABEL[user.role]}
          </span>
        </div>

        <Avatar
          name={user.name}
          size={36}
        />

        <button
          className="aej-icon-btn"
          onClick={onLogout}
          title="Keluar"
        >
          <LogOut size={17} />
        </button>

      </div>
    </div>
  );
}


/* ============================================================
   STAT CARD
   ============================================================ */

function StatCard({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="aej-stat-card">

      <div className="aej-stat-icon">
        <Icon
          size={18}
          color="#0F1B3D"
        />
      </div>

      <div>
        <p className="aej-stat-label">
          {label}
        </p>

        <p className="aej-stat-value">
          {value}
        </p>
      </div>

    </div>
  );
}


/* ============================================================
   MEMBER FORM
   ============================================================ */

function MemberFormDialog({
  open,
  initial,
  divisions,
  onCancel,
  onSave,
}) {
  const emptyForm = {
    name: "",
    username: "",
    division:
      divisions[0]?.id || "",
    jabatan: "Anggota",
    status: "aktif",
  };

  const [form, setForm] =
    useState(emptyForm);

  useEffect(() => {
    if (initial) {
      setForm({
        ...emptyForm,
        ...initial,
      });
    } else {
      setForm(emptyForm);
    }
  }, [
    initial,
    open,
    divisions,
  ]);

  if (!open) return null;

  const update = (
    key,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div
      className="aej-overlay"
      onClick={onCancel}
    >
      <div
        className="aej-dialog"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <button
          className="aej-dialog-close"
          onClick={onCancel}
        >
          <X size={18} />
        </button>

        <h3 className="aej-dialog-title">
          {initial?.id
            ? "Edit Anggota"
            : "Tambah Anggota"}
        </h3>


        <label className="aej-label">
          Nama lengkap
        </label>

        <input
          className="aej-input"
          value={form.name}
          onChange={(event) =>
            update(
              "name",
              event.target.value
            )
          }
        />


        <label
          className="aej-label"
          style={{ marginTop: 10 }}
        >
          Username
        </label>

        <input
          className="aej-input"
          value={form.username}
          onChange={(event) =>
            update(
              "username",
              event.target.value
            )
          }
          disabled={Boolean(initial?.id)}
        />


        <div className="aej-form-row">

          <div>
            <label className="aej-label">
              Divisi
            </label>

            <select
              className="aej-input"
              value={form.division}
              onChange={(event) =>
                update(
                  "division",
                  event.target.value
                )
              }
            >
              {divisions.map(
                (division) => (
                  <option
                    key={division.id}
                    value={division.id}
                  >
                    {division.name}
                  </option>
                )
              )}
            </select>
          </div>


          <div>
            <label className="aej-label">
              Jabatan
            </label>

            <input
              className="aej-input"
              value={form.jabatan}
              onChange={(event) =>
                update(
                  "jabatan",
                  event.target.value
                )
              }
            />
          </div>

        </div>


        <label
          className="aej-label"
          style={{ marginTop: 10 }}
        >
          Status keanggotaan
        </label>

        <select
          className="aej-input"
          value={form.status}
          onChange={(event) =>
            update(
              "status",
              event.target.value
            )
          }
        >
          <option value="aktif">
            Aktif
          </option>

          <option value="nonaktif">
            Nonaktif
          </option>
        </select>


        <div className="aej-dialog-actions">

          <button
            className="aej-btn-ghost"
            onClick={onCancel}
          >
            Batal
          </button>

          <button
            className="aej-btn-primary"
            disabled={
              !form.name.trim() ||
              !form.username.trim() ||
              !form.division
            }
            onClick={() =>
              onSave(form)
            }
          >
            Simpan
          </button>

        </div>

      </div>
    </div>
  );
}


/* ============================================================
   MAIN APP
   ============================================================ */

export default function AEJApp() {

  const [booting, setBooting] =
    useState(true);

  const [users, setUsers] =
    useState([]);

  const [divisions, setDivisions] =
    useState(DIVISIONS_SEED);

  const [session, setSession] =
    useState(null);

  const [showLogin, setShowLogin] =
    useState(false);

  const [loginLoading, setLoginLoading] =
    useState(false);

  const [loginError, setLoginError] =
    useState("");

  const [activeMenu, setActiveMenu] =
    useState("dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [toasts, setToasts] =
    useState([]);

  const [memberDialog, setMemberDialog] =
    useState({
      open: false,
      initial: null,
    });

  const [confirmState, setConfirmState] =
    useState({
      open: false,
    });

  const [search, setSearch] =
    useState("");

  const [pwForm, setPwForm] =
    useState({
      current: "",
      next: "",
      confirm: "",
    });


  /* ==========================================================
     TOAST
     ========================================================== */

  const pushToast = useCallback(
    (
      title,
      desc,
      type = "ok"
    ) => {
      const id =
        Math.random()
          .toString(36)
          .slice(2);

      setToasts((current) => [
        ...current,
        {
          id,
          title,
          desc,
          type,
        },
      ]);

      setTimeout(() => {
        setToasts((current) =>
          current.filter(
            (item) =>
              item.id !== id
          )
        );
      }, 4200);
    },
    []
  );


  const closeToast = (id) => {
    setToasts((current) =>
      current.filter(
        (item) =>
          item.id !== id
      )
    );
  };


  /* ==========================================================
     BOOT
     ========================================================== */

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        let loadedUsers =
          await dbGetUsers();

        if (
          !loadedUsers ||
          loadedUsers.length === 0
        ) {
          loadedUsers = [
            ...SEED_USERS,
          ];

          await dbSaveUsers(
            loadedUsers
          );
        }


        let loadedDivisions =
          await dbGetDivisions();

        if (
          !loadedDivisions ||
          loadedDivisions.length === 0
        ) {
          loadedDivisions = [
            ...DIVISIONS_SEED,
          ];

          await dbSaveDivisions(
            loadedDivisions
          );
        }


        const savedSession =
          await dbGetSession();


        if (!mounted) return;


        setUsers(
          loadedUsers
        );

        setDivisions(
          loadedDivisions
        );


        if (
          savedSession?.userId
        ) {
          const found =
            loadedUsers.find(
              (user) =>
                user.id ===
                savedSession.userId
            );


          if (
            found &&
            found.status ===
              "aktif"
          ) {
            setSession(found);
          } else {
            await dbClearSession();
          }
        }

      } catch (error) {
        console.error(
          "Boot error:",
          error
        );

        if (mounted) {
          setUsers([
            ...SEED_USERS,
          ]);

          setDivisions([
            ...DIVISIONS_SEED,
          ]);
        }
      } finally {
        if (mounted) {
          setBooting(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);


  /* ==========================================================
     LOGIN
     ========================================================== */

  const handleLogin = async (
    username,
    password
  ) => {
    setLoginError("");

    const cleanUsername =
      username.trim();

    if (
      !cleanUsername ||
      !password
    ) {
      setLoginError(
        "Username dan password wajib diisi."
      );
      return;
    }


    setLoginLoading(true);

    try {
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            350
          )
      );


      const found =
        users.find(
          (user) =>
            user.username
              .toLowerCase() ===
            cleanUsername.toLowerCase()
        );


      if (!found) {
        setLoginError(
          "Username atau password salah."
        );
        return;
      }


      if (
        found.password !==
        simpleHash(password)
      ) {
        setLoginError(
          "Username atau password salah."
        );
        return;
      }


      if (
        found.status !==
        "aktif"
      ) {
        setLoginError(
          "Akun ini nonaktif. Hubungi Ketua Umum atau Pembina."
        );
        return;
      }


      await dbSaveSession(
        found.id
      );

      setSession(found);

      setShowLogin(false);

      setActiveMenu(
        "dashboard"
      );

      pushToast(
        "Login berhasil",
        `Selamat datang, ${found.name}.`
      );

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setLoginError(
        "Terjadi kesalahan saat login."
      );
    } finally {
      setLoginLoading(false);
    }
  };


  /* ==========================================================
     LOGOUT
     ========================================================== */

  const handleLogout =
    async () => {
      await dbClearSession();

      setSession(null);

      setActiveMenu(
        "dashboard"
      );

      pushToast(
        "Berhasil keluar",
        "Sampai jumpa lagi!"
      );
    };


  /* ==========================================================
     PERSIST USERS
     ========================================================== */

  const persistUsers =
    async (nextUsers) => {
      try {
        const success =
          await dbSaveUsers(
            nextUsers
          );

        if (!success) {
          throw new Error(
            "Gagal menyimpan"
          );
        }

        setUsers(nextUsers);

        return true;

      } catch (error) {
        console.error(
          "Persist users error:",
          error
        );

        pushToast(
          "Gagal menyimpan",
          "Data tidak berhasil disimpan.",
          "error"
        );

        return false;
      }
    };


  /* ==========================================================
     SAVE MEMBER
     ========================================================== */

  const saveMember =
    async (form) => {
      const name =
        String(
          form.name || ""
        ).trim();

      const username =
        String(
          form.username || ""
        ).trim();

      const division =
        String(
          form.division || ""
        ).trim();


      if (
        !name ||
        !username ||
        !division
      ) {
        pushToast(
          "Form belum lengkap",
          "Nama, username, dan divisi wajib diisi.",
          "error"
        );

        return;
      }


      const duplicate =
        users.some(
          (user) =>
            user.id !== form.id &&
            user.username
              .toLowerCase() ===
              username.toLowerCase()
        );


      if (duplicate) {
        pushToast(
          "Username sudah dipakai",
          "Gunakan username lain.",
          "error"
        );

        return;
      }


      /* EDIT */
      if (form.id) {
        const nextUsers =
          users.map(
            (user) =>
              user.id === form.id
                ? {
                    ...user,
                    ...form,
                    name,
                    username,
                    division,
                  }
                : user
          );


        const success =
          await persistUsers(
            nextUsers
          );

        if (!success) return;


        if (
          session?.id ===
          form.id
        ) {
          const updated =
            nextUsers.find(
              (user) =>
                user.id ===
                form.id
            );

          setSession(updated);
        }


        pushToast(
          "Anggota diperbarui",
          `${name} berhasil disimpan.`
        );
      }


      /* TAMBAH */
      else {
        const temporaryPassword =
          "Aej" +
          Math.floor(
            1000 +
              Math.random() *
                9000
          );


        const randomId =
          typeof crypto !==
            "undefined" &&
          typeof crypto.randomUUID ===
            "function"
            ? crypto.randomUUID()
            : Math.random()
                .toString(36)
                .slice(2, 11);


        const newUser = {
          id: `u-${randomId}`,
          username,
          password:
            simpleHash(
              temporaryPassword
            ),
          role: "anggota",
          name,
          division,
          jabatan:
            form.jabatan ||
            "Anggota",
          status:
            form.status ||
            "aktif",
          createdAt:
            new Date()
              .toISOString()
              .slice(0, 10),
        };


        const nextUsers = [
          ...users,
          newUser,
        ];


        const success =
          await persistUsers(
            nextUsers
          );

        if (!success) return;


        pushToast(
          "Anggota ditambahkan",
          `Password sementara: ${temporaryPassword}`
        );
      }


      setMemberDialog({
        open: false,
        initial: null,
      });
    };


  /* ==========================================================
     ACTIVATE / DEACTIVATE
     ========================================================== */

  const askDeactivate =
    (member) => {
      const activate =
        member.status ===
        "nonaktif";

      setConfirmState({
        open: true,

        title: activate
          ? "Aktifkan kembali anggota?"
          : "Nonaktifkan anggota?",

        desc:
          `${member.name} akan diubah statusnya menjadi ` +
          `${
            activate
              ? "Aktif"
              : "Nonaktif"
          }.`,


        danger: !activate,


        onConfirm:
          async () => {
            const nextUsers =
              users.map(
                (user) =>
                  user.id ===
                  member.id
                    ? {
                        ...user,
                        status:
                          user.status ===
                          "aktif"
                            ? "nonaktif"
                            : "aktif",
                      }
                    : user
              );


            const success =
              await persistUsers(
                nextUsers
              );

            if (!success) return;


            setConfirmState({
              open: false,
            });


            pushToast(
              "Status diperbarui",
              `${member.name} sekarang ${
                member.status ===
                "aktif"
                  ? "nonaktif"
                  : "aktif"
              }.`
            );
          },
      });
    };


  /* ==========================================================
     CHANGE PASSWORD
     ========================================================== */

  const changePassword =
    async () => {
      const {
        current,
        next,
        confirm,
      } = pwForm;


      if (
        !current ||
        !next ||
        !confirm
      ) {
        pushToast(
          "Lengkapi form",
          "Semua kolom wajib diisi.",
          "error"
        );

        return;
      }


      if (next.length < 8) {
        pushToast(
          "Password terlalu pendek",
          "Password baru minimal 8 karakter.",
          "error"
        );

        return;
      }


      if (
        session.password !==
        simpleHash(current)
      ) {
        pushToast(
          "Password lama salah",
          "Periksa kembali password saat ini.",
          "error"
        );

        return;
      }


      if (next !== confirm) {
        pushToast(
          "Konfirmasi tidak cocok",
          "Password baru dan konfirmasi harus sama.",
          "error"
        );

        return;
      }


      if (current === next) {
        pushToast(
          "Password tidak berubah",
          "Gunakan password baru yang berbeda.",
          "error"
        );

        return;
      }


      const newHash =
        simpleHash(next);


      const nextUsers =
        users.map(
          (user) =>
            user.id ===
            session.id
              ? {
                  ...user,
                  password:
                    newHash,
                }
              : user
        );


      const success =
        await persistUsers(
          nextUsers
        );

      if (!success) return;


      setSession(
        (currentSession) => ({
          ...currentSession,
          password:
            newHash,
        })
      );


      setPwForm({
        current: "",
        next: "",
        confirm: "",
      });


      pushToast(
        "Password diganti",
        "Password baru berhasil disimpan."
      );
    };


  /* ==========================================================
     STATS
     ========================================================== */

  const stats =
    useMemo(() => {
      const anggota =
        users.filter(
          (user) =>
            user.role ===
            "anggota"
        );

      return {
        totalAnggota:
          anggota.length,

        aktif:
          anggota.filter(
            (user) =>
              user.status ===
              "aktif"
          ).length,

        totalDivisi:
          divisions.length,
      };
    }, [
      users,
      divisions,
    ]);


  /* ==========================================================
     FILTER MEMBERS
     ========================================================== */

  const filteredMembers =
    useMemo(() => {
      const anggota =
        users.filter(
          (user) =>
            user.role !==
            "pembina"
        );


      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {
        return anggota;
      }


      return anggota.filter(
        (user) =>
          user.name
            .toLowerCase()
            .includes(query) ||

          user.username
            .toLowerCase()
            .includes(query) ||

          (
            user.division ||
            ""
          )
            .toLowerCase()
            .includes(query)
      );
    }, [
      users,
      search,
    ]);


  const divisionName =
    (id) =>
      divisions.find(
        (division) =>
          division.id === id
      )?.name || "—";


  /* ==========================================================
     BOOT SCREEN
     ========================================================== */

  if (booting) {
    return (
      <>
        <GlobalStyle />

        <div className="aej-loading-screen">
          <Loader2
            size={28}
            className="aej-spin"
            color="#0F1B3D"
          />

          <p>
            Menyiapkan AEJ
            Management System…
          </p>
        </div>
      </>
    );
  }


  /* ==========================================================
     PUBLIC APP
     ========================================================== */

  if (!session) {
    return (
      <div className="aej-root">

        <GlobalStyle />

        <LandingPage
          onLoginClick={() => {
            setShowLogin(true);
            setLoginError("");
          }}
          divisions={divisions}
        />


        {showLogin && (
          <LoginModal
            onClose={() =>
              setShowLogin(false)
            }
            onLogin={handleLogin}
            loading={
              loginLoading
            }
            error={
              loginError
            }
          />
        )}


        <Toast
          toasts={toasts}
          onClose={
            closeToast
          }
        />

      </div>
    );
  }


  /* ==========================================================
     DASHBOARD APP
     ========================================================== */

  return (
    <div className="aej-root aej-app">

      <GlobalStyle />


      <Sidebar
        role={session.role}
        active={activeMenu}
        onSelect={setActiveMenu}
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />


      <div className="aej-main">

        <Topbar
          user={session}
          onBurger={() =>
            setSidebarOpen(true)
          }
          onLogout={
            handleLogout
          }
        />


        <main className="aej-content">


          {/* =================================================
             DASHBOARD ANGGOTA
             ================================================= */}

          {activeMenu ===
            "dashboard" &&
            session.role ===
              "anggota" && (
              <>
                <h1 className="aej-page-title">
                  Dashboard Saya
                </h1>


                <div className="aej-profile-banner">
                  <Avatar
                    name={
                      session.name
                    }
                    size={58}
                  />

                  <div>
                    <p className="aej-profile-name">
                      {session.name}
                    </p>

                    <p className="aej-profile-info">
                      {divisionName(
                        session.division
                      )}
                      {" · "}
                      {session.jabatan}
                    </p>

                    <div
                      style={{
                        marginTop: 6,
                      }}
                    >
                      <StatusPill
                        status={
                          session.status
                        }
                      />
                    </div>
                  </div>
                </div>


                <div className="aej-stat-grid">

                  <StatCard
                    label="Total Tugas"
                    value={0}
                    icon={
                      LayoutDashboard
                    }
                  />

                  <StatCard
                    label="Rata-rata Nilai"
                    value="—"
                    icon={
                      ShieldCheck
                    }
                  />

                  <StatCard
                    label="Persentase Kehadiran"
                    value="—"
                    icon={
                      CalendarDays
                    }
                  />

                  <StatCard
                    label="Jumlah Karya"
                    value={0}
                    icon={
                      ImageIcon
                    }
                  />

                </div>


                <div className="aej-card aej-card-margin">

                  <EmptyState
                    icon={
                      LayoutDashboard
                    }
                    title="Belum ada data tugas, nilai, atau absensi"
                    desc="Fitur Materi, Tugas, Penilaian, dan Absensi akan aktif pada Phase 2 pengembangan."
                  />

                </div>
              </>
            )}


          {/* =================================================
             DASHBOARD KETUA
             ================================================= */}

          {activeMenu ===
            "dashboard" &&
            session.role ===
              "ketua_umum" && (
              <>
                <h1 className="aej-page-title">
                  Dashboard Ketua Umum
                </h1>


                <div className="aej-stat-grid">

                  <StatCard
                    label="Total Anggota"
                    value={
                      stats.totalAnggota
                    }
                    icon={Users}
                  />

                  <StatCard
                    label="Anggota Aktif"
                    value={
                      stats.aktif
                    }
                    icon={
                      ShieldCheck
                    }
                  />

                  <StatCard
                    label="Total Divisi"
                    value={
                      stats.totalDivisi
                    }
                    icon={
                      Building2
                    }
                  />

                  <StatCard
                    label="Rata-rata Nilai AEJ"
                    value="—"
                    icon={
                      LayoutDashboard
                    }
                  />

                </div>


                <div className="aej-card aej-card-margin">

                  <EmptyState
                    title="Modul Tugas, Penilaian, Absensi & Raport belum aktif"
                    desc="Menyusul pada Phase 2–4 sesuai urutan pembangunan."
                  />

                </div>
              </>
            )}


          {/* =================================================
             DASHBOARD PEMBINA
             ================================================= */}

          {activeMenu ===
            "dashboard" &&
            session.role ===
              "pembina" && (
              <>
                <h1 className="aej-page-title">
                  Dashboard Pembina
                </h1>


                <div className="aej-stat-grid">

                  <StatCard
                    label="Total Anggota"
                    value={
                      stats.totalAnggota
                    }
                    icon={Users}
                  />

                  <StatCard
                    label="Total Divisi"
                    value={
                      stats.totalDivisi
                    }
                    icon={
                      Building2
                    }
                  />

                  <StatCard
                    label="Rata-rata Nilai AEJ"
                    value="—"
                    icon={
                      ShieldCheck
                    }
                  />

                  <StatCard
                    label="Persentase Capaian Passing Grade"
                    value="—"
                    icon={
                      LayoutDashboard
                    }
                  />

                </div>


                <div className="aej-card aej-card-margin">

                  <EmptyState
                    title="Data monitoring lengkap menyusul"
                    desc="Statistik performa divisi aktif setelah modul Tugas & Penilaian dibangun."
                  />

                </div>
              </>
            )}


          {/* =================================================
             ANGGOTA
             ================================================= */}

          {activeMenu ===
            "anggota" &&
            (
              session.role ===
                "ketua_umum" ||
              session.role ===
                "pembina"
            ) && (
              <>
                <div className="aej-page-header">

                  <h1 className="aej-page-title no-margin">
                    {session.role ===
                    "ketua_umum"
                      ? "Kelola Anggota"
                      : "Data Anggota"}
                  </h1>


                  {session.role ===
                    "ketua_umum" && (
                    <button
                      className="aej-btn-primary"
                      onClick={() =>
                        setMemberDialog({
                          open: true,
                          initial: null,
                        })
                      }
                    >
                      <Plus size={16} />
                      Tambah Anggota
                    </button>
                  )}

                </div>


                <div className="aej-search-bar">

                  <Search
                    size={16}
                    color="#8a92a3"
                  />

                  <input
                    placeholder="Cari nama, username, atau divisi…"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target
                          .value
                      )
                    }
                  />

                </div>


                <div className="aej-table-wrap">

                  <table className="aej-table">

                    <thead>
                      <tr>
                        <th>
                          Nama
                        </th>

                        <th>
                          Username
                        </th>

                        <th>
                          Divisi
                        </th>

                        <th>
                          Jabatan
                        </th>

                        <th>
                          Status
                        </th>

                        {session.role ===
                          "ketua_umum" && (
                          <th>
                            Aksi
                          </th>
                        )}
                      </tr>
                    </thead>


                    <tbody>

                      {filteredMembers.map(
                        (member) => (
                          <tr
                            key={
                              member.id
                            }
                          >

                            <td>
                              <div className="aej-member-cell">

                                <Avatar
                                  name={
                                    member.name
                                  }
                                  size={28}
                                />

                                {
                                  member.name
                                }

                              </div>
                            </td>


                            <td>
                              {
                                member.username
                              }
                            </td>


                            <td>
                              {divisionName(
                                member.division
                              )}
                            </td>


                            <td>
                              {
                                member.jabatan
                              }
                            </td>


                            <td>
                              <StatusPill
                                status={
                                  member.status
                                }
                              />
                            </td>


                            {session.role ===
                              "ketua_umum" && (
                              <td>

                                <div className="aej-action-group">

                                  <button
                                    className="aej-icon-btn"
                                    onClick={() =>
                                      setMemberDialog(
                                        {
                                          open: true,
                                          initial:
                                            member,
                                        }
                                      )
                                    }
                                    title="Edit"
                                  >
                                    <Pencil
                                      size={14}
                                    />
                                  </button>


                                  <button
                                    className="aej-icon-btn"
                                    onClick={() =>
                                      askDeactivate(
                                        member
                                      )
                                    }
                                    title={
                                      member.status ===
                                      "aktif"
                                        ? "Nonaktifkan"
                                        : "Aktifkan"
                                    }
                                  >
                                    <Trash2
                                      size={14}
                                    />
                                  </button>

                                </div>

                              </td>
                            )}

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>


                  {filteredMembers.length ===
                    0 && (
                    <EmptyState
                      title="Tidak ada anggota ditemukan"
                      desc="Coba kata kunci lain."
                    />
                  )}

                </div>
              </>
            )}


          {/* =================================================
             DIVISI
             ================================================= */}

          {activeMenu ===
            "divisi" && (
            <>
              <h1 className="aej-page-title">
                Divisi AEJ
              </h1>


              <div className="aej-grid">

                {divisions.map(
                  (division) => {
                    const count =
                      users.filter(
                        (user) =>
                          user.division ===
                          division.id
                      ).length;

                    return (
                      <div
                        key={
                          division.id
                        }
                        className="aej-div-card"
                      >
                        <h3>
                          {
                            division.name
                          }
                        </h3>

                        <p>
                          {
                            division.desc
                          }
                        </p>

                        <p className="aej-member-count">
                          {count} anggota
                        </p>
                      </div>
                    );
                  }
                )}

              </div>
            </>
          )}


          {/* =================================================
             PROFIL
             ================================================= */}

          {activeMenu ===
            "profil" && (
            <>
              <h1 className="aej-page-title">
                Profil Saya
              </h1>


              <div className="aej-profile-banner">

                <Avatar
                  name={
                    session.name
                  }
                  size={58}
                />

                <div>

                  <p className="aej-profile-name">
                    {
                      session.name
                    }
                  </p>

                  <p className="aej-profile-info">
                    {
                      ROLE_LABEL[
                        session.role
                      ]
                    }

                    {session.division
                      ? ` · ${divisionName(
                          session.division
                        )}`
                      : ""}
                  </p>

                </div>

              </div>


              <div className="aej-card aej-card-margin">

                <div className="aej-detail-row">
                  <span>
                    Username
                  </span>

                  <b>
                    {
                      session.username
                    }
                  </b>
                </div>


                <div className="aej-detail-row">
                  <span>
                    Jabatan
                  </span>

                  <b>
                    {
                      session.jabatan
                    }
                  </b>
                </div>


                <div className="aej-detail-row">
                  <span>
                    Status Keanggotaan
                  </span>

                  <StatusPill
                    status={
                      session.status
                    }
                  />
                </div>


                <div className="aej-detail-row">
                  <span>
                    Bergabung sejak
                  </span>

                  <b>
                    {
                      session.createdAt
                    }
                  </b>
                </div>

              </div>
            </>
          )}


          {/* =================================================
             PENGATURAN
             ================================================= */}

          {activeMenu ===
            "pengaturan" && (
            <>
              <h1 className="aej-page-title">
                Pengaturan
              </h1>


              <div
                className="aej-card"
                style={{
                  maxWidth: 460,
                }}
              >

                <h3 className="aej-card-title">
                  Ganti Password
                </h3>


                <label className="aej-label">
                  Password saat ini
                </label>

                <input
                  className="aej-input"
                  type="password"
                  value={
                    pwForm.current
                  }
                  onChange={(event) =>
                    setPwForm(
                      (form) => ({
                        ...form,
                        current:
                          event.target
                            .value,
                      })
                    )
                  }
                />


                <label
                  className="aej-label"
                  style={{
                    marginTop: 10,
                  }}
                >
                  Password baru
                </label>

                <input
                  className="aej-input"
                  type="password"
                  value={
                    pwForm.next
                  }
                  onChange={(event) =>
                    setPwForm(
                      (form) => ({
                        ...form,
                        next:
                          event.target
                            .value,
                      })
                    )
                  }
                />


                <label
                  className="aej-label"
                  style={{
                    marginTop: 10,
                  }}
                >
                  Konfirmasi password baru
                </label>

                <input
                  className="aej-input"
                  type="password"
                  value={
                    pwForm.confirm
                  }
                  onChange={(event) =>
                    setPwForm(
                      (form) => ({
                        ...form,
                        confirm:
                          event.target
                            .value,
                      })
                    )
                  }
                />


                <button
                  className="aej-btn-primary"
                  style={{
                    marginTop: 14,
                  }}
                  onClick={
                    changePassword
                  }
                >
                  Simpan Password
                </button>

              </div>


              <button
                className="aej-btn-ghost"
                style={{
                  marginTop: 16,
                }}
                onClick={
                  handleLogout
                }
              >
                <LogOut size={15} />
                Keluar dari akun
              </button>

            </>
          )}

        </main>
      </div>


      {/* MEMBER DIALOG */}
      <MemberFormDialog
        open={
          memberDialog.open
        }
        initial={
          memberDialog.initial
        }
        divisions={divisions}
        onCancel={() =>
          setMemberDialog({
            open: false,
            initial: null,
          })
        }
        onSave={
          saveMember
        }
      />


      {/* CONFIRM */}
      <ConfirmDialog
        open={
          confirmState.open
        }
        title={
          confirmState.title
        }
        desc={
          confirmState.desc
        }
        danger={
          confirmState.danger
        }
        onConfirm={
          confirmState.onConfirm
        }
        onCancel={() =>
          setConfirmState({
            open: false,
          })
        }
      />


      {/* TOAST */}
      <Toast
        toasts={toasts}
        onClose={
          closeToast
        }
      />

    </div>
  );
}


/* ============================================================
   GLOBAL CSS
   ============================================================ */

function GlobalStyle() {
  return (
    <style>{`

      @import url(
        'https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap'
      );


      * {
        box-sizing: border-box;
      }


      html {
        scroll-behavior: smooth;
      }


      body {
        margin: 0;
        background: #F5F6FA;
      }


      button,
      input,
      select {
        font-family:
          'Montserrat',
          sans-serif;
      }


      .aej-root {
        color: #14171F;
        min-height: 100vh;
        font-family:
          'Montserrat',
          sans-serif;
      }


      /* ======================================================
         ANIMATION
         ====================================================== */

      .aej-spin {
        animation:
          aej-spin
          0.9s
          linear
          infinite;
      }


      @keyframes aej-spin {
        to {
          transform:
            rotate(360deg);
        }
      }


      /* ======================================================
         BUTTONS
         ====================================================== */

      .aej-btn-primary,
      .aej-btn-gold,
      .aej-btn-ghost,
      .aej-btn-danger {
        border: none;
        cursor: pointer;
        border-radius: 6px;
        font-weight: 600;
        font-size: 13.5px;
        padding: 9px 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition:
          filter .15s ease,
          background .15s ease,
          transform .15s ease;
      }


      .aej-btn-primary {
        background: #0F1B3D;
        color: #fff;
      }


      .aej-btn-primary:hover {
        filter: brightness(1.18);
      }


      .aej-btn-primary:disabled {
        opacity: .5;
        cursor: not-allowed;
      }


      .aej-btn-gold {
        background: #C9A227;
        color: #0F1B3D;
      }


      .aej-btn-gold:hover {
        filter: brightness(1.08);
      }


      .aej-btn-lg {
        padding: 12px 22px;
        font-size: 14px;
      }


      .aej-btn-full {
        width: 100%;
        margin-top: 16px;
      }


      .aej-btn-ghost {
        background: #F1F2F5;
        color: #14171F;
      }


      .aej-btn-ghost:hover {
        background: #E6E8EE;
      }


      .aej-btn-danger {
        background: #B3261E;
        color: #fff;
      }


      .aej-btn-danger:hover {
        filter: brightness(1.15);
      }


      /* ======================================================
         BRAND
         ====================================================== */

      .aej-brand {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }


      .aej-brand-mark {
        background: #C9A227;
        color: #0F1B3D;
        font-family:
          'Poppins',
          sans-serif;
        font-weight: 800;
        font-size: 13px;
        padding: 6px 9px;
        border-radius: 6px;
        letter-spacing: .5px;
      }


      .aej-brand-mark-sm {
        padding: 5px 8px;
        font-size: 12px;
      }


      /* ======================================================
         NAVBAR
         ====================================================== */

      .aej-nav {
        position: sticky;
        top: 0;
        z-index: 50;
        background: #0F1B3D;
      }


      .aej-nav-inner {
        max-width: 1180px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 18px;
        padding: 12px 20px;
      }


      .aej-brand-text {
        color: #fff;
        font-family:
          'Poppins',
          sans-serif;
        font-weight: 600;
        font-size: 14px;
        display: none;
      }


      .aej-nav-links {
        display: none;
        gap: 4px;
        flex: 1;
      }


      .aej-nav-link {
        background: none;
        border: none;
        color: #CBD3E6;
        font-size: 13px;
        padding: 8px 10px;
        border-radius: 6px;
        cursor: pointer;
      }


      .aej-nav-link:hover {
        color: #fff;
        background:
          rgba(255,255,255,.06);
      }


      .aej-burger {
        margin-left: auto;
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        display: inline-flex;
      }


      .aej-burger-dark {
        color: #14171F;
      }


      .aej-mobile-menu {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 8px 16px 16px;
        background: #0F1B3D;
      }


      .aej-mobile-menu button {
        background: none;
        border: none;
        color: #CBD3E6;
        text-align: left;
        padding: 10px 4px;
        font-size: 14px;
        cursor: pointer;
      }


      /* ======================================================
         HERO
         ====================================================== */

      .aej-hero {
        position: relative;
        background: #0F1B3D;
        overflow: hidden;
        padding: 56px 20px 70px;
      }


      .aej-hero-diagonal {
        position: absolute;
        top: -40%;
        right: -10%;
        width: 60%;
        height: 180%;
        background:
          linear-gradient(
            135deg,
            rgba(201,162,39,.16),
            rgba(201,162,39,0)
          );
        transform:
          rotate(18deg);
      }


      .aej-hero-inner {
        max-width: 1180px;
        margin: 0 auto;
        position: relative;
        display: grid;
        grid-template-columns: 1fr;
        gap: 40px;
        align-items: center;
      }


      .aej-hero-kicker {
        color: #C9A227;
        font-size: 12.5px;
        font-weight: 600;
        margin: 0 0 14px;
      }


      .aej-hero-title {
        font-family:
          'Poppins',
          sans-serif;
        color: #fff;
        font-size: 34px;
        line-height: 1.15;
        font-weight: 700;
        margin: 0;
      }


      .aej-hero-sub {
        color: #D8DEEE;
        font-size: 15px;
        margin: 12px 0 0;
        font-weight: 500;
      }


      .aej-hero-desc {
        color: #AEB7CC;
        font-size: 14px;
        line-height: 1.6;
        margin: 14px 0 26px;
        max-width: 480px;
      }


      .aej-hero-visual {
        display: none;
      }


      .aej-hero-card {
        background: #fff;
        border-radius: 10px;
        padding: 14px;
        width: 220px;
        box-shadow:
          0 18px 40px
          rgba(0,0,0,.25);
      }


      .aej-hero-lines {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }


      .aej-hero-lines span {
        display: block;
        height: 6px;
        border-radius: 3px;
        background: #E9ECF3;
        width: 100%;
      }


      /* ======================================================
         SECTION
         ====================================================== */

      .aej-section {
        max-width: 1180px;
        margin: 0 auto;
        padding: 48px 20px;
      }


      .aej-section-alt {
        background: #F7F8FA;
        max-width: none;
      }


      .aej-section-alt > * {
        max-width: 1180px;
        margin-left: auto;
        margin-right: auto;
      }


      .aej-section-title {
        font-family:
          'Poppins',
          sans-serif;
        font-size: 22px;
        font-weight: 700;
        color: #0F1B3D;
        margin: 0 0 18px;
        position: relative;
        padding-bottom: 12px;
      }


      .aej-section-title::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 46px;
        height: 3px;
        background: #C9A227;
      }


      .aej-section-body {
        font-size: 14.5px;
        line-height: 1.75;
        color: #3d4250;
        max-width: 760px;
      }


      /* ======================================================
         STRUCTURE
         ====================================================== */

      .aej-struktur {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }


      .aej-struktur-node {
        border: 1.5px solid #0F1B3D;
        color: #0F1B3D;
        font-weight: 600;
        font-size: 13px;
        padding: 10px 18px;
        border-radius: 6px;
        background: #fff;
      }


      .aej-struktur-top {
        background: #0F1B3D;
        color: #fff;
      }


      .aej-struktur-connector {
        width: 2px;
        height: 18px;
        background: #C9A227;
      }


      .aej-struktur-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
      }


      /* ======================================================
         GRID
         ====================================================== */

      .aej-grid {
        display: grid;
        grid-template-columns:
          repeat(
            auto-fit,
            minmax(
              210px,
              1fr
            )
          );
        gap: 14px;
      }


      .aej-div-card {
        border: 1px solid #E4E6ED;
        border-radius: 8px;
        padding: 18px;
        background: #fff;
      }


      .aej-div-card h3 {
        font-family:
          'Poppins',
          sans-serif;
        font-size: 15px;
        margin: 0 0 8px;
        color: #0F1B3D;
      }


      .aej-div-card p {
        margin: 0;
        font-size: 13px;
        color: #5b6272;
        line-height: 1.55;
      }


      .aej-member-count {
        margin-top: 10px !important;
        color: #0F1B3D !important;
        font-weight: 600;
      }


      /* ======================================================
         EMPTY
         ====================================================== */

      .aej-empty {
        border: 1.5px dashed #DADFEA;
        border-radius: 8px;
        padding: 34px 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }


      .aej-empty-title {
        margin:
          10px 0 2px;
        font-weight: 600;
        font-size: 14px;
      }


      .aej-empty-desc {
        margin: 0;
        font-size: 12.5px;
        color: #8a92a3;
      }


      /* ======================================================
         FOOTER
         ====================================================== */

      .aej-footer {
        background: #0B1530;
        color: #fff;
        text-align: center;
        padding: 30px 20px;
      }


      .aej-footer-title {
        margin: 0;
        font-weight: 700;
        font-family:
          'Poppins',
          sans-serif;
      }


      .aej-footer-sub {
        margin:
          2px 0 0;
        color: #B8C0D6;
        font-size: 13px;
      }


      /* ======================================================
         OVERLAY
         ====================================================== */

      .aej-overlay {
        position: fixed;
        inset: 0;
        background:
          rgba(
            10,
            14,
            30,
            .55
          );
        z-index: 100

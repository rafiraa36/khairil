import React, { useState } from "react";
import {
  Menu,
  X,
  ArrowRight,
  Newspaper,
  Image as ImageIcon,
  Trophy,
  CalendarDays,
  Users,
  Building2,
  ShieldCheck,
} from "lucide-react";

const divisions = [
  ["Artistik", "Desain grafis, ilustrasi, dan identitas visual AEJ."],
  ["Dokumentasi", "Fotografi dan videografi kegiatan sekolah."],
  ["Bahasa", "Penyuntingan bahasa dan pengembangan naskah."],
  ["Liputan", "Peliputan berita dan reportase lapangan."],
  ["Redaktur", "Penyuntingan akhir dan tata kelola penerbitan."],
];

const publicSections = [
  ["Berita", Newspaper, "Berita kegiatan AEJ akan tampil di sini."],
  ["Karya", ImageIcon, "Karya anggota AEJ akan tampil di sini."],
  ["Prestasi", Trophy, "Prestasi AEJ dan anggota akan tampil di sini."],
  ["Agenda", CalendarDays, "Agenda kegiatan AEJ akan tampil di sini."],
  ["Galeri", ImageIcon, "Dokumentasi kegiatan AEJ akan tampil di sini."],
];

function App() {
  const [menu, setMenu] = useState(false);
  const [login, setLogin] = useState(false);

  const scroll = (id) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      <style>{css}</style>

      <header className="nav">
        <div className="nav-inner">
          <div className="brand" onClick={() => scroll("beranda")}>
            <b>AEJ</b>
            <span>Management System</span>
          </div>

          <nav>
            {[
              "Beranda",
              "Tentang AEJ",
              "Struktur",
              "Divisi",
              "Berita",
              "Karya",
              "Prestasi",
              "Agenda",
              "Galeri",
            ].map((item) => (
              <button
                key={item}
                onClick={() =>
                  scroll(item.toLowerCase().replaceAll(" ", "-"))
                }
              >
                {item}
              </button>
            ))}
          </nav>

          <button className="gold" onClick={() => setLogin(true)}>
            Login
          </button>

          <button className="burger" onClick={() => setMenu(!menu)}>
            {menu ? <X /> : <Menu />}
          </button>
        </div>

        {menu && (
          <div className="mobile-menu">
            {[
              "Beranda",
              "Tentang AEJ",
              "Struktur",
              "Divisi",
              "Berita",
              "Karya",
              "Prestasi",
              "Agenda",
              "Galeri",
            ].map((item) => (
              <button
                key={item}
                onClick={() =>
                  scroll(item.toLowerCase().replaceAll(" ", "-"))
                }
              >
                {item}
              </button>
            ))}

            <button className="gold" onClick={() => setLogin(true)}>
              Login
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="beranda" className="hero">
        <div className="hero-content">
          <div>
            <small>ALIYAH EDUCATION JOURNALIST · MAN 2 DELI SERDANG</small>

            <h1>
              AEJ Management
              <br />
              System
            </h1>

            <h3>Aliyah Education Journalist MAN 2 Deli Serdang</h3>

            <p>
              Platform digital untuk mendukung kegiatan jurnalistik,
              pelatihan, kreativitas, kolaborasi, dan pengelolaan
              organisasi AEJ.
            </p>

            <button className="gold big" onClick={() => setLogin(true)}>
              LOGIN ANGGOTA <ArrowRight size={17} />
            </button>
          </div>

          <div className="hero-cards">
            {[Newspaper, ImageIcon, Trophy].map((Icon, i) => (
              <div className="hero-card" key={i}>
                <Icon size={22} />
                <div>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang-aej" className="section">
        <Title text="Tentang AEJ" />

        <p className="about">
          Aliyah Education Journalist (AEJ) adalah organisasi jurnalistik
          siswa MAN 2 Deli Serdang yang mewadahi minat siswa pada dunia
          tulis-menulis, fotografi, desain, dan pemberitaan sekolah.
          Melalui pelatihan dan penugasan lapangan, anggota AEJ dibina
          untuk menghasilkan karya jurnalistik berkualitas serta membangun
          kerja sama lintas divisi.
        </p>
      </section>

      {/* STRUKTUR */}
      <section id="struktur" className="section alt">
        <Title text="Struktur Organisasi" />

        <div className="structure">
          <div className="node dark">Pembina</div>
          <div className="line" />
          <div className="node dark">Ketua Umum</div>
          <div className="line" />

          <div className="structure-row">
            {divisions.map(([name]) => (
              <div className="node" key={name}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVISI */}
      <section id="divisi" className="section">
        <Title text="Divisi" />

        <div className="grid">
          {divisions.map(([name, desc]) => (
            <div className="card" key={name}>
              <h3>{name}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PUBLIC SECTIONS */}
      {publicSections.map(([name, Icon, desc]) => (
        <section
          id={name.toLowerCase()}
          className="section alt"
          key={name}
        >
          <Title text={name} />

          <div className="empty">
            <Icon size={30} />
            <h3>Belum ada data</h3>
            <p>{desc}</p>
          </div>
        </section>
      ))}

      {/* FOOTER */}
      <footer>
        <b>ALIYAH EDUCATION JOURNALIST</b>
        <span>MAN 2 Deli Serdang</span>
      </footer>

      {/* LOGIN */}
      {login && <Login onClose={() => setLogin(false)} />}
    </>
  );
}

function Title({ text }) {
  return <h2 className="title">{text}</h2>;
}

function Login({ onClose }) {
  const [show, setShow] = useState(false);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="login" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>
          <X />
        </button>

        <div className="login-brand">AEJ</div>

        <h2>Login Anggota</h2>
        <p>Masuk dengan akun AEJ kamu</p>

        <label>Username</label>
        <input placeholder="Username" />

        <label>Password</label>

        <div className="password">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
          />

          <button onClick={() => setShow(!show)}>
            {show ? "Sembunyikan" : "Lihat"}
          </button>
        </div>

        <button className="primary">Masuk</button>

        <div className="demo">
          <b>Akun demo</b>
          <p>pembina.aej / Pembina#2026</p>
          <p>ketua.aej / Ketua#2026</p>
          <p>anggota.artistik / Anggota#2026</p>
        </div>
      </div>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: #f5f6fa;
  color: #171a22;
  font-family: Montserrat, sans-serif;
}

button,
input {
  font-family: inherit;
}

button {
  cursor: pointer;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #0f1b3d;
}

.nav-inner {
  max-width: 1180px;
  margin: auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 18px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
}

.brand b,
.login-brand {
  background: #c9a227;
  color: #0f1b3d;
  padding: 7px 10px;
  border-radius: 6px;
  font: 800 13px Poppins;
}

.brand span {
  color: white;
  font: 600 14px Poppins;
}

nav {
  display: flex;
  gap: 2px;
  flex: 1;
  justify-content: center;
}

nav button,
.mobile-menu button {
  border: 0;
  background: transparent;
  color: #cbd3e6;
  padding: 9px;
  font-size: 12px;
}

nav button:hover,
.mobile-menu button:hover {
  color: white;
}

.gold {
  border: 0;
  background: #c9a227;
  color: #0f1b3d;
  padding: 10px 17px;
  border-radius: 6px;
  font-weight: 700;
}

.burger {
  display: none;
  background: none;
  border: 0;
  color: white;
}

.mobile-menu {
  display: none;
}

.hero {
  position: relative;
  overflow: hidden;
  background: #0f1b3d;
  padding: 80px 20px;
}

.hero:after {
  content: "";
  position: absolute;
  width: 55%;
  height: 160%;
  right: -15%;
  top: -30%;
  background: rgba(201,162,39,.12);
  transform: rotate(18deg);
}

.hero-content {
  max-width: 1180px;
  margin: auto;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 70px;
}

.hero small {
  color: #c9a227;
  font-weight: 700;
}

.hero h1 {
  color: white;
  font: 700 48px/1.15 Poppins;
  margin: 15px 0;
}

.hero h3 {
  color: #dce2f0;
  font-size: 16px;
}

.hero p {
  max-width: 520px;
  color: #adb7cf;
  line-height: 1.7;
  font-size: 14px;
  margin: 18px 0 28px;
}

.big {
  padding: 13px 21px;
  display: inline-flex;
  gap: 7px;
  align-items: center;
}

.hero-cards {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-card {
  width: 250px;
  background: white;
  padding: 17px;
  border-radius: 9px;
  box-shadow: 0 20px 40px rgba(0,0,0,.25);
  margin: 8px;
}

.hero-card:nth-child(2) {
  margin-left: 70px;
}

.hero-card div {
  margin-top: 12px;
}

.hero-card span {
  display: block;
  height: 6px;
  background: #e5e8ef;
  margin: 6px 0;
  border-radius: 4px;
}

.section {
  max-width: 1180px;
  margin: auto;
  padding: 60px 20px;
}

.alt {
  max-width: none;
  background: #f8f9fb;
}

.alt > * {
  max-width: 1180px;
  margin-left: auto;
  margin-right: auto;
}

.title {
  color: #0f1b3d;
  font: 700 24px Poppins;
  margin: 0 0 28px;
  position: relative;
  padding-bottom: 12px;
}

.title:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 45px;
  height: 3px;
  background: #c9a227;
}

.about {
  max-width: 800px;
  color: #4c5260;
  line-height: 1.8;
  font-size: 14px;
}

.structure {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.node {
  border: 1.5px solid #0f1b3d;
  color: #0f1b3d;
  background: white;
  padding: 11px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.node.dark {
  background: #0f1b3d;
  color: white;
}

.line {
  width: 2px;
  height: 20px;
  background: #c9a227;
}

.structure-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 16px;
}

.card {
  background: white;
  border: 1px solid #e1e4eb;
  border-radius: 8px;
  padding: 20px;
}

.card h3 {
  color: #0f1b3d;
  font: 600 16px Poppins;
  margin: 0 0 8px;
}

.card p {
  color: #656c7b;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}

.empty {
  border: 1.5px dashed #d8dce5;
  border-radius: 8px;
  padding: 45px 20px;
  text-align: center;
  color: #9aa2b2;
}

.empty h3 {
  color: #343945;
  font-size: 14px;
  margin: 12px 0 5px;
}

.empty p {
  margin: 0;
  font-size: 13px;
}

footer {
  background: #0b1530;
  color: white;
  padding: 35px 20px;
  text-align: center;
}

footer b {
  display: block;
  font: 700 15px Poppins;
}

footer span {
  display: block;
  color: #b8c0d6;
  margin-top: 4px;
  font-size: 13px;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(8,12,28,.6);
  display: grid;
  place-items: center;
  padding: 20px;
}

.login {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 10px;
  padding: 30px;
}

.close {
  position: absolute;
  right: 15px;
  top: 15px;
  background: none;
  border: 0;
}

.login-brand {
  display: inline-block;
  margin-bottom: 15px;
}

.login h2 {
  color: #0f1b3d;
  margin: 0;
  font-family: Poppins;
}

.login > p {
  color: #777e8d;
  font-size: 13px;
  margin-bottom: 25px;
}

.login label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin: 12px 0 6px;
}

.login input {
  width: 100%;
  border: 1px solid #dfe2e8;
  border-radius: 6px;
  padding: 11px;
  outline: none;
}

.login input:focus {
  border-color: #0f1b3d;
}

.password {
  display: flex;
  gap: 5px;
}

.password input {
  flex: 1;
}

.password button {
  border: 0;
  background: #eef0f4;
  border-radius: 6px;
  padding: 0 10px;
}

.primary {
  width: 100%;
  margin-top: 18px;
  padding: 11px;
  background: #0f1b3d;
  color: white;
  border: 0;
  border-radius: 6px;
  font-weight: 600;
}

.demo {
  margin-top: 20px;
  padding: 12px;
  background: #f5f6f9;
  border-radius: 6px;
  font-size: 11px;
  color: #666;
}

.demo p {
  margin: 5px 0;
}

@media (max-width: 850px) {
  nav {
    display: none;
  }

  .burger {
    display: block;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    padding: 10px 20px 20px;
    background: #0f1b3d;
  }

  .mobile-menu button {
    text-align: left;
  }

  .hero-content {
    grid-template-columns: 1fr;
  }

  .hero-cards {
    display: none;
  }

  .hero h1 {
    font-size: 38px;
  }
}

@media (max-width: 500px) {
  .brand span {
    display: none;
  }

  .nav-inner {
    padding: 11px 15px;
  }

  .hero {
    padding: 60px 20px;
  }

  .hero h1 {
    font-size: 32px;
  }

  .section {
    padding: 45px 20px;
  }
}
`;

export default App;

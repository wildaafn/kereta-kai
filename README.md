# 🚂 Kereta KAI — Game Petualangan Masinis & Edukasi Anak (100% Bebas & Gratis!)

Game edukasi dan simulator kereta api Indonesia yang terinspirasi dari **Labo Brick Train**, dibuat **100% GRATIS & SEMUA KERETA TERBUKA (UNLOCKED)** khusus untuk anak-anak tercinta tanpa paywall, tanpa in-app purchase, dan tanpa iklan!

Dapat dimainkan dengan lancar di HP, tablet, maupun laptop/komputer.

---

## 🌟 Fitur Utama (Labo Brick Train KAI Edition)

### 1. 🚅 Nyetir Kereta di Rel (Petualangan Masinis Cilik)
- **Tuas Gas Masinis (Throttle)**: Tarik tuas maju untuk jalan pelan (30 km/h), santai (70 km/h), hingga ngebut maksimal (120 km/h atau 350 km/h untuk Whoosh!). Dorong ke bawah untuk rem berdecit sampai berhenti.
- **Klakson Semboyan 35 KAI Raksasa**: Tombol klakson besar yang bisa dipencet sesuka hati! Menghasilkan suara terompet ganda lokomotif KAI yang khas (*HOOOOONK-HOOOONK!*) atau peluit uap otentik.
- **Lampu Sorot Kereta**: Bisa dinyalakan untuk menerangi malam dan terowongan gelap.
- **Cerobong Asap Interaktif**: Tombol asap untuk meletupkan kepulan uap tebal.
- **Stasiun-Stasiun KAI Nyata**:
  - Stasiun Gambir
  - Stasiun Bandung
  - Stasiun Yogyakarta (Tugu)
  - Stasiun Surabaya Gubeng
  - Kereta bisa berhenti di peron stasiun, lalu tekan tombol **"🐾 Naikkan Penumpang!"** agar hewan-hewan lucu (kucing masinis, panda, beruang, kelinci) naik ke dalam gerbong sambil melambaikan tangan!
- **Perlintasan Sebidang Kereta Api (JPL)**:
  - Saat kereta mendekat, palang pintu perlintasan otomatis turun, lampu merah berkedip bergantian, bel peringatan berbunyi *"tong... tong... tong..."*, dan mobil-mobil lucu berhenti antre menunggu kereta lewat!
- **Jembatan Kereta Tinggi & Terowongan Gunung**: Melewati jembatan sungai dan terowongan batu yang gelap (lampu kereta menyala otomatis).
- **Balon & Bintang Mengambang**: Bisa ditabrak atau diklik untuk meletupkan efek kembang api confetti!
- **Ganti Waktu ☀️/🌅/🌙**: Ganti suasana Siang Cerah, Sore Sunset, dan Malam Berbintang.

### 2. 🧱 Bengkel Balok KAI (Rakit & Kustomisasi Kereta)
Semua koleksi kereta **100% UNLOCKED & GRATIS**:
- 🚂 **CC 206 KAI** (Lokomotif Kabin Ganda 'Transformer')
- 🚅 **Whoosh (KCIC Kereta Cepat Jakarta-Bandung)**
- 🚆 **CC 201 / CC 203** (Lokomotif Hidung Miring Ikonik)
- 🚃 **KRL Commuter Line** (Kereta Listrik Merah-Kuning)
- 🚂💨 **Lokomotif Uap Mak Itam / B25 Ambarawa**
- 🧱 **Rakit Balok Bebas** (Model Lego Toy Brick)
- **Pilihan 6 Tipe Gerbong Lengkap**:
  - 🛋️ **Gerbong Eksekutif KAI** (Stainless steel dengan tirai & bogie realistis)
  - 🪟 **Gerbong Panoramic KAI** (Atap kaca lengkung mewah warna biru-emas)
  - 📦 **Gerbong Kontainer KAI Logistik** (Gerbong datar PPCW dengan kontainer oranye & biru)
  - ⛽ **Gerbong Tangki BBM Pertamina** (Tangki silinder bahan bakar putih-merah)
  - ☕ **Gerbong Restorasi / Makan (M1)** (Kereta kafe dengan meja makan & bar KAI)
  - ⚡ **Gerbong Pembangkit Listrik (P)** (Kereta generator dengan ventilasi radiator diesel)
- **Panjang Gerbong**: Bisa diatur dari 1 hingga 5 gerbong panjang!
- **Pilihan Warna Bodi**: 7 warna cerah khas kereta api.
- Tombol **"🚦 AYO BERANGKAT NYETIR KERETA INI!"** untuk langsung membawa hasil rakitan ke lintasan rel.

### 3. 🎓 Taman Belajar KAI (6 Mini-Game Edukasi)
| Game | Cara Main |
|---|---|
| 🚃 **Susun Gerbong** | Tarik gerbong ke tempat kosong di belakang lokomotif |
| ⚡ **Tangkap Kereta** | Ketuk kereta yang melaju sebelum pergi |
| 🌈 **Cocok Warna** | Tarik kereta ke stasiun dengan warna yang cocok |
| 🔢 **Belajar Angka** | Ketuk kereta nomor yang diminta suara |
| 🔤 **Huruf ABC** | Ketuk kereta huruf latin yang diminta |
| 🕌 **Huruf Hijaiyah** | Ketuk kereta huruf hijaiyah (Alif, Ba, Ta, Tsa, Jim) |

---

## 📦 File Project

```
index.html      → Halaman utama (Menu Utama, Bengkel, Menyetir di Rel, Mini-Game)
game.js         → Logika simulasi rel, bengkel, suara Web Audio & Web Speech
style.css       → Tampilan grafis kereta, pemandangan lintasan, kokpit masinis
edgeone.json    → Konfigurasi deploy Tencent Cloud EdgeOne
_headers        → Header cache & keamanan CDN
README.md       → Panduan lengkap ini
```

---

## 🚀 Cara Upload ke Tencent Cloud EdgeOne

### Opsi 1 — Upload File ZIP via Console (Paling Mudah)
1. Buat file zip dari semua file di folder ini:
   ```bash
   zip -r kereta-kai.zip index.html style.css game.js edgeone.json _headers README.md
   ```
2. Buka console [Tencent Cloud EdgeOne Makers](https://console.tencentcloud.com/edgeone/makers).
3. Klik **Create Project** $\rightarrow$ **Direct Upload** (atau Drag & Drop ZIP).
4. Selesai! Game langsung aktif di domain publik Tencent Cloud EdgeOne bersertifikat SSL (HTTPS).

### Opsi 2 — Deploy via EdgeOne CLI
```bash
# Login (sekali saja)
edgeone login

# Deploy permanen ke production
edgeone makers deploy . --name kereta-kai --env production
```

---

## 🧪 Menjalankan Secara Lokal di Komputer
```bash
python3 -m http.server 8000
# Buka di browser: http://localhost:8000
```

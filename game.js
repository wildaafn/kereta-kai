// ===== KERETA KAI - Petualangan Masinis & Edukasi Anak =====
(function () {
  "use strict";

  // ====================================================
  // 1. SISTEM SUARA (WEB AUDIO API - OTENTIK KERETA KAI)
  // ====================================================
  let audioCtx = null;
  let soundOn = true;

  function initAudio() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
    } catch (e) {}
  }

  function beep(freq, dur, type, gainVal) {
    if (!soundOn) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type || "sine";
      o.frequency.value = freq;
      g.gain.value = gainVal || 0.16;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + (dur || 0.18));
      o.stop(audioCtx.currentTime + (dur || 0.18));
    } catch (e) {}
  }

  // Efek suara game edukasi
  const sndPick = () => beep(520, 0.1, "triangle");
  const sndGood = () => { beep(660, 0.12, "sine"); setTimeout(() => beep(880, 0.16, "sine"), 110); };
  const sndWin = () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.2, "sine"), i * 130)); };
  const sndTap = () => beep(720, 0.08, "square");
  const sndWrong = () => beep(180, 0.25, "sawtooth");
  const sndPop = () => { beep(900, 0.08, "triangle", 0.22); setTimeout(() => beep(1200, 0.1, "sine", 0.18), 40); };

  // Suara Klakson KAI Semboyan 35 (Khas Lokomotif GE KAI CC 206 / CC 201)
  function playKaiHorn() {
    if (!soundOn) return;
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    // Chord terompet lokomotif khas KAI Nathan K3LA: D#4, F#4, A4 (~311Hz, 370Hz, 440Hz)
    const freqs = [311.13, 369.99, 440.00, 622.25];
    freqs.forEach(f => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = "sawtooth";
      o.frequency.value = f;
      // Filter lembut untuk suara terompet kuningan (brass)
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1400;

      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.08, now + 0.05);
      g.gain.setValueAtTime(0.08, now + 0.65);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

      o.connect(filter);
      filter.connect(g);
      g.connect(audioCtx.destination);
      o.start(now);
      o.stop(now + 1.0);
    });
  }

  // Klakson Kereta Cepat Whoosh (Melodic High Speed Chime)
  function playWhooshHorn() {
    if (!soundOn) return;
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    [587.33, 880.00].forEach((f, idx) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      const startT = now + idx * 0.18;
      g.gain.setValueAtTime(0.001, startT);
      g.gain.linearRampToValueAtTime(0.15, startT + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, startT + 0.55);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(startT); o.stop(startT + 0.6);
    });
  }

  // Peluit Lokomotif Uap Mak Itam (Steam Whistle)
  function playSteamWhistle() {
    if (!soundOn) return;
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    [780, 830].forEach(f => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(f, now);
      o.frequency.linearRampToValueAtTime(f + 40, now + 0.3);
      o.frequency.linearRampToValueAtTime(f, now + 0.7);

      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.12, now + 0.08);
      g.gain.setValueAtTime(0.12, now + 0.55);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      o.connect(g); g.connect(audioCtx.destination);
      o.start(now); o.stop(now + 0.9);
    });
  }

  // Suara Klakson Lokomotif Vintage PJKA BB 301 (Krupp Tyfon Dual-Tone Resonant Horn)
  function playVintageHorn() {
    if (!soundOn) return;
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    [261.63, 329.63, 392.00].forEach(f => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = "sawtooth";
      o.frequency.value = f;
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1100;

      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.09, now + 0.06);
      g.gain.setValueAtTime(0.09, now + 0.65);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

      o.connect(filter);
      filter.connect(g);
      g.connect(audioCtx.destination);
      o.start(now);
      o.stop(now + 1.0);
    });
  }

  // Bel Perlintasan Sebidang Kereta Api (JPL Bell: "tong... tong... tong...")
  let lastJplBell = 0;
  function playJPLBell() {
    if (!soundOn) return;
    const nowTime = performance.now();
    if (nowTime - lastJplBell < 480) return;
    lastJplBell = nowTime;
    beep(740, 0.35, "sine", 0.14);
    setTimeout(() => beep(860, 0.35, "sine", 0.12), 240);
  }

  // Jingle Pengumuman Stasiun KAI (Sol - Do - Mi - Sol)
  function playStationJingle() {
    if (!soundOn) return;
    initAudio();
    const notes = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    notes.forEach((f, i) => {
      setTimeout(() => beep(f, 0.28, "sine", 0.15), i * 220);
    });
  }

  // Suara Rel Gesekan Roda (Jeg-jeg-jeg)
  let lastClickClack = 0;
  function playClickClack() {
    if (!soundOn) return;
    const nowTime = performance.now();
    if (nowTime - lastClickClack < 280) return;
    lastClickClack = nowTime;
    beep(130, 0.05, "triangle", 0.06);
    setTimeout(() => beep(160, 0.05, "triangle", 0.05), 70);
  }

  // Suara Bicara Web Speech API (Bahasa Indonesia)
  let cachedVoices = [];
  function loadVoices() {
    try { if (window.speechSynthesis) cachedVoices = window.speechSynthesis.getVoices() || []; } catch (e) {}
  }
  loadVoices();
  if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
  function pickIndonesianVoice() {
    if (!cachedVoices.length) loadVoices();
    let v = cachedVoices.find(v => /^id/i.test(v.lang));
    if (!v) v = cachedVoices.find(v => /indones/i.test(v.name) || /indones/i.test(v.lang));
    return v || null;
  }
  function speak(text) {
    if (!soundOn) return;
    try {
      if (!window.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "id-ID";
      const v = pickIndonesianVoice();
      if (v) u.voice = v;
      u.rate = 0.88; u.pitch = 1.15;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  // ====================================================
  // 2. NAVIGASI LAYAR & SETTING
  // ====================================================
  const screens = document.querySelectorAll(".screen");
  function show(id) {
    screens.forEach(s => s.classList.remove("active"));
    const target = document.getElementById(id);
    if (target) target.classList.add("active");
  }

  // Sound toggle
  document.getElementById("sound-toggle").addEventListener("click", function () {
    soundOn = !soundOn;
    this.textContent = soundOn ? "🔊" : "🔇";
    if (soundOn) { initAudio(); sndTap(); }
  });

  // Tombol Kembali ke Rumah (Reset semua loop aktif)
  document.querySelectorAll("[data-back]").forEach(b => {
    b.addEventListener("click", () => {
      initAudio();
      stopDriveSimulation();
      clearInterval(tangkapSpawn);
      clearInterval(tangkapTimer);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      show("home");
    });
  });

  // Tombol Kembali ke Menu Taman Belajar
  document.querySelectorAll("[data-back-edu]").forEach(b => {
    b.addEventListener("click", () => {
      initAudio();
      clearInterval(tangkapSpawn);
      clearInterval(tangkapTimer);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      show("screen-edu");
    });
  });

  // Navigasi dari Layar Utama ke 3 Mode
  document.getElementById("btn-goto-drive").addEventListener("click", () => {
    initAudio(); startDrive();
  });
  document.getElementById("btn-goto-bengkel").addEventListener("click", () => {
    initAudio(); startBengkel();
  });
  document.getElementById("btn-goto-edu").addEventListener("click", () => {
    initAudio(); show("screen-edu");
  });

  // Navigasi Mini-Game Edukasi
  document.querySelectorAll("#screen-edu .menu-btn").forEach(b => {
    b.addEventListener("click", () => {
      initAudio();
      const g = b.dataset.game;
      if (g === "susun") startSusun();
      else if (g === "tangkap") startTangkap();
      else if (g === "warna") startWarna();
      else if (g === "tebaksuara") startTebakSuara();
      else if (g === "angka" || g === "abc" || g === "hijaiyah") startCari(g);
    });
  });

  // Replay mini-games
  document.querySelectorAll("[data-replay]").forEach(b => {
    b.addEventListener("click", () => {
      initAudio();
      const g = b.dataset.replay;
      if (g === "susun") startSusun();
      else if (g === "tangkap") startTangkap();
      else if (g === "warna") startWarna();
      else if (g === "tebaksuara") startTebakSuara();
      else if (g === "cari") startCari(currentCariKey);
    });
  });

  // ====================================================
  // 3. BENGKEL BALOK KERETA KAI (WORKSHOP & BUILDER)
  // ====================================================
  const trainConfig = {
    loco: "cc206",       // 'cc206' | 'whoosh' | 'cc201' | 'krl' | 'uap' | 'vintage'
    color: "#e23b2e",
    carriage: "eksekutif",// 'eksekutif' | 'panoramic' | 'kontainer' | 'tangki' | 'makan' | 'pembangkit'
    count: 2,
    sticker: "none"       // 'none' | 'flag' | 'star' | 'kai' | 'flower' | 'sparkle'
  };

  const stickerEmojiMap = {
    flag: "🇮🇩",
    star: "⭐",
    kai: "🚆",
    flower: "🌺",
    sparkle: "✨"
  };

  const PEEP_ANIMALS = ["panda.png", "rabbit.png", "duck.png", "bear.png", "chick.png"];

  function startBengkel() {
    show("screen-bengkel");
    updateBengkelPreview();
    speak("Selamat datang di Bengkel Kereta KAI!");
  }

  // Map aset ilustrasi realistis KAI (Standar Game Vektor Presisi & 100% Transparan)
  const locoImageMap = {
    cc206: "assets/cc206.svg",
    whoosh: "assets/whoosh.svg",
    cc201: "assets/cc201.svg",
    krl: "assets/krl.svg",
    uap: "assets/uap_b25.svg",
    vintage: "assets/vintage_bb301.svg"
  };

  const carriageImageMap = {
    eksekutif: "assets/gerbong_eksekutif.svg",
    panoramic: "assets/gerbong_panoramic.svg",
    kontainer: "assets/gerbong_kontainer.svg",
    tangki: "assets/gerbong_tangki.svg",
    makan: "assets/gerbong_makan.svg",
    pembangkit: "assets/gerbong_pembangkit.svg"
  };

  // Pembuat elemen HTML Lokomotif
  function createLocomotiveElement(locoType, color, isDriveMode) {
    const wrapper = document.createElement("div");
    wrapper.className = "train-unit";

    const loco = document.createElement("div");
    loco.id = isDriveMode ? "active-loco-body" : "";

    if (locoImageMap[locoType]) {
      loco.className = "loco-realistic";
      loco.innerHTML = `<img src="${locoImageMap[locoType]}" class="train-sprite-img" alt="${locoType}" />`;
    } else {
      // balok bebas (Lego Toy Brick Style)
      loco.className = "loco-balok";
      loco.style.background = color;
      loco.innerHTML = `
        <div class="studs">
          <div class="stud"></div><div class="stud"></div><div class="stud"></div>
        </div>
      `;
    }

    const wheels = document.createElement("div");
    wheels.className = "unit-wheels";
    wheels.innerHTML = '<div class="u-wheel"></div><div class="u-wheel"></div>';

    wrapper.appendChild(loco);
    if (!locoImageMap[locoType]) {
      wrapper.appendChild(wheels);
    }

    // Stiker Lokomotif
    if (trainConfig.sticker && trainConfig.sticker !== "none") {
      const stickerEl = document.createElement("div");
      stickerEl.className = "train-sticker";
      stickerEl.textContent = stickerEmojiMap[trainConfig.sticker] || "";
      wrapper.appendChild(stickerEl);
    }

    if (isDriveMode) {
      const cone = document.createElement("div");
      cone.className = "headlight-cone";
      wrapper.appendChild(cone);
    }
    return wrapper;
  }

  // Pembuat elemen HTML Gerbong
  function createCarriageElement(carriageType, color, isDriveMode) {
    const wrapper = document.createElement("div");
    wrapper.className = "train-unit";

    const car = document.createElement("div");

    if (carriageImageMap[carriageType]) {
      car.className = "carriage-realistic";
      car.innerHTML = `<img src="${carriageImageMap[carriageType]}" class="train-sprite-img" alt="${carriageType}" />`;
      wrapper.appendChild(car);
    } else {
      car.className = "carriage-box car-" + carriageType;
      car.style.background = color;
      const wheels = document.createElement("div");
      wheels.className = "unit-wheels";
      wheels.innerHTML = '<div class="u-wheel"></div><div class="u-wheel"></div>';
      wrapper.appendChild(car);
      wrapper.appendChild(wheels);
    }

    // Tempat Penumpang Lucu di Jendela Gerbong
    if (isDriveMode && ["eksekutif", "panoramic", "makan"].includes(carriageType)) {
      const peepBox = document.createElement("div");
      peepBox.className = "carriage-passengers-peep";
      wrapper.appendChild(peepBox);
    }

    // Stiker Gerbong
    if (trainConfig.sticker && trainConfig.sticker !== "none") {
      const stickerEl = document.createElement("div");
      stickerEl.className = "train-sticker";
      stickerEl.textContent = stickerEmojiMap[trainConfig.sticker] || "";
      wrapper.appendChild(stickerEl);
    }

    return wrapper;
  }

  // Render Kereta Utuh ke kontainer
  function renderTrainAssembly(container, config, isDriveMode) {
    container.innerHTML = "";
    // Urutan: Gerbong di belakang, Lokomotif di paling depan (kanan)
    for (let i = 0; i < config.count; i++) {
      const carriageEl = createCarriageElement(config.carriage, config.color, isDriveMode);
      container.appendChild(carriageEl);
    }
    const locoEl = createLocomotiveElement(config.loco, config.color, isDriveMode);
    container.appendChild(locoEl);

    if (isDriveMode) {
      updateCarriagePassengers();
    }
  }

  // Update Penumpang Mengintip di Jendela Gerbong
  function updateCarriagePassengers() {
    const peepBoxes = document.querySelectorAll("#drive-train-container .carriage-passengers-peep");
    if (!peepBoxes.length) return;

    let remaining = drivePassengers;
    let animIdx = 0;

    peepBoxes.forEach(box => {
      box.innerHTML = "";
      const count = Math.min(remaining, 3);
      remaining -= count;
      for (let i = 0; i < count; i++) {
        const animal = PEEP_ANIMALS[animIdx % PEEP_ANIMALS.length];
        animIdx++;
        const img = document.createElement("img");
        img.src = `assets/kenney/animals/${animal}`;
        img.className = "peep-animal";
        img.title = "Penumpang Cilik KAI!";
        img.onclick = (e) => {
          e.stopPropagation();
          initAudio();
          sndPop();
          img.style.transform = "scale(1.4) translateY(-6px)";
          setTimeout(() => { img.style.transform = ""; }, 250);
          floatScore(e.clientX, e.clientY, "Halo Masinis! 🐾");
        };
        box.appendChild(img);
      }
    });
  }

  function updateBengkelPreview() {
    const preview = document.getElementById("bengkel-train-preview");
    renderTrainAssembly(preview, trainConfig, false);
    document.getElementById("gerbong-count-label").textContent = trainConfig.count + " Gerbong";
  }

  // Handler Pilihan Lokomotif
  document.querySelectorAll("#loco-picker .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#loco-picker .chip").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      const loco = btn.dataset.loco;
      trainConfig.loco = loco;
      sndTap();
      updateBengkelPreview();

      if (loco === "vintage") speak("Lokomotif Vintage BB 301 PJKA krem hijau dipilih!");
      else if (loco === "cc206") speak("Lokomotif CC 206 KAI dipilih!");
      else if (loco === "whoosh") speak("Kereta Cepat Whoosh dipilih!");
      else if (loco === "cc201") speak("Lokomotif CC 201 Hidung Miring dipilih!");
      else if (loco === "krl") speak("KRL Commuter Line dipilih!");
      else if (loco === "uap") speak("Lokomotif Uap Mak Itam dipilih!");
    });
  });

  // Handler Pilihan Warna
  document.querySelectorAll("#train-color-palette .color-dot").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#train-color-palette .color-dot").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      trainConfig.color = btn.dataset.color;
      sndTap();
      updateBengkelPreview();
    });
  });

  // Handler Pilihan Gerbong
  document.querySelectorAll("#carriage-picker .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#carriage-picker .chip").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      trainConfig.carriage = btn.dataset.carriage;
      sndTap();
      updateBengkelPreview();
    });
  });

  // Handler Pilihan Stiker Gerbong (Gratis)
  document.querySelectorAll("#sticker-picker .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#sticker-picker .chip").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      trainConfig.sticker = btn.dataset.sticker;
      sndTap();
      updateBengkelPreview();

      if (trainConfig.sticker === "flag") speak("Stiker Bendera Merah Putih dipilih!");
      else if (trainConfig.sticker === "star") speak("Stiker Bintang Emas dipilih!");
      else if (trainConfig.sticker === "kai") speak("Stiker Logo Resmi KAI dipilih!");
      else if (trainConfig.sticker === "flower") speak("Stiker Bunga Melati dipilih!");
      else if (trainConfig.sticker === "sparkle") speak("Stiker Kilau Ajaib dipilih!");
    });
  });

  // Stepper Panjang Gerbong
  document.getElementById("btn-gerbong-plus").addEventListener("click", () => {
    if (trainConfig.count < 5) {
      trainConfig.count++;
      sndTap();
      updateBengkelPreview();
    }
  });
  document.getElementById("btn-gerbong-minus").addEventListener("click", () => {
    if (trainConfig.count > 1) {
      trainConfig.count--;
      sndTap();
      updateBengkelPreview();
    }
  });

  // Tes Klakson di Bengkel
  document.getElementById("btn-test-horn").addEventListener("click", () => {
    soundLocoHorn();
  });

  // Tes Asap di Bengkel
  document.getElementById("btn-test-smoke").addEventListener("click", () => {
    createSmokePuff(document.getElementById("bengkel-train-preview"));
  });

  // Tombol Langsung Nyetir dari Bengkel
  document.getElementById("btn-start-drive-from-bengkel").addEventListener("click", () => {
    initAudio();
    startDrive();
  });
  document.getElementById("btn-open-bengkel-from-drive").addEventListener("click", () => {
    initAudio();
    stopDriveSimulation();
    startBengkel();
  });

  // Rintangan Hewan di Rel (Edukasi Klakson Semboyan 35)
  const TRACK_OBSTACLES = [
    { id: "obs-sapi", name: "Sapi Pasundan", pos: 5400, img: "assets/kenney/animals/cow.png", sound: "cow", cleared: false },
    { id: "obs-kambing", name: "Kambing Jawa", pos: 12500, img: "assets/kenney/animals/goat.png", sound: "sheep", cleared: false }
  ];

  function soundLocoHorn() {
    if (trainConfig.loco === "whoosh") {
      playWhooshHorn();
    } else if (trainConfig.loco === "uap") {
      playSteamWhistle();
    } else if (trainConfig.loco === "vintage") {
      playVintageHorn();
    } else {
      playKaiHorn();
    }

    // Cek jika ada rintangan hewan di dekat kereta (Semboyan 35)
    TRACK_OBSTACLES.forEach(obs => {
      if (obs.cleared) return;
      let relX = (obs.pos - driveWorldOffset);
      if (relX < -500) relX += TOTAL_TRACK_LOOP;
      const trainBox = document.getElementById("drive-train-container");
      const trainFrontX = trainBox ? trainBox.getBoundingClientRect().right : 300;
      const dist = relX - trainFrontX;
      if (dist > -120 && dist < 520) {
        obs.cleared = true;
        const el = document.getElementById(obs.id);
        if (el) {
          el.classList.add("obstacle-cleared");
          setTimeout(() => el.remove(), 1100);
        }
        playAnimalAudio(obs.sound);
        driveStars += 15;
        updateStarsDisplay();
        floatScore(window.innerWidth / 2, 140, `+15 ⭐ Semboyan 35 Berhasil!`);
        speak(`Hore! ${obs.name} melompat ke padang rumput! Rel sudah aman!`);
        const obsBanner = document.getElementById("obstacle-warning-banner");
        if (obsBanner) obsBanner.classList.add("hidden");
      }
    });
  }

  function createSmokePuff(parent) {
    if (!parent) return;
    const puff = document.createElement("div");
    puff.className = "smoke-puff";
    const size = 16 + Math.random() * 20;
    puff.style.width = size + "px";
    puff.style.height = size + "px";
    puff.style.right = "25px";
    puff.style.bottom = "55px";
    parent.appendChild(puff);
    setTimeout(() => puff.remove(), 1200);
  }

  // ====================================================
  // 4. PETUALANGAN NYETIR KERETA DI REL (DRIVE SIMULATOR)
  // ====================================================
  let driveAnimId = null;
  let driveWorldOffset = 0;
  let driveSpeed = 0;             // pixel per frame
  let driveMaxKm = 120;
  let driveCurrentKm = 0;
  let driveHeadlight = false;
  let drivePassengers = 0;
  let driveStars = 0;
  let driveTimeMode = "day";      // 'day' | 'sunset' | 'night'
  let currentStationAtPlatform = null;

  // Lintasan Rel & Bangunan Ikonik KAI
  const TRACK_ITEMS = [
    { type: "station", name: "Stasiun Gambir", pos: 800, icon: "🏛️" },
    { type: "jpl", name: "Perlintasan JPL 01", pos: 2400 },
    { type: "bridge", name: "Jembatan Cikubang", pos: 4200 },
    { type: "tunnel", name: "Terowongan Sasaksaat", pos: 5800 },
    { type: "station", name: "Stasiun Bandung", pos: 7600, icon: "🌸" },
    { type: "jpl", name: "Perlintasan JPL 02", pos: 9600 },
    { type: "bridge", name: "Jembatan Cirahong", pos: 11400 },
    { type: "tunnel", name: "Terowongan Ijo", pos: 13000 },
    { type: "station", name: "Stasiun Yogyakarta (Tugu)", pos: 14800, icon: "🕌" },
    { type: "jpl", name: "Perlintasan JPL 03", pos: 16800 },
    { type: "station", name: "Stasiun Surabaya Gubeng", pos: 18600, icon: "🦈" }
  ];
  const TOTAL_TRACK_LOOP = 20000;

  // Sintesis Suara Hewan Lucu (Web Audio API)
  function playAnimalAudio(type) {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    try {
      if (type === "cow") {
        // Suara Sapi Rendah (Mooo)
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(145, now);
        osc.frequency.exponentialRampToValueAtTime(88, now + 0.45);
        g.gain.setValueAtTime(0.2, now);
        g.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.5);
      } else if (type === "duck") {
        // Suara Bebek Kwek Kwek
        [0, 0.16].forEach(del => {
          const osc = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(460, now + del);
          osc.frequency.exponentialRampToValueAtTime(280, now + del + 0.11);
          g.gain.setValueAtTime(0.2, now + del);
          g.gain.linearRampToValueAtTime(0.01, now + del + 0.13);
          osc.connect(g); g.connect(audioCtx.destination);
          osc.start(now + del); osc.stop(now + del + 0.13);
        });
      } else if (type === "chicken") {
        // Suara Ayam Petok Petok
        [0, 0.08, 0.18].forEach((del, i) => {
          const osc = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          osc.type = "sine";
          const f = i === 1 ? 880 : 660;
          osc.frequency.setValueAtTime(f, now + del);
          g.gain.setValueAtTime(0.16, now + del);
          g.gain.linearRampToValueAtTime(0.01, now + del + 0.07);
          osc.connect(g); g.connect(audioCtx.destination);
          osc.start(now + del); osc.stop(now + del + 0.07);
        });
      } else {
        // Suara Kambing / Domba (Mbee)
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(260, now + 0.35);
        g.gain.setValueAtTime(0.18, now);
        g.gain.linearRampToValueAtTime(0.01, now + 0.38);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.38);
      }
    } catch (e) {
      // Audio fallback
    }
  }

  function updateStarsDisplay() {
    const el = document.getElementById("drive-stars-count");
    if (el) el.textContent = driveStars;
  }

  function startDrive() {
    show("screen-drive");
    const container = document.getElementById("drive-train-container");
    renderTrainAssembly(container, trainConfig, true);
    
    // Set parameter kecepatan berdasarkan tipe kereta
    driveMaxKm = (trainConfig.loco === "whoosh") ? 350 : 120;
    driveSpeed = 0;
    driveCurrentKm = 0;
    document.getElementById("throttle-slider").value = 0;
    updateSpeedometer();
    updateStarsDisplay();

    // Reset dan bangun pemandangan di lintasan
    buildDriveScenery();
    startDriveSimulation();

    // Setup interaksi awan di langit
    document.querySelectorAll('[data-interactive="cloud"]').forEach(c => {
      c.onpointerdown = (e) => {
        e.stopPropagation();
        initAudio();
        sndPop();
        driveStars += 2;
        updateStarsDisplay();
        floatScore(e.clientX, e.clientY, "Wusss! +2");
        c.style.transform = "scale(1.2)";
        setTimeout(() => { c.style.transform = ""; }, 300);
      };
    });

    speak("Masinis siap! Tarik tuas gas untuk menjalankan kereta!");
  }

  function buildDriveScenery() {
    const layer = document.getElementById("drive-scenery");
    layer.innerHTML = "";

    // 1. Bangun Landmark Utama (Stasiun, JPL, Jembatan, Terowongan)
    TRACK_ITEMS.forEach((it, idx) => {
      const el = document.createElement("div");
      el.className = "scenery-item";
      el.dataset.pos = it.pos;
      el.dataset.type = it.type;
      el.dataset.idx = idx;

      if (it.type === "station") {
        const waiting = ["chick", "rabbit", "panda", "monkey", "bear"]
          .map(n => `<span><img src="assets/kenney/animals/${n}.png" alt="${n}" draggable="false"></span>`).join("");
        el.innerHTML = `
          <div class="st-station">
            <div class="st-roof-canopy">
              <div class="st-station-clock"><i></i></div>
            </div>
            <div class="st-building-facade">
              <div class="st-signboard">${it.name}</div>
              <div class="st-platform-deck">
                <img class="st-master-ppka" src="assets/mascot_masinis.svg" alt="PPKA" draggable="false">
                <div class="st-waiting-animals" id="station-passengers-${idx}">${waiting}</div>
              </div>
            </div>
          </div>
        `;
      } else if (it.type === "jpl") {
        el.innerHTML = `
          <div class="st-jpl" id="jpl-el-${idx}">
            <div class="jpl-post"></div>
            <div class="jpl-cross"></div>
            <div class="jpl-lights-box">
              <div class="jpl-bulb b1"></div>
              <div class="jpl-bulb b2"></div>
            </div>
            <div class="jpl-bar"></div>
          </div>
        `;
      } else if (it.type === "bridge") {
        el.innerHTML = `
          <div class="st-bridge">
            <div class="bridge-river"></div>
          </div>
        `;
      } else if (it.type === "tunnel") {
        el.innerHTML = `
          <div class="st-tunnel">
            <div class="tunnel-rock"></div>
            <div class="tunnel-hole"></div>
          </div>
        `;
      }
      layer.appendChild(el);
    });

    // 1b. Rintangan Hewan Melintas di Rel (Semboyan 35)
    TRACK_OBSTACLES.forEach(obs => {
      obs.cleared = false;
      const obsEl = document.createElement("div");
      obsEl.className = "scenery-item";
      obsEl.dataset.pos = obs.pos;
      obsEl.dataset.type = "obstacle";
      obsEl.dataset.obsId = obs.id;
      obsEl.innerHTML = `
        <div class="track-obstacle-wrap" id="${obs.id}">
          <img src="${obs.img}" class="obstacle-animal-sprite" alt="${obs.name}" draggable="false" />
        </div>
      `;
      layer.appendChild(obsEl);
    });

    // Helper: cek apakah posisi p berdekatan dengan landmark utama
    function isNearLandmark(p, minDist = 220) {
      return TRACK_ITEMS.some(it => Math.abs(it.pos - p) < minDist);
    }

    // 2. Tiang Telegraf & Listrik Aliran Atas (LAA) setiap 260px
    for (let p = 120; p < TOTAL_TRACK_LOOP; p += 260) {
      if (!isNearLandmark(p, 180)) {
        const pole = document.createElement("div");
        pole.className = "scenery-item";
        pole.dataset.pos = p;
        pole.innerHTML = `
          <div class="st-telegraph-pole">
            <div class="pole-crossbar"></div>
            <div class="pole-wood"></div>
          </div>
        `;
        layer.appendChild(pole);
      }
    }

    // Aset: Kenney "Background Elements Redux" & "Animal Pack Redux" (CC0)
    const K = "assets/kenney/";
    const sprite = (path, h, extra = "") =>
      `<img src="${K}${path}.png" style="height:${h}px;width:auto;${extra}" alt="" draggable="false">`;
    const addDeco = (pos, html) => {
      const d = document.createElement("div");
      d.className = "scenery-item";
      d.dataset.pos = pos;
      d.innerHTML = html;
      layer.appendChild(d);
      return d;
    };

    // 3. Pohon tropis (kelapa, rindang, pinus) + semak setiap 300px
    const treeSet = [
      ["deco/treePalm", 150], ["deco/tree", 128], ["deco/treeLong", 140],
      ["deco/treePalm", 122], ["deco/treePine", 136], ["deco/tree", 112]
    ];
    const bushSet = [["deco/bush1", 34], ["deco/bushAlt1", 30], ["deco/bush3", 38], ["deco/bushAlt2", 44]];
    let treeCount = 0;
    for (let p = 200; p < TOTAL_TRACK_LOOP; p += 300) {
      if (isNearLandmark(p, 200)) continue;
      const t = treeSet[treeCount % treeSet.length];
      addDeco(p, sprite(t[0], t[1]));
      const b = bushSet[treeCount % bushSet.length];
      addDeco(p + 120 + (treeCount % 3) * 20, sprite(b[0], b[1]));
      treeCount++;
    }

    // 3b. Rumah desa & pagar di belakang jalur setiap ~900px
    const houseSet = [["deco/house1", 150], ["deco/houseSmall1", 70], ["deco/houseAlt1", 140], ["deco/house2", 130]];
    let hCount = 0;
    for (let p = 520; p < TOTAL_TRACK_LOOP; p += 900) {
      if (isNearLandmark(p, 320)) continue;
      const h = houseSet[hCount++ % houseSet.length];
      addDeco(p, sprite(h[0], h[1]));
      addDeco(p + 190, sprite("deco/fence", 44));
    }

    // 4. Hewan ternak & kebun yang bisa diklik setiap 680px
    const farmAnimals = [
      { img: "animals/cow", name: "Sapi", sound: "Moo!", type: "cow" },
      { img: "animals/goat", name: "Kambing", sound: "Mbee!", type: "goat" },
      { img: "animals/duck", name: "Bebek", sound: "Kwek!", type: "duck" },
      { img: "animals/chick", name: "Anak Ayam", sound: "Ciap!", type: "chicken" },
      { img: "animals/chicken", name: "Ayam", sound: "Petok!", type: "chicken" },
      { img: "animals/horse", name: "Kuda", sound: "Hihihi!", type: "goat" },
      { img: "animals/buffalo", name: "Kerbau", sound: "Mooo!", type: "cow" }
    ];
    let anIdx = 0;
    for (let p = 380; p < TOTAL_TRACK_LOOP; p += 680) {
      if (isNearLandmark(p, 280)) continue;
      const an = farmAnimals[anIdx++ % farmAnimals.length];
      const pasture = addDeco(p, `
        <div class="st-animal-pasture" title="Sapa ${an.name}!">
          <img class="pasture-bush" src="${K}deco/bush1.png" alt="" draggable="false">
          <img class="pasture-animal" src="${K}${an.img}.png" alt="${an.name}" draggable="false">
        </div>`);
      const pastureEl = pasture.querySelector(".st-animal-pasture");
      pastureEl.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        initAudio();
        playAnimalAudio(an.type);
        pastureEl.classList.remove("jump");
        void pastureEl.offsetWidth; // reflow
        pastureEl.classList.add("jump");
        setTimeout(() => pastureEl.classList.remove("jump"), 380);
        driveStars += 5;
        updateStarsDisplay();
        floatScore(e.clientX, e.clientY, `${an.sound} +5`);
      });
    }

    // 5. Bintang & balon bonus melayang
    for (let p = 450; p < TOTAL_TRACK_LOOP; p += 520) {
      const isBalloon = (p % 1040 === 0);
      const s = document.createElement("div");
      s.className = "scenery-item collectible-star";
      s.dataset.pos = p;
      s.innerHTML = `<img src="assets/${isBalloon ? "balloon" : "star"}.svg" alt="" draggable="false">`;
      s.style.bottom = (65 + (p % 60)) + "px";
      s.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        initAudio();
        sndPop();
        driveStars += isBalloon ? 15 : 10;
        updateStarsDisplay();
        floatScore(e.clientX, e.clientY, isBalloon ? "+15" : "+10");
        s.style.display = "none";
      });
      layer.appendChild(s);
    }
  }

  function startDriveSimulation() {
    stopDriveSimulation();
    let lastTime = performance.now();

    function loop(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Update posisi dunia
      if (driveSpeed > 0) {
        driveWorldOffset = (driveWorldOffset + driveSpeed * 60 * dt) % TOTAL_TRACK_LOOP;
        playClickClack();
        // Semburan asap uap spontan saat kereta melaju
        if (Math.random() < 0.08) {
          createSmokePuff(document.getElementById("drive-train-container"));
        }
      }

      // Parallax layer update
      updateSceneryPositions();
      checkTrackEvents();

      driveAnimId = requestAnimationFrame(loop);
    }
    driveAnimId = requestAnimationFrame(loop);
  }

  function stopDriveSimulation() {
    if (driveAnimId) {
      cancelAnimationFrame(driveAnimId);
      driveAnimId = null;
    }
  }

  function updateSceneryPositions() {
    const layer = document.getElementById("drive-scenery");
    if (!layer) return;
    const screenWidth = window.innerWidth || 1200;

    // Multiplane Parallax Pegunungan Jauh & Perbukitan Sawah Hijau
    const mFar = document.getElementById("parallax-mountains");
    if (mFar) {
      mFar.style.setProperty("--mx", `${(-driveWorldOffset * 0.08).toFixed(1)}px`);
    }
    const hNear = document.getElementById("parallax-hills");
    if (hNear) {
      hNear.style.setProperty("--mx", `${(-driveWorldOffset * 0.28).toFixed(1)}px`);
    }

    const items = layer.children;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const basePos = parseFloat(it.dataset.pos);
      // Hitung posisi relatif terhadap kereta
      let relX = (basePos - driveWorldOffset);
      if (relX < -500) relX += TOTAL_TRACK_LOOP;

      it.style.transform = `translateX(${relX}px)`;
      it.style.visibility = (relX > -400 && relX < screenWidth + 400) ? "visible" : "hidden";
    }
  }

  function checkTrackEvents() {
    const trainBox = document.getElementById("drive-train-container");
    if (!trainBox) return;
    const trainRect = trainBox.getBoundingClientRect();
    const trainFrontX = trainRect.right;

    let inTunnel = false;
    let nearJpl = false;
    let stationInFocus = null;

    const layer = document.getElementById("drive-scenery");
    if (!layer) return;
    const items = layer.querySelectorAll(".scenery-item[data-type]");

    items.forEach(it => {
      const type = it.dataset.type;
      const basePos = parseFloat(it.dataset.pos);
      let relX = (basePos - driveWorldOffset);
      if (relX < -500) relX += TOTAL_TRACK_LOOP;

      const dist = relX - trainFrontX;

      // Cek Perlintasan Sebidang JPL
      if (type === "jpl") {
        const jplEl = it.querySelector(".st-jpl");
        if (dist > -200 && dist < 380) {
          nearJpl = true;
          if (jplEl) jplEl.classList.add("jpl-active");
          playJPLBell();
        } else {
          if (jplEl) jplEl.classList.remove("jpl-active");
        }
      }

      // Cek Terowongan (Tunnel)
      if (type === "tunnel") {
        if (dist > -220 && dist < 120) {
          inTunnel = true;
        }
      }

      // Cek Stasiun
      if (type === "station") {
        if (dist > -120 && dist < 160) {
          const idx = parseInt(it.dataset.idx, 10);
          const data = { ...TRACK_ITEMS[idx], idx: idx };
          stationInFocus = data;
        }
      }
    });

    // Cek Rintangan Hewan di Depan Kereta (Semboyan 35)
    let nearObstacle = null;
    TRACK_OBSTACLES.forEach(obs => {
      if (obs.cleared) return;
      let relX = (obs.pos - driveWorldOffset);
      if (relX < -500) relX += TOTAL_TRACK_LOOP;
      const dist = relX - trainFrontX;
      if (dist > -80 && dist < 380) {
        nearObstacle = obs;
      }
    });

    const obsBanner = document.getElementById("obstacle-warning-banner");
    if (obsBanner) {
      if (nearObstacle) {
        obsBanner.classList.remove("hidden");
        const titleEl = document.getElementById("obs-title");
        if (titleEl) titleEl.textContent = `ADA ${nearObstacle.name.toUpperCase()} DI REL!`;
        if (driveSpeed > 1.2) {
          driveSpeed = 1.0;
          driveCurrentKm = Math.min(driveCurrentKm, 25);
          updateSpeedometer();
        }
      } else {
        obsBanner.classList.add("hidden");
      }
    }

    // Update JPL Indikator
    const jplBanner = document.getElementById("jpl-sign-indicator");
    if (jplBanner) {
      if (nearJpl) {
        jplBanner.classList.remove("hidden");
      } else {
        jplBanner.classList.add("hidden");
      }
    }

    // Update Terowongan & Lampu Otomatis
    const tunnelOverlay = document.getElementById("drive-tunnel-overlay");
    if (tunnelOverlay) {
      if (inTunnel) {
        tunnelOverlay.classList.remove("hidden");
        document.getElementById("drive-train-container").classList.add("headlight-active");
      } else {
        tunnelOverlay.classList.add("hidden");
        if (!driveHeadlight) {
          document.getElementById("drive-train-container").classList.remove("headlight-active");
        }
      }
    }

    // Update Stasiun & Penumpang
    const stBanner = document.getElementById("station-arrival-banner");
    if (stBanner) {
      if (stationInFocus && driveSpeed === 0) {
        currentStationAtPlatform = stationInFocus;
        document.getElementById("station-name-text").textContent = "Tiba di " + stationInFocus.name + "!";
        stBanner.classList.remove("hidden");
        document.getElementById("drive-next-station").textContent = stationInFocus.name;
      } else {
        stBanner.classList.add("hidden");
      }
    }
  }

  function updateSpeedometer() {
    const kmh = Math.round(driveCurrentKm);
    
    // Tampilan Angka Digital di Header & Speedometer Gauge
    const disp1 = document.getElementById("drive-speed-display");
    if (disp1) disp1.textContent = kmh;
    const disp2 = document.getElementById("cockpit-kmh-val");
    if (disp2) disp2.textContent = kmh;

    // Jarum Speedometer Analog (-110 deg sampai +110 deg)
    const needle = document.getElementById("gauge-needle");
    if (needle) {
      const ratio = Math.min(Math.max(driveCurrentKm / (driveMaxKm || 120), 0), 1);
      const needleDeg = -110 + (ratio * 220);
      needle.style.transform = `rotate(${needleDeg.toFixed(1)}deg)`;
    }

    // Status Badge Notch Tuas Gas Masinis
    const badge = document.getElementById("throttle-status-badge");
    if (badge) {
      const v = parseInt(document.getElementById("throttle-slider").value, 10);
      if (v === 0) {
        badge.textContent = "🛑 BERHENTI";
        badge.style.background = "#dc2626";
      } else if (v === 1) {
        badge.textContent = "🐢 PELAN";
        badge.style.background = "#d97706";
      } else if (v === 2) {
        badge.textContent = "🚗 SEDANG";
        badge.style.background = "#0284c7";
      } else {
        badge.textContent = "🚀 CEPAT";
        badge.style.background = "#16a34a";
      }
    }

    const train = document.getElementById("drive-train-container");
    if (train) {
      if (driveSpeed > 0) {
        train.classList.add("bouncing");
        train.classList.add("spinning");
      } else {
        train.classList.remove("bouncing");
        train.classList.remove("spinning");
      }
    }
  }

  // Kontrol Tuas Gas Masinis (Throttle Slider)
  const throttleInput = document.getElementById("throttle-slider");
  throttleInput.addEventListener("input", function () {
    const val = parseInt(this.value, 10);
    initAudio();
    if (val === 0) {
      driveSpeed = 0;
      driveCurrentKm = 0;
    } else if (val === 1) {
      driveSpeed = 2.4;
      driveCurrentKm = driveMaxKm * 0.28;
      sndTap();
    } else if (val === 2) {
      driveSpeed = 5.0;
      driveCurrentKm = driveMaxKm * 0.65;
      sndTap();
    } else {
      driveSpeed = 8.6;
      driveCurrentKm = driveMaxKm;
      sndGood();
    }
    updateSpeedometer();
  });

  // Tombol Klakson Raksasa Semboyan 35 KAI (Tactile 3D Feedback)
  const btnHorn = document.getElementById("btn-horn-kai");
  btnHorn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    initAudio();
    soundLocoHorn();
    floatScore(e.clientX, e.clientY, "📢 TOOOOOT!");

    // Efek Getaran Layar (Screen Rumble)
    const world = document.getElementById("drive-world");
    if (world) {
      world.classList.remove("rumble");
      void world.offsetWidth; // reflow
      world.classList.add("rumble");
      setTimeout(() => world.classList.remove("rumble"), 420);
    }
  });

  // Tombol Lampu Depan (Sorot Volumetrik)
  const btnLight = document.getElementById("btn-toggle-light");
  btnLight.addEventListener("click", () => {
    initAudio();
    driveHeadlight = !driveHeadlight;
    btnLight.classList.toggle("active", driveHeadlight);
    const train = document.getElementById("drive-train-container");
    if (driveHeadlight) {
      train.classList.add("headlight-active");
      sndTap();
    } else {
      train.classList.remove("headlight-active");
    }
  });

  // Tombol Asap Uap
  document.getElementById("btn-puff-smoke").addEventListener("click", (e) => {
    initAudio();
    createSmokePuff(document.getElementById("drive-train-container"));
    beep(240, 0.15, "triangle", 0.1);
  });

  // Tombol Bel Stasiun
  document.getElementById("btn-station-chime").addEventListener("click", () => {
    initAudio();
    playStationJingle();
    setTimeout(() => {
      speak("Perhatian, Kereta Api Eksekutif Argo Bromo Anggrek akan melintas langsung.");
    }, 1100);
  });

  // Tombol Radio Masinis (Authentic Indonesian Railway Conductor Announcements)
  const radioAnnouncements = [
    "Perhatian bapak, ibu, dan adik-adik masinis. Kereta Api kita sedang melaju nyaman dan tepat waktu. Terima kasih telah menggunakan jasa Kereta Api Indonesia.",
    "Perhatian para penumpang, sesaat lagi kereta api kita akan melintasi jembatan megah nan indah. Selamat menikmati pemandangan alam Indonesia!",
    "Panggilan masinis cilik! Siap-siap kita akan segera singgah di stasiun berikutnya. Periksa kembali tiket dan barang bawaan adik.",
    "Perhatian para penumpang, kereta api sedang melintas langsung dengan kecepatan aman. Duduk dengan santai dan nikmati perjalanan seru ini!"
  ];
  let radioAnnouncementIndex = 0;

  const btnRadio = document.getElementById("btn-conductor-radio");
  if (btnRadio) {
    btnRadio.addEventListener("click", () => {
      initAudio();
      playStationJingle();
      btnRadio.classList.add("broadcasting");
      setTimeout(() => {
        const msg = radioAnnouncements[radioAnnouncementIndex % radioAnnouncements.length];
        radioAnnouncementIndex++;
        speak(msg);
        setTimeout(() => {
          btnRadio.classList.remove("broadcasting");
        }, 4000);
      }, 1100);
    });
  }

  // Audio Efek Hujan (Synthesized Rain Pitter-Patter)
  let rainInterval = null;
  function startRainAudio() {
    if (!soundOn || !audioCtx) return;
    stopRainAudio();
    try {
      rainInterval = setInterval(() => {
        if (!soundOn || driveTimeMode !== "rain") {
          stopRainAudio();
          return;
        }
        beep(1200 + Math.random() * 900, 0.025, "sine", 0.02);
      }, 85);
    } catch(e) {}
  }
  function stopRainAudio() {
    if (rainInterval) {
      clearInterval(rainInterval);
      rainInterval = null;
    }
  }

  // Tombol Ganti Waktu Dinamis (Siang / Sore / Malam / Hujan / Pelangi)
  document.getElementById("btn-env-time").addEventListener("click", function () {
    initAudio();
    sndTap();
    const world = document.getElementById("drive-world");
    const rainDrops = document.getElementById("drive-rain-drops");

    if (driveTimeMode === "day") {
      driveTimeMode = "sunset";
      this.textContent = "🌅";
      world.className = "drive-world time-sunset";
      if (rainDrops) rainDrops.classList.add("hidden");
      stopRainAudio();
    } else if (driveTimeMode === "sunset") {
      driveTimeMode = "night";
      this.textContent = "🌙";
      world.className = "drive-world time-night";
      if (rainDrops) rainDrops.classList.add("hidden");
      stopRainAudio();
    } else if (driveTimeMode === "night") {
      driveTimeMode = "rain";
      this.textContent = "🌧️";
      world.className = "drive-world time-rain";
      if (rainDrops) rainDrops.classList.remove("hidden");
      startRainAudio();
      speak("Hujan rintik-rintik turun! Masinis tetap melaju aman!");
    } else if (driveTimeMode === "rain") {
      driveTimeMode = "rainbow";
      this.textContent = "🌈";
      world.className = "drive-world time-rainbow";
      if (rainDrops) rainDrops.classList.add("hidden");
      stopRainAudio();
      sndWin();
      driveStars += 20;
      updateStarsDisplay();
      floatScore(window.innerWidth / 2, 100, "🌈 Pelangi Cantik! +20 ⭐");
      speak("Wah, lihat ada Pelangi Indah setelah hujan!");
    } else {
      driveTimeMode = "day";
      this.textContent = "☀️";
      world.className = "drive-world time-day";
      if (rainDrops) rainDrops.classList.add("hidden");
      stopRainAudio();
    }
  });

  // Sistem Paspor Masinis KAI (Koleksi Cap 4 Stasiun Utama Jawa)
  const stampedStations = {
    gambir: false,
    bandung: false,
    tugu: false,
    gubeng: false
  };

  function stampStation(key, name) {
    if (stampedStations[key]) return;
    stampedStations[key] = true;

    const seal = document.getElementById(`seal-${key}`);
    if (seal) {
      const today = new Date();
      const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
      seal.innerHTML = `
        <div class="stamp-seal-stamped">
          <span class="seal-official">PT KAI RESMI</span>
          <span class="seal-name">${name}</span>
          <span class="seal-date">${dateStr}</span>
        </div>
      `;
    }

    beep(190, 0.14, "triangle", 0.25);
    setTimeout(() => beep(240, 0.1, "sine", 0.2), 50);

    const total = Object.values(stampedStations).filter(Boolean).length;
    const countLabel = document.getElementById("passport-count-label");
    if (countLabel) countLabel.textContent = `Cap Terkumpul: ${total} / 4 Stasiun`;
    const barFill = document.getElementById("passport-bar-fill");
    if (barFill) barFill.style.width = `${(total / 4) * 100}%`;

    floatScore(window.innerWidth / 2, 160, `📖 Cap ${name} Masuk Paspor!`);

    if (total === 4) {
      setTimeout(() => {
        sndWin();
        const trophyModal = document.getElementById("modal-passport-trophy");
        if (trophyModal) trophyModal.classList.remove("hidden");
        speak("Luar biasa Masinis Cilik! Seluruh cap stasiun di Pulau Jawa sudah terkumpul lengkap!");
      }, 1200);
    }
  }

  // Listener Modal Paspor & Trophy
  const btnOpenPassport = document.getElementById("btn-open-passport");
  if (btnOpenPassport) {
    btnOpenPassport.addEventListener("click", () => {
      initAudio();
      sndTap();
      document.getElementById("modal-passport").classList.remove("hidden");
    });
  }
  const btnClosePassport = document.getElementById("btn-close-passport");
  if (btnClosePassport) {
    btnClosePassport.addEventListener("click", () => {
      document.getElementById("modal-passport").classList.add("hidden");
    });
  }
  const btnCloseTrophy = document.getElementById("btn-close-trophy");
  if (btnCloseTrophy) {
    btnCloseTrophy.addEventListener("click", () => {
      document.getElementById("modal-passport-trophy").classList.add("hidden");
      driveStars += 50;
      updateStarsDisplay();
      floatScore(window.innerWidth / 2, 140, "🎖️ +50 Bintang Masinis Utama!");
    });
  }

  // Tombol Naikkan Penumpang di Stasiun
  document.getElementById("btn-board-passengers").addEventListener("click", () => {
    initAudio();
    sndWin();
    drivePassengers += 3;
    driveStars += 15;
    document.getElementById("drive-passengers-count").textContent = drivePassengers;
    updateStarsDisplay();
    updateCarriagePassengers();

    // Cap Stasiun di Paspor Masinis
    if (currentStationAtPlatform) {
      const n = currentStationAtPlatform.name.toLowerCase();
      if (n.includes("gambir")) stampStation("gambir", "GAMBIR");
      else if (n.includes("bandung")) stampStation("bandung", "BANDUNG");
      else if (n.includes("yogyakarta") || n.includes("tugu")) stampStation("tugu", "TUGU YOGYA");
      else if (n.includes("gubeng") || n.includes("surabaya")) stampStation("gubeng", "S. GUBENG");
    }

    // Animasi hewan melompat naik ke dalam kereta
    if (currentStationAtPlatform) {
      const stAnimals = document.getElementById(`station-passengers-${currentStationAtPlatform.idx}`);
      if (stAnimals) {
        stAnimals.style.transform = "translateX(50px) scale(0)";
        stAnimals.style.transition = "transform .5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      }
    }

    document.getElementById("station-arrival-banner").classList.add("hidden");
    speak("Hore! Tiga penumpang lucu naik ke dalam kereta!");
    floatScore(window.innerWidth / 2, 120, "+3 Penumpang! +15");
  });

  // ====================================================
  // 5. MINI-GAME EDUKASI (ORIGINAL & DISEMPURNAKAN)
  // ====================================================

  // Util drag pointer
  function makeDraggable(el, onDrop) {
    el.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      initAudio();
      const rect = el.getBoundingClientRect();
      const offX = e.clientX - rect.left;
      const offY = e.clientY - rect.top;
      const clone = el.cloneNode(true);
      clone.classList.add("dragging");
      clone.style.position = "fixed";
      clone.style.left = rect.left + "px";
      clone.style.top = rect.top + "px";
      clone.style.width = rect.width + "px";
      clone.style.height = rect.height + "px";
      clone.style.zIndex = 999;
      clone.style.pointerEvents = "none";
      document.body.appendChild(clone);
      el.style.visibility = "hidden";
      sndPick();
      const move = (ev) => {
        clone.style.left = (ev.clientX - offX) + "px";
        clone.style.top = (ev.clientY - offY) + "px";
      };
      const up = (ev) => {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
        const target = document.elementFromPoint(ev.clientX, ev.clientY);
        const dropEl = target ? target.closest("[data-drop]") : null;
        clone.remove();
        el.style.visibility = "visible";
        onDrop(dropEl, el);
      };
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
    });
  }

  function floatScore(x, y, text) {
    const f = document.createElement("div");
    f.className = "float-score";
    f.textContent = text;
    f.style.left = x + "px"; f.style.top = y + "px";
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 800);
  }

  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    r = Math.max(0, Math.min(255, r + pct));
    g = Math.max(0, Math.min(255, g + pct));
    b = Math.max(0, Math.min(255, b + pct));
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function trainEl(color, withWindow) {
    const t = document.createElement("div");
    t.className = "train";
    t.style.background = "linear-gradient(" + color + "," + shade(color, -22) + ")";
    if (withWindow !== false) {
      const cab = document.createElement("div"); cab.className = "cabin"; t.appendChild(cab);
      const win = document.createElement("div"); win.className = "win"; t.appendChild(win);
    }
    const w1 = document.createElement("div"); w1.className = "wheel w1"; t.appendChild(w1);
    const w2 = document.createElement("div"); w2.className = "wheel w2"; t.appendChild(w2);
    return t;
  }
  const COLORS = ["#e23b2e", "#2e8be2", "#2eb85c", "#f0a500", "#9b59b6", "#16b3b3"];

  // Marimba synth untuk sentuhan kartu edukasi anak
  const MARIMBA_NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
  function playMarimba(idx) {
    if (!soundOn) return;
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const freq = MARIMBA_NOTES[idx % MARIMBA_NOTES.length];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // ====================================================
  // GAME 1: SUSUN RANGKAIAN KERETA KAI (STUDIO ASSETS)
  // ====================================================
  let susunScore = 0;
  const SUSUN_WAGONS = [
    { type: "eksekutif", name: "Eksekutif KAI", img: "assets/gerbong_eksekutif.svg" },
    { type: "panoramic", name: "Panoramic Mewah", img: "assets/gerbong_panoramic.svg" },
    { type: "makan", name: "Restorasi Kafe (M1)", img: "assets/gerbong_makan.svg" },
    { type: "pembangkit", name: "Pembangkit Listrik (P)", img: "assets/gerbong_pembangkit.svg" },
    { type: "kontainer", name: "Kontainer Logistik", img: "assets/gerbong_kontainer.svg" },
    { type: "tangki", name: "Tangki BBM Pertamina", img: "assets/gerbong_tangki.svg" }
  ];

  function startSusun() {
    show("game-susun");
    susunScore = 0;
    document.getElementById("susun-score").textContent = "0";
    document.getElementById("susun-win").classList.add("hidden");
    const track = document.getElementById("susun-track");
    const yard = document.getElementById("susun-yard");
    track.innerHTML = ""; yard.innerHTML = "";

    // 1. Lokomotif CC 206 di ujung kanan rel (posisi depan / penarik)
    const locoLead = document.createElement("div");
    locoLead.className = "susun-loco-lead";
    locoLead.innerHTML = `
      <img src="assets/cc206.svg" alt="CC 206 KAI" />
      <div class="lead-smoke-gen"></div>
    `;

    // 2. Buat 4 slot target untuk gerbong
    const targetCount = 4;
    for (let i = 1; i <= targetCount; i++) {
      const slot = document.createElement("div");
      slot.className = "gerbong-slot";
      slot.dataset.drop = "1";
      slot.dataset.slotIndex = i;
      slot.setAttribute("title", "Sambungkan gerbong ke-" + i);
      track.appendChild(slot);
    }
    // Lokomotif di depan gerbong
    track.appendChild(locoLead);

    // 3. Pilihan gerbong di yard/depo (acak 4 dari koleksi)
    const shuffledWagons = shuffle([...SUSUN_WAGONS]).slice(0, targetCount);
    shuffledWagons.forEach(wagon => {
      const card = document.createElement("div");
      card.className = "susun-carriage-card";
      card.dataset.wagonType = wagon.type;
      card.innerHTML = `
        <img src="${wagon.img}" alt="${wagon.name}" />
        <span class="card-caption">${wagon.name}</span>
      `;

      makeDraggable(card, (drop, el) => {
        if (drop && drop.dataset.drop && !drop.classList.contains("filled")) {
          drop.classList.add("filled");
          drop.classList.add("snap-pop");
          drop.appendChild(el);
          el.style.position = "static";
          el.style.cursor = "default";
          el.style.pointerEvents = "none";
          el.style.boxShadow = "none";
          el.style.border = "none";
          el.style.background = "transparent";

          susunScore++;
          document.getElementById("susun-score").textContent = susunScore;
          sndGood();
          beep(440, 0.08, "triangle", 0.2); // metallic couple sound
          playMarimba(susunScore);

          if (susunScore === targetCount) {
            playKaiHorn();
            sndWin();
            speak("Luar biasa! Rangkaian Kereta KAI sudah tersambung lengkap!");
            setTimeout(() => {
              document.getElementById("susun-win").classList.remove("hidden");
            }, 500);
          } else {
            speak(wagon.name + " tersambung!");
          }
        }
      });
      yard.appendChild(card);
    });

    speak("Ayo susun rangkaian gerbong di belakang lokomotif CC 206!");
  }

  // Tombol aksi di Win Screen Susun -> Langsung Nyetir
  document.getElementById("btn-susun-to-drive").addEventListener("click", () => {
    document.getElementById("susun-win").classList.add("hidden");
    startDrive();
  });

  // ====================================================
  // GAME 2: TANGKAP KERETA (AUTHENTIC SPRITES & COMBOS)
  // ====================================================
  let tangkapScore = 0;
  let tangkapCombo = 0;
  let tangkapTimer = null;
  let tangkapSpawn = null;
  let tangkapTimeLeft = 0;

  const TANGKAP_TRAINS = [
    { type: "whoosh", img: "assets/whoosh.svg", name: "Whoosh Cepat! ⚡", speedMultiplier: 1.45, horn: playWhooshHorn },
    { type: "cc206", img: "assets/cc206.svg", name: "CC 206 KAI! 🚂", speedMultiplier: 1.0, horn: playKaiHorn },
    { type: "vintage", img: "assets/vintage_bb301.svg", name: "Vintage BB 301! 🏛️", speedMultiplier: 0.95, horn: playVintageHorn },
    { type: "krl", img: "assets/krl.svg", name: "KRL Commuter! 🚃", speedMultiplier: 1.1, horn: playKaiHorn },
    { type: "uap", img: "assets/uap_b25.svg", name: "Kereta Uap B25! 💨", speedMultiplier: 0.8, horn: playSteamWhistle },
    { type: "cc201", img: "assets/cc201.svg", name: "CC 201 Klasik! 🚆", speedMultiplier: 1.05, horn: playKaiHorn }
  ];

  function startTangkap() {
    show("game-tangkap");
    tangkapScore = 0;
    tangkapCombo = 0;
    document.getElementById("tangkap-score").textContent = "0";
    document.getElementById("tangkap-combo").innerHTML = "⚡ Combo: <strong>x0</strong>";
    document.getElementById("tangkap-win").classList.add("hidden");

    const stage = document.getElementById("tangkap-stage");
    stage.innerHTML = "";
    const TOTAL = 30;
    tangkapTimeLeft = TOTAL;
    const fill = document.getElementById("tangkap-timer");
    fill.style.width = "100%";

    function spawnMover() {
      const trainData = TANGKAP_TRAINS[Math.floor(Math.random() * TANGKAP_TRAINS.length)];
      const mover = document.createElement("div");
      mover.className = "tangkap-train-mover";
      mover.innerHTML = `
        <img src="${trainData.img}" alt="${trainData.name}" />
        <span class="mover-tag">${trainData.name}</span>
      `;

      // Posisi ketinggian rel acak
      const trackRows = [20, 45, 70];
      const rowY = trackRows[Math.floor(Math.random() * trackRows.length)];
      mover.style.top = rowY + "%";
      mover.style.left = "-180px";
      stage.appendChild(mover);

      const baseDur = 2400 / trainData.speedMultiplier;
      const startT = performance.now();
      const W = stage.clientWidth || 360;

      function step(now) {
        const p = (now - startT) / baseDur;
        if (p >= 1) {
          mover.remove();
          // Reset combo jika terlewat
          if (tangkapCombo > 0) {
            tangkapCombo = Math.max(0, tangkapCombo - 1);
            document.getElementById("tangkap-combo").innerHTML = `⚡ Combo: <strong>x${tangkapCombo}</strong>`;
          }
          return;
        }
        mover.style.left = (-180 + p * (W + 220)) + "px";
        if (!mover.dataset.caught) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);

      mover.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        if (!mover.dataset.caught) {
          mover.dataset.caught = "1";
          tangkapScore++;
          tangkapCombo++;
          document.getElementById("tangkap-score").textContent = tangkapScore;
          document.getElementById("tangkap-combo").innerHTML = `⚡ Combo: <strong>x${tangkapCombo}</strong>`;

          trainData.horn();
          sndGood();
          playMarimba(tangkapScore);

          floatScore(e.clientX, e.clientY, `⭐ +1 ${trainData.name}`);
          mover.style.transform = "translateY(-50%) scale(1.3) rotate(6deg)";
          mover.style.opacity = "0";
          setTimeout(() => mover.remove(), 180);
        }
      });
    }

    clearInterval(tangkapSpawn);
    tangkapSpawn = setInterval(spawnMover, 850);
    spawnMover();

    clearInterval(tangkapTimer);
    tangkapTimer = setInterval(() => {
      tangkapTimeLeft--;
      fill.style.width = (tangkapTimeLeft / TOTAL * 100) + "%";
      if (tangkapTimeLeft <= 0) endTangkap();
    }, 1000);

    speak("Sentuh semua kereta yang lewat sebelum lolos!");
  }

  function endTangkap() {
    clearInterval(tangkapSpawn);
    clearInterval(tangkapTimer);
    document.getElementById("tangkap-final").textContent = tangkapScore;
    sndWin();
    speak("Hore! Kamu berhasil menangkap " + tangkapScore + " kereta!");
    document.getElementById("tangkap-win").classList.remove("hidden");
  }

  // ====================================================
  // GAME 3: COCOK WARNA STASIUN (INDONESIAN STATIONS)
  // ====================================================
  const COLOR_STATIONS = [
    { name: "Stasiun Merah", city: "Gambir", color: "#e23b2e", bg: "linear-gradient(180deg, #dc2626, #991b1b)", trainImg: "assets/cc206.svg" },
    { name: "Stasiun Biru", city: "Bandung", color: "#2563eb", bg: "linear-gradient(180deg, #2563eb, #1e40af)", trainImg: "assets/gerbong_panoramic.svg" },
    { name: "Stasiun Hijau", city: "Yogyakarta", color: "#16a34a", bg: "linear-gradient(180deg, #16a34a, #166534)", trainImg: "assets/uap_b25.svg" },
    { name: "Stasiun Kuning", city: "Surabaya", color: "#d97706", bg: "linear-gradient(180deg, #f59e0b, #b45309)", trainImg: "assets/krl.svg" }
  ];
  let warnaScore = 0;

  function startWarna() {
    show("game-warna");
    warnaScore = 0;
    document.getElementById("warna-score").textContent = "0";
    document.getElementById("warna-win").classList.add("hidden");

    const stationsEl = document.getElementById("warna-stations");
    const yard = document.getElementById("warna-yard");
    stationsEl.innerHTML = ""; yard.innerHTML = "";

    // 1. Render 4 Stasiun KAI
    COLOR_STATIONS.forEach(st => {
      const card = document.createElement("div");
      card.className = "stasiun-platform-card";
      card.style.background = st.bg;
      card.dataset.drop = "1";
      card.dataset.colorName = st.name;

      card.innerHTML = `
        <div class="st-roof">🚉 Platform ${st.city}</div>
        <div class="st-nameplate">${st.name}</div>
        <div class="st-dock-slot" data-drop="1" data-color-name="${st.name}">
          <span style="font-size:11px; opacity:.85; font-weight:800;">Parkir Sini 🅿️</span>
        </div>
      `;
      stationsEl.appendChild(card);
    });

    // 2. Render 4 Kereta yang harus dicocokkan (diacak)
    const shuffledTrains = shuffle([...COLOR_STATIONS]);
    shuffledTrains.forEach(st => {
      const trainItem = document.createElement("div");
      trainItem.className = "warna-train-item";
      trainItem.dataset.colorName = st.name;
      trainItem.innerHTML = `<img src="${st.trainImg}" alt="${st.name}" />`;

      makeDraggable(trainItem, (drop, el) => {
        if (!drop) return;
        const targetColor = drop.dataset.colorName || (drop.closest(".stasiun-platform-card") && drop.closest(".stasiun-platform-card").dataset.colorName);

        if (targetColor === el.dataset.colorName) {
          const dockSlot = drop.classList.contains("st-dock-slot") ? drop : drop.querySelector(".st-dock-slot");
          if (dockSlot && !dockSlot.classList.contains("filled")) {
            dockSlot.classList.add("filled");
            dockSlot.innerHTML = "";
            dockSlot.appendChild(el);
            el.style.position = "static";
            el.style.margin = "0";
            el.style.cursor = "default";
            el.style.pointerEvents = "none";
            el.style.width = "100%";
            el.style.height = "100%";

            warnaScore++;
            document.getElementById("warna-score").textContent = warnaScore;
            sndGood();
            playStationJingle();
            playMarimba(warnaScore);
            speak("Bagus! Kereta tiba di " + st.name + "!");

            if (warnaScore === COLOR_STATIONS.length) {
              sndWin();
              speak("Hebat sekali! Semua kereta sudah terparkir rapi di stasiun yang benar!");
              setTimeout(() => document.getElementById("warna-win").classList.remove("hidden"), 450);
            }
          }
        } else {
          sndWrong();
          speak("Warna belum cocok, coba cari stasiun yang sama!");
        }
      });

      yard.appendChild(trainItem);
    });

    speak("Tarik kereta ke peron stasiun yang warnanya cocok!");
  }

  // ====================================================
  // GAME 4, 5, 6: TAMAN BELAJAR KAI
  // 28 HIJAIYAH (DENGAN HARAKAT), ANGKA 1-20, ALFABET A-Z
  // ====================================================
  const HIJAIYAH_DATA = [
    { char: "ا", name: "Alif", latin: "Alif", phonics: { asli: "Alif", fathah: "A", kasrah: "I", dammah: "U" }, displayHarakat: { asli: "ا", fathah: "اَ", kasrah: "اِ", dammah: "اُ" }, object: "🍎 Apel" },
    { char: "ب", name: "Ba", latin: "Ba", phonics: { asli: "Ba", fathah: "Ba", kasrah: "Bi", dammah: "Bu" }, displayHarakat: { asli: "ب", fathah: "بَ", kasrah: "بِ", dammah: "بُ" }, object: "🦆 Bebek" },
    { char: "ت", name: "Ta", latin: "Ta", phonics: { asli: "Ta", fathah: "Ta", kasrah: "Ti", dammah: "Tu" }, displayHarakat: { asli: "ت", fathah: "تَ", kasrah: "تِ", dammah: "تُ" }, object: "👑 Mahkota" },
    { char: "ث", name: "Tsa", latin: "Tsa", phonics: { asli: "Tsa", fathah: "Tsa", kasrah: "Tsi", dammah: "Tsu" }, displayHarakat: { asli: "ث", fathah: "ثَ", kasrah: "ثِ", dammah: "ثُ" }, object: "🦊 Rubah" },
    { char: "ج", name: "Jim", latin: "Jim", phonics: { asli: "Jim", fathah: "Ja", kasrah: "Ji", dammah: "Ju" }, displayHarakat: { asli: "ج", fathah: "جَ", kasrah: "جِ", dammah: "جُ" }, object: "🐪 Unta" },
    { char: "ح", name: "Ha", latin: "Ha", phonics: { asli: "Ha", fathah: "Ha", kasrah: "Hi", dammah: "Hu" }, displayHarakat: { asli: "ح", fathah: "حَ", kasrah: "حِ", dammah: "حُ" }, object: "🐋 Paus" },
    { char: "خ", name: "Kha", latin: "Kha", phonics: { asli: "Kha", fathah: "Kha", kasrah: "Khi", dammah: "Khu" }, displayHarakat: { asli: "خ", fathah: "خَ", kasrah: "خِ", dammah: "خُ" }, object: "🍞 Roti" },
    { char: "د", name: "Dal", latin: "Dal", phonics: { asli: "Dal", fathah: "Da", kasrah: "Di", dammah: "Du" }, displayHarakat: { asli: "د", fathah: "دَ", kasrah: "دِ", dammah: "دُ" }, object: "🐓 Ayam" },
    { char: "ذ", name: "Dzal", latin: "Dzal", phonics: { asli: "Dzal", fathah: "Dza", kasrah: "Dzi", dammah: "Dzu" }, displayHarakat: { asli: "ذ", fathah: "ذَ", kasrah: "ذِ", dammah: "ذُ" }, object: "🐺 Serigala" },
    { char: "ر", name: "Ra", latin: "Ra", phonics: { asli: "Ra", fathah: "Ro", kasrah: "Ri", dammah: "Ru" }, displayHarakat: { asli: "ر", fathah: "رَ", kasrah: "رِ", dammah: "رُ" }, object: "🦚 Merak" },
    { char: "ز", name: "Zai", latin: "Zai", phonics: { asli: "Zai", fathah: "Za", kasrah: "Zi", dammah: "Zu" }, displayHarakat: { asli: "ز", fathah: "زَ", kasrah: "زِ", dammah: "زُ" }, object: "🦒 Jerapah" },
    { char: "س", name: "Sin", latin: "Sin", phonics: { asli: "Sin", fathah: "Sa", kasrah: "Si", dammah: "Su" }, displayHarakat: { asli: "س", fathah: "سَ", kasrah: "سِ", dammah: "سُ" }, object: "🐟 Ikan" },
    { char: "ش", name: "Syin", latin: "Syin", phonics: { asli: "Syin", fathah: "Sya", kasrah: "Syi", dammah: "Syu" }, displayHarakat: { asli: "ش", fathah: "شَ", kasrah: "شِ", dammah: "شُ" }, object: "☀️ Mentari" },
    { char: "ص", name: "Shad", latin: "Shad", phonics: { asli: "Shad", fathah: "Sho", kasrah: "Shi", dammah: "Shu" }, displayHarakat: { asli: "ص", fathah: "صَ", kasrah: "صِ", dammah: "صُ" }, object: "🦅 Elang" },
    { char: "ض", name: "Dhad", latin: "Dhad", phonics: { asli: "Dhad", fathah: "Dho", kasrah: "Dhi", dammah: "Dhu" }, displayHarakat: { asli: "ض", fathah: "ضَ", kasrah: "ضِ", dammah: "ضُ" }, object: "🐸 Katak" },
    { char: "ط", name: "Tha", latin: "Tha", phonics: { asli: "Tha", fathah: "Tho", kasrah: "Thi", dammah: "Thu" }, displayHarakat: { asli: "ط", fathah: "طَ", kasrah: "طِ", dammah: "طُ" }, object: "✈️ Pesawat" },
    { char: "ظ", name: "Zha", latin: "Zha", phonics: { asli: "Zha", fathah: "Zho", kasrah: "Zhi", dammah: "Zhu" }, displayHarakat: { asli: "ظ", fathah: "ظَ", kasrah: "ظِ", dammah: "ظُ" }, object: "✉️ Surat" },
    { char: "ع", name: "'Ain", latin: "'Ain", phonics: { asli: "'Ain", fathah: "'A", kasrah: "'I", dammah: "'U" }, displayHarakat: { asli: "ع", fathah: "عَ", kasrah: "عِ", dammah: "عُ" }, object: "🍇 Anggur" },
    { char: "غ", name: "Ghain", latin: "Ghain", phonics: { asli: "Ghain", fathah: "Gho", kasrah: "Ghi", dammah: "Ghu" }, displayHarakat: { asli: "غ", fathah: "غَ", kasrah: "غِ", dammah: "غُ" }, object: "☁️ Awan" },
    { char: "ف", name: "Fa", latin: "Fa", phonics: { asli: "Fa", fathah: "Fa", kasrah: "Fi", dammah: "Fu" }, displayHarakat: { asli: "ف", fathah: "فَ", kasrah: "فِ", dammah: "فُ" }, object: "🐘 Gajah" },
    { char: "ق", name: "Qaf", latin: "Qaf", phonics: { asli: "Qaf", fathah: "Qo", kasrah: "Qi", dammah: "Qu" }, displayHarakat: { asli: "ق", fathah: "قَ", kasrah: "قِ", dammah: "قُ" }, object: "🌙 Bulan" },
    { char: "ك", name: "Kaf", latin: "Kaf", phonics: { asli: "Kaf", fathah: "Ka", kasrah: "Ki", dammah: "Ku" }, displayHarakat: { asli: "ك", fathah: "كَ", kasrah: "كِ", dammah: "كُ" }, object: "⚽ Bola" },
    { char: "ل", name: "Lam", latin: "Lam", phonics: { asli: "Lam", fathah: "La", kasrah: "Li", dammah: "Lu" }, displayHarakat: { asli: "ل", fathah: "لَ", kasrah: "لِ", dammah: "لُ" }, object: "🍋 Lemon" },
    { char: "م", name: "Mim", latin: "Mim", phonics: { asli: "Mim", fathah: "Ma", kasrah: "Mi", dammah: "Mu" }, displayHarakat: { asli: "م", fathah: "مَ", kasrah: "مِ", dammah: "مُ" }, object: "🍌 Pisang" },
    { char: "ن", name: "Nun", latin: "Nun", phonics: { asli: "Nun", fathah: "Na", kasrah: "Ni", dammah: "Nu" }, displayHarakat: { asli: "ن", fathah: "نَ", kasrah: "نِ", dammah: "نُ" }, object: "⭐ Bintang" },
    { char: "و", name: "Waw", latin: "Waw", phonics: { asli: "Waw", fathah: "Wa", kasrah: "Wi", dammah: "Wu" }, displayHarakat: { asli: "و", fathah: "وَ", kasrah: "وِ", dammah: "وُ" }, object: "🌹 Mawar" },
    { char: "هـ", name: "Ha'", latin: "Ha'", phonics: { asli: "Ha", fathah: "Ha", kasrah: "Hi", dammah: "Hu" }, displayHarakat: { asli: "هـ", fathah: "هَـ", kasrah: "هِـ", dammah: "هُـ" }, object: "🎁 Hadiah" },
    { char: "ي", name: "Ya", latin: "Ya", phonics: { asli: "Ya", fathah: "Ya", kasrah: "Yi", dammah: "Yu" }, displayHarakat: { asli: "ي", fathah: "يَ", kasrah: "يِ", dammah: "يُ" }, object: "✋ Tangan" }
  ];

  let currentHarakat = "asli"; // 'asli' | 'fathah' | 'kasrah' | 'dammah'

  const CARI = {
    angka: {
      title: "🔢 Belajar Angka 1 - 20 KAI",
      speechPrefix: "angka",
      rounds: 10,
      items: [
        { display: "1", sub: "Satu", speak: "angka satu, satu gerbong!", countLabel: "🐾 1" },
        { display: "2", sub: "Dua", speak: "angka dua, dua gerbong!", countLabel: "🐾 2" },
        { display: "3", sub: "Tiga", speak: "angka tiga, tiga gerbong!", countLabel: "🐾 3" },
        { display: "4", sub: "Empat", speak: "angka empat, empat gerbong!", countLabel: "🐾 4" },
        { display: "5", sub: "Lima", speak: "angka lima, lima gerbong!", countLabel: "🐾 5" },
        { display: "6", sub: "Enam", speak: "angka enam", countLabel: "🐾 6" },
        { display: "7", sub: "Tujuh", speak: "angka tujuh", countLabel: "🐾 7" },
        { display: "8", sub: "Delapan", speak: "angka delapan", countLabel: "🐾 8" },
        { display: "9", sub: "Sembilan", speak: "angka sembilan", countLabel: "🐾 9" },
        { display: "10", sub: "Sepuluh", speak: "angka sepuluh", countLabel: "🐾 10" },
        { display: "11", sub: "Sebelas", speak: "angka sebelas", countLabel: "🐾 11" },
        { display: "12", sub: "Dua Belas", speak: "angka dua belas", countLabel: "🐾 12" },
        { display: "13", sub: "Tiga Belas", speak: "angka tiga belas", countLabel: "🐾 13" },
        { display: "14", sub: "Empat Belas", speak: "angka empat belas", countLabel: "🐾 14" },
        { display: "15", sub: "Lima Belas", speak: "angka lima belas", countLabel: "🐾 15" },
        { display: "16", sub: "Enam Belas", speak: "angka enam belas", countLabel: "🐾 16" },
        { display: "17", sub: "Tujuh Belas", speak: "angka tujuh belas", countLabel: "🐾 17" },
        { display: "18", sub: "Delapan Belas", speak: "angka delapan belas", countLabel: "🐾 18" },
        { display: "19", sub: "Sembilan Belas", speak: "angka sembilan belas", countLabel: "🐾 19" },
        { display: "20", sub: "Dua Puluh", speak: "angka dua puluh", countLabel: "🐾 20" }
      ].map((it, i) => ({ ...it, key: "n_" + i }))
    },
    abc: {
      title: "🔤 Huruf Alfabet A - Z Lengkap",
      speechPrefix: "huruf",
      rounds: 10,
      items: [
        { display: "Aa", sub: "Apel 🍎", speak: "huruf A, Apel segar!" },
        { display: "Bb", sub: "Balon 🎈", speak: "huruf B, Balon terbang!" },
        { display: "Cc", sub: "Ceri 🍒", speak: "huruf C, Buah Ceri manis!" },
        { display: "Dd", sub: "Domba 🐑", speak: "huruf D, Domba lucu!" },
        { display: "Ee", sub: "Elang 🦅", speak: "huruf E, Burung Elang gagah!" },
        { display: "Ff", sub: "Flamingo 🦩", speak: "huruf F, Burung Flamingo merah jambu!" },
        { display: "Gg", sub: "Gajah 🐘", speak: "huruf G, Gajah belalai panjang!" },
        { display: "Hh", sub: "Harimau 🐅", speak: "huruf H, Harimau belang!" },
        { display: "Ii", sub: "Ikan 🐟", speak: "huruf I, Ikan berenang!" },
        { display: "Jj", sub: "Jerapah 🦒", speak: "huruf J, Jerapah leher tinggi!" },
        { display: "Kk", sub: "Kereta 🚂", speak: "huruf K, Kereta Api KAI melaju cepat!" },
        { display: "Ll", sub: "Lumba 🐬", speak: "huruf L, Lumba-lumba melompat!" },
        { display: "Mm", sub: "Mobil 🚗", speak: "huruf M, Mobil jalan raya!" },
        { display: "Nn", sub: "Nanas 🍍", speak: "huruf N, Buah Nanas!" },
        { display: "Oo", sub: "Orangutan 🦧", speak: "huruf O, Orangutan cerdas!" },
        { display: "Pp", sub: "Pesawat ✈️", speak: "huruf P, Pesawat terbang di awan!" },
        { display: "Qq", sub: "Quran 📖", speak: "huruf Q, Al Quran mulia!" },
        { display: "Rr", sub: "Rusa 🦌", speak: "huruf R, Rusa lincah!" },
        { display: "Ss", sub: "Singa 🦁", speak: "huruf S, Singa raja hutan!" },
        { display: "Tt", sub: "Tupai 🐿️", speak: "huruf T, Tupai melompat!" },
        { display: "Uu", sub: "Unta 🐪", speak: "huruf U, Unta padang pasir!" },
        { display: "Vv", sub: "Vas 🏺", speak: "huruf V, Vas bunga indah!" },
        { display: "Ww", sub: "Wortel 🥕", speak: "huruf W, Sayur Wortel bergizi!" },
        { display: "Xx", sub: "Xilofon 🎼", speak: "huruf X, Alat musik Xilofon!" },
        { display: "Yy", sub: "Yoyo 🪀", speak: "huruf Y, Mainan Yoyo!" },
        { display: "Zz", sub: "Zebra 🦓", speak: "huruf Z, Kuda Zebra bergaris!" }
      ].map((it, i) => ({ ...it, key: "abc_" + i }))
    },
    hijaiyah: {
      title: "🕌 Huruf Hijaiyah Lengkap (28 Huruf)",
      speechPrefix: "huruf",
      rounds: 10,
      isArabic: true,
      items: HIJAIYAH_DATA.map((it, i) => ({
        display: it.displayHarakat.asli,
        sub: it.latin + " • " + it.object,
        speak: "huruf " + it.phonics.asli + ", " + it.object,
        key: "hij_" + i,
        raw: it
      }))
    }
  };

  let currentCariKey = "hijaiyah";
  let cariMode = "dict"; // 'dict' | 'quiz'
  let cariScore = 0;
  let cariStreak = 0;
  let cariTarget = null;

  function startCari(key) {
    currentCariKey = key;
    cariStreak = 0;
    show("game-cari");
    document.getElementById("cari-title").textContent = CARI[key].title;
    document.getElementById("cari-win").classList.add("hidden");

    // Tampilkan / sembunyikan bar Harakat
    const harakatBar = document.getElementById("hijaiyah-harakat-bar");
    if (key === "hijaiyah") {
      harakatBar.classList.remove("hidden");
    } else {
      harakatBar.classList.add("hidden");
    }

    setEduTabMode("dict");
    renderDictionaryGrid();
    speak("Ayo belajar " + (key === "hijaiyah" ? "dua puluh delapan huruf hijaiyah" : key === "angka" ? "angka satu sampai dua puluh" : "huruf alfabet"));
  }

  function setEduTabMode(mode) {
    cariMode = mode;
    const tabLearn = document.getElementById("tab-learn");
    const tabQuiz = document.getElementById("tab-quiz");
    const dictView = document.getElementById("cari-dict-view");
    const quizView = document.getElementById("cari-quiz-view");

    if (mode === "dict") {
      tabLearn.classList.add("active");
      tabQuiz.classList.remove("active");
      dictView.classList.remove("hidden");
      quizView.classList.add("hidden");
    } else {
      tabQuiz.classList.add("active");
      tabLearn.classList.remove("active");
      quizView.classList.remove("hidden");
      dictView.classList.add("hidden");
      startQuizRound();
    }
  }

  // Switcher Tab
  document.getElementById("tab-learn").addEventListener("click", () => {
    initAudio(); sndTap(); setEduTabMode("dict");
  });
  document.getElementById("tab-quiz").addEventListener("click", () => {
    initAudio(); sndTap(); setEduTabMode("quiz");
  });
  document.getElementById("btn-back-to-dict").addEventListener("click", () => {
    document.getElementById("cari-win").classList.add("hidden");
    setEduTabMode("dict");
  });

  // Handler Harakat (Asli, Fathah, Kasrah, Dammah)
  document.querySelectorAll(".harakat-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      initAudio();
      document.querySelectorAll(".harakat-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      currentHarakat = this.dataset.harakat;
      playMarimba(3);

      // Update items Hijaiyah dengan tanda baca terpilih
      CARI.hijaiyah.items = HIJAIYAH_DATA.map((it, i) => {
        const charHarakat = it.displayHarakat[currentHarakat];
        const phonicSound = it.phonics[currentHarakat];
        return {
          display: charHarakat,
          sub: phonicSound + " • " + it.object,
          speak: phonicSound + ", " + it.object,
          key: "hij_" + i,
          raw: it
        };
      });

      renderDictionaryGrid();
      speak("Tanda baca " + (currentHarakat === "asli" ? "huruf asli" : currentHarakat));
    });
  });

  // Render Kamus Suara (Kualitas Studio Toy Wagon)
  function renderDictionaryGrid() {
    const cfg = CARI[currentCariKey];
    const container = document.getElementById("cari-full-grid");
    container.innerHTML = "";

    cfg.items.forEach((item, index) => {
      const card = document.createElement("div");
      const color = COLORS[index % COLORS.length];
      card.className = "dict-train-card" + (cfg.isArabic ? " is-hijaiyah" : "");
      card.style.background = `linear-gradient(180deg, ${color} 0%, ${shade(color, -25)} 100%)`;

      card.innerHTML = `
        <span class="card-speaker-icon">🔊</span>
        <div class="card-main-symbol">${item.display}</div>
        <div class="card-sub-label">${item.sub}</div>
        <div class="card-wheels">
          <div class="c-wheel"></div><div class="c-wheel"></div>
        </div>
      `;

      card.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        initAudio();
        playMarimba(index);
        card.classList.add("bouncing");
        setTimeout(() => card.classList.remove("bouncing"), 250);
        floatScore(e.clientX, e.clientY, "🌟");
        speak(item.speak);
      });

      container.appendChild(card);
    });
  }

  // Quiz Mode Logic (Dengan Bogie Kereta & Combo Streak)
  function startQuizRound() {
    cariScore = 0;
    cariStreak = 0;
    document.getElementById("cari-score").textContent = "0";
    document.getElementById("quiz-streak-pill").classList.add("hidden");
    document.getElementById("cari-win").classList.add("hidden");
    nextQuizQuestion();
  }

  function nextQuizQuestion() {
    const cfg = CARI[currentCariKey];
    cariTarget = cfg.items[Math.floor(Math.random() * cfg.items.length)];
    const others = shuffle(cfg.items.filter(i => i.key !== cariTarget.key)).slice(0, 3);
    const picks = shuffle([cariTarget, ...others]);

    const targetEl = document.getElementById("cari-target");
    targetEl.textContent = cfg.isArabic ? `${cariTarget.display} (${cariTarget.sub})` : `${cariTarget.display} - ${cariTarget.sub}`;
    document.querySelector(".quiz-prompt-card").classList.toggle("is-hijaiyah-quiz", !!cfg.isArabic);

    const grid = document.getElementById("cari-grid");
    grid.innerHTML = "";

    picks.forEach((item, pIdx) => {
      const color = COLORS[(pIdx * 2 + Math.floor(Math.random() * 3)) % COLORS.length];
      const opt = document.createElement("div");
      opt.className = "quiz-carriage-option" + (cfg.isArabic ? " is-hijaiyah-opt" : "");
      opt.style.background = `linear-gradient(180deg, ${color} 0%, ${shade(color, -25)} 100%)`;

      opt.innerHTML = `
        <div class="opt-symbol">${item.display}</div>
        <div class="opt-sub">${item.sub}</div>
        <div class="opt-wheels">
          <div class="c-wheel"></div><div class="c-wheel"></div>
        </div>
      `;

      opt.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        initAudio();

        if (item.key === cariTarget.key) {
          cariScore++;
          cariStreak++;
          document.getElementById("cari-score").textContent = cariScore;

          const streakPill = document.getElementById("quiz-streak-pill");
          if (cariStreak > 1) {
            streakPill.classList.remove("hidden");
            document.getElementById("quiz-streak-count").textContent = cariStreak;
          }

          sndGood();
          playMarimba(cariScore);
          floatScore(e.clientX, e.clientY, `⭐ Hebat! +1`);

          if (cariScore >= cfg.rounds) {
            document.getElementById("cari-final").textContent = cariScore;
            sndWin();
            speak("Masya Allah luar biasa! Adik pintar berhasil menjawab semua soal!");
            setTimeout(() => document.getElementById("cari-win").classList.remove("hidden"), 400);
          } else {
            setTimeout(nextQuizQuestion, 600);
          }
        } else {
          cariStreak = 0;
          document.getElementById("quiz-streak-pill").classList.add("hidden");
          sndWrong();
          opt.classList.add("shake");
          setTimeout(() => opt.classList.remove("shake"), 400);
          speak("Coba lagi adik cerdas, cari " + cariTarget.speak);
        }
      });

      grid.appendChild(opt);
    });

    speak("Di mana " + cariTarget.speak + "?");
  }

  document.getElementById("cari-repeat").addEventListener("click", () => {
    initAudio();
    if (cariTarget) speak(cariTarget.speak);
  });

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ====================================================
  // 6. GAME: TEBAK SUARA SULING & KLAKSON KERETA
  // ====================================================
  const TEBAK_SUARA_POOL = [
    { id: "whoosh", name: "Kereta Cepat Whoosh", img: "assets/whoosh.svg", play: playWhooshHorn },
    { id: "uap", name: "Uap B25 Mak Itam", img: "assets/uap_b25.svg", play: playSteamWhistle },
    { id: "cc206", name: "Lokomotif CC 206 KAI", img: "assets/cc206.svg", play: playKaiHorn },
    { id: "vintage", name: "Vintage BB 301 PJKA", img: "assets/vintage_bb301.svg", play: playVintageHorn }
  ];

  let tebakScore = 0;
  let tebakRound = 0;
  const TEBAK_TOTAL_ROUNDS = 5;
  let currentMysteryLoco = null;

  function startTebakSuara() {
    show("game-tebaksuara");
    tebakScore = 0;
    tebakRound = 0;
    const scoreEl = document.getElementById("tebaksuara-score");
    if (scoreEl) scoreEl.textContent = "0";
    const winOverlay = document.getElementById("tebaksuara-win");
    if (winOverlay) winOverlay.classList.add("hidden");
    nextTebakRound();
    speak("Ayo tebak suara klakson dan suling lokomotif!");
  }

  function nextTebakRound() {
    if (tebakRound >= TEBAK_TOTAL_ROUNDS) {
      sndWin();
      const winEl = document.getElementById("tebaksuara-win");
      if (winEl) winEl.classList.remove("hidden");
      speak("Luar biasa adik masinis! Telingamu sangat hebat!");
      return;
    }
    tebakRound++;
    const roundLbl = document.getElementById("mystery-round-label");
    if (roundLbl) roundLbl.textContent = `Tebakan ${tebakRound} / ${TEBAK_TOTAL_ROUNDS}`;

    currentMysteryLoco = TEBAK_SUARA_POOL[Math.floor(Math.random() * TEBAK_SUARA_POOL.length)];

    const choicesContainer = document.getElementById("tebaksuara-choices");
    if (!choicesContainer) return;
    choicesContainer.innerHTML = "";

    const shuffled = [...TEBAK_SUARA_POOL].sort(() => Math.random() - 0.5);
    shuffled.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "tebak-choice-btn";
      btn.innerHTML = `
        <img src="${item.img}" class="tebak-choice-img" alt="${item.name}" />
        <strong>${item.name}</strong>
      `;
      btn.onclick = () => {
        initAudio();
        if (item.id === currentMysteryLoco.id) {
          btn.classList.add("correct");
          sndGood();
          tebakScore += 20;
          const scoreEl = document.getElementById("tebaksuara-score");
          if (scoreEl) scoreEl.textContent = tebakScore;
          floatScore(window.innerWidth / 2, 140, "Hebat! Benar! +20 ⭐");
          speak("Benar! Itu suara " + item.name);
          setTimeout(() => {
            nextTebakRound();
          }, 1400);
        } else {
          btn.classList.add("wrong");
          sndWrong();
          speak("Bukan, ayo dengarkan lagi suaranya!");
          setTimeout(() => btn.classList.remove("wrong"), 600);
        }
      };
      choicesContainer.appendChild(btn);
    });

    setTimeout(() => {
      playCurrentMysterySound();
    }, 400);
  }

  function playCurrentMysterySound() {
    if (!currentMysteryLoco) return;
    initAudio();
    const waves = document.getElementById("mystery-waves");
    if (waves) waves.classList.add("waves-playing");
    currentMysteryLoco.play();
    setTimeout(() => {
      if (waves) waves.classList.remove("waves-playing");
    }, 1200);
  }

  const btnMysteryPlay = document.getElementById("btn-play-mystery-sound");
  if (btnMysteryPlay) {
    btnMysteryPlay.addEventListener("click", () => {
      playCurrentMysterySound();
    });
  }

  // Mulai di layar depan
  show("home");
})();


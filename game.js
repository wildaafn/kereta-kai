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
      else if (g === "cari") startCari(currentCariKey);
    });
  });

  // ====================================================
  // 3. BENGKEL BALOK KERETA KAI (WORKSHOP & BUILDER)
  // ====================================================
  const trainConfig = {
    loco: "cc206",       // 'cc206' | 'whoosh' | 'cc201' | 'krl' | 'uap' | 'balok'
    color: "#e23b2e",
    carriage: "eksekutif",// 'eksekutif' | 'panoramic' | 'kontainer' | 'tangki'
    count: 2
  };

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
    uap: "assets/uap_b25.svg"
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

    if (isDriveMode) {
      const cone = document.createElement("div");
      cone.className = "headlight-cone";
      wrapper.appendChild(cone);
    }
    return wrapper;
  }

  // Pembuat elemen HTML Gerbong
  function createCarriageElement(carriageType, color) {
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

    return wrapper;
  }

  // Render Kereta Utuh ke kontainer
  function renderTrainAssembly(container, config, isDriveMode) {
    container.innerHTML = "";
    // Urutan: Gerbong di belakang, Lokomotif di paling depan (kanan)
    for (let i = 0; i < config.count; i++) {
      const carriageEl = createCarriageElement(config.carriage, config.color);
      container.appendChild(carriageEl);
    }
    const locoEl = createLocomotiveElement(config.loco, config.color, isDriveMode);
    container.appendChild(locoEl);
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
      trainConfig.loco = btn.dataset.loco;
      sndTap();
      updateBengkelPreview();
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

  function soundLocoHorn() {
    if (trainConfig.loco === "whoosh") {
      playWhooshHorn();
    } else if (trainConfig.loco === "uap") {
      playSteamWhistle();
    } else {
      playKaiHorn();
    }
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
  let driveTimeMode = "day";      // 'day' | 'sunset' | 'night'
  let currentStationAtPlatform = null;

  // Lintasan Rel & Bangunan Ikonik KAI
  const TRACK_ITEMS = [
    { type: "station", name: "Stasiun Gambir", pos: 700, icon: "🏛️" },
    { type: "jpl", name: "Perlintasan JPL 01", pos: 2200 },
    { type: "bridge", name: "Jembatan Cikubang", pos: 3800 },
    { type: "tunnel", name: "Terowongan Sasaksaat", pos: 5200 },
    { type: "station", name: "Stasiun Bandung", pos: 7000, icon: "🌸" },
    { type: "jpl", name: "Perlintasan JPL 02", pos: 8800 },
    { type: "bridge", name: "Jembatan Cirahong", pos: 10400 },
    { type: "tunnel", name: "Terowongan Ijo", pos: 11800 },
    { type: "station", name: "Stasiun Yogyakarta (Tugu)", pos: 13500, icon: "🕌" },
    { type: "jpl", name: "Perlintasan JPL 03", pos: 15200 },
    { type: "station", name: "Stasiun Surabaya Gubeng", pos: 17000, icon: "🦈" }
  ];
  const TOTAL_TRACK_LOOP = 18500;

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

    // Reset dan bangun pemandangan di lintasan
    buildDriveScenery();
    startDriveSimulation();

    speak("Masinis siap! Tarik tuas gas untuk menjalankan kereta!");
  }

  function buildDriveScenery() {
    const layer = document.getElementById("drive-scenery");
    layer.innerHTML = "";

    TRACK_ITEMS.forEach((it, idx) => {
      const el = document.createElement("div");
      el.className = "scenery-item";
      el.dataset.pos = it.pos;
      el.dataset.type = it.type;
      el.dataset.idx = idx;

      if (it.type === "station") {
        el.innerHTML = `
          <div class="st-station">
            <div class="st-roof"></div>
            <div class="st-body">
              <div class="st-sign">${it.name}</div>
              <div class="st-flag">🇮🇩</div>
              <div class="st-passengers-waiting">🐱🐼🐻🐰</div>
            </div>
          </div>
        `;
      } else if (it.type === "jpl") {
        el.innerHTML = `
          <div class="st-jpl" id="jpl-el-${idx}">
            <div class="jpl-post"></div>
            <div class="jpl-cross">❌</div>
            <div class="jpl-lights-box">
              <div class="jpl-bulb b1"></div>
              <div class="jpl-bulb b2"></div>
            </div>
            <div class="jpl-bar"></div>
            <div class="jpl-cars">🚗🚙🛵</div>
          </div>
        `;
      } else if (it.type === "bridge") {
        el.innerHTML = `
          <div class="st-bridge">
            <div class="bridge-girder"></div>
            <div class="bridge-girder"></div>
            <div class="bridge-girder"></div>
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

    // Tambahkan bintang & balon yang bisa diklik untuk bonus confetti
    for (let p = 400; p < TOTAL_TRACK_LOOP; p += 650) {
      const s = document.createElement("div");
      s.className = "collectible-star";
      s.dataset.pos = p;
      s.textContent = (p % 1300 === 0) ? "🎈" : "⭐";
      s.style.bottom = (60 + (p % 70)) + "px";
      s.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        sndPop();
        floatScore(e.clientX, e.clientY, "+10 🌟");
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
        // Spontaneous smoke puffs while moving
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
    const trainBox = document.getElementById("drive-train-container");
    const trainX = trainBox.getBoundingClientRect().left || 200;
    const screenWidth = window.innerWidth;

    const items = layer.children;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const basePos = parseFloat(it.dataset.pos);
      // Hitung posisi relatif terhadap kereta
      let relX = (basePos - driveWorldOffset);
      if (relX < -400) relX += TOTAL_TRACK_LOOP;

      it.style.transform = `translateX(${relX}px)`;
      it.style.visibility = (relX > -300 && relX < screenWidth + 300) ? "visible" : "hidden";
    }
  }

  function checkTrackEvents() {
    const trainBox = document.getElementById("drive-train-container");
    const trainRect = trainBox.getBoundingClientRect();
    const trainFrontX = trainRect.right;

    let inTunnel = false;
    let nearJpl = false;
    let stationInFocus = null;

    const layer = document.getElementById("drive-scenery");
    const items = layer.querySelectorAll(".scenery-item");

    items.forEach(it => {
      const type = it.dataset.type;
      const basePos = parseFloat(it.dataset.pos);
      let relX = (basePos - driveWorldOffset);
      if (relX < -400) relX += TOTAL_TRACK_LOOP;

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
          const data = TRACK_ITEMS[parseInt(it.dataset.idx, 10)];
          stationInFocus = data;
        }
      }
    });

    // Update JPL Indikator
    const jplBanner = document.getElementById("jpl-sign-indicator");
    if (nearJpl) {
      jplBanner.classList.remove("hidden");
    } else {
      jplBanner.classList.add("hidden");
    }

    // Update Terowongan & Lampu Otomatis
    const tunnelOverlay = document.getElementById("drive-tunnel-overlay");
    if (inTunnel) {
      tunnelOverlay.classList.remove("hidden");
      // Lampu otomatis menyala terang di terowongan
      document.getElementById("drive-train-container").classList.add("headlight-active");
    } else {
      tunnelOverlay.classList.add("hidden");
      if (!driveHeadlight) {
        document.getElementById("drive-train-container").classList.remove("headlight-active");
      }
    }

    // Update Stasiun & Penumpang
    const stBanner = document.getElementById("station-arrival-banner");
    if (stationInFocus && driveSpeed === 0) {
      currentStationAtPlatform = stationInFocus;
      document.getElementById("station-name-text").textContent = "Tiba di " + stationInFocus.name + "!";
      stBanner.classList.remove("hidden");
      document.getElementById("drive-next-station").textContent = stationInFocus.name;
    } else {
      stBanner.classList.add("hidden");
    }
  }

  function updateSpeedometer() {
    document.getElementById("drive-speed-display").textContent = Math.round(driveCurrentKm);
    const train = document.getElementById("drive-train-container");
    if (driveSpeed > 0) {
      train.classList.add("bouncing");
      train.classList.add("spinning");
    } else {
      train.classList.remove("bouncing");
      train.classList.remove("spinning");
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
      driveSpeed = 2.2;
      driveCurrentKm = driveMaxKm * 0.28;
      sndTap();
    } else if (val === 2) {
      driveSpeed = 4.8;
      driveCurrentKm = driveMaxKm * 0.65;
      sndTap();
    } else {
      driveSpeed = 8.2;
      driveCurrentKm = driveMaxKm;
      sndGood();
    }
    updateSpeedometer();
  });

  // Tombol Klakson Raksasa Semboyan 35
  const btnHorn = document.getElementById("btn-horn-kai");
  btnHorn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    initAudio();
    soundLocoHorn();
    floatScore(e.clientX, e.clientY, "📢 TOOOOOT!");
  });

  // Tombol Lampu Depan
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
      speak("Perhatian, Kereta Api Argo Bromo Anggrek akan melintas langsung.");
    }, 1100);
  });

  // Tombol Ganti Waktu (Siang / Sore / Malam)
  document.getElementById("btn-env-time").addEventListener("click", function () {
    initAudio();
    sndTap();
    const world = document.getElementById("drive-world");
    if (driveTimeMode === "day") {
      driveTimeMode = "sunset";
      this.textContent = "🌅";
      world.className = "drive-world time-sunset";
    } else if (driveTimeMode === "sunset") {
      driveTimeMode = "night";
      this.textContent = "🌙";
      world.className = "drive-world time-night";
    } else {
      driveTimeMode = "day";
      this.textContent = "☀️";
      world.className = "drive-world time-day";
    }
  });

  // Tombol Naikkan Penumpang di Stasiun
  document.getElementById("btn-board-passengers").addEventListener("click", () => {
    initAudio();
    sndWin();
    drivePassengers += 3;
    document.getElementById("drive-passengers-count").textContent = drivePassengers;
    document.getElementById("station-arrival-banner").classList.add("hidden");
    speak("Hore! Tiga penumpang lucu naik ke dalam kereta!");
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

  // GAME 1: SUSUN GERBONG
  let susunScore = 0;
  function startSusun() {
    show("game-susun");
    susunScore = 0;
    document.getElementById("susun-score").textContent = "0";
    document.getElementById("susun-win").classList.add("hidden");
    const track = document.getElementById("susun-track");
    const yard = document.getElementById("susun-yard");
    track.innerHTML = ""; yard.innerHTML = "";

    const loco = document.createElement("div");
    loco.className = "locomo";
    loco.innerHTML = '<div class="chimney"></div><div class="smoke"></div><div class="cabin"></div><div class="wheel w1"></div><div class="wheel w2"></div>';
    track.appendChild(loco);

    const count = 4;
    const chosen = COLORS.slice(0, count);
    for (let i = 0; i < count; i++) {
      const slot = document.createElement("div");
      slot.className = "gerbong-slot";
      slot.dataset.drop = "1";
      track.appendChild(slot);
    }
    const shuffled = chosen.slice().sort(() => Math.random() - 0.5);
    shuffled.forEach(color => {
      const t = trainEl(color);
      t.dataset.color = color;
      makeDraggable(t, (drop, el) => {
        if (drop && drop.dataset.drop && !drop.classList.contains("filled")) {
          drop.classList.add("filled");
          drop.appendChild(el);
          el.style.position = "static";
          el.style.cursor = "default";
          el.style.pointerEvents = "none";
          el.style.width = "84px"; el.style.height = "72px";
          susunScore++;
          document.getElementById("susun-score").textContent = susunScore;
          sndGood();
          if (susunScore === count) {
            sndWin();
            setTimeout(() => document.getElementById("susun-win").classList.remove("hidden"), 400);
          }
        }
      });
      yard.appendChild(t);
    });
  }

  // GAME 2: TANGKAP KERETA
  const EMOJIS = ["🚂", "🚃", "🚄", "🚅", "🚆", "🚈"];
  let tangkapScore = 0, tangkapTimer = null, tangkapSpawn = null, tangkapTimeLeft = 0;
  function startTangkap() {
    show("game-tangkap");
    tangkapScore = 0;
    document.getElementById("tangkap-score").textContent = "0";
    document.getElementById("tangkap-win").classList.add("hidden");
    const stage = document.getElementById("tangkap-stage");
    stage.innerHTML = "";
    const TOTAL = 30;
    tangkapTimeLeft = TOTAL;
    const fill = document.getElementById("tangkap-timer");
    fill.style.width = "100%";

    function spawn() {
      const m = document.createElement("div");
      m.className = "mover";
      m.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      m.style.top = (10 + Math.random() * 60) + "%";
      m.style.left = "-70px";
      stage.appendChild(m);
      const dur = 1800 + Math.random() * 1400;
      const start = performance.now();
      const W = stage.clientWidth;
      function step(now) {
        const p = (now - start) / dur;
        if (p >= 1) { m.remove(); return; }
        m.style.left = (-70 + p * (W + 90)) + "px";
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      m.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        if (!m.dataset.caught) {
          m.dataset.caught = "1";
          tangkapScore++;
          document.getElementById("tangkap-score").textContent = tangkapScore;
          sndTap();
          floatScore(e.clientX, e.clientY, "🎯");
          m.style.transform = "translateY(-50%) scale(1.4)";
          m.style.opacity = "0";
          setTimeout(() => m.remove(), 150);
        }
      });
    }
    clearInterval(tangkapSpawn);
    tangkapSpawn = setInterval(spawn, 850);
    spawn();

    clearInterval(tangkapTimer);
    tangkapTimer = setInterval(() => {
      tangkapTimeLeft--;
      fill.style.width = (tangkapTimeLeft / TOTAL * 100) + "%";
      if (tangkapTimeLeft <= 0) endTangkap();
    }, 1000);
  }
  function endTangkap() {
    clearInterval(tangkapSpawn);
    clearInterval(tangkapTimer);
    document.getElementById("tangkap-final").textContent = tangkapScore;
    sndWin();
    document.getElementById("tangkap-win").classList.remove("hidden");
  }

  // GAME 3: COCOK WARNA
  const STATIONS = [
    { name: "Merah", color: "#e23b2e" },
    { name: "Biru", color: "#2e8be2" },
    { name: "Hijau", color: "#2eb85c" },
    { name: "Kuning", color: "#f0a500" }
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

    STATIONS.forEach(st => {
      const s = document.createElement("div");
      s.className = "station";
      s.style.background = "linear-gradient(" + st.color + "," + shade(st.color, -25) + ")";
      s.dataset.drop = "1";
      s.dataset.color = st.color;
      s.innerHTML = '<div class="roof"></div>' + st.name;
      stationsEl.appendChild(s);
    });

    const shuffled = STATIONS.slice().sort(() => Math.random() - 0.5);
    shuffled.forEach(st => {
      const t = trainEl(st.color);
      t.dataset.color = st.color;
      makeDraggable(t, (drop, el) => {
        if (drop && drop.dataset.drop && !drop.classList.contains("filled") && drop.dataset.color === el.dataset.color) {
          drop.classList.add("filled");
          drop.appendChild(el);
          el.style.position = "static";
          el.style.margin = "0";
          el.style.cursor = "default";
          el.style.pointerEvents = "none";
          el.style.width = "40px"; el.style.height = "34px";
          el.querySelectorAll(".wheel").forEach(w => { w.style.width = "9px"; w.style.height = "9px"; });
          warnaScore++;
          document.getElementById("warna-score").textContent = warnaScore;
          sndGood();
          if (warnaScore === STATIONS.length) {
            sndWin();
            setTimeout(() => document.getElementById("warna-win").classList.remove("hidden"), 400);
          }
        }
      });
      yard.appendChild(t);
    });
  }

  // ====================================================
  // GAME 4: BELAJAR LENGKAP (HIJAIYAH, ANGKA 1-20, ABC A-Z)
  // DUAL MODE: KAMUS SUARA (SENTUH & DENGAR) + KUIS TEBAK
  // ====================================================
  const CARI = {
    angka: {
      title: "🔢 Belajar Angka 1 - 20",
      speechPrefix: "angka",
      rounds: 10,
      items: [
        { display: "1", sub: "Satu", speak: "angka satu" },
        { display: "2", sub: "Dua", speak: "angka dua" },
        { display: "3", sub: "Tiga", speak: "angka tiga" },
        { display: "4", sub: "Empat", speak: "angka empat" },
        { display: "5", sub: "Lima", speak: "angka lima" },
        { display: "6", sub: "Enam", speak: "angka enam" },
        { display: "7", sub: "Tujuh", speak: "angka tujuh" },
        { display: "8", sub: "Delapan", speak: "angka delapan" },
        { display: "9", sub: "Sembilan", speak: "angka sembilan" },
        { display: "10", sub: "Sepuluh", speak: "angka sepuluh" },
        { display: "11", sub: "Sebelas", speak: "angka sebelas" },
        { display: "12", sub: "Dua Belas", speak: "angka dua belas" },
        { display: "13", sub: "Tiga Belas", speak: "angka tiga belas" },
        { display: "14", sub: "Empat Belas", speak: "angka empat belas" },
        { display: "15", sub: "Lima Belas", speak: "angka lima belas" },
        { display: "16", sub: "Enam Belas", speak: "angka enam belas" },
        { display: "17", sub: "Tujuh Belas", speak: "angka tujuh belas" },
        { display: "18", sub: "Delapan Belas", speak: "angka delapan belas" },
        { display: "19", sub: "Sembilan Belas", speak: "angka sembilan belas" },
        { display: "20", sub: "Dua Puluh", speak: "angka dua puluh" }
      ].map((it, i) => ({ ...it, key: "n_" + i }))
    },
    abc: {
      title: "🔤 Huruf Alfabet A - Z Lengkap",
      speechPrefix: "huruf",
      rounds: 10,
      items: [
        { display: "A", sub: "Apel 🍎", speak: "huruf A, Apel" },
        { display: "B", sub: "Balon 🎈", speak: "huruf B, Balon" },
        { display: "C", sub: "Ceri 🍒", speak: "huruf C, Ceri" },
        { display: "D", sub: "Domba 🐑", speak: "huruf D, Domba" },
        { display: "E", sub: "Elang 🦅", speak: "huruf E, Elang" },
        { display: "F", sub: "Flamingo 🦩", speak: "huruf F, Flamingo" },
        { display: "G", sub: "Gajah 🐘", speak: "huruf G, Gajah" },
        { display: "H", sub: "Harimau 🐅", speak: "huruf H, Harimau" },
        { display: "I", sub: "Ikan 🐟", speak: "huruf I, Ikan" },
        { display: "J", sub: "Jerapah 🦒", speak: "huruf J, Jerapah" },
        { display: "K", sub: "Kereta 🚂", speak: "huruf K, Kereta Api!" },
        { display: "L", sub: "Lumba 🐬", speak: "huruf L, Lumba lumba" },
        { display: "M", sub: "Mobil 🚗", speak: "huruf M, Mobil" },
        { display: "N", sub: "Nanas 🍍", speak: "huruf N, Nanas" },
        { display: "O", sub: "Orangutan 🦧", speak: "huruf O, Orangutan" },
        { display: "P", sub: "Pesawat ✈️", speak: "huruf P, Pesawat" },
        { display: "Q", sub: "Quran 📖", speak: "huruf Q, Quran" },
        { display: "R", sub: "Rusa 🦌", speak: "huruf R, Rusa" },
        { display: "S", sub: "Singa 🦁", speak: "huruf S, Singa" },
        { display: "T", sub: "Tupai 🐿️", speak: "huruf T, Tupai" },
        { display: "U", sub: "Unta 🐪", speak: "huruf U, Unta" },
        { display: "V", sub: "Vas 🏺", speak: "huruf V, Vas bunga" },
        { display: "W", sub: "Wortel 🥕", speak: "huruf W, Wortel" },
        { display: "X", sub: "Xilofon 🎼", speak: "huruf X, Xilofon" },
        { display: "Y", sub: "Yoyo 🪀", speak: "huruf Y, Yoyo" },
        { display: "Z", sub: "Zebra 🦓", speak: "huruf Z, Zebra" }
      ].map((it, i) => ({ ...it, key: "abc_" + i }))
    },
    hijaiyah: {
      title: "🕌 Huruf Hijaiyah Lengkap (28 Huruf)",
      speechPrefix: "huruf",
      rounds: 10,
      isArabic: true,
      items: [
        { display: "ا", sub: "Alif", speak: "Alif" },
        { display: "ب", sub: "Ba", speak: "Ba" },
        { display: "ت", sub: "Ta", speak: "Ta" },
        { display: "ث", sub: "Tsa", speak: "Tsa" },
        { display: "ج", sub: "Jim", speak: "Jim" },
        { display: "ح", sub: "Ha", speak: "Ha" },
        { display: "خ", sub: "Kha", speak: "Kha" },
        { display: "د", sub: "Dal", speak: "Dal" },
        { display: "ذ", sub: "Dzal", speak: "Dzal" },
        { display: "ر", sub: "Ra", speak: "Ra" },
        { display: "ز", sub: "Zai", speak: "Zai" },
        { display: "س", sub: "Sin", speak: "Sin" },
        { display: "ش", sub: "Syin", speak: "Syin" },
        { display: "ص", sub: "Shad", speak: "Shad" },
        { display: "ض", sub: "Dhad", speak: "Dhad" },
        { display: "ط", sub: "Tha", speak: "Tha" },
        { display: "ظ", sub: "Zha", speak: "Zha" },
        { display: "ع", sub: "'Ain", speak: "Ain" },
        { display: "غ", sub: "Ghain", speak: "Ghain" },
        { display: "ف", sub: "Fa", speak: "Fa" },
        { display: "ق", sub: "Qaf", speak: "Qaf" },
        { display: "ك", sub: "Kaf", speak: "Kaf" },
        { display: "ل", sub: "Lam", speak: "Lam" },
        { display: "م", sub: "Mim", speak: "Mim" },
        { display: "ن", sub: "Nun", speak: "Nun" },
        { display: "و", sub: "Waw", speak: "Waw" },
        { display: "هـ", sub: "Ha'", speak: "Ha" },
        { display: "ي", sub: "Ya", speak: "Ya" }
      ].map((it, i) => ({ ...it, key: "hij_" + i }))
    }
  };

  let currentCariKey = "hijaiyah";
  let cariMode = "dict"; // 'dict' | 'quiz'
  let cariScore = 0;
  let cariTarget = null;

  function startCari(key) {
    currentCariKey = key;
    show("game-cari");
    document.getElementById("cari-title").textContent = CARI[key].title;
    document.getElementById("cari-win").classList.add("hidden");

    // Default ke mode Kamus Suara (Pencet & Dengar)
    setEduTabMode("dict");
    renderDictionaryGrid();
    speak("Ayo belajar " + (key === "hijaiyah" ? "huruf hijaiyah" : key === "angka" ? "angka" : "huruf alfabet") + "!");
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

  // Tab switcher
  document.getElementById("tab-learn").addEventListener("click", () => {
    initAudio();
    sndTap();
    setEduTabMode("dict");
  });
  document.getElementById("tab-quiz").addEventListener("click", () => {
    initAudio();
    sndTap();
    setEduTabMode("quiz");
  });
  document.getElementById("btn-back-to-dict").addEventListener("click", () => {
    document.getElementById("cari-win").classList.add("hidden");
    setEduTabMode("dict");
  });

  // Render Kamus Suara Lengkap
  function renderDictionaryGrid() {
    const cfg = CARI[currentCariKey];
    const container = document.getElementById("cari-full-grid");
    container.innerHTML = "";

    cfg.items.forEach((item, index) => {
      const card = document.createElement("div");
      const color = COLORS[index % COLORS.length];
      card.className = "dict-train-card" + (cfg.isArabic ? " is-hijaiyah" : "");
      card.style.background = `linear-gradient(180deg, ${color} 0%, ${shade(color, -22)} 100%)`;

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
        sndGood();
        card.classList.add("bouncing");
        setTimeout(() => card.classList.remove("bouncing"), 300);
        floatScore(e.clientX, e.clientY, "🌟");
        speak(item.speak);
      });

      container.appendChild(card);
    });
  }

  // Quiz Mode Logic
  function startQuizRound() {
    cariScore = 0;
    document.getElementById("cari-score").textContent = "0";
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

    picks.forEach(item => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const t = trainEl(color, false);
      t.classList.add("big");
      if (cfg.isArabic) t.classList.add("is-hijaiyah-train");

      const lab = document.createElement("div");
      lab.className = "tlabel";
      lab.textContent = item.display;
      if (item.sub) {
        const s = document.createElement("div");
        s.className = "tsub";
        s.textContent = item.sub;
        lab.appendChild(s);
      }
      t.appendChild(lab);

      t.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        initAudio();
        if (item.key === cariTarget.key) {
          sndGood();
          cariScore++;
          document.getElementById("cari-score").textContent = cariScore;
          floatScore(e.clientX, e.clientY, "⭐ Hebat!");

          if (cariScore >= cfg.rounds) {
            document.getElementById("cari-final").textContent = cariScore;
            sndWin();
            setTimeout(() => document.getElementById("cari-win").classList.remove("hidden"), 400);
          } else {
            setTimeout(nextQuizQuestion, 600);
          }
        } else {
          sndWrong();
          t.classList.add("shake");
          setTimeout(() => t.classList.remove("shake"), 400);
          speak("Coba lagi, cari " + cariTarget.speak);
        }
      });
      grid.appendChild(t);
    });

    // Ucapkan pertanyaan
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

  // Mulai di layar depan
  show("home");
})();

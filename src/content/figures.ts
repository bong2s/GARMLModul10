// Small inline SVG illustrations for the Modul 10 lessons.
// Static, author-written markup (no user input). Colours come from CSS classes in style.css
// (.f-box, .f-hot, .f-txt, .f-dim, .f-line) so the figures follow the panel accent colour.

const wrap = (w: number, h: number, body: string, label: string): string =>
  `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">` +
  `<defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="f-arrow"/></marker></defs>${body}</svg>`;

const box = (x: number, y: number, w: number, h: number, text: string, hot = false, sub = ""): string =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="${hot ? "f-hot" : "f-box"}"/>` +
  `<text x="${x + w / 2}" y="${y + h / 2 + (sub ? -2 : 5)}" text-anchor="middle" class="f-txt">${text}</text>` +
  (sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 13}" text-anchor="middle" class="f-dim">${sub}</text>` : "");

const arrow = (x1: number, y1: number, x2: number, y2: number): string =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="f-line" marker-end="url(#arr)"/>`;

const label = (x: number, y: number, text: string, anchor = "middle"): string =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" class="f-dim">${text}</text>`;


const dashedBox = (x: number, y: number, w: number, h: number, text: string, sub = ""): string =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="f-box" stroke-dasharray="5 4"/>` +
  `<text x="${x + w / 2}" y="${y + h / 2 + (sub ? -2 : 5)}" text-anchor="middle" class="f-txt">${text}</text>` +
  (sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 13}" text-anchor="middle" class="f-dim">${sub}</text>` : "");

const biArrow = (x1: number, y1: number, x2: number, y2: number): string =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="f-line" marker-start="url(#arr)" marker-end="url(#arr)"/>`;

/** 1 — scalar versus superscalar issue. */
export const FIG_SUPERSCALAR = wrap(
  360,
  176,
  label(10, 14, "Skalar: maksimal 1 instruksi per clock", "start") +
    box(10, 22, 100, 28, "I1") +
    box(130, 22, 100, 28, "I2") +
    box(250, 22, 100, 28, "I3") +
    label(10, 80, "Superskalar: beberapa instruksi per clock", "start") +
    box(10, 88, 100, 24, "I1", true) +
    box(10, 116, 100, 24, "I2", true) +
    box(130, 88, 100, 24, "I3", true) +
    box(130, 116, 100, 24, "I4", true) +
    box(250, 88, 100, 24, "I5", true) +
    box(250, 116, 100, 24, "I6", true) +
    label(60, 160, "clock 1") +
    label(180, 160, "clock 2") +
    label(300, 160, "clock 3"),
  "Perbandingan prosesor skalar dan superskalar: superskalar menyelesaikan beberapa instruksi dalam satu clock"
);

/** 3 — inputs and outputs of the control unit. */
export const FIG_CONTROL_UNIT = wrap(
  360,
  150,
  box(8, 10, 90, 30, "IR", false, "opcode") +
    box(8, 60, 90, 30, "Clock", false, "pengatur tempo") +
    box(8, 110, 90, 30, "Flag ALU", false, "status hasil") +
    box(132, 38, 96, 70, "Unit Kontrol", true) +
    arrow(98, 25, 130, 62) +
    arrow(98, 75, 130, 73) +
    arrow(98, 125, 130, 90) +
    box(262, 18, 90, 40, "Sinyal internal", false, "register, ALU") +
    box(262, 90, 90, 40, "Control bus", false, "Read / Write") +
    arrow(228, 60, 260, 40) +
    arrow(228, 88, 260, 108),
  "Unit kontrol menerima IR, clock, dan flag, lalu mengeluarkan sinyal internal dan sinyal control bus"
);

/** 4 — execution hierarchy down to the micro-operation. */
export const FIG_MICRO_LEVELS = wrap(
  360,
  180,
  box(70, 6, 220, 28, "Program") +
    box(70, 50, 220, 28, "Instruksi mesin") +
    box(70, 94, 220, 28, "Siklus", false, "") +
    label(180, 116, "Fetch · Indirect · Execute · Interrupt") +
    box(70, 138, 220, 34, "Operasi mikro", true, "atomik: tepat 1 siklus clock") +
    arrow(180, 34, 180, 48) +
    arrow(180, 78, 180, 92) +
    arrow(180, 122, 180, 136),
  "Hierarki eksekusi: program, instruksi mesin, siklus, dan operasi mikro"
);

/** 6 — hardwired control unit. */
export const FIG_HARDWIRED = wrap(
  360,
  196,
  box(8, 8, 80, 30, "Clock") +
    box(112, 8, 100, 30, "Step counter") +
    box(236, 8, 116, 30, "Timing decoder", false, "T1, T2, T3 …") +
    arrow(88, 23, 110, 23) +
    arrow(212, 23, 234, 23) +
    box(8, 96, 80, 30, "IR") +
    box(112, 96, 100, 30, "Instr. decoder") +
    arrow(88, 111, 110, 111) +
    box(236, 80, 116, 62, "Logika kontrol", true, "AND-OR / PLA") +
    arrow(212, 111, 234, 111) +
    arrow(294, 38, 294, 78) +
    box(112, 150, 100, 30, "Flag ALU") +
    arrow(212, 160, 250, 144) +
    box(236, 156, 116, 30, "Sinyal kontrol") +
    arrow(294, 142, 294, 154),
  "Diagram blok hardwired control unit: clock, step counter, timing decoder, IR, decoder instruksi, flag, dan logika kontrol"
);

/** 7 — microprogrammed control unit. */
export const FIG_MICROPROGRAMMED = wrap(
  360,
  196,
  box(8, 8, 62, 30, "IR") +
    box(90, 8, 100, 30, "Mapping logic") +
    box(236, 8, 116, 30, "CAR", true, "") +
    arrow(70, 23, 88, 23) +
    arrow(190, 23, 234, 23) +
    box(236, 70, 116, 34, "Control Memory", false, "mikroprogram") +
    arrow(294, 38, 294, 68) +
    box(236, 130, 116, 30, "CDR", false, "") +
    arrow(294, 104, 294, 128) +
    box(90, 70, 100, 34, "Sequencer", false, "alamat berikut") +
    box(8, 70, 62, 34, "Flag") +
    arrow(70, 87, 88, 87) +
    arrow(190, 80, 234, 36) +
    arrow(236, 150, 150, 106) +
    label(294, 178, "sinyal kontrol → ALU, register, bus, memori"),
  "Diagram microprogrammed control unit: IR, mapping logic, CAR, control memory, CDR, dan sequencer"
);

/** 9 — fields of a microinstruction. */
export const FIG_MICROINSTRUCTION = wrap(
  360,
  92,
  box(6, 10, 82, 46, "Kontrol", true, "ALU, reg, R/W") +
    box(96, 10, 82, 46, "Kondisi", false, "flag diuji") +
    box(186, 10, 82, 46, "Cabang", false, "alamat tujuan") +
    box(276, 10, 78, 46, "Urutan", false, "lanjut/lompat") +
    label(180, 78, "Satu mikroinstruksi = satu kata di control memory"),
  "Field mikroinstruksi: kontrol, kondisi, alamat cabang, dan urutan"
);

/** 8 — TI 8800 building blocks. */
export const FIG_TI8800 = wrap(
  360,
  206,
  dashedBox(128, 8, 104, 34, "Host", "tulis & debug") +
    box(8, 66, 104, 40, "Microsequencer", false, "SN74ACT8818") +
    box(128, 66, 104, 40, "Microcode mem.", true, "RAM (writable)") +
    box(248, 66, 104, 40, "Pipeline reg.", false, "mikroinstruksi aktif") +
    arrow(180, 42, 180, 64) +
    arrow(112, 86, 126, 86) +
    arrow(232, 86, 246, 86) +
    box(8, 150, 104, 44, "Memori utama", false, "macro memory") +
    box(128, 150, 104, 44, "ALU 32 bit", false, "SN74ACT8832") +
    box(248, 150, 104, 44, "FPU", false, "SN74ACT8847") +
    arrow(280, 106, 190, 148) +
    arrow(300, 106, 300, 148) +
    biArrow(112, 172, 126, 172),
  "Blok bangun TI 8800: host, microsequencer, microcode memory, pipeline register, ALU 32 bit, FPU, dan memori utama"
);

/** 10 — SMP versus AMP. */
export const FIG_SMP_AMP = wrap(
  360,
  190,
  label(10, 14, "SMP: prosesor setara, berbagi memori utama", "start") +
    box(10, 22, 100, 28, "Prosesor 1") +
    box(130, 22, 100, 28, "Prosesor 2") +
    box(250, 22, 100, 28, "Prosesor 3") +
    arrow(60, 50, 60, 76) +
    arrow(180, 50, 180, 76) +
    arrow(300, 50, 300, 76) +
    box(10, 78, 340, 28, "Memori utama (bersama)", true) +
    label(10, 132, "AMP: pembagian tugas dan tanggung jawab berbeda", "start") +
    box(10, 140, 165, 40, "Prosesor A", false, "tugas jenis X") +
    box(185, 140, 165, 40, "Prosesor B", false, "tugas jenis Y"),
  "SMP: banyak prosesor setara berbagi memori. AMP: prosesor dengan tugas berbeda"
);

/** 11 — two cores with private caches and one main memory. */
export const FIG_COHERENCE = wrap(
  360,
  156,
  box(10, 8, 90, 28, "Core 1") +
    box(10, 54, 90, 34, "Cache 1", true, "salinan data") +
    arrow(55, 36, 55, 52) +
    box(260, 8, 90, 28, "Core 2") +
    box(260, 54, 90, 34, "Cache 2", true, "salinan data") +
    arrow(305, 36, 305, 52) +
    biArrow(102, 71, 258, 71) +
    label(180, 64, "pantau perubahan") +
    box(110, 116, 140, 30, "Main Memory (RAM)") +
    arrow(55, 88, 110, 126) +
    arrow(305, 88, 250, 126),
  "Dua core dengan cache masing-masing dan satu memori utama; perubahan di satu cache harus diketahui cache lain"
);

/** 12 — the four MESI states. */
export const FIG_MESI = wrap(
  360,
  146,
  box(8, 8, 168, 54, "M · Modified", true, "diubah, beda dari RAM") +
    box(184, 8, 168, 54, "E · Exclusive", false, "satu cache, sama dengan RAM") +
    box(8, 76, 168, 54, "S · Shared", false, "banyak cache, sama dengan RAM") +
    box(184, 76, 168, 54, "I · Invalid", false, "tidak boleh dipakai"),
  "Empat status protokol MESI: Modified, Exclusive, Shared, dan Invalid"
);

/** 13 — one vector instruction over four elements. */
export const FIG_VECTOR = (() => {
  const xs = [58, 128, 198, 268];
  const row = (y: number, name: string, prefix: string, hot = false): string =>
    label(10, y + 17, name, "start") + xs.map((x, i) => box(x, y, 64, 26, `${prefix}${i + 1}`, hot)).join("");
  return wrap(
    360,
    164,
    row(8, "V1", "a") +
      row(42, "V2", "b") +
      box(58, 78, 274, 28, "1 instruksi ADD → 4 penjumlahan sekaligus", true) +
      arrow(195, 68, 195, 76) +
      arrow(195, 106, 195, 118) +
      row(122, "V3", "c"),
    "Satu instruksi vektor memproses empat elemen data sekaligus; V1, V2, V3 adalah register vektor ilustrasi"
  );
})();

/** 14 — split, run in parallel, combine. */
export const FIG_PARALLEL = wrap(
  360,
  176,
  box(125, 6, 110, 28, "Tugas") +
    box(10, 68, 100, 32, "Prosesor 1", true) +
    box(130, 68, 100, 32, "Prosesor 2", true) +
    box(250, 68, 100, 32, "Prosesor 3", true) +
    arrow(150, 34, 60, 66) +
    arrow(180, 34, 180, 66) +
    arrow(210, 34, 300, 66) +
    label(180, 56, "dibagi") +
    box(115, 138, 130, 30, "Hasil akhir", true) +
    arrow(60, 100, 150, 136) +
    arrow(180, 100, 180, 136) +
    arrow(300, 100, 210, 136) +
    label(180, 124, "digabung"),
  "Tugas dibagi ke beberapa prosesor, dikerjakan bersamaan, lalu hasilnya digabung"
);

/** Circuit board — control and data paths towards memory and I/O (supporting context). */
export const FIG_BOARD_PATHS = wrap(
  360,
  150,
  `<rect x="2" y="2" width="356" height="146" rx="10" class="f-box" stroke-dasharray="6 4"/>` +
    label(180, 18, "Papan sirkuit (jalur tembaga + soket)") +
    box(14, 34, 84, 100, "CPU", true, "unit kontrol") +
    box(262, 34, 84, 44, "RAM") +
    box(262, 90, 84, 44, "Perangkat I/O") +
    label(180, 48, "Read / Write") +
    arrow(100, 54, 260, 54) +
    biArrow(100, 70, 260, 70) +
    label(180, 86, "data") +
    arrow(100, 112, 260, 112) +
    label(180, 128, "Read / Write"),
  "CPU mengirim sinyal kontrol dan bertukar data dengan RAM dan perangkat I/O melalui jalur pada papan sirkuit"
);

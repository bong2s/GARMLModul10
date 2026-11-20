// Learning content for Modul 10 (Prosesor Lanjut dan Organisasi Paralel).
// Source: Makalah_Final_Kelompok_10.pdf (Bab II, subbab 1–14 dan hasil tanya jawab).
//
// Topics, in the order of the source document:
//   1. Prosesor Superskalar      6. Hardwired               11. Cache Coherence
//   2. PowerPC dan Pentium       7. Kontrol Terprogram      12. MESI
//   3. Unit Kontrol              8. TI 8800                 13. Komputasi Vektor
//   4. Operasi Mikro             9. Pemrograman Mikro       14. Prosesor Paralel
//   5. Kontrol CPU              10. Multiprocessing

import {
  FIG_BOARD_PATHS,
  FIG_COHERENCE,
  FIG_CONTROL_UNIT,
  FIG_HARDWIRED,
  FIG_MESI,
  FIG_MICRO_LEVELS,
  FIG_MICROINSTRUCTION,
  FIG_MICROPROGRAMMED,
  FIG_PARALLEL,
  FIG_SMP_AMP,
  FIG_SUPERSCALAR,
  FIG_TI8800,
  FIG_VECTOR,
} from "./figures";

export type LessonBlock =
  | { kind: "heading"; text: string }
  | { kind: "text"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "formula"; text: string }
  | { kind: "example"; lines: string[] }
  | { kind: "note"; text: string }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "figure"; svg: string; caption: string };

export interface LessonTopic {
  id: string;
  title: string;
  short: string;
  /** Supporting panel for a model (not one of the fourteen numbered topics). */
  context?: boolean;
  blocks: LessonBlock[];
}

export const MODULE_TOPICS: LessonTopic[] = [
  // ------------------------------------------------------------------ 1
  {
    id: "superscalar",
    title: "Prosesor Superskalar",
    short: "Banyak instruksi dalam satu siklus clock",
    blocks: [
      { kind: "heading", text: "Konsep dasar" },
      {
        kind: "text",
        text: "Prosesor superskalar mengambil (fetch), menerjemahkan (decode), dan mengeksekusi lebih dari satu instruksi secara paralel dalam satu siklus clock. Prosesor skalar biasa hanya menyelesaikan maksimal satu instruksi per siklus.",
      },
      {
        kind: "text",
        text: "Caranya dengan menyediakan beberapa unit eksekusi. Tujuannya memaksimalkan Instruction-Level Parallelism (ILP) tanpa menaikkan kecepatan clock secara ekstrem.",
      },
      { kind: "figure", svg: FIG_SUPERSCALAR, caption: "Ilustrasi: skalar vs superskalar (contoh 2 instruksi per clock)" },
      { kind: "heading", text: "Tiga hambatan (pipeline hazards)" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Ketergantungan data: instruksi harus menunggu hasil instruksi sebelumnya.",
          "Ketergantungan percabangan: pada if-else, CPU harus menebak jalur instruksi berikutnya.",
          "Konflik sumber daya: dua instruksi atau lebih berebut unit eksekusi (ALU, FPU) yang jumlahnya terbatas.",
        ],
      },
      { kind: "heading", text: "Tiga solusi" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Out-of-Order Execution (OoO): menjalankan instruksi berikutnya yang datanya sudah siap tanpa menunggu instruksi yang terhambat.",
          "Register Renaming: menyediakan register cadangan agar tidak terjadi penimpaan data (WAR/WAW).",
          "Branch Prediction: memprediksi jalur percabangan lebih awal agar proses tidak menganggur (stall).",
        ],
      },
      { kind: "heading", text: "Konflik WAR dan WAW" },
      {
        kind: "text",
        text: "Keduanya bukan ketergantungan data asli. Dua instruksi kebetulan memakai nama register yang sama padahal datanya tidak berhubungan (name dependency), sehingga bisa dihilangkan dengan register renaming.",
      },
      {
        kind: "example",
        lines: [
          "WAW (Write After Write)",
          "  I1: R1 = R2 + R3",
          "  I2: R1 = R4 + R5",
          "  Bila I1 selesai belakangan, R1 berisi hasil I1.",
          "  Seharusnya hasil akhir R1 milik I2.",
          "",
          "WAR (Write After Read)",
          "  I1: R4 = R1 + R2   (membaca R1)",
          "  I2: R1 = R5 + R6   (menulis R1)",
          "  Bila I2 jalan lebih dulu dan menimpa R1,",
          "  I1 membaca nilai R1 yang sudah berubah.",
        ],
      },
      { kind: "heading", text: "Batas instruksi per clock" },
      {
        kind: "text",
        text: "Jumlah maksimal dibatasi desain perangkat keras (issue width), yaitu jumlah unit eksekusi, serta kondisi program: ketergantungan data dan percabangan. Pada Intel Pentium yang hanya punya dua jalur pipeline (U-Pipe dan V-Pipe), batasnya 2 instruksi per siklus. Pada prosesor modern umumnya 2 sampai 8.",
      },
      {
        kind: "text",
        text: "Bila tidak ada instruksi independen, sistem tidak rusak. Prosesor menjalankan instruksi berurutan, menahan antrean (pipeline stall), atau mencari instruksi lain lewat OoO. Dampaknya hanya kecepatan turun sementara.",
      },
      {
        kind: "note",
        text: "Pada model 3D: CPU tampil sebagai satu kemasan chip. Unit eksekusi, pipeline, dan register di dalamnya tidak terlihat pada model, jadi konsep di atas bersifat konseptual.",
      },
    ],
  },
  // ------------------------------------------------------------------ 2
  {
    id: "powerpc-pentium",
    title: "PowerPC dan Pentium",
    short: "RISC vs CISC pada prosesor superskalar 1990-an",
    blocks: [
      { kind: "heading", text: "Dua pionir superskalar" },
      {
        kind: "text",
        text: "PowerPC dan Intel Pentium mendominasi era 1990-an dengan filosofi yang bertolak belakang. PowerPC dikembangkan aliansi Apple, IBM, dan Motorola (kubu RISC). Pentium mewakili kubu CISC dan mempertahankan kompatibilitas dengan perangkat lunak x86.",
      },
      {
        kind: "table",
        head: ["Aspek", "PowerPC (RISC)", "Pentium (CISC)"],
        rows: [
          ["Fokus", "Sederhana dan cepat", "Kompatibel dengan x86"],
          ["Panjang instruksi", "Tetap, 32 bit", "Bervariasi, 1–15 byte"],
          ["Decode", "Mudah, bisa paralel", "Jauh lebih kompleks"],
          ["Unit eksekusi", "IU, FPU, BPU", "Dual pipeline: U-Pipe dan V-Pipe"],
          ["Unit kontrol", "Hardwired murni", "Internal diterjemahkan ke micro-ops (Pentium Pro ke atas)"],
        ],
      },
      { kind: "heading", text: "PowerPC" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Instruksi seragam 32 bit, mudah diambil dan diterjemahkan paralel.",
          "32 General-Purpose Registers dan 32 Floating-Point Registers untuk mengurangi akses berulang ke RAM.",
          "Integer Unit (IU), Floating-Point Unit (FPU), dan Branch Processing Unit (BPU). BPU menangani percabangan lebih awal (branch folding).",
        ],
      },
      { kind: "heading", text: "Intel Pentium" },
      {
        kind: "list",
        ordered: false,
        items: [
          "U-Pipe menjalankan semua jenis instruksi integer x86.",
          "V-Pipe hanya menjalankan instruksi integer sederhana, menurut aturan pemasangan (instruction pairing) yang ketat.",
          "Mulai Pentium Pro, instruksi CISC x86 diterjemahkan menjadi micro-ops bergaya RISC di dalam chip agar bisa dieksekusi Out-of-Order.",
        ],
      },
      {
        kind: "note",
        text: "Pada model 3D: model CPU adalah chip generik. Ia tidak mereplika PowerPC maupun Pentium, hanya mewakili CPU tempat arsitektur seperti itu berjalan.",
      },
    ],
  },
  // ------------------------------------------------------------------ 3
  {
    id: "control-unit",
    title: "Unit Kontrol",
    short: "Pengarah seluruh operasi prosesor",
    blocks: [
      { kind: "heading", text: "Peran" },
      {
        kind: "text",
        text: "Unit kontrol adalah bagian utama CPU yang mengarahkan seluruh operasi prosesor dengan mengirim sinyal kontrol ke ALU, register, dan memori.",
      },
      {
        kind: "list",
        ordered: false,
        items: [
          "Mengambil (fetch) dan menerjemahkan (decode) instruksi dari memori.",
          "Mengatur waktu (timing) perpindahan data antar-register.",
          "Menentukan urutan eksekusi operasi mikro.",
        ],
      },
      { kind: "figure", svg: FIG_CONTROL_UNIT, caption: "Masukan dan keluaran unit kontrol" },
      { kind: "heading", text: "Masukan (input)" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Instruction Register (IR): kode instruksi yang sedang dijalankan.",
          "System Clock: detak pengatur tempo kerja.",
          "Flag/status ALU: kondisi hasil sebelumnya, misalnya nol, negatif, atau overflow.",
        ],
      },
      { kind: "heading", text: "Keluaran (output)" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Sinyal internal CPU: mengatur perpindahan data antar-register dan memerintahkan fungsi ALU (jumlah, kurang, geser bit).",
          "Sinyal eksternal (Control Bus): perintah baca (Read) atau tulis (Write) ke RAM dan perangkat I/O.",
        ],
      },
      {
        kind: "note",
        text: "Pada model 3D: unit kontrol berada di dalam chip CPU dan tidak terlihat sebagai komponen tersendiri. Sinyal kontrol adalah sinyal listrik, bukan bagian yang bisa ditunjuk.",
      },
    ],
  },
  // ------------------------------------------------------------------ 4
  {
    id: "micro-operations",
    title: "Operasi Mikro",
    short: "Operasi dasar atomik pada register CPU",
    blocks: [
      { kind: "heading", text: "Definisi" },
      {
        kind: "text",
        text: "Operasi mikro adalah operasi dasar tingkat rendah yang dilakukan langsung pada data di register CPU. Sifatnya atomik: satu operasi mikro selalu selesai dalam tepat satu siklus clock.",
      },
      { kind: "figure", svg: FIG_MICRO_LEVELS, caption: "Hierarki eksekusi: dari program sampai operasi mikro" },
      {
        kind: "text",
        text: "Program tersusun atas instruksi mesin. Setiap instruksi dipecah menjadi beberapa siklus (Fetch, Indirect, Execute, Interrupt), dan setiap siklus dijalankan lewat serangkaian operasi mikro.",
      },
      { kind: "heading", text: "Empat kategori" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Transfer register: memindahkan data biner antar-register tanpa mengubah nilainya.",
          "Aritmatika: penjumlahan, pengurangan, increment, decrement.",
          "Logika: AND, OR, NOT, XOR pada isi register.",
          "Pergeseran (shift): geser bit ke kiri (Shift Left) atau kanan (Shift Right).",
        ],
      },
      { kind: "formula", text: "R2 ← R1   (transfer register)" },
      {
        kind: "note",
        text: "Pada model 3D: register tempat operasi mikro bekerja berada di dalam chip CPU dan tidak tampak pada model.",
      },
    ],
  },
  // ------------------------------------------------------------------ 5
  {
    id: "cpu-control",
    title: "Kontrol CPU",
    short: "Mekanisme sinyal kontrol internal dan eksternal",
    blocks: [
      { kind: "heading", text: "Mengapa perlu dikontrol" },
      {
        kind: "text",
        text: "Di dalam CPU ada banyak jalur data (bus) yang menghubungkan register dan ALU. Aliran data harus diatur ketat agar tidak bertabrakan. Unit kontrol berperan seperti sakelar pembuka dan penutup gerbang pada setiap detak clock, sehingga hanya satu aliran data yang lewat pada satu waktu.",
      },
      { kind: "heading", text: "Sinyal kontrol internal CPU" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Transfer register: membuka gerbang keluar register sumber dan gerbang masuk register tujuan.",
          "Operasi ALU: mengirim data ke ALU dan memilih operasi matematika atau logika yang dijalankan.",
        ],
      },
      { kind: "heading", text: "Sinyal kontrol eksternal (system bus)" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Kontrol memori: sinyal Memory Read atau Memory Write ke RAM.",
          "Kontrol I/O: perintah I/O Read atau I/O Write untuk perangkat eksternal.",
        ],
      },
      {
        kind: "note",
        text: "Pada model 3D: CPU adalah sumber sinyal kontrol. Jalur sinyal ke RAM dan I/O ada pada papan sirkuit (lihat tab Papan Sirkuit).",
      },
    ],
  },
  // ------------------------------------------------------------------ 6
  {
    id: "hardwired",
    title: "Hardwired",
    short: "Unit kendali dengan logika digital permanen",
    blocks: [
      { kind: "heading", text: "Konsep" },
      {
        kind: "text",
        text: "Hardwired Control Unit (HCU) menghasilkan sinyal kontrol dengan rangkaian logika digital yang terpasang permanen: gerbang logika, flip-flop, decoder, dan counter. Mengubah perilakunya berarti mendesain ulang rangkaian.",
      },
      { kind: "figure", svg: FIG_HARDWIRED, caption: "Diagram blok hardwired control unit (disederhanakan)" },
      { kind: "heading", text: "Komponen utama" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Instruction Register (IR): menyimpan instruksi, opcode menjadi masukan utama.",
          "Instruction Decoder: mengubah opcode menjadi sinyal instruksi (ADD, LOAD, JUMP, ...).",
          "Step/Sequence Counter: menandai langkah waktu T1, T2, T3, ...",
          "Timing Decoder: mengubah nilai counter menjadi sinyal waktu individual.",
          "Flag/Status Register: Zero, Carry, Negative, Overflow, untuk percabangan bersyarat.",
          "Control Logic Circuit (AND-OR / PLA): inti HCU yang menggabungkan instruksi, waktu, dan flag.",
          "Clock: pemberi ritme yang menggerakkan step counter.",
        ],
      },
      { kind: "heading", text: "Cara kerja" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Clock berdetak, step counter bertambah, sinyal T1, T2, T3 aktif bergantian.",
          "Tahap fetch: instruksi dari memori masuk ke IR. Sinyal di tahap ini sama untuk semua instruksi.",
          "Opcode di IR didekode untuk mengetahui instruksi yang dijalankan.",
          "Logika kontrol menggabungkan opcode + sinyal waktu + flag.",
          "Sinyal kontrol dikirim ke ALU, register, bus, dan memori.",
          "Instruksi selesai, step counter di-reset, siklus berikutnya mulai.",
        ],
      },
      { kind: "heading", text: "Masukan dan keluaran" },
      {
        kind: "text",
        text: "Masukan: opcode dari IR, sinyal waktu, flag ALU, dan sinyal eksternal (interrupt, reset). Keluaran berupa sinyal seperti PC_out, PC_in, MAR_in, MDR_in/out, Read, Write, IR_in, operasi ALU, RegWrite, serta Z_in dan Z_out.",
      },
      { kind: "heading", text: "Metode perancangan" },
      {
        kind: "list",
        ordered: false,
        items: [
          "State Table: unit kendali dipandang sebagai finite state machine. Rangkaian bisa minimal dan efisien, tetapi sulit untuk set instruksi besar.",
          "Delay Element: urutan waktu dari rantai flip-flop D (mirip ring counter atau one-hot). Mudah ditelusuri, tetapi jumlah elemen cepat membengkak.",
          "PLA: seluruh logika kontrol dalam satu larik AND-OR yang bisa diprogram. Teratur dan mudah dimodifikasi, tetapi ukurannya membesar dan fleksibilitasnya di bawah microprogrammed.",
          "Sequence Counter: yang paling umum. Counter + timing decoder menghasilkan T1, T2, ...; fetch (T1–T3) sama untuk semua instruksi, mulai T4 bergantung jenis instruksi.",
        ],
      },
      { kind: "heading", text: "Kelebihan" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Sangat cepat: sinyal langsung dari logika, tanpa membaca memori kontrol.",
          "Efisien untuk instruksi sederhana, cocok untuk RISC.",
          "Daya relatif rendah dan hemat chip bila set instruksi kecil.",
        ],
      },
      { kind: "heading", text: "Kekurangan" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Sulit dirancang untuk set instruksi besar dan kompleks.",
          "Tidak fleksibel: ubah atau tambah instruksi berarti desain ulang.",
          "Sulit di-debug, pengembangan lebih lama dan rawan salah desain.",
        ],
      },
      {
        kind: "note",
        text: "Pada model 3D: gerbang logika pembentuk unit kendali ini ada di dalam chip, dan papan sirkuit hanya menjadi tempat komponennya dipasang. Diagram di atas konseptual.",
      },
    ],
  },
  // ------------------------------------------------------------------ 7
  {
    id: "microprogrammed",
    title: "Kontrol Terprogram",
    short: "Unit kendali yang membaca mikroinstruksi",
    blocks: [
      { kind: "heading", text: "Konsep" },
      {
        kind: "text",
        text: "Microprogrammed Control Unit (MCU) menghasilkan sinyal kontrol dengan membaca mikroinstruksi dari control memory. Setiap instruksi mesin dijalankan oleh serangkaian mikroinstruksi yang disebut mikroprogram atau mikrorutin.",
      },
      {
        kind: "text",
        text: "Gagasan ini diperkenalkan Maurice Wilkes tahun 1951. MCU bekerja seperti komputer kecil di dalam CPU: ada memori, alamat, dan urutan eksekusi.",
      },
      { kind: "figure", svg: FIG_MICROPROGRAMMED, caption: "Diagram blok microprogrammed control unit (disederhanakan)" },
      { kind: "heading", text: "Komponen utama" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Control Memory (ROM/RAM): menyimpan seluruh mikroprogram.",
          "Control Address Register (CAR): alamat mikroinstruksi berikutnya, mirip program counter untuk mikroprogram.",
          "Control Data Register (CDR) / microinstruction register: menampung mikroinstruksi yang sedang dieksekusi.",
          "Next-Address Generator / Sequencer: menentukan alamat berikutnya (naik satu, lompat, atau cabang).",
          "Mapping Logic: mengubah opcode IR menjadi alamat awal mikrorutin.",
          "Decoder (opsional): pada format encoded, mengubah field menjadi sinyal individual.",
          "Status/Flag Register: sumber kondisi percabangan.",
        ],
      },
      { kind: "heading", text: "Alur proses" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Fetch: mikrorutin fetch (alamat tetap, misalnya 0) mengambil instruksi ke IR.",
          "Mapping: opcode diubah menjadi alamat awal mikrorutin, masuk ke CAR.",
          "Isi control memory pada alamat CAR dibaca ke CDR.",
          "Bit di CDR dikirim ke ALU, register, bus, dan memori sebagai sinyal kontrol.",
          "Sequencer menentukan CAR berikutnya: CAR + 1, lompat, atau cabang.",
          "Ulangi langkah 3–5 sampai mikrorutin selesai.",
          "CAR kembali ke alamat mikrorutin fetch untuk instruksi berikutnya.",
        ],
      },
      { kind: "heading", text: "Nanoprogramming" },
      {
        kind: "text",
        text: "Memakai dua level memori, micro-store dan nano-store. Ukuran total control memory berkurang bila banyak mikroinstruksi berulang. Jenis horizontal dan vertical dibahas di Pemrograman Mikro.",
      },
      { kind: "heading", text: "Hardwired vs microprogrammed" },
      {
        kind: "table",
        head: ["Aspek", "Hardwired", "Terprogram"],
        rows: [
          ["Kecepatan", "Sangat cepat", "Lebih lambat (akses control memory)"],
          ["Fleksibilitas", "Rendah, desain ulang", "Tinggi, ubah isi control memory"],
          ["Debug", "Sulit", "Mudah, logika berupa data"],
          ["Cocok untuk", "RISC, instruksi sederhana", "CISC, set instruksi besar"],
          ["Biaya tambahan", "Gerbang bertambah", "Control memory, sequencer, CAR, CDR"],
        ],
      },
      {
        kind: "text",
        text: "Keunggulan lain MCU: desain sistematis, emulasi arsitektur lain, dan perbaikan bug lewat microcode update.",
      },
      {
        kind: "note",
        text: "Pada model 3D: control memory dan register di sini konseptual. Pada papan sirkuit, bagian seperti ini diwujudkan sebagai chip dan memori yang dipasang pada papan.",
      },
    ],
  },
  // ------------------------------------------------------------------ 8
  {
    id: "ti8800",
    title: "TI 8800",
    short: "Kumpulan chip untuk prosesor mikroprogram",
    blocks: [
      { kind: "heading", text: "Apa itu TI 8800" },
      {
        kind: "text",
        text: "TI 8800 adalah kumpulan chip VLSI untuk membangun prosesor mikroprogram (bit-slice/microprogrammable) secara modular. Pengguna menyusun CPU dari chip-chip ini dan menulis mikrokodenya sendiri, sehingga banyak dipakai untuk belajar organisasi komputer dan merancang prosesor khusus.",
      },
      { kind: "figure", svg: FIG_TI8800, caption: "Blok bangun TI 8800 (disederhanakan)" },
      { kind: "heading", text: "Ciri khas" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Horizontal microprogramming: mikroinstruksi lebar, sinyal aktif paralel dalam satu clock.",
          "Pipelining mikroinstruksi: pembacaan berikutnya berjalan bersamaan dengan eksekusi sekarang.",
          "Writable control store: mikrokode bisa diubah atau diunggah.",
          "Modular: lebar data dan kemampuan bertambah dengan menambah chip.",
          "Sequencing lengkap: stack, loop counter, dan cabang bersyarat di dalam sequencer.",
        ],
      },
      { kind: "heading", text: "Komponen" },
      {
        kind: "table",
        head: ["Komponen", "Peran"],
        rows: [
          ["Microcode memory", "RAM penyimpan mikroprogram, isi dapat diubah"],
          ["Microsequencer SN74ACT8818", "Mengatur alamat mikroinstruksi berikutnya (peran CAR + next-address generator)"],
          ["Pipeline register", "Menampung mikroinstruksi yang sedang dieksekusi"],
          ["Register-ALU 32 bit SN74ACT8832", "ALU dengan register file, bagian datapath"],
          ["FPU SN74ACT8847", "Operasi bilangan pecahan"],
          ["Memori utama (macro memory)", "Program dan data bahasa mesin"],
          ["Host / antarmuka pengembangan", "Komputer pendamping untuk menulis, merakit, memuat mikrokode, dan debug"],
        ],
      },
      {
        kind: "note",
        text: "Pada model 3D: TI 8800 adalah kumpulan chip, bukan satu komponen yang ada pada model. Papan sirkuit di sini hanya gambaran tempat chip semacam itu dirakit.",
      },
    ],
  },
  // ------------------------------------------------------------------ 9
  {
    id: "microprogramming",
    title: "Pemrograman Mikro",
    short: "Teknik menyusun instruksi sebagai mikroinstruksi",
    blocks: [
      { kind: "heading", text: "Metode vs perangkat" },
      {
        kind: "text",
        text: "Microprogramming adalah teknik merancang unit kendali dengan menyusun setiap instruksi mesin sebagai urutan mikroinstruksi di control memory. Microprogramming adalah metodenya, sedangkan microprogrammed control unit adalah perangkat kerasnya.",
      },
      { kind: "heading", text: "Konsep dasar" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Mikrooperasi: aksi paling dasar dalam satu clock, misalnya MAR ← PC.",
          "Mikroinstruksi: satu kata di control memory berisi satu atau beberapa mikrooperasi dan informasi alamat berikutnya.",
          "Mikroprogram/mikrorutin: kumpulan mikroinstruksi untuk satu instruksi mesin.",
          "Control store: memori penyimpan mikroprogram (ROM atau RAM).",
          "Microcycle: waktu membaca dan mengeksekusi satu mikroinstruksi.",
        ],
      },
      { kind: "heading", text: "Format mikroinstruksi" },
      { kind: "figure", svg: FIG_MICROINSTRUCTION, caption: "Field umum sebuah mikroinstruksi" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Field mikrooperasi: sinyal kontrol (ALU, sumber/tujuan register, read/write).",
          "Field kondisi: flag yang diuji (Zero, Carry, Negative, ...).",
          "Field alamat cabang: tujuan lompatan.",
          "Field urutan: cara memilih alamat berikutnya.",
        ],
      },
      { kind: "heading", text: "Berdasarkan pengkodean sinyal" },
      {
        kind: "table",
        head: ["Jenis", "Ciri", "Dampak"],
        rows: [
          ["Horizontal", "Satu bit per sinyal kontrol", "Lebar, cepat, paralel tinggi, boros memori"],
          ["Vertical", "Sinyal dikodekan dalam field pendek lalu didekode", "Sempit, hemat memori, lebih lambat, paralelisme terbatas"],
          ["Diagonal / field-encoded", "Sinyal dikelompokkan dalam field yang saling eksklusif, tiap field dikodekan", "Kompromi ukuran dan kecepatan"],
        ],
      },
      { kind: "heading", text: "Berdasarkan penentuan alamat berikutnya" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Satu alamat: setiap mikroinstruksi memuat alamat berikutnya secara eksplisit.",
          "Dua alamat: satu alamat bila kondisi benar, satu lagi bila salah.",
          "Alamat berurutan (variable format): CAR + 1, kecuali ada instruksi cabang.",
        ],
      },
      { kind: "heading", text: "Aturan pengurutan (sequencing)" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Increment: CAR ← CAR + 1.",
          "Jump tanpa syarat: CAR ← alamat tujuan.",
          "Conditional branch: bercabang bila flag terpenuhi.",
          "Mapping: opcode IR dipetakan ke alamat awal mikrorutin.",
          "Call/return mikrosubrutin: alamat kembali disimpan di register atau stack khusus, sehingga mikrokode yang sama (misalnya fetch operand) dipakai banyak instruksi.",
          "Loop: counter mengulang mikrooperasi, misalnya pada perkalian atau shift berulang.",
        ],
      },
      {
        kind: "note",
        text: "Pada model 3D: microprogramming adalah teknik pemrograman. Yang tampak fisik hanyalah papan sirkuit tempat chip dan memorinya dipasang.",
      },
    ],
  },
  // ------------------------------------------------------------------ 10
  {
    id: "multiprocessing",
    title: "Multiprocessing",
    short: "Dua atau lebih prosesor/core bekerja bersamaan",
    blocks: [
      { kind: "heading", text: "Definisi" },
      {
        kind: "text",
        text: "Multiprocessing adalah teknik pemrosesan yang memakai dua atau lebih prosesor atau inti prosesor (CPU core) untuk menjalankan beberapa tugas secara bersamaan. Tujuannya meningkatkan kecepatan, efisiensi, dan kinerja komputer.",
      },
      { kind: "heading", text: "Jenis" },
      { kind: "figure", svg: FIG_SMP_AMP, caption: "SMP dan AMP" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Symmetric Multiprocessing (SMP): prosesor berkedudukan setara dan berbagi akses ke memori utama.",
          "Asymmetric Multiprocessing (AMP): prosesor dengan pembagian tugas dan tanggung jawab berbeda.",
        ],
      },
      { kind: "heading", text: "SMP atau AMP?" },
      {
        kind: "text",
        text: "Sistem operasi modern (Windows, Linux, macOS) memilih SMP karena pekerjaan bisa dibagi fleksibel ke core mana pun, tanpa bergantung pada satu prosesor utama, dan mudah menyesuaikan saat jumlah core bertambah.",
      },
      {
        kind: "text",
        text: "AMP masih relevan untuk perangkat yang butuh pembagian tugas khusus: sistem embedded, perangkat industri (kontrol mesin, PLC), dan otomotif (ECU).",
      },
      { kind: "heading", text: "Cara kerja" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Komputer menerima tugas.",
          "Sistem membagi tugas menjadi beberapa bagian dan membagikannya ke tiap prosesor.",
          "Setiap prosesor mengerjakan bagiannya bersamaan.",
          "Hasil dikumpulkan dan digabung menjadi satu hasil akhir.",
        ],
      },
      { kind: "heading", text: "Keuntungan" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Lebih cepat dan efisien: pekerjaan dibagi ke beberapa core.",
          "Multitasking: banyak aplikasi berjalan sekaligus.",
          "Cocok untuk pekerjaan yang banyak perhitungan.",
        ],
      },
      { kind: "heading", text: "Kekurangan" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Biaya lebih tinggi karena butuh perangkat keras pendukung.",
          "Pengelolaan lebih rumit.",
          "Masalah sinkronisasi: beberapa prosesor bisa butuh data yang sama pada saat yang sama.",
          "Tidak semua pekerjaan bisa diparalelkan, ada yang harus berurutan.",
        ],
      },
      {
        kind: "text",
        text: "Penerapan: komputer modern, server, supercomputer, dan sistem pengolah data besar.",
      },
      {
        kind: "note",
        text: "Pada model 3D: server rack hanya gambaran sistem komputasi berskala besar. Pembagian tugas antar-core terjadi di dalam perangkat keras dan perangkat lunak, bukan sesuatu yang tampak pada model.",
      },
    ],
  },
  // ------------------------------------------------------------------ 11
  {
    id: "cache-coherence",
    title: "Cache Coherence",
    short: "Menjaga data antar-cache tetap konsisten",
    blocks: [
      { kind: "heading", text: "Definisi" },
      {
        kind: "text",
        text: "Cache coherence adalah mekanisme yang menjaga data di cache beberapa core prosesor tetap konsisten atau sama.",
      },
      { kind: "figure", svg: FIG_COHERENCE, caption: "Dua core, dua cache, satu memori utama" },
      { kind: "heading", text: "Elemen pada ilustrasi" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Core 1 dan Core 2: prosesor yang memproses data.",
          "Cache 1 dan Cache 2: memori sementara berisi salinan data tiap core.",
          "Main Memory (RAM): penyimpanan utama data komputer.",
        ],
      },
      { kind: "heading", text: "Cara kerja" },
      {
        kind: "text",
        text: "Sistem memantau perubahan data pada cache setiap core. Ketika satu core mengubah data, sistem memastikan cache core lain mengetahuinya, sehingga semua prosesor memakai data yang konsisten.",
      },
      { kind: "heading", text: "Tujuan" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Menjaga konsistensi data antar-cache.",
          "Mencegah penggunaan data yang sudah lama.",
          "Menghindari kesalahan pemrosesan.",
          "Mendukung kinerja prosesor paralel.",
        ],
      },
      {
        kind: "note",
        text: "Pada model 3D: cache berada di dalam chip prosesor. Server rack hanya mewakili sistem multiprosesor tempat masalah ini muncul, dan cache tidak tampak pada model.",
      },
    ],
  },
  // ------------------------------------------------------------------ 12
  {
    id: "mesi",
    title: "MESI",
    short: "Protokol empat status untuk cache multiprosesor",
    blocks: [
      { kind: "heading", text: "Definisi" },
      {
        kind: "text",
        text: "MESI adalah protokol yang mengatur status data dalam cache prosesor agar konsistensi data terjaga. Namanya dari empat status: Modified, Exclusive, Shared, Invalid.",
      },
      { kind: "figure", svg: FIG_MESI, caption: "Empat status MESI" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Modified (M): data sudah diubah dan berbeda dari RAM. Perubahan belum ditulis kembali ke RAM.",
          "Exclusive (E): data hanya dimiliki satu cache dan masih sama dengan RAM.",
          "Shared (S): data yang sama dimiliki beberapa cache dan masih konsisten dengan RAM.",
          "Invalid (I): data tidak valid, tidak boleh dipakai sebelum diperbarui.",
        ],
      },
      { kind: "heading", text: "Contoh dua core" },
      {
        kind: "table",
        head: ["Langkah", "Kejadian", "Cache 1", "Cache 2"],
        rows: [
          ["1", "Core 1 membaca data dari RAM", "E", "-"],
          ["2", "Core 2 membaca data yang sama", "S", "S"],
          ["3", "Core 1 ingin mengubah data", "S", "S"],
          ["4", "Cache Core 2 dijadikan Invalid", "S", "I"],
          ["5", "Core 1 mengubah data", "M", "I"],
        ],
      },
      { kind: "heading", text: "Fungsi" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Menjaga konsistensi data cache.",
          "Mengatur status data dalam cache.",
          "Mencegah pemakaian data tidak valid.",
          "Mendukung kinerja sistem multiprosesor.",
        ],
      },
      {
        kind: "note",
        text: "Pada model 3D: status M, E, S, I adalah tanda (bit status) yang disimpan bersama data di cache. Ia bukan bagian fisik yang bisa ditunjuk pada server rack.",
      },
    ],
  },
  // ------------------------------------------------------------------ 13
  {
    id: "vector",
    title: "Komputasi Vektor",
    short: "Satu instruksi untuk banyak data",
    blocks: [
      { kind: "heading", text: "Definisi" },
      {
        kind: "text",
        text: "Komputasi vektor memungkinkan satu instruksi dipakai untuk mengolah banyak data sekaligus.",
      },
      { kind: "heading", text: "Cara kerja" },
      {
        kind: "text",
        text: "Sekumpulan data dimasukkan ke register vektor, lalu beberapa data diproses sekaligus oleh satu instruksi. Hasilnya perhitungan lebih cepat dan efisien.",
      },
      { kind: "figure", svg: FIG_VECTOR, caption: "Ilustrasi: satu instruksi, empat elemen (V1, V2, V3 adalah register vektor contoh)" },
      { kind: "heading", text: "Contoh penerapan" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Pengolahan gambar: banyak piksel sekaligus.",
          "Pengolahan video: mempercepat pemrosesan frame.",
          "Kecerdasan buatan: perhitungan data pada model AI.",
          "Simulasi cuaca: banyak perhitungan matematika.",
          "Game: perhitungan grafis dan posisi objek.",
        ],
      },
      { kind: "heading", text: "Kelebihan" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Mempercepat pemrosesan data.",
          "Mengurangi jumlah instruksi untuk operasi berulang.",
          "Efisien untuk perhitungan matematika dalam jumlah besar.",
        ],
      },
      { kind: "heading", text: "Kekurangan" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Tidak semua pekerjaan cocok diproses secara vektor.",
          "Butuh dukungan instruksi dan perangkat keras khusus.",
          "Data yang tidak teratur lebih sulit diolah.",
        ],
      },
      {
        kind: "note",
        text: "Pada model 3D: register vektor berada di dalam prosesor dan tidak tampak pada model CPU.",
      },
    ],
  },
  // ------------------------------------------------------------------ 14
  {
    id: "parallel-processor",
    title: "Prosesor Paralel",
    short: "Beberapa unit pemrosesan mengerjakan tugas bersamaan",
    blocks: [
      { kind: "heading", text: "Definisi" },
      {
        kind: "text",
        text: "Prosesor paralel adalah sistem pemrosesan yang memakai beberapa unit pemrosesan untuk mengerjakan bagian-bagian tugas secara bersamaan, demi kecepatan dan efisiensi yang lebih tinggi.",
      },
      { kind: "figure", svg: FIG_PARALLEL, caption: "Bagi, kerjakan bersamaan, gabungkan" },
      { kind: "heading", text: "Cara kerja (contoh: 1.000 data)" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Komputer menerima tugas.",
          "Tugas dibagi menjadi beberapa bagian.",
          "Tiap prosesor mendapat bagian masing-masing.",
          "Semua prosesor bekerja bersamaan.",
          "Hasil dikumpulkan dan digabung menjadi hasil akhir.",
        ],
      },
      { kind: "heading", text: "Multiprocessing vs prosesor paralel" },
      {
        kind: "text",
        text: "Keduanya berbeda fokus. Multiprocessing menekankan penggunaan dua atau lebih prosesor/core untuk menjalankan beberapa proses. Prosesor paralel menekankan kemampuan arsitektur membagi dan mengerjakan bagian-bagian tugas bersamaan. Multiprocessing adalah salah satu pendekatan untuk pemrosesan paralel, yang juga bisa diwujudkan lewat teknologi lain seperti GPU.",
      },
      { kind: "heading", text: "Contoh penerapan" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Supercomputer: perhitungan dalam jumlah besar.",
          "Kecerdasan buatan: pelatihan model.",
          "Rendering 3D: gambar dan animasi.",
          "Simulasi cuaca: berbagai kondisi atmosfer.",
          "Game: grafis dan perhitungan permainan.",
        ],
      },
      { kind: "heading", text: "Kelebihan" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Mempercepat pekerjaan dan membagi beban kerja.",
          "Meningkatkan kemampuan komputasi.",
          "Cocok untuk pekerjaan yang banyak perhitungan.",
        ],
      },
      { kind: "heading", text: "Kekurangan" },
      {
        kind: "list",
        ordered: false,
        items: [
          "Butuh perangkat keras pendukung.",
          "Pembagian tugas lebih kompleks.",
          "Butuh sinkronisasi antarprosesor.",
          "Tidak semua pekerjaan bisa dilakukan paralel.",
        ],
      },
      {
        kind: "note",
        text: "Pada model 3D: server rack mewakili sistem komputasi berskala besar. Pembagian tugas adalah proses logika, bukan komponen fisik pada model.",
      },
    ],
  },
];

/** Supporting panel for the circuit board: physical paths and where the control-unit topics apply. */
export const BOARD_CONTEXT: LessonTopic = {
  id: "board-connections",
  title: "Papan Sirkuit",
  short: "Tempat komponen terhubung",
  context: true,
  blocks: [
    { kind: "heading", text: "Peran papan sirkuit" },
    {
      kind: "text",
      text: "Papan sirkuit adalah dasar fisik tempat komponen dipasang. Jalur tembaga dan soket menghubungkan CPU, memori, dan perangkat I/O, sehingga sinyal data dan kontrol dapat berpindah.",
    },
    { kind: "figure", svg: FIG_BOARD_PATHS, caption: "Penyederhanaan: CPU mengirim sinyal kontrol dan bertukar data lewat jalur pada papan" },
    { kind: "heading", text: "Kaitan dengan materi" },
    {
      kind: "list",
      ordered: false,
      items: [
        "Sinyal kontrol eksternal (Read/Write) dari unit kontrol bergerak lewat jalur seperti ini menuju RAM dan I/O.",
        "Unit kendali hardwired maupun terprogram, termasuk rangkaian TI 8800, adalah rancangan yang diwujudkan sebagai chip dan memori yang dipasang pada papan.",
        "Tab Hardwired, Kontrol Terprogram, TI 8800, dan Pemrograman Mikro membahas cara unit kendali itu dibangun.",
      ],
    },
    {
      kind: "note",
      text: "Yang fisik: papan sirkuit dan komponen yang terpasang. Yang konseptual: mikroinstruksi, status, dan alur sinyal pada diagram. Model papan tidak menampilkan control memory atau sequencer secara khusus.",
    },
  ],
};

/** Supporting panel for the RP2040 board: a small embedded example, not a primary topic owner. */
export const RP2040_CONTEXT: LessonTopic = {
  id: "rp2040-context",
  title: "Mikrokontroler RP2040",
  short: "Contoh papan embedded sebagai pendukung",
  context: true,
  blocks: [
    { kind: "heading", text: "Peran pada modul ini" },
    {
      kind: "text",
      text: "Model ini adalah papan mikrokontroler kecil. Ia tidak mewakili prosesor superskalar, PowerPC, Pentium, TI 8800, maupun server multiprosesor, jadi tidak diberi topik utama.",
    },
    { kind: "heading", text: "Kaitan dengan materi" },
    {
      kind: "list",
      ordered: false,
      items: [
        "Sistem embedded adalah salah satu tempat AMP masih relevan (tab Multiprocessing).",
        "Mikrokontroler RP2040 diketahui memiliki dua inti, sehingga dapat dipakai membayangkan multiprocessing dalam skala kecil. Detail ini di luar makalah.",
        "Pembagian tugas ke beberapa unit pemrosesan dibahas di tab Prosesor Paralel.",
      ],
    },
    {
      kind: "note",
      text: "Cache coherence dan MESI tidak dibahas pada model ini. Keduanya dipelajari pada konteks sistem multiprosesor di server rack.",
    },
  ],
};

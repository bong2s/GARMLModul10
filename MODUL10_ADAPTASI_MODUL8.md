# GARML AR Modul 10 — Prosesor Lanjut dan Organisasi Paralel (adaptasi dari Modul 8)

Mesin AR Modul 8 dipertahankan apa adanya (`src/ar/engine.ts`, `scene.ts`, `session.ts`, `hotspots.ts`,
`src/main.ts`, dependency, `vite.config.ts`). Yang berubah hanya model, konfigurasi, dan konten.

| File | Perubahan |
|---|---|
| `public/models/` | `CPU_Processor.glb`, `Circuit_Board.glb`, `RP2040_Microcontroller.glb`, `Server_Rack.glb` (byte-identik dengan file yang diunggah) |
| `src/models/registry.ts` | 4 model (CPU, Papan Sirkuit, RP2040, Server Rack) dan pemetaan model → topik |
| `src/ar/config.ts` | Label, warna, ukuran, posisi per model (dari bounding box GLB; semua Y-up, tanpa koreksi rotasi) |
| `src/content/lessons.ts` | 14 topik sesuai Makalah_Final_Kelompok_10.pdf + 2 panel pendukung (Papan Sirkuit, RP2040) |
| `src/content/figures.ts` | 13 ilustrasi SVG konseptual |
| `src/content/renderLesson.ts`, `src/style.css` | Blok baru `table` (dapat digulir horizontal di HP) |
| `index.html`, string log | Identitas Modul 10 |

## Alur urutan komponen (urutan makalah)
1 Prosesor Superskalar · 2 PowerPC dan Pentium · 3 Unit Kontrol · 4 Operasi Mikro · 5 Kontrol CPU ·
6 Hardwired · 7 Kontrol Terprogram · 8 TI 8800 · 9 Pemrograman Mikro · 10 Multiprocessing ·
11 Cache Coherence · 12 MESI · 13 Komputasi Vektor · 14 Prosesor Paralel

## Pemetaan model → materi (konfigurasi penulis, bukan dari geometri)
* CPU: 1–5 dan 13 (superskalar, PowerPC/Pentium, unit kontrol, operasi mikro, kontrol CPU, komputasi vektor)
* Papan Sirkuit: 6–9 (hardwired, terprogram, TI 8800, pemrograman mikro) + panel konteks Papan Sirkuit
* Server Rack: 10, 11, 12, 14 (multiprocessing, cache coherence, MESI, prosesor paralel)
* RP2040: tanpa topik utama; panel konteks + tab tautan ke Multiprocessing dan Prosesor Paralel

Setiap topik memuat catatan "Pada model 3D" yang menegaskan mana yang fisik dan mana yang konseptual.

## Ukuran GLB asli (x × y × z, meter)
CPU 0.0873 × 0.0044 × 0.0495 · Papan 0.0925 × 0.0181 × 0.0600 · RP2040 0.0460 × 0.0043 × 0.0200 ·
Server Rack 0.6000 × 2.0006 × 1.0653

## Menjalankan
`npm install` → `npm run dev` (pratinjau) atau `npm run build` (hasil di `dist/`). Kamera dan WebXR butuh HTTPS atau localhost.

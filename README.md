# Aurora — Zen Browser UI Overhaul

Kompletní přepracování vzhledu Zen Browseru. Inspirováno Opera GX, ale s plnou svobodou přizpůsobení.

## Funkce

- **Barvy** — color pickery pro panely, text, ohraničení, pozadí a akcent
- **Obrázky na pozadí** — vlastní obrázky pro prohlížeč i Novou záložku
- **Zvukové efekty** — zvuky pro psaní, přepínání panelů a otevírání záložek
- **Material You** — automatická extrakce palety z obrázku na pozadí
- **Denní cyklus** — barvy se mění podle denní doby
- **Animace** — nastavitelná rychlost přechodů UI
- **Export/Import** — sdílení témat jako `.json` soubor

## Instalace (Sine)

1. Nainstaluj [Sine](https://github.com/CosmoCreeper/Sine) pro Zen Browser
2. V Nastavení → Sine → přidej nepublikovaný mod: `Rockynio-dot/zen-aurora`
3. Restartuj Zen Browser

## Vývoj

```bash
npm install
npm run build      # jednorázový build
npm run watch      # sledování změn
```

Po buildu commitni `dist/` a pushni — Sine stáhne aktualizaci při příštím startu.

### Ověření funkčnosti

Po načtení modu otevři Browser Console (`Ctrl+Shift+J`) a hledej:

```
[Aurora] Loaded successfully.
```

## Struktura projektu

```
src/
  core/        — state, CSS engine, globální eventy
  features/    — zvuky, paleta, dynamické motivy, animace
  share/       — export/import témat
  types/       — TypeScript typy pro UC_API a Gecko
dist/          — buildnuté soubory (načítá Sine)
assets/        — výchozí zvukové sady a ikony
```

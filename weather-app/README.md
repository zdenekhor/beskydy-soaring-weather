# SPL Pocasi LKFR (PC + Android)

Aplikace poskytuje predpoved pocasi pro LKFR (Frydlant n. Ostravici) se zamerenim na vyhodnoceni podminek pro plachtare SPL.

## Funkce

- 3denni hodinova predpoved z Open-Meteo
- Vyhodnoceni letovych podminek (soaring index, semafor GO/CAUTION/NO-GO)
- Prepinatelne SPL profily (Zak / Klub / Zkuseny XC)
- Grafy teploty, rosneho bodu, vetru, oblacnosti a termiky
- Dvojjazycne rozhrani (CZ/EN)
- Hodnoceni aplikace (backend agregace) + pocet zobrazeni
- PWA instalace na desktop i Android

## Spusteni lokalne

```bash
npm install
npm run dev
```

Otevrete `http://localhost:3000`.

## Produkcni build

```bash
npm run build
npm run start
```

## Backend pro hodnoceni

Aplikace umi bezet ve dvou rezimech:

- Bez DATABASE_URL: in-memory backend (data se resetuji po restartu serveru)
- S DATABASE_URL: trvale ukladani hodnoceni a zobrazeni v PostgreSQL

Priklad nastaveni:

```bash
export DATABASE_URL="postgres://user:pass@host:5432/dbname"
```

## Instalace jako aplikace

### PC (Chrome / Edge)

1. Otevrete nasazenou aplikaci v prohlizeci.
2. V adresnim radku kliknete na ikonu instalace (nebo menu -> Install app).
3. Potvrdte instalaci.

### Android (Chrome)

1. Otevrete nasazenou HTTPS URL aplikace.
2. V menu prohlizece zvolte `Pridat na plochu` nebo `Instalovat aplikaci`.
3. Potvrdte instalaci.

Poznamka: Instalace na Android vyzaduje HTTPS nasazeni (lokalne funguje pouze testovaci beh v prohlizeci).

## Android APK (native wrapper)

Aplikace obsahuje pripravenou konfiguraci pro Android wrapper pres Capacitor.
Wrapper muze nacitat nasazenou HTTPS verzi aplikace.

1. Nastavte URL nasazene aplikace:

```bash
export CAP_SERVER_URL="https://vas-nasazeny-web.example.com"
```

2. Nainstalujte zavislosti a pripravte Android projekt:

```bash
npm install
npm run android:init
npm run android:sync
```

3. Otevrete Android Studio:

```bash
npm run android:open
```

4. V Android Studiu vytvorte APK nebo AAB.

Poznamka: Pokud chcete wrapper bez vzdalene URL, je potreba dodelat staticky export frontendu bez dynamickych API route.

Detailni release postup (signed APK/AAB) je v [ANDROID_RELEASE.md](ANDROID_RELEASE.md).

## Struktura

- `app/page.tsx`: hlavni stranka s vyhodnocenim podminek
- `app/api/forecast/route.ts`: API endpoint pro predpoved
- `app/manifest.ts`: web app manifest pro PWA
- `public/sw.js`: service worker pro PWA cache

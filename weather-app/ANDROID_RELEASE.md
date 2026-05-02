# Android Release (APK / AAB)

Tento projekt pouziva Capacitor wrapper nad web aplikaci. Release build je urceny pro Android Studio / Gradle.

## 1) Vytvoreni upload keystore

Spustte v terminalu ve slozce `weather-app/android`:

```bash
keytool -genkeypair -v -keystore release-upload-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

Vysledek:
- vznikne `release-upload-keystore.jks`
- soubor necommitovat do gitu

## 2) Signing konfigurace

Vytvorte soubor `weather-app/android/signing.properties` podle sablony:

```bash
cp android/signing.properties.example android/signing.properties
```

A doplnte realne hodnoty:
- `STORE_FILE`
- `STORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`

## 3) Sync wrapperu

Nejdriv nastavte URL nasazene web aplikace (HTTPS):

```bash
export CAP_SERVER_URL="https://vas-nasazeny-web.example.com"
```

Pak provedte sync:

```bash
npm run android:sync
```

## 4) Build AAB (doporučeno pro Play Console)

```bash
cd android
./gradlew bundleRelease
```

Vystup:
- `android/app/build/outputs/bundle/release/app-release.aab`

## 5) Build APK (test/installace mimo Play)

```bash
cd android
./gradlew assembleRelease
```

Vystup:
- `android/app/build/outputs/apk/release/app-release.apk`

## 6) Upload do Google Play

- Nahrajte `app-release.aab` do Play Console.
- Pouzijte upload key (ne app signing key od Googlu).
- V Play Console vyplnte release notes a rollout.

## Dulezite

- Nikdy necommitujte `android/signing.properties` ani `.jks` soubory.
- Zaloha keystore a hesel je kriticka. Bez nich nelze aktualizovat stejnou aplikaci.
- Pro produkci pouzivejte vzdy HTTPS URL v `CAP_SERVER_URL`.

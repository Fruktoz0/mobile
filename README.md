# Tiszta Város Mobilalkalmazás

![Tiszta Város logó](assets/images/tisztavaros_logo.png)  
Ez a mobilalkalmazás a **Tiszta Város** projekt része, melynek célja, hogy a lakosok egyszerűen jelezhessék a városban észlelt problémákat. Az alkalmazás **React Native** alapokra épül, és **Expo** keretrendszerrel futtatható, így könnyen telepíthető és kipróbálható mobil eszközökön. A felhasználói felület kialakítása egyszerű és áttekinthető, hogy technikai tudástól függetlenül bárki használhassa.

## Fő funkciók

- **Bejelentések küldése:** Közterületi hibák, problémák gyors jelentése egy űrlap kitöltésével.  
- **Térképes helymegjelölés:** A bejelentés pontos helyszínének megadása interaktív térképen.  
- **Képfeltöltés:** Fotók csatolása a bejelentéshez (legfeljebb 3 kép), hogy szemléltessük a problémát.  
- **Értesítések:** Az alkalmazás push értesítéseket küld a bejelentések státuszának változásakor, így a felhasználó azonnal értesül a fejleményekről.  
- **Saját bejelentések:** A felhasználó nyomon követheti az általa beküldött bejelentések listáját és azok aktuális státuszát (pl. folyamatban, megoldva).  
- **Közösségi bejelentések böngészése:** Minden beküldött probléma publikusan megtekinthető egy listában, ahol a felhasználók láthatják a város összes bejelentését és akár jelezhetik egyetértésüket (szavazás).  
- **Kihívások és jelvények:** Gamifikált rendszer – pontgyűjtés és jutalmak. A felhasználók különböző kihívásokat teljesíthetnek, jelvényeket szerezhetnek a város tisztaságáért tett erőfeszítéseikért.  
- **Hírek és információk:** A kezdőképernyőn friss hírek, városi információk jelennek meg, így a lakosok értesülhetnek a fontosabb aktualitásokról és eseményekről.  
- **Profilkezelés:** Saját profil megtekintése és szerkesztése (pl. név, e-mail cím módosítása, profilkép beállítása) a **Profilom** menüpont alatt.  
- **Regisztráció és bejelentkezés:** Új felhasználók egyszerűen regisztrálhatnak, a regisztrált felhasználók pedig biztonságosan bejelentkezhetnek az alkalmazásba. (Bejelentkezés szükséges a bejelentések beküldéséhez.)  
- **GY.I.K. és hibajelentés:** Beépített **Gyakran Ismételt Kérdések** segítik a használatot, illetve egy külön funkcióval visszajelzést vagy hibajelentést is küldhetnek a felhasználók a fejlesztőknek.  

## Telepítés és futtatás

Az alkalmazás futtatásához telepítened kell a Node.js-t és ajánlott az **Expo CLI** használata. A futtatás lépései a következők:

1. **Repo klónozása:** Nyisd meg a terminált és futtasd:  
   ```bash
   git clone https://github.com/Fruktoz0/mobile.git
   ```  
   Majd lépj be a projekt mappájába:  
   ```bash
   cd mobile
   ```  

2. **Függőségek telepítése:** Telepítsd a szükséges csomagokat npm segítségével:  
   ```bash
   npm install
   ```  

3. **Applikáció indítása Expo-val:** Győződj meg arról, hogy egy Android-emulátor fut, vagy az Android készüléked USB-n csatlakoztatva van. Indítsd el az alkalmazást az alábbi paranccsal:  
   ```bash
   npx expo run:android
   ```  
   Ez a parancs elindítja az Expo bundlert, lefordítja az alkalmazást és telepíti a csatlakoztatott Android eszközre vagy emulátorra. **iOS** platformon Mac használata esetén hasonlóan futtatható: `npx expo run:ios`.  

4. **Expo Go (alternatív):** Fejlesztői módban használhatod az Expo Go alkalmazást is. Ehhez futtasd az `expo start` parancsot, majd olvasd be a megjelenő QR-kódot az Expo Go appal a telefonodon. Így telepítés nélkül is kipróbálhatod az alkalmazást.  

## Backend kapcsolat

A mobilalkalmazás egy külön backend szerverrel kommunikál a bejelentések és felhasználói adatok kezelése érdekében. A backend kódja nyílt forráskódú és elérhető a GitHub-on: **[Tiszta Város Backend](https://github.com/Fruktoz0/backend)**. Ezen a szerveren futnak azok a szolgáltatások és API végpontok, amelyek a bejelentések fogadásáért, tárolásáért, státuszkövetéséért, valamint a kihívások és jelvények kiosztásáért felelősek.


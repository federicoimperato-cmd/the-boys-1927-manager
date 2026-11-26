# THE BOYS 1927 MANAGER — V1.0

Portale web per una singola squadra Pro Club, in italiano, responsive. Logo originale fornito dal club. Nessun server da installare, nessuna compilazione, nessuna carta di credito richiesta se si rimane su Firebase Spark e GitHub Free con repository pubblico.

## 1. Crea il repository GitHub (separato da HML Manager)

1. Accedi a https://github.com/new con il tuo account esistente.
2. Repository name: `the-boys-1927-manager`.
3. Visibility: **Public** (necessario per Pages con GitHub Free). Non mettere dati reali o backup nel repository. Spunta Add a README file se vuoi inizializzare subito il ramo main.
4. Create repository.
5. Estrai lo ZIP. Non caricare lo ZIP intero. I file `index.html`, `config.js`, `firestore.rules`, `README.md` e le cartelle `assets`, `js` devono stare nella radice del repository. `.nojekyll` è consigliato ma non indispensabile. Non caricare il file HTML demo separato.
6. Per caricare: Code → Add file → Upload files; trascina i file e le due cartelle, poi Commit changes. Se il caricamento non conserva le cartelle, usa GitHub Desktop oppure crea le cartelle con Add file → Create new file e il percorso `js/...` / `assets/...`.
7. Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch `main` → `/ (root)` → Save. Quando disponibile, il sito sarà `https://TUO-USERNAME.github.io/the-boys-1927-manager/` (sostituisci TUO-USERNAME con il vero nome account). Se il repository è di un'organizzazione, usa il nome dell'organizzazione.
8. Apri il sito. Prima della configurazione Firebase vedrai un messaggio e un link alla demo; la demo non contiene dati reali e non comunica con il database.

## 2. Crea Firebase, senza fatturazione

1. Apri https://console.firebase.google.com/ con lo stesso Google account che vuoi usare come proprietario, o con un account dedicato alla società.
2. Crea un NUOVO progetto, nome `The Boys 1927 Manager`. Non riutilizzare il progetto di HML Manager. L'ID progetto è assegnato da Firebase e deve essere unico; accetta un eventuale suffisso.
3. Puoi disattivare Google Analytics. Completa la creazione. Verifica che il piano sia **Spark**: non passare a Blaze, non collegare un conto di fatturazione.
4. Nella panoramica del progetto clicca l'icona Web `</>` (Aggiungi app), nickname `The Boys 1927 Web`. NON attivare Firebase Hosting: usiamo GitHub Pages. Registra l'app.
5. Seleziona la configurazione SDK (opzione Config, se presente). Copia soltanto l'oggetto `firebaseConfig` con apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId ed eventualmente measurementId. Non copiare le istruzioni npm o initializeApp.
6. Su GitHub apri `config.js` → matita Edit. Sostituisci `export const firebaseConfig = {};` con `export const firebaseConfig = { ... };` usando esattamente i valori della tua app Firebase. Fai Commit changes. Le chiavi di configurazione client Firebase non sono password; non inserire mai chiavi di service account o token privati. La protezione dei dati è nelle regole Firestore.

## 3. Abilita il login Google

1. Firebase → Build / Crea → Authentication → Get started.
2. Scheda Sign-in method / Metodo di accesso → Google → Enable / Abilita. Se richiesto, scegli un nome pubblico del progetto e l'email di supporto. Salva.
3. Authentication → Settings / Impostazioni → Authorized domains / Domini autorizzati → Add domain. Inserisci `TUO-USERNAME.github.io` senza `https://`, senza slash e senza il nome del repository. Usa il dominio effettivo del sito.
4. Se l'accesso non funziona, verifica il dominio e che Google sia abilitato. Apri il link nel browser normale (Chrome, Safari, Edge) invece del browser incorporato in Discord/WhatsApp; consenti la finestra popup. Non usare account Google Workspace che vietano accessi esterni.

## 4. Crea il database e pubblica le regole (OBBLIGATORIO)

1. Firebase → Firestore Database → Create database.
2. Seleziona **Standard edition** (non Enterprise), database `(default)`. Regione europea a tua scelta, se disponibile (ad es. europe-west1); controlla la scelta prima di confermare, la località non si cambia facilmente. Non scegliere funzioni a pagamento.
3. Seleziona **Production mode / Modalità produzione** (non test mode). Crea il database.
4. Scheda Rules / Regole: elimina il contenuto predefinito e incolla TUTTO il testo di `firestore.rules` incluso nello ZIP. Premi Publish / Pubblica. Caricare il file su GitHub NON pubblica le regole su Firebase. Non impostare `allow read, write: if true`.
5. La prima registrazione è consentita solo a un account Google autenticato e con email verificata; l'utente resta pending e non può leggere alcun dato del club. I permessi sono verificati dal database, non solo dall'interfaccia.

## 5. Attiva il tuo amministratore (una sola volta)

1. Aspetta che GitHub Pages abbia pubblicato il commit con il config aggiornato (Settings → Pages / Actions).
2. Apri il sito senza `?demo=1`, fai Accedi con Google e usa il tuo account. Vedrai «Richiesta di accesso registrata». È corretto.
3. Torna su Firebase → Authentication → Users. Individua il TUO indirizzo e copia lo UID dell'account.
4. Firebase → Firestore Database → Data. Si sarà creata una collection `users`. Aprila e seleziona il documento con lo UID esatto appena copiato (controlla il campo email).
5. Modifica il campo esistente `role`: tipo stringa, valore esatto `admin` (minuscolo), al posto di `pending`. Non modificare gli altri campi. La console del proprietario può effettuare questa prima promozione; il sito non può auto-promuovere nessuno.
6. Torna al portale, che dovrebbe aggiornarsi automaticamente. Se necessario ricarica la pagina. Ora hai accesso a tutte le sezioni.
7. Campi personalizzati → Aggiungi campi di base mancanti, se desideri partire dai 13 esempi. Il database parte VUOTO: nessun giocatore fittizio né partita demo in produzione.
8. Rosa → + Giocatore: inserisci la squadra reale.

## 6. Invita i giocatori e prova i permessi

1. Invia a tutti il link GitHub Pages (senza `?demo=1`). Aprono il sito e accedono con Google. Non devono installare nulla.
2. Dal tuo portale → Utenti e permessi: ogni nuovo accesso compare come In attesa. Apri Permessi, scegli il livello e, se serve, collega la scheda del giocatore corrispondente. Salva. Non approvare account sconosciuti.
3. Per revocare l'accesso, rimetti il ruolo In attesa. Puoi assegnare un solo giocatore per account dall'interfaccia; non associare lo stesso giocatore a due utenti attivi.
4. Prima di inserire note reali, prova con un secondo account Google in una finestra privata. Verifica che: prima dell'approvazione non veda il club; da giocatore veda la rosa, ma non l'area staff o la gestione utenti/campi; non possa modificare la rosa; possa rispondere solo per la propria scheda; da staff possa editare ma non approvare una formazione. Revoca il secondo account e verifica che l'accesso venga bloccato. Verifica anche le regole nel simulatore Rules Playground / Emulator, se disponibile.

| Ruolo | Accesso |
|---|---|
| Amministratore | Gestisce tutto, campi globali, approvazioni utenti e backup |
| Capitano | Rosa, partite, statistiche, tattiche, note staff, approvazione formazioni |
| Staff | Gestione tecnica, proposte, note riservate; non approva formazioni |
| Giocatore | Consulta dati condivisi; modifica solo la propria disponibilità, se collegato alla scheda |
| In attesa | Nessun dato del club |

## 7. Funzioni della V1

- Dashboard: risultati, vittorie, gol, prossima partita.
- Rosa: nome/gamertag, numero, note generali, ruoli multipli. Ogni pulsante ruolo cicla non assegnato → naturale (verde, N) → adattato (arancione, A) → non assegnato.
- Campi personalizzati: numero, testo, elenco, sì/no. Puoi aggiungere un campo globale direttamente dal pannello senza cambiare codice. Appare in tutte le schede esistenti e future; i valori sono individuali e i campi vuoti non diventano automaticamente zero. Per esempio `Visione di gioco` (numero, Scheda giocatore), `Piede preferito` (elenco), `Note sulla build` (testo). Rinomina, riordina o archivia senza eliminare i valori. Tipo e destinazione sono immutabili per preservare la compatibilità dei dati; se necessario crea un nuovo campo.
- Campi partita: numerici con aggregazione Somma o Media semplice. Crea `Gol` (somma), `Voto` (media) ecc. Compila Partite → Dettagli → Compila per ogni partecipante. Le statistiche si aggiornano dalle partite concluse e solo dai partecipanti segnati come presenti. La presenza si conta automaticamente. La media percentuale non è ponderata; se vuoi un rapporto ponderato serve una futura funzione.
- Formazioni: sei moduli (4-2-3-1, 4-3-3, 4-4-2, 3-5-2, 4-1-2-1-2, 5-3-2), scelta dei titolari per posizione e riserve; suggerimento di compatibilità verde/arancione; ruolo non dichiarato segnalato in rosso. Note tattiche. Proposte duplicabili e approvabili da capitano/admin. La modifica di una formazione riporta lo stato a proposta. Cambiando modulo ricontrolla le assegnazioni; sono mantenute per indice, non automaticamente riottimizzate. Una partita associata a una formazione punta alla formazione corrente; per conservarne lo storico, duplica la formazione prima di modificarla.
- Disponibilità: per ogni partita programmata, Disponibile / In dubbio / Assente / Non risposto, nota opzionale.
- Area staff: appunti privati, generali o associati a un giocatore. Le note nella scheda normale, nelle partite e nelle disponibilità sono invece leggibili da tutti gli iscritti approvati. Non scrivere informazioni sensibili non necessarie.
- Esportazione statistiche CSV e backup JSON manuale da Utenti e permessi. I backup contengono dati privati: conservali offline, mai nel repository pubblico. Ripristino automatico non incluso (si potrà aggiungere o effettuare tramite strumenti amministrativi). Archiviazione reversibile di campi, giocatori, partite, formazioni e note. Eliminare una singola scheda partita cancella i dati di quella scheda, con conferma.

## 8. Aggiornamenti e architettura

Non rifare un nuovo repository. Carica soltanto i file modificati mantenendo `config.js` e il progetto Firebase. GitHub Pages ripubblica allo stesso indirizzo. Le modifiche ai dati e ai campi dal pannello sono salvate in Firestore senza toccare GitHub. Se una futura versione cambia regole o collezioni, applica le nuove regole prima della distribuzione, dopo un backup e preferibilmente un test su un progetto separato.

Struttura:
- `index.html`: pagina di ingresso.
- `config.js`: collegamento al tuo progetto Firebase.
- `assets/style.css`: tema e layout responsive.
- `assets/logo.png`: logo della squadra.
- `js/model.js`: ruoli, moduli, campi iniziali, funzioni di calcolo.
- `js/store.js`: adattatori demo locale e database cloud, autenticazione e ascolto in tempo reale.
- `js/ui.js`: componenti riutilizzabili, modali e gestione dei form.
- `js/app.js`: navigazione e viste funzionali (funzioni separate per sezione).
- `firestore.rules`: autorizzazioni del database, da pubblicare in console.

Collezioni Firestore: `users`, `players`, `fields`, `matches`, `records`, `formations`, `availability`, `staffNotes`. ID stabili, valori delle statistiche indicizzati per ID del campo. Nuove funzionalità possono aggiungere viste e collezioni senza cambiare le precedenti.

## 9. Limiti e manutenzione

Il piano Spark comprende 1 GiB, 50.000 letture e 20.000 scritture al giorno per il database gratuito. Se superi le quote, le richieste possono essere temporaneamente bloccate; controlla Firestore → Usage. La V1 legge le collezioni condivise per mantenerle sincronizzate; con molte stagioni servirà ottimizzare interrogazioni e paginazione. Non attivare Blaze se vuoi evitare fatturazione. GitHub Free Pages richiede repo pubblico; i dati sono su Firebase, non nel codice. Le quote possono cambiare.

Niente API EA, IA a pagamento, import automatico degli screenshot, votazioni o analisi video in questa release. I dati si compilano manualmente. Modifiche concorrenti alla stessa scheda possono sovrascriversi (ultima scrittura prevale); evitate di editare contemporaneamente la stessa scheda. Non è stato effettuato un deployment reale né un test end-to-end con un account Firebase del club. Eseguire la verifica permessi al punto 6 prima dell'uso effettivo.

Documentazione ufficiale: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site ; https://firebase.google.com/docs/web/setup ; https://firebase.google.com/docs/auth/web/google-signin ; https://firebase.google.com/docs/firestore/quickstart ; https://firebase.google.com/docs/firestore/pricing .

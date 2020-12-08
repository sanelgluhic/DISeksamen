# BankingSystem
BankingSystem er et simpelt banksystem til en bankkasserer, udviklet til, at kunne håndtere både klienter (clients) og konti (accounts). Systemet består af simple CRUD (Create, Read, Update, Delete) funktioner, på både client- og account-siden. Funktionerne skaber et simpelt interface, hvor det er muligt at:

**Client siden**
* Oprette ny clienter
* Hente eksisterende client
* Opdatere en clients oplysninger'
* Slet en client

**Account siden**
* Opret en ny account
* Læs accountens balance
* Opdater accountens balance (hæv og indsæt)
* Overfør penge fra en account til en anden
* Slet en account

## Hvordan køres programmet?
### Step 1 - Ændre database URL
Idet at jeg og du sikkert ikke har samme databasenavn, så bør URL'en til databasen ændres følgende steder:



* /DISeksamen/app.js - linje 16
* /DISeksamen/test.js - linje 13

Følgende link kan bruges, hvor "port" og database navn blot tilpasses til egen database:

```bash
'mongodb://localhost: <port> / <database navn>'
```

### Step 2 - Installere NPM
OBS! Dette step skal kun bruges, hvis man vælger at clone projektet fra github. 

GitHub link til cloning: https://github.com/sanelgluhic/DISeksamen.git

Kør "npm install" fra mappen "\DISeksamen". Denne installere alle nødvendige dependencies 
```bash
npm install 
```

### Step 3 - eksekver filerne
Kør "npm start" fra mappen "\DISeksamen" for at eksekvere følgende kommandoer på en gang;
* "npm run seaport listen 9090", 
* "load-balancer.js", 
* 2x "app.js" (2 servere startes)

```bash
npm start
```

### Step 4 - eksekver testen
Kør "test.js" fra mappen "\DISeksamen", for at teste systemet

```bash
npm test # retunerer "15 passing"
```

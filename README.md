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
### Step 1 - eksekver filerne
Kør "npm start" for at eksekvere følgende kommandoer på en gang;
* "npm run seaport listen 9090", 
* "load-balancer.js", 
* 2x "app.js" (2 servere startes)

```bash
npm start
```

### Step 2 - eksekver testen
Kør "test.js" for at teste systemet

```bash
node test.js # retunerer "15 passing"
```

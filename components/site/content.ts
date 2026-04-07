export type SystemSlot = "north" | "west" | "east" | "south" | "northwest";

export const navigation = [
  { id: "sistema", label: "Sistema" },
  { id: "attivita", label: "Attività" },
  { id: "produzione", label: "Produzione" },
  { id: "filiera", label: "Filiera" },
  { id: "metodo", label: "Metodo" },
  { id: "sostenibilita", label: "Sostenibilità" },
  { id: "strutture", label: "Strutture" },
  { id: "mezzi", label: "Mezzi" },
  { id: "fontana", label: "Fontana" },
] as const;

export const heroMetrics = [
  { value: "63", unit: "biolche", label: "terreno sotto gestione" },
  { value: "30", unit: "pannelli", label: "energia integrata" },
  { value: "8", unit: "trattori", label: "mezzi operativi" },
  { value: "2", unit: "operatori", label: "struttura essenziale" },
] as const;

export const heroSignals = [
  "Gestione costante.",
  "Processo sotto controllo.",
  "Nessuna variabilità inutile.",
] as const;

export const systemNodes: ReadonlyArray<{
  slot: SystemSlot;
  title: string;
  text: string;
}> = [
  {
    slot: "north",
    title: "Campi",
    text: "Prato stabile e colture coordinate come base operativa.",
  },
  {
    slot: "west",
    title: "Strutture",
    text: "Edifici nuovi, ordine fisico, flussi leggibili.",
  },
  {
    slot: "east",
    title: "Mezzi",
    text: "Macchine adeguate, utilizzo mirato, capacità continua.",
  },
  {
    slot: "south",
    title: "Energia",
    text: "Fotovoltaico integrato nella gestione ordinaria.",
  },
  {
    slot: "northwest",
    title: "Acqua",
    text: "Irrigazione mirata e fittodepurazione applicata.",
  },
] as const;

export const productionCards = [
  {
    title: "Prato stabile",
    text: "Fieno come materia prima strutturale per la filiera lattiero-casearia.",
    tags: ["base costante", "tagli programmati", "qualità replicabile"],
  },
  {
    title: "Colture coordinate",
    text: "Mais, soia, granoturco, patate e grano con funzione agronomica precisa.",
    tags: ["rotazione", "supporto diretto", "resa controllata"],
  },
  {
    title: "Produzione conto terzi",
    text: "Capacità operativa estesa oltre il perimetro aziendale quando serve.",
    tags: ["mezzi pronti", "tempi stretti", "affidabilità"],
  },
] as const;

export const productionStats = [
  { label: "Produzione principale", value: "Fieno / prato stabile" },
  { label: "Colture", value: "Mais, soia, granoturco, patate, grano" },
  { label: "Supporto", value: "Filiera lattiero-casearia e conto terzi" },
] as const;

export const chainSteps = [
  {
    title: "Campo",
    text: "Suolo gestito, tempi controllati, interventi decisi.",
  },
  {
    title: "Fieno",
    text: "Materia prima con funzione nutrizionale e costanza tecnica.",
  },
  {
    title: "Allevamento",
    text: "Base alimentare per una filiera ad alta disciplina qualitativa.",
  },
  {
    title: "Latte",
    text: "Qualità a monte, prima che il prodotto finale esista.",
  },
  {
    title: "Grana Padano",
    text: "Il risultato visibile arriva dopo. L'origine è qui.",
  },
] as const;

export const methodCards = [
  {
    number: "01",
    title: "Controllo",
    text: "Ogni fase è monitorata. Ogni intervento è deciso, non casuale.",
    micro: "gestione costante",
  },
  {
    number: "02",
    title: "Precisione agronomica",
    text: "Suolo, tempi e lavorazioni sono organizzati per ridurre attrito e variabilità.",
    micro: "tempistiche calibrate",
  },
  {
    number: "03",
    title: "Efficienza",
    text: "Risorse, mezzi ed energia vengono usati con la minima dispersione possibile.",
    micro: "sprechi ridotti",
  },
  {
    number: "04",
    title: "Continuità",
    text: "Il valore è nella stabilità del sistema, non nell'evento singolo.",
    micro: "risultati replicabili",
  },
] as const;

export const sustainabilityMetrics = [
  {
    value: "30 pannelli",
    label: "fotovoltaico",
    text: "Energia in supporto alla struttura, senza narrazione superflua.",
  },
  {
    value: "Bamboo system",
    label: "fittodepurazione",
    text: "Trattamento naturale integrato, con impatto presidiato nel tempo.",
  },
] as const;

export const structurePoints = [
  {
    title: "Ordine fisico",
    text: "Spazi leggibili, superfici pulite, flussi di lavoro senza dispersione.",
  },
  {
    title: "Funzionalità",
    text: "Nuove strutture progettate per supportare operazioni continue e chiare.",
  },
  {
    title: "Integrazione",
    text: "La presenza costruita resta radicata nel territorio, non sovrapposta.",
  },
] as const;

export const equipmentPoints = [
  {
    title: "Dotazione adeguata",
    text: "Otto trattori permettono continuità, manutenzione distribuita e prontezza operativa.",
  },
  {
    title: "Struttura essenziale",
    text: "Due operatori, ruoli chiari, utilizzo preciso dei mezzi in base alla fase.",
  },
  {
    title: "Capacità estesa",
    text: "Quando serve, il sistema entra anche nella produzione conto terzi.",
  },
] as const;

export const identitySignals = [
  "acqua in movimento",
  "riflessi puliti",
  "segno integrato",
] as const;

export const closingMarks = [
  "Rodigo, Mantova",
  "Azienda agricola familiare",
  "Fondata nel 2007",
] as const;

export const activityCards = [
  {
    icon: "🌳",
    title: "Produzione di legna",
    text: "Gestione forestale integrata: taglio, raccolta e lavorazione della legna come risorsa locale e rinnovabile.",
  },
  {
    icon: "🌾",
    title: "Tutti i nostri terreni",
    text: "63 biolche di terreno gestito con rotazione agronomica precisa tra prato stabile, mais, soia, grano e patate.",
  },
  {
    icon: "🚜",
    title: "Pulizia strada azienda",
    text: "Manutenzione costante delle strade rurali: un servizio al territorio che garantisce accessibilità e ordine.",
  },
  {
    icon: "🌸",
    title: "Cura del verde a Rivalta",
    text: "Manutenzione del paesaggio a Rivalta sul Mincio: potature, sfalci e cura degli spazi verdi pubblici.",
  },
] as const;

export const gelsiShowcase = {
  eyebrow: "Patrimonio vivo",
  title: "I gelsi centenari",
  lead: "Recupero e tutela dei gelsi storici del territorio mantovano.",
  text: "Nel cuore della nostra azienda crescono gelsi che hanno attraversato generazioni. Non li trattiamo come alberi qualunque: li curiamo, li proteggiamo, li restituiamo al paesaggio. Ogni gelso è una radice viva della storia agricola di questa terra.",
  marks: ["patrimonio locale", "tutela attiva", "memoria del territorio"],
} as const;

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const toDecimal = (value: string) =>
  new Prisma.Decimal(value.replace(",", "."));

const parseDate = (value: string | null) => {
  if (!value) return null;
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) return null;
  return new Date(Date.UTC(year, month - 1, day));
};

const parseRange = (value: string | null) => {
  if (!value) return { start: null, end: null };
  const [startRaw, endRaw] = value.split("-").map((part) => part.trim());
  return {
    start: parseDate(startRaw ?? null),
    end: parseDate(endRaw ?? null),
  };
};

const records = [
  {
    leader: "Damien Lambert",
    company: "Actimaine",
    range: "05/12/2024 - 05/06/2026",
    email: "contact@acti-maine.fr",
    service: "SEO",
    amountHt: "480",
    status: "ACTIF",
  },
  {
    leader: "Pierre Guillard",
    company: "Méréo",
    range: "05/10/2024 - 05/10/2025",
    email: "guiard.pierre@gmail.com",
    service: "SEO",
    amountHt: "150",
    status: "ACTIF",
  },
  {
    leader: "Adeline Babel",
    company: "COMIZI",
    range: "05/05/2025 - 05/05/2026",
    email: "ababel@comizi.fr",
    service: "SEO",
    amountHt: "250",
    status: "ACTIF",
  },
  {
    leader: "Julien Bidois",
    company: "Julien Bidois Chef",
    range: "05/04/2025 - 04/04/2026",
    email: "julienbidois8@gmail.com",
    service: "SEO",
    amountHt: "250",
    status: "ACTIF",
  },
  {
    leader: "Zidane Desbarres",
    company: "DP RENOV",
    range: "05/11/2024 - 05/07/2027",
    email: "desbarrephillippe@gmail.com",
    service: "SEO",
    amountHt: "291.67",
    status: "ACTIF",
  },
  {
    leader: "Philippe Paumier",
    company: "Ventsetcourbes",
    range: "05/04/2025 - 05/08/2026",
    email: "ventsetcourbes@gmail.com",
    service: "SEO",
    amountHt: "316.67",
    status: "ACTIF",
  },
  {
    leader: "David Botton",
    company: "Boat On Yacht Club",
    range: "05/04/2025 - 05/10/2026",
    email: "botton.david@gmail.com",
    service: "Maintenance web / SEO",
    amountHt: "692.5",
    status: "ACTIF",
  },
  {
    leader: "Clément Nignol",
    company: "STM BZH",
    range: "05/06/2025 - 05/10/2026",
    email: "clement.nignol@stm-bzh.fr",
    service: "SEO",
    amountHt: "333,3",
    status: "ACTIF",
  },
  {
    leader: "Edouard Suchet",
    company: "ES COMMUNICATION",
    range: "05/06/2025 - 05/06/2026",
    email: "edouard@es-solutions.fr",
    service: "SEO",
    amountHt: "250",
    status: "ACTIF",
  },
  {
    leader: "Julien Bidoit",
    company: "Chef Julien Bidois",
    range: null,
    email: "julienbidois8@gmail.com",
    service: "SEO",
    amountHt: "300",
    status: "ACTIF",
  },
  {
    leader: "Mehrad",
    company: "Matineh Food",
    range: "05/11/2025 - 05/11/2026",
    email: "contact@matinehfood.com",
    service: "SEO",
    amountHt: "300",
    status: "ACTIF",
  },
  {
    leader: "Stéphane Hortelano",
    company: "Rennes Pneus",
    range: "05/04/2025 - 05/04/2026",
    email: "contact@rennespneus.fr",
    service: "SEO",
    amountHt: "500",
    status: "SUSPENDU",
  },
  {
    leader: "Amhed",
    company: "AS Prestige",
    range: "05/07/2025 - 05/07/2026",
    email: "contact@rennespneus.fr",
    service: "SEO",
    amountHt: "500",
    status: "SUSPENDU",
  },
  {
    leader: "Ibrahim",
    company: "Renov +",
    range: null,
    email: "contact@sas-renovplus.com",
    service: "SEO",
    amountHt: "500",
    status: "ACTIF",
  },
  {
    leader: "Ibrahim",
    company: "Matcha",
    range: null,
    email: "contact@sas-renovplus.com",
    service: "SEO",
    amountHt: "500",
    status: "ACTIF",
  },
  {
    leader: "Solatrack",
    company: "Outil web",
    range: null,
    email: "sis.jadelefeuvre@gmail.com",
    service: "Maintenance web",
    amountHt: "200",
    status: "ACTIF",
  },
  {
    leader: "Solatrack",
    company: "Outil web",
    range: null,
    email: "sis.jadelefeuvre@gmail.com",
    service: "Paiement de l'outil",
    amountHt: "1200",
    status: "ACTIF",
  },
  {
    leader: "Benoît Planchon",
    company: "Happy Kite Surf",
    range: "05/11/2024 - 05/11/2025",
    email: "benoitplanchon@gmail.com",
    service: "SEO",
    amountHt: "316.67",
    status: "TERMINE",
  },
  {
    leader: "Brad Mouche",
    company: "ECO HABITAT",
    range: "05/06/2025 - 05/06/2026",
    email: "ecohabitat44.contact@gmail.com",
    service: "SEO",
    amountHt: "416.67",
    status: "TERMINE",
  },
  {
    leader: "Safak Evin",
    company: "LAS SIETTE",
    range: "05/07/2024 - 05/07/2025",
    email: "safak.evin@las-siette.fr",
    service: "SEO",
    amountHt: "100",
    status: "TERMINE",
  },
  {
    leader: "Louise Lequipee",
    company: "EPICU",
    range: "05/04/2024 - 05/08/2025",
    email: "contact@epicu.fr",
    service: "Site web",
    amountHt: "550",
    status: "TERMINE",
  },
  {
    leader: "William Claudi",
    company: "Protecttoit",
    range: "05/04/2024 - 05/04/2025",
    email: "protecttoit@gmail.com",
    service: "SEO",
    amountHt: "400",
    status: "TERMINE",
  },
  {
    leader: "Gautier Lorgeoux",
    company: "Pépites",
    range: "05/05/2022 - 05/05/2025",
    email: "contact@pepites-lacave.com",
    service: "SEO",
    amountHt: "455",
    status: "TERMINE",
  },
  {
    leader: "Camille",
    company: "Guest House Service",
    range: "05/07/2025 - 05/07/2026",
    email: "contact@guesthomeservice.fr",
    service: "SEO",
    amountHt: "500",
    status: "TERMINE",
  },
  {
    leader: "Marc Suchet",
    company: "Mister Pool",
    range: "05/03/2025 - 05/09/2026",
    email: "info@mister-pool.fr",
    service: "Maintenance web / SEO",
    amountHt: "1167",
    status: "TERMINE",
  },
  {
    leader: "Maxime Guillois",
    company: "Maxx Le Magicien",
    range: "05/12/2024 - 05/12/2025",
    email: "guilloismaxime@yahoo.fr",
    service: "SEO",
    amountHt: "291.67",
    status: "TERMINE",
  },
];

const main = async () => {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, vatRate: 20, taxRate: 26 },
  });

  await prisma.clientRecord.deleteMany();

  for (const record of records) {
    const range = parseRange(record.range);
    await prisma.clientRecord.create({
      data: {
        leader: record.leader,
        company: record.company,
        email: record.email,
        service: record.service,
        amountHt: toDecimal(record.amountHt),
        frequency: "MENSUEL",
        status: record.status as "ACTIF" | "SUSPENDU" | "TERMINE",
        startDate: range.start,
        endDate: range.end,
      },
    });
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  createRecord,
  deleteRecord,
  updateRecord,
  updateSettings,
} from "@/app/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const formatMoney = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (value: Date | null) => {
  if (!value) return "—";
  return value.toLocaleDateString("fr-FR");
};

const toInputDate = (value: Date | null) => {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
};

export default async function Home({
  searchParams,
}: {
  searchParams?: { edit?: string };
}) {
  const settings =
    (await prisma.settings.findUnique({ where: { id: 1 } })) ??
    (await prisma.settings.create({
      data: { id: 1, vatRate: 20, taxRate: 26 },
    }));

  const records = await prisma.clientRecord.findMany({
    orderBy: [{ status: "asc" }, { company: "asc" }],
  });

  const editableRecord = records.find(
    (record) => record.id === searchParams?.edit,
  );

  const activeRecords = records.filter(
    (record) => record.status !== "TERMINE",
  );
  const archivedRecords = records.filter(
    (record) => record.status === "TERMINE",
  );

  const totalHt = activeRecords.reduce(
    (sum, record) => sum + Number(record.amountHt),
    0,
  );

  const vatRate = Number(settings.vatRate) / 100;
  const taxRate = Number(settings.taxRate) / 100;

  const totalTtc = totalHt * (1 + vatRate);
  const totalAfterTax = totalHt * (1 - taxRate);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Document interne
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Liste des clients récurrents
          </h1>
          <p className="text-base text-slate-600">
            Ajoutez, modifiez ou supprimez une ligne. Les anciens clients restent
            stockés dans la base.
          </p>
        </header>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Résumé mensuel
              </h2>
              <p className="text-sm text-slate-500">
                Calculé sur les contrats actifs et suspendus.
              </p>
            </div>
            <form
              action={updateSettings}
              className="flex flex-wrap gap-3 text-sm"
            >
              <label className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
                TVA (%)
                <input
                  name="vatRate"
                  type="number"
                  step="0.01"
                  defaultValue={settings.vatRate.toString()}
                  className="w-20 bg-transparent text-right outline-none"
                />
              </label>
              <label className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
                Impôts (%)
                <input
                  name="taxRate"
                  type="number"
                  step="0.01"
                  defaultValue={settings.taxRate.toString()}
                  className="w-20 bg-transparent text-right outline-none"
                />
              </label>
              <button className="rounded-full bg-slate-900 px-4 py-2 text-white">
                Mettre à jour
              </button>
            </form>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Total HT mensuel
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {formatMoney(totalHt)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Total TTC mensuel
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {formatMoney(totalTtc)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Après TVA & impôts
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {formatMoney(totalAfterTax)}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editableRecord ? "Modifier un client" : "Ajouter un client"}
            </h2>
            <p className="text-sm text-slate-500">
              Saisissez les informations du contrat mensuel.
            </p>
          </div>
          <form
            action={editableRecord ? updateRecord : createRecord}
            className="grid gap-4 md:grid-cols-2"
          >
            {editableRecord ? (
              <input type="hidden" name="id" value={editableRecord.id} />
            ) : null}
            <label className="grid gap-2 text-sm">
              Dirigeant
              <input
                name="leader"
                required
                defaultValue={editableRecord?.leader ?? ""}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Entreprise
              <input
                name="company"
                required
                defaultValue={editableRecord?.company ?? ""}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Mail
              <input
                name="email"
                type="email"
                required
                defaultValue={editableRecord?.email ?? ""}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Prestation
              <input
                name="service"
                required
                defaultValue={editableRecord?.service ?? ""}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Montant HT
              <input
                name="amountHt"
                type="number"
                step="0.01"
                required
                defaultValue={editableRecord?.amountHt.toString() ?? ""}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Fréquence
              <select
                name="frequency"
                defaultValue={editableRecord?.frequency ?? "MENSUEL"}
                className="rounded-lg border border-slate-200 px-3 py-2"
              >
                <option value="MENSUEL">Mensuel</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              Date de début
              <input
                name="startDate"
                type="date"
                defaultValue={toInputDate(editableRecord?.startDate ?? null)}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Date de fin
              <input
                name="endDate"
                type="date"
                defaultValue={toInputDate(editableRecord?.endDate ?? null)}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Statut
              <select
                name="status"
                defaultValue={editableRecord?.status ?? "ACTIF"}
                className="rounded-lg border border-slate-200 px-3 py-2"
              >
                <option value="ACTIF">Actif</option>
                <option value="SUSPENDU">Suspendu</option>
                <option value="TERMINE">Terminé</option>
              </select>
            </label>
            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              <button className="rounded-full bg-slate-900 px-5 py-2 text-white">
                {editableRecord ? "Enregistrer" : "Ajouter"}
              </button>
              {editableRecord ? (
                <Link
                  href="/"
                  className="rounded-full border border-slate-200 px-5 py-2 text-slate-600"
                >
                  Annuler
                </Link>
              ) : null}
            </div>
          </form>
        </section>

        <section className="grid gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Clients actifs et suspendus
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Dirigeant</th>
                  <th className="px-4 py-3">Entreprise</th>
                  <th className="px-4 py-3">Date contrat</th>
                  <th className="px-4 py-3">Mail</th>
                  <th className="px-4 py-3">Prestation</th>
                  <th className="px-4 py-3 text-right">Montant HT</th>
                  <th className="px-4 py-3">Fréquence</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {record.leader}
                    </td>
                    <td className="px-4 py-3">{record.company}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(record.startDate)} -{" "}
                      {formatDate(record.endDate)}
                    </td>
                    <td className="px-4 py-3">{record.email}</td>
                    <td className="px-4 py-3">{record.service}</td>
                    <td className="px-4 py-3 text-right">
                      {formatMoney(Number(record.amountHt))}
                    </td>
                    <td className="px-4 py-3">Mensuel</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          record.status === "SUSPENDU"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {record.status === "SUSPENDU" ? "Suspendu" : "Actif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/?edit=${record.id}`}
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                        >
                          Modifier
                        </Link>
                        <form action={deleteRecord}>
                          <input type="hidden" name="id" value={record.id} />
                          <button className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600">
                            Supprimer
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {activeRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Aucun client actif pour le moment.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Clients terminés
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Dirigeant</th>
                  <th className="px-4 py-3">Entreprise</th>
                  <th className="px-4 py-3">Date contrat</th>
                  <th className="px-4 py-3">Mail</th>
                  <th className="px-4 py-3">Prestation</th>
                  <th className="px-4 py-3 text-right">Montant HT</th>
                  <th className="px-4 py-3">Fréquence</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {archivedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {record.leader}
                    </td>
                    <td className="px-4 py-3">{record.company}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(record.startDate)} -{" "}
                      {formatDate(record.endDate)}
                    </td>
                    <td className="px-4 py-3">{record.email}</td>
                    <td className="px-4 py-3">{record.service}</td>
                    <td className="px-4 py-3 text-right">
                      {formatMoney(Number(record.amountHt))}
                    </td>
                    <td className="px-4 py-3">Mensuel</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                        Terminé
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/?edit=${record.id}`}
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                        >
                          Modifier
                        </Link>
                        <form action={deleteRecord}>
                          <input type="hidden" name="id" value={record.id} />
                          <button className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600">
                            Supprimer
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {archivedRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Aucun client terminé pour le moment.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const toDecimal = (value: string) =>
  new Prisma.Decimal(value.replace(",", "."));

const toDate = (value: FormDataEntryValue | null) => {
  if (!value) return null;
  const stringValue = value.toString().trim();
  if (!stringValue) return null;
  return new Date(`${stringValue}T00:00:00.000Z`);
};

const normalizeString = (value: FormDataEntryValue | null) =>
  value?.toString().trim() ?? "";

const normalizeEmail = (value: FormDataEntryValue | null) =>
  value?.toString().trim().toLowerCase() ?? "";

export async function createRecord(formData: FormData) {
  const leader = normalizeString(formData.get("leader"));
  const company = normalizeString(formData.get("company"));
  const email = normalizeEmail(formData.get("email"));
  const service = normalizeString(formData.get("service"));
  const amountHt = normalizeString(formData.get("amountHt"));
  const frequency = normalizeString(formData.get("frequency"));
  const status = normalizeString(formData.get("status"));
  const startDate = toDate(formData.get("startDate"));
  const endDate = toDate(formData.get("endDate"));

  if (!leader || !company || !email || !service || !amountHt) {
    return;
  }

  await prisma.clientRecord.create({
    data: {
      leader,
      company,
      email,
      service,
      amountHt: toDecimal(amountHt),
      frequency: frequency === "MENSUEL" ? "MENSUEL" : "MENSUEL",
      status:
        status === "SUSPENDU"
          ? "SUSPENDU"
          : status === "TERMINE"
            ? "TERMINE"
            : "ACTIF",
      startDate,
      endDate,
    },
  });

  revalidatePath("/");
}

export async function updateRecord(formData: FormData) {
  const id = normalizeString(formData.get("id"));
  const leader = normalizeString(formData.get("leader"));
  const company = normalizeString(formData.get("company"));
  const email = normalizeEmail(formData.get("email"));
  const service = normalizeString(formData.get("service"));
  const amountHt = normalizeString(formData.get("amountHt"));
  const frequency = normalizeString(formData.get("frequency"));
  const status = normalizeString(formData.get("status"));
  const startDate = toDate(formData.get("startDate"));
  const endDate = toDate(formData.get("endDate"));

  if (!id || !leader || !company || !email || !service || !amountHt) {
    return;
  }

  await prisma.clientRecord.update({
    where: { id },
    data: {
      leader,
      company,
      email,
      service,
      amountHt: toDecimal(amountHt),
      frequency: frequency === "MENSUEL" ? "MENSUEL" : "MENSUEL",
      status:
        status === "SUSPENDU"
          ? "SUSPENDU"
          : status === "TERMINE"
            ? "TERMINE"
            : "ACTIF",
      startDate,
      endDate,
    },
  });

  revalidatePath("/");
}

export async function deleteRecord(formData: FormData) {
  const id = normalizeString(formData.get("id"));
  if (!id) return;

  await prisma.clientRecord.delete({
    where: { id },
  });

  revalidatePath("/");
}

export async function updateSettings(formData: FormData) {
  const vatRate = normalizeString(formData.get("vatRate"));
  const taxRate = normalizeString(formData.get("taxRate"));

  await prisma.settings.upsert({
    where: { id: 1 },
    update: {
      vatRate: vatRate ? toDecimal(vatRate) : undefined,
      taxRate: taxRate ? toDecimal(taxRate) : undefined,
    },
    create: {
      id: 1,
      vatRate: vatRate ? toDecimal(vatRate) : 20,
      taxRate: taxRate ? toDecimal(taxRate) : 26,
    },
  });

  revalidatePath("/");
}

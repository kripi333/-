import { isLocale } from "@/config/i18n";
import { company } from "@/config/company";
import { isMovingType, isServiceKey, limits } from "@/config/pricing";

const contactKeys = ["telegram", "instagram", "viber", "email", "phone"] as const;

type IncomingRequest = {
  name?: unknown;
  contacts?: Record<string, unknown>;
  message?: unknown;
  consent?: unknown;
  locale?: unknown;
  summary?: Record<string, unknown> | null;
};

/** Ошибки без текста на конкретном языке: клиент переводит их сам. */
class RequestError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

function validate(body: IncomingRequest) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (name.length < 2 || name.length > 120) throw new RequestError("name");

  const contacts = body.contacts && typeof body.contacts === "object" ? body.contacts : {};
  const filled = contactKeys
    .map((key) => ({ key, value: typeof contacts[key] === "string" ? (contacts[key] as string).trim() : "" }))
    .filter((item) => item.value.length > 0);
  if (filled.length === 0) throw new RequestError("contacts");

  const email = filled.find((item) => item.key === "email")?.value;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new RequestError("email");

  const phone = filled.find((item) => item.key === "phone" || item.key === "viber")?.value;
  if (phone && phone.replace(/[^\d]/g, "").length < 7) throw new RequestError("phone");

  if (body.consent !== true) throw new RequestError("consent");

  const message = typeof body.message === "string" ? body.message.slice(0, 2000) : "";

  const summary = body.summary && typeof body.summary === "object" ? body.summary : null;
  const cleanSummary = summary && isMovingType(summary.movingType) && Array.isArray(summary.services)
    && summary.services.every(isServiceKey)
    ? {
        movingType: summary.movingType,
        area: Number(summary.area) || 0,
        distance: Number(summary.distance) || 0,
        originFloor: Math.min(limits.floor.max, Math.max(0, Number(summary.originFloor) || 0)),
        destinationFloor: Math.min(limits.floor.max, Math.max(0, Number(summary.destinationFloor) || 0)),
        originElevator: Boolean(summary.originElevator),
        destinationElevator: Boolean(summary.destinationElevator),
        services: summary.services,
        date: typeof summary.date === "string" ? summary.date.slice(0, 32) : "",
        cityFrom: typeof summary.cityFrom === "string" ? summary.cityFrom.slice(0, 120) : "",
        cityTo: typeof summary.cityTo === "string" ? summary.cityTo.slice(0, 120) : "",
        min: Number(summary.min) || 0,
        max: Number(summary.max) || 0,
        id: typeof summary.id === "string" ? summary.id.slice(0, 40) : "",
      }
    : null;

  const locale = isLocale(body.locale) ? body.locale : "de";

  return { name, contacts: Object.fromEntries(filled.map((item) => [item.key, item.value])), message, summary: cleanSummary, locale };
}

export async function POST(request: Request) {
  let body: IncomingRequest;
  try {
    body = (await request.json()) as IncomingRequest;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  try {
    const payload = validate(body);

    // Доставка заявки: пока логирование + структурированный ответ.
    // Для продакшена здесь добавляется SMTP/Telegram-бот или CRM-вебхук,
    // а также rate limiting и антиспам (см. README, раздел «Перед публикацией»).
    console.info("[request]", JSON.stringify({
      receivedAt: new Date().toISOString(),
      locale: payload.locale,
      name: payload.name,
      contacts: payload.contacts,
      message: payload.message,
      estimateId: payload.summary?.id ?? null,
      priceRange: payload.summary ? [payload.summary.min, payload.summary.max] : null,
      notify: company.email,
    }));

    return Response.json({ ok: true, receivedAt: new Date().toISOString(), estimateId: payload.summary?.id ?? null });
  } catch (error) {
    if (error instanceof RequestError) return Response.json({ ok: false, error: error.code }, { status: 400 });
    return Response.json({ ok: false, error: "server" }, { status: 500 });
  }
}

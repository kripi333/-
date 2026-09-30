import { calculateMove, isMovingType, isServiceKey, limits, type CalculationInput } from "@/config/pricing";

/**
 * Расчёт стоимости. Тексты ошибок возвращаются кодами:
 * сообщение на нужном языке формирует интерфейс, а не API.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CalculationInput;
    const areaOk = Number.isFinite(body.area) && body.area >= limits.area.min && body.area <= limits.area.max;
    const distanceOk = Number.isFinite(body.distance) && body.distance >= limits.distance.min && body.distance <= limits.distance.max;
    const servicesOk = Array.isArray(body.services) && body.services.every(isServiceKey);

    if (!isMovingType(body.movingType) || !areaOk || !distanceOk || !servicesOk) {
      return Response.json({ ok: false, error: "invalid_input" }, { status: 400 });
    }

    const safe = {
      ...body,
      originFloor: Math.max(limits.floor.min, Math.min(limits.floor.max, Number(body.originFloor) || 0)),
      destinationFloor: Math.max(limits.floor.min, Math.min(limits.floor.max, Number(body.destinationFloor) || 0)),
      originElevator: Boolean(body.originElevator),
      destinationElevator: Boolean(body.destinationElevator),
    };
    const result = calculateMove(safe);
    const id = `KUS-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    return Response.json({ ...result, id });
  } catch {
    return Response.json({ ok: false, error: "server" }, { status: 500 });
  }
}

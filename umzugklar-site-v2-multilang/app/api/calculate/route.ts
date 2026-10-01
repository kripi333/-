import { calculateMove, type CalculationInput, pricing } from "@/config/pricing";

const validTypes = Object.keys(pricing.base);
const validServices = Object.keys(pricing.services);

export async function POST(request: Request) {
  try {
    const body = await request.json() as CalculationInput;
    if (!validTypes.includes(body.movingType) || !Number.isFinite(body.area) || body.area < 1 || body.area > 1000 || !Number.isFinite(body.distance) || body.distance < 0 || body.distance > 3000 || !Array.isArray(body.services) || body.services.some((s) => !validServices.includes(s))) {
      return Response.json({ error: "Bitte prüfen Sie Ihre Angaben." }, { status: 400 });
    }
    const safe = { ...body, originFloor: Math.max(0, Math.min(30, Number(body.originFloor) || 0)), destinationFloor: Math.max(0, Math.min(30, Number(body.destinationFloor) || 0)), originElevator: Boolean(body.originElevator), destinationElevator: Boolean(body.destinationElevator) };
    const result = calculateMove(safe);
    const id = `MOV-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    return Response.json({ ...result, id });
  } catch { return Response.json({ error: "Die Berechnung konnte nicht gestartet werden." }, { status: 400 }); }
}

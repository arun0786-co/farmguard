// real forecast from open-meteo.com (free, no key) + simple farm tips from it

export type day = { date: string; max: number; min: number; rain: number; rain_chance: number; wind: number };
export type forecast = { place: string; days: day[] };

export async function get_forecast(place: string): Promise<forecast | null> {
    const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=en&format=json`,
    ).then((r) => r.json());
    const hit = geo?.results?.[0];
    if (!hit) return null;

    const q = new URLSearchParams({
        latitude: String(hit.latitude),
        longitude: String(hit.longitude),
        daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max",
        timezone: "auto",
        forecast_days: "5",
    });
    const f = await fetch(`https://api.open-meteo.com/v1/forecast?${q}`).then((r) => r.json());
    const d = f.daily;
    const days: day[] = d.time.map((t: string, i: number) => ({
        date: t,
        max: d.temperature_2m_max[i],
        min: d.temperature_2m_min[i],
        rain: d.precipitation_sum[i] ?? 0,
        rain_chance: d.precipitation_probability_max?.[i] ?? 0,
        wind: d.wind_speed_10m_max[i],
    }));
    const where = [hit.name, hit.admin1, hit.country].filter(Boolean).join(", ");
    return { place: where, days };
}

export function farm_tips(days: day[]): string[] {
    const tips: string[] = [];
    const soon = days.slice(0, 2);
    if (soon.some((d) => d.rain >= 5 || d.rain_chance >= 60)) {
        tips.push("Rain expected in the next 2 days: don't spray pesticide or put fertilizer now, the rain will wash it away.");
    }
    if (days.some((d) => d.rain >= 50)) tips.push("Heavy rain coming: clear field drains so water does not stand.");
    if (days.some((d) => d.max >= 38)) tips.push("Very hot days: water in the evening or early morning, use mulch to keep soil wet.");
    if (days.some((d) => d.min <= 6)) tips.push("Very cold nights: frost risk. Light irrigation in the evening helps protect crops.");
    if (soon.some((d) => d.wind >= 25)) tips.push("Windy: don't spray, it will drift. Support tall crops like banana or sugarcane.");
    if (days.every((d) => d.rain < 1)) tips.push("No rain for 5 days: plan your irrigation.");
    if (!tips.length) tips.push("Normal weather: a good time for field work and spraying (early morning or evening).");
    return tips;
}

function day_name(date: string, i: number) {
    if (i === 0) return "Today";
    if (i === 1) return "Tomorrow";
    return new Date(date + "T00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function weather_text(f: forecast) {
    const lines = [`**🌤️ Weather for ${f.place}**`, ""];
    f.days.forEach((d, i) => {
        const rain = d.rain >= 1 ? `🌧️ ${d.rain.toFixed(0)} mm` : "☀️ dry";
        lines.push(`• **${day_name(d.date, i)}:** ${Math.round(d.min)}-${Math.round(d.max)}°C, ${rain} (${d.rain_chance}% chance)`);
    });
    lines.push("", "**🌾 For your farm:**", ...farm_tips(f.days).map((t) => `• ${t}`));
    lines.push("", "_forecast from open-meteo.com_");
    return lines.join("\n");
}

// "weather in thrissur" / "weather at Pune tomorrow" -> place name
export function place_from(text: string) {
    const m = text.match(/\b(?:in|at|for|of)\s+([a-z][a-z .'-]{1,40})/i);
    if (!m) return "";
    return m[1].replace(/\b(today|tomorrow|this week|now)\b/gi, "").replace(/[?.!]+$/, "").trim();
}

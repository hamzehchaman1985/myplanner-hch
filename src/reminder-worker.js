export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({
        ok: true,
        service: "myplanner-reminder-cron",
        cronSecretConfigured: Boolean(env.CRON_SECRET),
        targetConfigured: Boolean(env.SUPABASE_FUNCTION_URL)
      });
    }

    return new Response("My Planner reminder scheduler is active.", {
      status: 200,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(sendReminders(env));
  }
};

async function sendReminders(env) {
  if (!env.CRON_SECRET) {
    throw new Error("CRON_SECRET is not configured");
  }

  const target =
    env.SUPABASE_FUNCTION_URL ||
    "https://tskpdopzrqfqgtmjneiq.supabase.co/functions/v1/send-reminders";

  const response = await fetch(target, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-cron-secret": env.CRON_SECRET
    },
    body: "{}"
  });

  const body = await response.text();

  console.log(JSON.stringify({
    event: "send-reminders",
    status: response.status,
    ok: response.ok,
    body: body.slice(0, 1000)
  }));

  if (!response.ok) {
    throw new Error(
      `Supabase send-reminders failed: ${response.status} ${body.slice(0, 500)}`
    );
  }
}

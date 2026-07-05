import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { drive_folder_origem, cid, nome_condominio, email_destino } = body ?? {};

  if (!drive_folder_origem || !cid || !nome_condominio || !email_destino) {
    return NextResponse.json(
      { error: "Preencha todos os campos antes de enviar." },
      { status: 400 }
    );
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;
  const headerName = process.env.N8N_WEBHOOK_HEADER_NAME || "Authorization";

  if (!webhookUrl || !webhookSecret) {
    return NextResponse.json(
      {
        error:
          "Aplicativo não configurado. Defina N8N_WEBHOOK_URL e N8N_WEBHOOK_SECRET.",
      },
      { status: 500 }
    );
  }

  try {
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [headerName]: webhookSecret,
      },
      body: JSON.stringify({
        drive_folder_origem,
        cid,
        nome_condominio,
        email_destino,
      }),
    });

    if (!n8nResponse.ok) {
      const text = await n8nResponse.text().catch(() => "");
      return NextResponse.json(
        {
          error:
            "O n8n recusou a submissão. Confira a pasta do Drive, o CID e tente novamente.",
          details: text.slice(0, 500),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível contatar o n8n. Tente novamente em instantes." },
      { status: 502 }
    );
  }
}

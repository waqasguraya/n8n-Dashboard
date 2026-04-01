export async function GET() {
  const email = process.env.NEXT_PUBLIC_JIRA_EMAIL;
  const token = process.env.NEXT_PUBLIC_JIRA_API_TOKEN;
  const baseUrl = process.env.NEXT_PUBLIC_JIRA_BASE_URL;

  const auth = Buffer.from(`${email}:${token}`).toString("base64");

  try {
    const response = await fetch(`${baseUrl}/rest/api/3/project`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Accept": "application/json"
      }
    });

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Failed to fetch Jira data" }, { status: 500 });
  }
}

export async function POST(request) {
  const token = process.env.NEXT_PUBLIC_JIRA_API_TOKEN;
  const baseUrl = process.env.NEXT_PUBLIC_JIRA_BASE_URL;

  try {
    const body = await request.json();
    const { username, email, name } = body;

    const userData = {
      name: username,
      emailAddress: email,
      displayName: name,
      password: username,
      notification: false,
    };

    const response = await fetch(`${baseUrl}/rest/api/2/user`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ error: `Failed to create user: Status ${response.status}, ${errorText}` }, { status: response.status });
    }

    const data = await response.json();

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ error: "Failed to create Jira user" }, { status: 500 });
  }
}
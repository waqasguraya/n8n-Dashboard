export default async function handler(req, res) {
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

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Jira data" });
  }
}
// pages/api/jira.js
export default async function handler(req, res) {
  const JIRA_BASE_URL = "https://jira.capregsoft.com"; // replace with your Jira domain
  const JIRA_EMAIL = "maliksaddique139@gmail.com"; // the email used for Jira
  const JIRA_API_TOKEN = process.env.Nzk0NDk0NDM1MTkzOp2efqWGSyLgr6/RWZZO1WxS2qss; // store your token in .env.local

  try {
    const response = await fetch(`${JIRA_BASE_URL}/rest/api/3/myself`, {
      headers: {
        "Authorization": `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
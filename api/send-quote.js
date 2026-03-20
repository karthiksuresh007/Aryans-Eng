const QUOTE_TO_EMAIL = "aryansengineeringlimited@gmail.com";
const RESEND_API_URL = "https://api.resend.com/emails";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const readBody = (body) => {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  return body;
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "Missing RESEND_API_KEY" });
  }

  const payload = readBody(req.body);
  const {
    name = "",
    phone = "",
    email = "",
    "project-type": projectType = "",
    location = "",
    budget = "",
    description = ""
  } = payload;

  if (!name || !phone || !email || !projectType || !location || !budget || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeEmail = escapeHtml(email);
  const safeProjectType = escapeHtml(projectType);
  const safeLocation = escapeHtml(location);
  const safeBudget = escapeHtml(budget);
  const safeDescription = escapeHtml(description).replace(/\n/g, "<br>");

  const emailPayload = {
    from: "Aryan's Engineering <onboarding@resend.dev>",
    to: [QUOTE_TO_EMAIL],
    subject: `New Quote Enquiry - ${projectType}`,
    reply_to: email,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2 style="margin-bottom:16px;">New Website Enquiry</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Project Type:</strong> ${safeProjectType}</p>
        <p><strong>Location:</strong> ${safeLocation}</p>
        <p><strong>Budget:</strong> ${safeBudget}</p>
        <p><strong>Description:</strong><br>${safeDescription}</p>
      </div>
    `,
    text: [
      "New Website Enquiry",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Project Type: ${projectType}`,
      `Location: ${location}`,
      `Budget: ${budget}`,
      `Description: ${description}`
    ].join("\n"),
    tags: [
      { name: "source", value: "website" },
      { name: "form", value: "quote" }
    ]
  };

  try {
    const resendResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(emailPayload)
    });

    const resendResult = await resendResponse.json();

    if (!resendResponse.ok) {
      return res.status(500).json({
        error: resendResult.message || "Failed to send email"
      });
    }

    return res.status(200).json({
      ok: true,
      id: resendResult.id
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unexpected server error"
    });
  }
};

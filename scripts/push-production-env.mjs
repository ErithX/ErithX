import fs from "node:fs";
import path from "node:path";

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf-8");
  const result = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      result[key] = val;
    }
  }
  return result;
}

async function main() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.error("❌ Error: VERCEL_TOKEN environment variable is not set.");
    process.exit(1);
  }

  const projectName = process.env.VERCEL_PROJECT_NAME || "contest-tracker-zms3";
  const localEnv = parseEnv(".env");

  const keysToSync = [
    "CLIST_API_KEY",
    "CLIST_USERNAME",
    "ENABLE_EMAIL_SERVICE",
    "GEMINI_API_KEY",
    "GROK_API_KEY",
    "GROQ_FALLBACK_KEY",
    "MONGODB_URI",
    "NEXT_PUBLIC_SUPERADMIN_EMAILS",
    "SUPERADMIN_EMAILS",
    "RESEND_API_KEY",
  ];

  console.log(`Connecting to Vercel via @vercel/sdk for project "${projectName}"...`);
  const { Vercel } = await import("@vercel/sdk");
  const vercel = new Vercel({ bearerToken: token });

  let successCount = 0;
  for (const key of keysToSync) {
    let value = localEnv[key];
    if (!value && key === "SUPERADMIN_EMAILS") {
      value = localEnv["NEXT_PUBLIC_SUPERADMIN_EMAILS"];
    }

    if (!value) {
      console.warn(`⚠️ Skipping ${key}: No value found in local .env`);
      continue;
    }

    const isSensitive = !(
      key.startsWith("NEXT_PUBLIC_") ||
      key === "ENABLE_EMAIL_SERVICE" ||
      key === "CLIST_USERNAME" ||
      key === "SUPERADMIN_EMAILS"
    );

    const type = isSensitive ? "sensitive" : "plain";

    try {
      console.log(`⏳ Updating ${key} (type: ${type}) in production...`);
      await vercel.projects.createProjectEnv({
        idOrName: projectName,
        upsert: "true",
        requestBody: {
          key,
          value,
          type,
          target: ["production"],
        },
      });
      console.log(`✅ Successfully updated ${key}`);
      successCount++;
    } catch (err) {
      console.error(`❌ Failed to update ${key}:`, err?.message || err);
    }
  }

  console.log(`\n🎉 Completed: ${successCount} environment variable(s) updated in production!`);
}

main();

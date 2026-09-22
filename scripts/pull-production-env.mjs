import fs from "node:fs";
import path from "node:path";

async function main() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.error("\n❌ Error: VERCEL_TOKEN environment variable is not set.\n");
    console.error("To obtain a token: Visit https://vercel.com/account/tokens to create a personal access token.");
    console.error("Then run in PowerShell:");
    console.error("  $env:VERCEL_TOKEN=\"<your_token_here>\"");
    console.error("  node scripts/pull-production-env.mjs\n");
    process.exit(1);
  }

  const projectName = process.env.VERCEL_PROJECT_NAME || "contest-tracker-zms3";
  const outputFile = process.env.OUTPUT_FILE || ".env.production.local";
  const outputPath = path.resolve(process.cwd(), outputFile);

  console.log(`Connecting to Vercel via @vercel/sdk...`);
  const { Vercel } = await import("@vercel/sdk");
  const vercel = new Vercel({ bearerToken: token });

  console.log(`Fetching environment variables for project "${projectName}"...`);

  try {
    const response = await vercel.projects.filterProjectEnvs({
      idOrName: projectName,
      decrypt: "true",
    });

    const envs = response.envs || [];
    console.log(`Retrieved ${envs.length} total environment variable(s).`);

    const prodEnvs = envs.filter((item) => {
      if (Array.isArray(item.target)) {
        return item.target.includes("production");
      }
      return item.target === "production";
    });

    if (prodEnvs.length === 0) {
      console.warn("⚠️  No variables targeted for 'production' found in this project.");
    }

    const lines = [
      `# Production environment variables imported via @vercel/sdk`,
      `# Project: ${projectName}`,
      `# Date: ${new Date().toISOString()}`,
      "",
    ];

    for (const env of prodEnvs) {
      const val = env.value ?? "";
      if (val.includes("\n") || val.includes(" ") || val.includes('"') || val.includes("'")) {
        const escaped = val.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
        lines.push(`${env.key}="${escaped}"`);
      } else {
        lines.push(`${env.key}=${val}`);
      }
    }

    fs.writeFileSync(outputPath, lines.join("\n") + "\n", "utf-8");
    console.log(`✅ Successfully imported ${prodEnvs.length} production variable(s) with decrypted values into ${outputFile}`);
  } catch (error) {
    console.error("❌ Failed to fetch environment variables:", error?.message || error);
    process.exit(1);
  }
}

main();

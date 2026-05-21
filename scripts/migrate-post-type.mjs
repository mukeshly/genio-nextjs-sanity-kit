import { createClient } from "@sanity/client";

const REQUIRED_ENV_VARS = [
  "SANITY_PROJECT_ID",
  "SANITY_DATASET",
  "SANITY_API_WRITE_TOKEN",
];

function getMissingEnvVars(env) {
  return REQUIRED_ENV_VARS.filter((name) => !env[name]?.trim());
}

function createSanityClient(env) {
  const missing = getMissingEnvVars(env);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }

  return createClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    apiVersion: env.SANITY_API_VERSION || "2026-05-22",
    token: env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  });
}

function parseArgs(argv) {
  return {
    write: argv.includes("--write"),
  };
}

async function fetchPostIdsMissingType(client) {
  return client.fetch(`*[_type == "post" && !defined(postType)]{ _id }`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const client = createSanityClient(process.env);
  const posts = await fetchPostIdsMissingType(client);

  console.log(`Found ${posts.length} post documents missing postType.`);

  if (posts.length === 0) {
    return;
  }

  if (!args.write) {
    console.log("Dry run only. Re-run with --write to backfill postType=\"article\".");
    return;
  }

  const transaction = client.transaction();
  for (const post of posts) {
    transaction.patch(post._id, {
      set: {
        postType: "article",
      },
    });
  }

  await transaction.commit();
  console.log(`Updated ${posts.length} post documents.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

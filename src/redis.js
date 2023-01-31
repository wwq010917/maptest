const { createClient } = require("redis");
async function main() {
  const client = createClient();

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  await client.set("0", "red");
  const value = await client.get("0");
  console.log(value);
  await client.disconnect();
}

(async function () {
  await main();
})();

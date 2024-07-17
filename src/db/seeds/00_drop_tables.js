module.exports.seed = async function (knex) {
  const tableNames = ["reviews", "movies_theaters", "critics", "movies", "theaters"];
  for (const table of tableNames) {
    const exists = await knex.schema.hasTable(table);
    if (exists) {
      await knex(table).del();
    }
  }
};


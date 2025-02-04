const db = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
});

async function list() {
  return db("theaters")
    .join("movies_theaters", "theaters.theater_id", "movies_theaters.theater_id")
    .join("movies", "movies.movie_id", "movies_theaters.movie_id")
    .select("theaters.*", "movies.*", "movies_theaters.is_showing")
    .then(reduceMovies);
}

module.exports = {
  list,
};

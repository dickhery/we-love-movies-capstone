const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movie_id) {
  return db("movies").select("*").where({ movie_id }).first();
}

async function listTheaters(movie_id) {
  return db("theaters")
    .join("movies_theaters", "theaters.theater_id", "movies_theaters.theater_id")
    .select("theaters.*", "movies_theaters.is_showing", "movies_theaters.movie_id")
    .where({ "movies_theaters.movie_id": movie_id });
}

async function listReviews(movie_id) {
  return db("reviews")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .select("reviews.*", "critics.*")
    .where({ "reviews.movie_id": movie_id })
    .then((reviews) => reviews.map(setCritic));
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

module.exports = {
  list,
  read,
  listTheaters,
  listReviews,
};

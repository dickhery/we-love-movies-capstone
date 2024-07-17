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
  const reviews = await db("reviews")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .select(
      "reviews.*",
      "critics.critic_id as critic:critic_id",
      "critics.preferred_name as critic:preferred_name",
      "critics.surname as critic:surname",
      "critics.organization_name as critic:organization_name",
      "critics.created_at as critic:created_at",
      "critics.updated_at as critic:updated_at"
    )
    .where({ "reviews.movie_id": movie_id });

  return reviews.map((review) => {
    const critic = {
      critic_id: review["critic:critic_id"],
      preferred_name: review["critic:preferred_name"],
      surname: review["critic:surname"],
      organization_name: review["critic:organization_name"],
      created_at: review["critic:created_at"],
      updated_at: review["critic:updated_at"],
    };

    return {
      review_id: review.review_id,
      content: review.content,
      score: review.score,
      critic_id: review.critic_id,
      movie_id: review.movie_id,
      created_at: review.created_at,
      updated_at: review.updated_at,
      critic,
    };
  });
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

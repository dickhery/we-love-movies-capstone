const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
}

async function list(req, res) {
  const { is_showing } = req.query;
  const data = await service.list(is_showing);
  res.json({ data });
}

async function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function listTheaters(req, res) {
  const data = await service.listTheaters(req.params.movieId);
  res.json({ data });
}

async function listReviews(req, res) {
  const data = await service.listReviews(req.params.movieId);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  listTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheaters)],
  listReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews)],
};

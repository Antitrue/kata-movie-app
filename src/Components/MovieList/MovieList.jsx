import MovieItem from '../MovieItem/MovieItem'

const MovieList = ({ movies, genres, rateMovie }) => {
  let moviesData = movies || []

  return (
    <ul className="app__list">
      {moviesData.map(
        ({
          poster_path,
          original_title,
          overview,
          release_date,
          id,
          backdrop_path,
          vote_average,
          genre_ids,
          rating,
        }) => {
          return (
            <MovieItem
              poster={poster_path}
              title={original_title}
              description={overview}
              releaseDate={release_date}
              key={id}
              vote_average={vote_average}
              genre_ids={genre_ids}
              genres={genres}
              backdrop_path={backdrop_path}
              rateMovie={rateMovie}
              id={id}
              rating={rating}
            />
          )
        }
      )}
    </ul>
  )
}

export default MovieList

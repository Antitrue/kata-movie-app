import React, { useContext } from 'react'
import { Rate } from 'antd'
import { GenreContext } from '../../App'
import { format, parse, isValid } from 'date-fns'

const MovieItem = ({
  title,
  poster,
  description,
  releaseDate,
  vote_average,
  genre_ids,
  backdrop_path,
  rateMovie,
  id,
  rating = 0,
}) => {
  const genres = useContext(GenreContext)
  const parseDate = (dateString) => {
    const formatString = 'yyyy-MM-dd'
    const parsedDate = parse(dateString, formatString, new Date())

    return isValid(parsedDate) ? parsedDate : new Date()
  }

  const currentRating = Number(vote_average)

  const getRatingColor = (rating) => {
    if (rating <= 3) return '#E90000'
    if (rating <= 5) return '#E97E00'
    if (rating <= 7) return '#E9D100'
    return '#66E900'
  }
  const ratingRounded = Math.round(currentRating * 10) / 10
  const releaseDateVaue = parseDate(releaseDate)
  const formattedDate = format(releaseDateVaue, 'MMMM d, yyyy')
  const ratingColor = getRatingColor(ratingRounded)
  return (
    <li className="app__item movie">
      <img
        src={`https://image.tmdb.org/t/p/w500${poster ? poster : backdrop_path}`}
        alt="movie preview"
        className="app__img"
      />
      <h2 className="movie__title">{title}</h2>
      <div className="item-rating">
        <span className="rating-circle" style={{ borderColor: ratingColor }}>
          {ratingRounded}
        </span>
      </div>
      <span className="movie__date">{formattedDate} </span>
      <div className="movie__genre-wrapper">
        {genres.map((genre) => {
          let correct
          genre_ids.forEach((Item) => {
            if (genre.id === Item) {
              correct = genre.name
            }
          })
          if (correct) {
            return (
              <span key={genre.id} className="movie__genre">
                {correct}
              </span>
            )
          }
        })}
      </div>
      <p className="movie__description">{description}</p>
      <div className="movie__rate-wrapper">
        <Rate allowHalf count={10} defaultValue={rating} onChange={(value) => rateMovie(id, value)} />
      </div>
    </li>
  )
}

export default MovieItem

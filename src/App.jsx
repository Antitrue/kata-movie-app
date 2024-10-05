import { createContext, useEffect, useState } from 'react'
import MovieList from './Components/MovieList/MovieList'
import SearchForm from './Components/MovieItem/Search/SearchForm'
import API_KEY from './config'
import { Tabs, Spin, Pagination, Alert } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import './index.css'
import { debounce } from 'lodash'
import { guestId } from './api'
import createGuestSession from './api'
export let GenreContext

function App() {
  const [data, setData] = useState({})
  const [genres, setGenres] = useState(['drama', 'action'])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsErorr] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isRated, setIsRated] = useState(false)
  const [ratedMovies, setRatedMovies] = useState([])
  const [addedRatedMoovies, setAddedRateMovies] = useState(false)
  GenreContext = createContext(genres)

  const fetchDefaultData = () => {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setIsLoading(true)
    fetchDefaultData()
    fetch(`https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((json) => {
        setGenres(json.genres)
        setIsLoading(false)
      })
    createGuestSession()
  }, [])

  const getMoviesByPage = (page) => {
    setIsLoading(true)
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setCurrentPage(page)
        setIsLoading(false)
      })
  }

  const debouncedSearching = debounce((SearchQuery) => {
    if (SearchQuery === '') {
      return
    }
    setIsLoading(true)
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}5&query=${SearchQuery}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.results.length === 0) {
          setIsErorr(true)
        } else {
          setIsErorr(false)
          setData(json)
          setCurrentPage(1)
        }
        setIsLoading(false)
      })
      .catch((e) => {
        setIsErorr(true)
        throw new Error(e)
      })
  }, 1500)

  const handleSearch = (searchQuery) => {
    debouncedSearching(searchQuery)
  }

  const getRatedMovies = async () => {
    if (!isRated && addedRatedMoovies) {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/guest_session/${guestId}/rated/movies?api_key=${API_KEY}`)
        const data = await res.json()
        setRatedMovies(data)
      } catch (e) {
        throw new Error(`Erorr fetching rated movies${e}`)
      }
    } else fetchDefaultData()
    return
  }

  const rateMovie = async (movieId, rating = 0) => {
    const currentRating = { value: rating }
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${guestId}`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentRating),
      }
    )
    setData((prev) => {
      const newArr = prev.results.map((movie) => {
        if (movie.id === movieId) {
          movie.rating = rating
          return movie
        }
        return movie
      })
      return { ...prev, results: newArr }
    })
    setAddedRateMovies(true)
  }

  const onChangeTab = (key) => {
    setIsRated((prev) => !prev)
    if (key == 2) {
      getRatedMovies()
    }
  }

  const items = [
    {
      key: '1',
      label: 'Search',
      children: isLoading ? (
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 48,
              }}
              spin
              allowFullScreen
            />
          }
        />
      ) : isError ? (
        <>
          <SearchForm className="search" onChange={handleSearch} />
          <Alert
            className="alert"
            message="Search Error"
            showIcon
            description="Nothing was found for your query"
            type="error"
          />
        </>
      ) : (
        <>
          <SearchForm className="search" onChange={handleSearch} />
          <MovieList movies={data.results} genres={genres} getMoviesByPage={getMoviesByPage} rateMovie={rateMovie} />,
          <Pagination
            defaultCurrent={currentPage}
            total={data.total_pages}
            align="center"
            showSizeChanger={false}
            onChange={(page) => getMoviesByPage(page)}
          />
        </>
      ),
    },
    {
      key: '2',
      label: 'Rated',
      children: isLoading ? (
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 48,
              }}
              spin
              allowFullScreen
            />
          }
        />
      ) : isError ? (
        <>
          <SearchForm className="search" onChange={(key) => handleSearch(key)} />
          <Alert
            className="alert"
            message="Search Error"
            showIcon
            description="Nothing was found for your query"
            type="error"
          />
        </>
      ) : ratedMovies.results ? (
        <>
          <MovieList movies={ratedMovies.results} genres={genres} rateMovie={rateMovie} />,
        </>
      ) : (
        <Alert message="Rate list is empty" description="Nothing is rated now" type="info" showIcon />
      ),
    },
  ]
  return (
    <div className="app">
      <GenreContext.Provider value={genres}>
        <Tabs
          className="tabs"
          items={items}
          centered
          defaultActiveKey="1"
          activeKey={isRated ? '2' : '1'}
          indicator={{ size: 70, align: 'center' }}
          onChange={onChangeTab}
        />
      </GenreContext.Provider>
    </div>
  )
}

export default App

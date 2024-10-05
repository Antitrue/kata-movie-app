import API_KEY from './config'

export let guestId

export default async function createGuestSession() {
  const fetchtSessionToken = async () => {
    const requestToken = await fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${API_KEY}`)
    const requestData = await requestToken.json()
    const token = requestData.request_token
    if (!requestToken.ok) {
      throw new Error(`Erorr token fetch ${requestData.status}`)
    }
    return token
  }

  const token = await fetchtSessionToken()
  const res = await fetch(
    `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}&request_token=${token}`,
    { method: 'POST' }
  )
  if (!res.ok) {
    throw new Error('Erorr fetching guest session id')
  }
  const data = await res.json()
  guestId = data.guest_session_id
}

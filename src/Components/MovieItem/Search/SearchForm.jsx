import { Input } from 'antd'
import { useState } from 'react'

export default function SearchForm({ onChange }) {
  const [value, setValue] = useState('')
  const handleSearch = (string) => {
    if (string === '') {
      setValue((prev) => prev)
    } else {
      setValue(string)
      onChange(string)
    }
  }
  return (
    <form>
      <Input placeholder="Search..." value={value} autoFocus onChange={(e) => handleSearch(e.target.value)} />
    </form>
  )
}

import axios from 'axios'
import { ITodoDTO } from '../dto/dto'
import { useEffect, useState } from 'react'

const useTodoGet = () => {
  const [userData, setUserData] = useState<ITodoDTO[] | null>(null)

  const fetchData = async () => {
    try {
      const res = await axios.get<ITodoDTO[]>(`http://localhost:8080/get`)
      setUserData(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { userData, fetchData }
}

export default useTodoGet

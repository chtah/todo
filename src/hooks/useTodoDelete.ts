import axios from 'axios'
import { IEditDTO } from '../dto/dto'

const useTodoDelete = () => {
  const SubmitDelete = async () => {
    try {
      await axios.delete<IEditDTO>(`http://localhost:8080/delete`)
    } catch (err) {
      console.error(err)
    }
  }

  return { SubmitDelete }
}

export default useTodoDelete

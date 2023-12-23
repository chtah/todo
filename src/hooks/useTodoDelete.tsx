import axios from 'axios'
import { IEditDTO } from '../dto/dto'

const useTodoDelete = () => {
  const SubmitDelete = async (id: number) => {
    try {
      await axios.delete<IEditDTO>(`http://localhost:8080/delete`, { data: { id: id } })
    } catch (err) {
      console.error(err)
    }
  }

  return { SubmitDelete }
}

export default useTodoDelete

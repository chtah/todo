import axios from 'axios'
import { ICreateDTO } from '../dto/dto'

const useTodoCreate = () => {
  const Submit = async (todo: ICreateDTO) => {
    try {
      await axios.post<ICreateDTO>(`http://localhost:8080/create`, todo)
    } catch (err) {
      console.error(err)
    }
  }

  return { Submit }
}

export default useTodoCreate

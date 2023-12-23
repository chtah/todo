import axios from 'axios'
import { IEditDTO } from '../dto/dto'

const useTodoEdit = () => {
  const SubmitEdit = async (todo: IEditDTO) => {
    try {
      await axios.patch<IEditDTO>(`http://localhost:8080/edit`, todo)
    } catch (err) {
      console.error(err)
    }
  }

  return { SubmitEdit }
}

export default useTodoEdit

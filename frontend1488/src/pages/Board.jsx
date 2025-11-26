import Feed from "../components/Feed"
import MessageField from "../components/MessageField"
import { useUserStore } from "../store/useUserStore"

const Board =() =>{
    const { session } = useUserStore()
    return (
        <>
            <h1>Board</h1>
            {session && <MessageField />}
            <Feed title="Последние сообщения" />
        </>
    )
}

export default Board
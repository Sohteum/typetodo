import React, { useRef, useEffect, useReducer, useContext } from "react";
import './App.css';
import Editor from "./components/Editor";
import { Todo } from "./types";
import TodoItem from "./components/TodoItem";

type Action =
  | {
    type: "CREATE";
    data: {
      id: number;
      content: string;
    }
  }
  | { type: "DELETE"; id: number }

function reducer(state: Todo[], action: Action) {
  switch (action.type) {
    case 'CREATE': {
      return [...state, action.data];
    }
    case "DELETE": {
      return state.filter((it) => it.id !== action.id)
    }
  }
}

export const todoStateContext = React.createContext<Todo[] | null>(null)
export const todoDispatchContext = React.createContext<{
  onClickAdd: (text: string) => void;
  onClickDelete: (text: number) => void;
} | null>(null)

export function useTodoDispatch(){
  const dispatch = useContext(todoDispatchContext);
  if(!dispatch) throw new Error("TodoDispatchContext에 문제가있다");
  return dispatch;
}

function App() {
  const [todos, dispatch] = useReducer(reducer, []);

  const idRef = useRef(0);




  const onClickAdd = (text: string) => {

    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        content: text,
      }
    })
  }

  const onClickDelete = (id: number) => {
    dispatch({
      type: "DELETE",
      id: id,
    })
  }

  useEffect(() => {
    console.log(todos);
  }, [todos])
  return (
    <div className="App">
      <todoStateContext.Provider value={todos}>
        <todoDispatchContext.Provider value={{onClickAdd, onClickDelete}}>
          <h1>todo</h1>
          <Editor />
          <div>{todos.map((todo) => (
            <TodoItem key={todo.id}{...todo}  />))}</div>
        </todoDispatchContext.Provider>
      </todoStateContext.Provider>
    </div>
  );
}

export default App;

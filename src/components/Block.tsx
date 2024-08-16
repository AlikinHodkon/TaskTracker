import { CSS } from "@dnd-kit/utilities";
import Task from "./Task"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";

export default function Block({block, deleteBlock}) {
  // const {isOver, setNodeRef} = useDroppable({id: header});
  const [value, setValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
    id: block.id,
    data: {
      type: 'block',
      block,
    }
  })
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }
  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="w-[30%] min-h-[15vh] min-w-[30vw] flex flex-col items-center opacity-40 border-[2px] border-black rounded-lg bg-white mt-5 ml-auto mr-auto pb-5"></div>
  }
  function addTask(task, header, tasks){
    if (task !== "") setTasks([...tasks, {id: Date.now(), header: header, task: task}]);
  }
  function deleteTask(id){
    const filteredTasks = tasks.filter((value) => id !== value.id);
    setTasks(filteredTasks);
  }
  return (
    <div ref={setNodeRef} style={style} className="w-[30%] min-h-[15vh] min-w-[30vw] flex flex-col items-center rounded-lg bg-white mt-5 ml-auto mr-auto pb-5">
        <div className="flex w-full bg-blue-400">
          <h1 className="text-[32px] w-full mr-auto ml-5" {...attributes} {...listeners}>{block.header}</h1>
          <button className="mr-5" onClick={() => deleteBlock(block.header)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
            <ul className={`text-[24px] w-full h-full flex flex-col pl-5 pr-5 pb-5 bg-slate-white`}>
              <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => <Task key={task.id} task={task} deleteTask={deleteTask}/>)}
              </SortableContext>
            </ul>
            <div className="flex items-center justify-center mt-5">
        <input className="placeholder:pl-2 border-[2px] border-black rounded-xl" onChange={(e) => {setValue(e.target.value)}} type="text" placeholder="Add task" />
        <button onClick={() => {addTask(value, block.header, tasks)}} className="bg-white ml-5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>
  )
}

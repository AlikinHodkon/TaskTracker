import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Task({task, deleteTask}) {

    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
      id: task.id,
      data: {
        task,
        type: 'task'
      }
    });
      const style = {
        transition,
        transform: CSS.Transform.toString(transform),
      }

      if (isDragging) {
        return <div ref={setNodeRef} style={style} className="w-full min-h-[5vh] flex bg-gray-300 mt-5 pl-5 pr-5 rounded-lg opacity-40"></div>
      }

  return (
    <li ref={setNodeRef} style={style} className="w-full flex min-h-[5vh] text-[24px] font-dm-sans bg-gray-300 mt-5 pl-5 pr-5 rounded-lg" {...attributes} {...listeners}>
      <p>{task.task}</p>
      <button onClick={() => deleteTask(task.id)} className="ml-auto">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  )
}


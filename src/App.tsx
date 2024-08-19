import { useMemo, useState } from "react"
import { closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core"
import Block from "./components/Block";
import Task from "./components/Task";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { PointerSensor, useSensors, useSensor } from "@dnd-kit/core";
import { IBlock, ITask } from "./types";

function App() {
  const [blocks, setBlocks] = useState<IBlock[]>([{id: 1, header: "ToDo"}, {id: 2, header: "In progress"}, {id: 3, header: "Done"}]);
  const [newBlock, setNewBlock] = useState<string>("");
  const blocksId: number[] = useMemo<number[]>(() => blocks.map((value) => value.id), [blocks]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [activeBlock, setActiveBlock] = useState<IBlock | null>(null);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
      distance: 1,
      }
    })
  )
  function addBlock(header: string){
    if (header !== "") setBlocks([...blocks, {id: Date.now(), header: header}]);
  }
  function deleteBlock(header: string){
    const filteredBlocks = blocks.filter((block) => header !== block.header);
    setBlocks(filteredBlocks);
    const filteredTasks =tasks.filter((task) => task.header !== header);
    setTasks(filteredTasks);
  }
  function onDragStart(event: DragStartEvent){
    if (event.active.data.current?.type === 'block') {
      setActiveBlock(event.active.data.current.block);
      return;
    }
    if (event.active.data.current?.type === 'task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }
  function addTask(task: string, header: string){
    if (task !== "") setTasks([...tasks, {id: Date.now(), header: header, task: task}]);
  }
  function deleteTask(id: number){
    const filteredTasks = tasks.filter((value) => id !== value.id);
    setTasks(filteredTasks);
  }
  function onDragEnd(event: DragEndEvent){
    setActiveBlock(null);
    setActiveTask(null);
    const { active, over} = event;
    if (!over) return;

    const activeBlockId = active.id;
    const overBlockId = over.id;

    if (activeBlockId === overBlockId) return;

    setBlocks((blocks) => {
      const activeBlockIndex = blocks.findIndex((block) => block.id === activeBlockId);
      const overBlockIndex = blocks.findIndex((block) => block.id === overBlockId);
      
      return arrayMove(blocks, activeBlockIndex, overBlockIndex);
    })
  }  
  function onDragOver(event: DragOverEvent){
    const { active, over} = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "task";
    const isOverTask = over.data.current?.type === 'task';
    if (!isActiveTask) return;
    if (isActiveTask && isOverTask){
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        const overIndex = tasks.findIndex((task) => task.id === overId);
        tasks[activeIndex].header = tasks[overIndex].header;
        return arrayMove(tasks, activeIndex, overIndex);
      })
    }
    const isOverBlock = over.data.current?.type === 'block';
    if (isActiveTask && isOverBlock){
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        tasks[activeIndex].header = over.data.current?.block.header;
        return arrayMove(tasks, activeIndex, activeIndex);
      })
    }
  }
  return (
    <div className="flex flex-col bg-[#F2F2F2] min-h-[100vh] font-dm-sans">
      <h1 className="text-center text-[64px] text-black">Manage your task</h1>
      <div className="ml-auto mr-auto flex text-[24px]">
        <input className="rounded-xl w-full pl-2 border-[2px] border-black" onChange={(e) => {setNewBlock(e.target.value)}} type="text" placeholder="Name of block" />
        <button className="bg-transparent ml-5" onClick={() => addBlock(newBlock)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap w-full pr-5 pl-5">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
          <SortableContext items={blocksId} strategy={horizontalListSortingStrategy}>
            {blocks.map((block) => <Block key={block.id} block={block} deleteBlock={deleteBlock} tasks={tasks.filter((task) => task.header === block.header)} addTask={addTask} deleteTask={deleteTask} />)}
          </SortableContext>
          {
            createPortal(
              <DragOverlay>
                {activeBlock && (<Block block={activeBlock} deleteBlock={deleteBlock} tasks={tasks.filter((task) => task.header === activeBlock.header)} addTask={addTask} deleteTask={deleteTask} />)}
                {activeTask && (<Task task={activeTask} deleteTask={deleteTask}/>)}
              </DragOverlay>, document.body
            )
          }
        </DndContext>
      </div>
    </div>
  )
}

export default App

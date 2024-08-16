import { useMemo, useState } from "react"
import { closestCorners, DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core"
import Block from "./components/Block";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function App() {
  // const [toDo, setToDo] = useState([
  //   {id: 1, header: "ToDo", task: "Buy Car"},
  //   {id: 2, header: "ToDo", task: "Call Babushka"},
  //   {id: 3, header: "ToDo", task: "Clean Home"}
  // ]);
  // const [inProgress, setInProgress] = useState([
  //   {id: 4, header: "In progress", task: "Make breakfast"},
  //   {id: 5, header: "In progress", task: "Brush Teeth"},
  //   {id: 6, header: "In progress", task: "Wash Hands"}
  // ]);
  // const [done, setDone] = useState([
  //   {id: 7, header: "Done", task: "Buy Phone"},
  //   {id: 8, header: "Done", task: "Visit Doctor"},
  //   {id: 9, header: "Done", task: "Fix Lamp"}
  // ]);
  const [blocks, setBlocks] = useState([{id: 1, header: "ToDo"}, {id: 2, header: "In progress"}, {id: 3, header: "Done"}]);
  const [newBlock, setNewBlock] = useState<string>("");
  const blocksId = useMemo(() => blocks.map((value) => value.id), [blocks]);
  const [activeBlock, setActiveBlock] = useState(null);
  // function handleDragEnd(event) {
  //   if (event.over && event.over.id === 'ToDo' && event.over.id !== event.active.data.current?.header) {
  //     setToDo([...toDo, {id: event.active.data.current?.id, header: "toDo", task: event.active.data.current?.task}]);
  //     switch(event.active.data.current?.header){
  //       case 'In progress':{
  //         let i = 0;
  //         let index : number = 0;
  //         inProgress.forEach((element) => {
  //           if (element.id === event.active.data.current?.id) index = i;
  //           i++;
  //         });
  //         setInProgress([...inProgress.slice(0, index), ...inProgress.slice(index+1)])
  //         break;
  //       }
  //       case 'Done':{
  //         let i = 0;
  //         let index : number = 0;
  //         done.forEach((element) => {
  //           if (element.id === event.active.data.current?.id) index = i;
  //           i++;
  //         });
  //         setDone([...done.slice(0, index), ...done.slice(index+1)])
  //         break;
  //       }
  //     }
  //   }
  //   if (event.over && event.over.id === 'In progress' && event.over.id !== event.active.data.current?.header) {
  //     setInProgress([...inProgress, {id: event.active.data.current?.id, header: "In progress", task: event.active.data.current?.task}]);
  //     switch(event.active.data.current?.header){
  //       case 'ToDo':{
  //         let i = 0;
  //         let index : number = 0;
  //         toDo.forEach((element) => {
  //           if (element.id === event.active.data.current?.id) index = i;
  //           i++;
  //         });
  //         setToDo([...toDo.slice(0, index), ...toDo.slice(index+1)])
  //         break;
  //       }
  //       case 'Done':{
  //         let i = 0;
  //         let index : number = 0;
  //         done.forEach((element) => {
  //           if (element.id === event.active.data.current?.id) index = i;
  //           i++;
  //         });
  //         setDone([...done.slice(0, index), ...done.slice(index+1)])
  //         break;
  //       }
  //     }
  //   }
  //   if (event.over && event.over.id === 'Done' && event.over.id !== event.active.data.current?.header) {
  //     setDone([...done, {id: event.active.data.current?.id, header: "Done", task: event.active.data.current?.task}]);
  //     switch(event.active.data.current?.header){
  //       case 'In progress':{
  //         let i = 0;
  //         let index : number = 0;
  //         inProgress.forEach((element) => {
  //           if (element.id === event.active.data.current?.id) index = i;
  //           i++;
  //         });
  //         setInProgress([...inProgress.slice(0, index), ...inProgress.slice(index+1)])
  //         break;
  //       }
  //       case 'ToDo':{
  //         let i = 0;
  //         let index : number = 0;
  //         toDo.forEach((element) => {
  //           if (element.id === event.active.data.current?.id) index = i;
  //           i++;
  //         });
  //         setToDo([...toDo.slice(0, index), ...toDo.slice(index+1)])
  //         break;
  //       }
  //     }
  //   }
  // }
  function addBlock(header : string){
    if (header !== "") setBlocks([...blocks, {id: Date.now(), header: header}]);
  }
  function deleteBlock(header : string){
    const filteredBlocks = blocks.filter((block) => header !== block.header);
    setBlocks(filteredBlocks);
  }
  function onDragStart(event : DragStartEvent){
    if (event.active.data.current?.type === 'block') {
      setActiveBlock(event.active.data.current.block);
      return;
    }
  }
  function onDragEnd(event: DragEndEvent){
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
  return (
    <div className="flex flex-col bg-[#F2F2F2] min-h-[100vh] font-dm-sans">
      <h1 className="text-center text-[64px] text-black">Manage your task</h1>
      <div className="ml-auto mr-auto flex text-[24px]">
        <input className="rounded-xl w-full placeholder:pl-2 border-[2px] border-black" onChange={(e) => {setNewBlock(e.target.value)}} type="text" placeholder="Name of block" />
        <button className="bg-transparent ml-5" onClick={() => addBlock(newBlock)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap w-full pr-5 pl-5">
        <DndContext collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <SortableContext items={blocksId} strategy={horizontalListSortingStrategy}>
            {blocks.map((block) => <Block key={block.id} block={block} deleteBlock={deleteBlock} />)}
          </SortableContext>
          {
            createPortal(
              <DragOverlay>
                {activeBlock && (<Block block={activeBlock} deleteBlock={deleteBlock} />)}
              </DragOverlay>, document.body
            )
          }
        </DndContext>
      </div>
    </div>
  )
}

export default App

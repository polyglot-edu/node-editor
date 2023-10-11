import { polyglotNodeComponentMapping } from '../../types/polyglotElements';
//nota: mettere su flowEditor le specifiche di onDragStart...

interface NodeItem{
  key: string;
  text: string;
  icon: string;
  index:string;
}

export default ()=>{

  const onDragStart = (event:DragEvent, nodeType:string) => {
    if(event.dataTransfer==null){return;}
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const li_remember_learning:NodeItem[]= Object.keys(polyglotNodeComponentMapping.nameMapping).map((index, id) => {    
    return {
      key: id.toString(),
      text: 'New ' + polyglotNodeComponentMapping.nameMapping[index],
      icon:'../../public/'+polyglotNodeComponentMapping.iconMapping[index],
      index: index
    };
});

  return (
    <>
      <div>New Nodes</div>
      <div>
          Learning Activities
        {li_remember_learning.map(nodes=><div key={nodes.key} onDragStart={(event) => onDragStart(event, nodes.index)} draggable>
          <span>
            <img src={nodes.icon} width="50" height="50"/>
            {nodes.text}
          </span></div>)}
      </div>
      
      <div>
          Assessment Activities
        <div id='remember_assessment'></div>
        <div id='understand_assessment'></div>
        <div id='apply_assessment'></div>
        <div id='create_assessment'></div>
      </div>
    </>
  );
};

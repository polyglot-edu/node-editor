import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';
import { polyglotNodeComponentMapping } from '../../types/polyglotElements';

interface NodeItem{
  key: string;
  text: string;
  icon: string;
  index:string;
  group:string;
}

export default ()=>{
  const onDragStart = (event:DragEvent, nodeType:string) => {
    if(event.dataTransfer==null){return;}
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  const nodes:NodeItem[]= Object.keys(polyglotNodeComponentMapping.nameMapping).map((index, id) => {    
    return {
      key: id.toString(),
      text: 'New ' + polyglotNodeComponentMapping.nameMapping[index],
      icon: polyglotNodeComponentMapping.iconMapping[index],
      index: index,
      group: polyglotNodeComponentMapping.groupMapping[index],
    };
  });

  const li_remember_learning:NodeItem[] = nodes.filter(function (node){ if(node.group=="remember_learning") return true; return false;});
  const li_understand_learning:NodeItem[] = nodes.filter(function (node){ if(node.group=="understand_learning") return true; return false;});
  const li_apply_learning:NodeItem[] = nodes.filter(function (node){ if(node.group=="apply_learning") return true; return false;});
  const li_create_learning:NodeItem[] = nodes.filter(function (node){ if(node.group=="create_learning") return true; return false;});
  
  const li_remember_assessment:NodeItem[] = nodes.filter(function (node){ if(node.group=="remember_assessment") return true; return false;});
  const li_understand_assessment:NodeItem[] = nodes.filter(function (node){ if(node.group=="understand_assessment") return true; return false;});
  const li_create_assessment:NodeItem[] = nodes.filter(function (node){ if(node.group=="create_assessment") return true; return false;});
  const li_apply_assessment:NodeItem[] = nodes.filter(function (node){ if(node.group=="apply_assessment") return true; return false;});

  return (
    <><Box width={"300px"} border={"1px"} borderColor={'lightgray'} title='drag the new node'>
      <div className='label'>ADD NEW ACTIVITY</div>
      <span className='label'>
        LEARNING ACTIVITY</span>
    
      <Accordion>
        <AccordionItem >
          {({ isExpanded }) => (
          <>
          <AccordionButton className="nodeButton" backgroundColor={'#D2EAFD'}>{isExpanded ? (
              <ChevronDownIcon/>
            ) : (
              <ChevronRightIcon/>
            )} <span className='text-[12px]'>REMEMBER</span></AccordionButton>        
          <AccordionPanel>
            {li_remember_learning.map(nodes=>
              <div key={nodes.key} className='nodeItem' onDragStart={(event) => onDragStart(event, nodes.index)} draggable>
              <img src={nodes.icon} style={{float:"left"}} width="20"/>
              {nodes.text}
              </div>
            )}
          </AccordionPanel>
          </>)}
        </AccordionItem>
        <AccordionItem>
          {({ isExpanded }) => (
          <>          
          <AccordionButton className="nodeButton" backgroundColor={'#A6D5FB'}>{isExpanded ? (
              <ChevronDownIcon/>
            ) : (
              <ChevronRightIcon/>
            )}  <span className='text-[12px]'>UNDERSTAND</span></AccordionButton>        
          <AccordionPanel>
            {li_understand_learning.map(nodes=>
              <div key={nodes.key} className='nodeItem' onDragStart={(event) => onDragStart(event, nodes.index)} draggable>
              <img src={nodes.icon} style={{float:"left"}} width="20"/>
              {nodes.text}
              </div>
            )}
          </AccordionPanel>
          </>)}
        </AccordionItem>
        <AccordionItem>
        {({ isExpanded }) => (
        <>
          <AccordionButton className="nodeButton" backgroundColor={'#79C1FA'}>{isExpanded ? (
              <ChevronDownIcon/>
            ) : (
              <ChevronRightIcon/>
            )}  <span className='text-[12px]'>APPLY</span></AccordionButton>        
          <AccordionPanel>
            {li_apply_learning.map(nodes=>
              <div key={nodes.key} className='nodeItem' onDragStart={(event) => onDragStart(event, nodes.index)} draggable>
              <img src={nodes.icon} style={{float:"left"}} width="20"/>
              {nodes.text}
              </div>
            )}
          </AccordionPanel>
          </>)}
        </AccordionItem>
        <AccordionItem>
        {({ isExpanded }) => (
        <>        
          <AccordionButton className="nodeButton" backgroundColor={'#4DACF8'}>{isExpanded ? (
              <ChevronDownIcon/>
            ) : (
              <ChevronRightIcon/>
            )}  <span className='text-[12px]'>CREATE</span></AccordionButton>        
          <AccordionPanel>
            {li_create_learning.map(nodes=>
              <div key={nodes.key} className='nodeItem' onDragStart={(event) => onDragStart(event, nodes.index)} draggable>
              <img src={nodes.icon} style={{float:"left"}} width="20"/>
              {nodes.text}
              </div>
            )}
          </AccordionPanel>
          </>)}
        </AccordionItem>
      </Accordion>
        <br/>
      <span className='label'>
      ASSESSMENT ACTIVITY </span>
      <Accordion>
        <AccordionItem>
          {({ isExpanded }) => (
          <>          
          <AccordionButton className="nodeButton" backgroundColor={'#FFCEC7'}>{isExpanded ? (
              <ChevronDownIcon/>
            ) : (
              <ChevronRightIcon/>
            )} <span className='text-[12px]'>REMEMBER</span></AccordionButton>        
          <AccordionPanel>
            {li_remember_assessment.map(nodes=>
              <div key={nodes.key} className='nodeItem' onDragStart={(event) => onDragStart(event, nodes.index)} draggable>
              <img src={nodes.icon} style={{float:"left"}} width="20"/>
              {nodes.text}
              </div>
            )}
          </AccordionPanel>
          </>)}
        </AccordionItem>
        <AccordionItem >
        {({ isExpanded }) => (
        <>        
          <AccordionButton className="nodeButton" backgroundColor={'#FFADA1'}>{isExpanded ? (
              <ChevronDownIcon/>
            ) : (
              <ChevronRightIcon/>
            )}  <span className='text-[12px]'>UNDERSTAND</span></AccordionButton>        
          <AccordionPanel>
            {li_understand_assessment.map(nodes=>
              <div key={nodes.key} className='nodeItem' onDragStart={(event) => onDragStart(event, nodes.index)} draggable>
              <img src={nodes.icon} style={{float:"left"}} width="20"/>
              {nodes.text}
              </div>
            )}
          </AccordionPanel>
          </>)}
        </AccordionItem>
        <AccordionItem>
        {({ isExpanded }) => (
        <>        
          <AccordionButton className="nodeButton" backgroundColor={'#FF8C7B'}>{isExpanded ? (
              <ChevronDownIcon/>
            ) : (
              <ChevronRightIcon/>
            )} <span className='text-[12px]'>APPLY</span></AccordionButton>        
          <AccordionPanel>
            {li_apply_assessment.map(nodes=>
              <div key={nodes.key} className='nodeItem' onDragStart={(event) => onDragStart(event, nodes.index)} draggable>
              <img src={nodes.icon} style={{float:"left"}} width="20"/>
              {nodes.text}
              </div>
            )}
          </AccordionPanel>
          </>)}
        </AccordionItem>
        <AccordionItem>
        {({ isExpanded }) => (
        <>        
          <AccordionButton className="nodeButton" backgroundColor={'#FF7B69'}>{isExpanded ? (
              <ChevronDownIcon/>
            ) : (
              <ChevronRightIcon/>
            )}  <span className='text-[12px]'>CREATE</span></AccordionButton>        
          <AccordionPanel>
            {li_create_assessment.map(nodes=>
              <div key={nodes.key} className='nodeItem' onDragStart={(event) => onDragStart(event, nodes.index)} draggable>
              <img src={nodes.icon} style={{float:"left"}} width="20"/>
              {nodes.text}
              </div>
            )}
          </AccordionPanel>
          </>)}
        </AccordionItem>
      </Accordion>
      </Box>
    </>
  );
};

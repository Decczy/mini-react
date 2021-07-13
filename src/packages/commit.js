export default function commitRoot(rootFiber, deletions){
    // rootFiber 的 dom 即为 render 函数中选中的 dom container，它不存在 fiber sibling
    deletions.forEach(fiber=>commitWork(fiber));
    commitWork(rootFiber.child);
}

function commitWork(fiber){
    if(!fiber){
        return;
    }

    const domParent = fiber.parent.dom;

    if(fiber.effectTag === 'PLACEMENT' && domParent!==null){
        domParent.appendChild(fiber.dom);
    }else if(fiber.effectTag === 'DELETION'){
        return domParent.removeChild(fiber.dom);
    }else if(fiber.effectTag === 'UPDATE' && fiber.dom !== null){
        updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

function updateDom(dom, oldProps, newProps){
    const isEvent = prop => prop.startsWith('on');
    const isProperty = prop => prop !== 'children' && !isEvent(prop);
    const isOldProperty = prop => !newProps.hasOwnProperty(prop);
    const isNewProperty = prop => !oldProps.hasOwnProperty(prop) || oldProps[prop] !== newProps[prop];
    const getEventType = event => event.toLocaleLowerCase().substring(2);

    // 移除prop
    Object
    .keys(oldProps)
    .filter(isProperty)
    .filter(isOldProperty)
    .forEach((prop)=>{
        dom[prop] = "";
    })

    // 移除eventListener
    Object
    .keys(oldProps)
    .filter(isEvent)
    .filter(event=> !newProps.hasOwnProperty(event) || isNewProperty(event))
    .forEach(event => domParent.removeEventListener(getEventType(event), oldProps[event]));

    // 添加新属性
    Object
    .keys(newProps)
    .filter(isProperty)
    .filter(isNewProperty)
    .forEach((prop)=>{
        dom[prop] = newProps[prop]
    })

    // 添加新的eventListener
    Object
    .keys(newProps)
    .filter(isEvent)
    .filter(isNewProperty)
    .forEach(event=>domParent.addEventListener(getEventType(event), newProps[event]));
}
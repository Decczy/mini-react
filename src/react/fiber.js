import createDom from './createDom';
import commit from './commit';

let rootFiber = null;
let nextUnitofWork = null;

export function render(element, container){
    // 生成一个根fiber
    rootFiber = {
        dom: container,
        parent: null,
        props: {
            children: [element]
        }
    }
    nextUnitofWork = rootFiber;
}

function performUnitOfWork(fiber){
    // 如果没有dom就生成dom，此时的dom不包含子节点
    if(!fiber.dom){
        fiber.dom = createDom(fiber);
    }

    // if(fiber.parent){
    //     // 更新父Fiber的DOM节点（此时只有增）
    //     fiber.parent.dom.appendChild(fiber.dom);
    // }

    let elements = fiber.props.children;
    let index = 0;
    let prevSibling = null;
    // 生成子节点对应的Fiber，并将子Fiber串起来
    while(index < elements.length){
        const newFiber = {
            type: elements[index].type,
            props: elements[index].props,
            parent: fiber,
            dom: null
        }
        if(index===0){
            fiber.child = newFiber;
        }else{
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }
    if(prevSibling){
        prevSibling.sibling = null;
    }

    // 如果有子fiber，下一个操作的fiber为子fiber
    if(fiber.child){
        return fiber.child;
    }

    // 如果有兄弟fiber，则下一个操作的fiber为兄弟fiber
    // 否则向上回到父fiber，在父fiber的层级寻找兄弟fiber，即当前节点的叔fiber
    // 如果一直没找到，则会一直向上，直到碰到值为null的fiber
    let nextFiber = fiber;
    while(nextFiber){
        if(nextFiber.sibling){
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
    return null;
}

function workLoop(deadline){
    let shouldYield = false;
    while(nextUnitofWork && !shouldYield){
        nextUnitofWork = performUnitOfWork(nextUnitofWork);
        shouldYield = deadline.timeRemaining() > 1;
    }


    if(nextUnitofWork){
        requestIdleCallback(workLoop);
    }else if(!nextUnitofWork && rootFiber){
        commit(rootFiber);
    }
}

requestIdleCallback(workLoop);
import createDom from './createDom';
import commit from './commit';
import { reconcileChildren } from './reconcile';

// 首次提交的fiber tree
let wipRoot = null;
// 表示当前一次提交的 fiber tree
let currentRoot = null;
// 当前执行的 fiber 节点
let nextUnitofWork = null;
let deletions = null;

export function render(element, container){
    // 生成一个根fiber
    wipRoot = {
        dom: container,
        parent: null,
        props: {
            children: [element]
        },
        alternative: currentRoot,
    }
    nextUnitofWork = wipRoot;
    deletions = [];
}

function performUnitOfWork(fiber){
    // 如果没有dom就生成dom，此时的dom不包含子节点
    if(!fiber.dom){
        fiber.dom = createDom(fiber);
    }

    let elements = fiber.props.children;
    // 根据上次reconcile的子fiber生成新的子fiber
    reconcileChildren(fiber, elements, deletions);

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
    }else if(!nextUnitofWork && wipRoot){
        commit(wipRoot, deletions);
        currentRoot = wipRoot;
        wipRoot = null;
    }
}

requestIdleCallback(workLoop);
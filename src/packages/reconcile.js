export function reconcileChildren(wipFiber, elements, deletions){
    // 上一次wipFiber的子fiber
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child || null;
    let index = 0;
    let preFiber = null;
    while(index < elements.length || oldFiber){
        const element = elements[index];
        let newFiber = null;
        const sameType = Boolean(oldFiber && element && element.type === oldFiber.type);
        
        if(sameType){
            newFiber = {
                type: element.type,
                props: element.props,
                parent: wipFiber,
                // 继续沿用 oldFiber 中的 dom
                dom: oldFiber.dom,
                alternate: oldFiber,
                effectTag: 'UPDATE'
            }
        }

        if(!sameType && element){
            newFiber = {
                type: element.type,
                props: element.props,
                parent: wipFiber,
                dom: null,
                alternate: oldFiber,
                effectTag: 'PLACEMENT'
            }
        }

        if(!sameType && oldFiber){
            oldFiber.effectTag = 'DELETION';
            deletions.push(oldFiber);
        }

        if(newFiber){
            if(index===0){
                wipFiber.child = newFiber;
            }else if(index<element.length){
                prevFiber.sibling = newFiber;
            }
            prevFiber = newFiber;
        }

        oldFiber = oldFiber.sibling;
        index++;
    }
    if(preFiber){
        preFiber.sibling = null;
    }
}
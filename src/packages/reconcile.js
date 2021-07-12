export function reconcileChildren(wipFiber, elements, deletions){
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    let index = 0;
    while(index < elements || oldFiber){
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
            oldFiber.effectTag = 'DELETE';
            deletions.push(oldFiber);
        }

        oldFiber = oldFiber.sibling;
    }
}
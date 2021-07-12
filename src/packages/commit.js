export default function commitRoot(rootFiber){
    // rootFiber 的 dom 即为 render 函数中选中的 dom container，它不存在 fiber sibling
    commitFiber(rootFiber.child);
}

function commitFiber(fiber){
    console.log('commit');
    if(!fiber){
        return;
    }
    fiber.parent.dom.appendChild(fiber.dom);
    commitFiber(fiber.child);
    commitFiber(fiber.sibling);
}
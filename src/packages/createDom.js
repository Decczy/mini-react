export default function createDom(fiber){
    const { type, props } = fiber;
    const dom = type === 'TEXT_ELEMENT' ? document.createTextNode("") : document.createElement(type);

    Object.keys(props).forEach((prop)=>{
        if(prop !== 'children'){
            dom[prop] = props[prop];
        }
    })

    return dom;
}
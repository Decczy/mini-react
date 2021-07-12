interface Element {
    type: string,
    props: {
        children: Element[],
        [key: string]: any
    },
}

interface Fiber {
    type: string,
    parent: Fiber,
    props: {
        children: Element[],
        [key: string]: any
    }
}
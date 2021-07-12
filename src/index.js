import { render } from './react/fiber';
import createElement from './react/createElement';

const top = (
    /** @jsx createElement */
    <header>Welcome to react</header>
)



// 使用babel将jsx转为树状的Element结构
/** @jsx createElement */
const element = (
    <div id="root">
        <ul>
            <li>virtual dom</li>
            <li>fibers</li>
            <li>hooks</li>
        </ul>
    </div>
)


render(element, document.body);
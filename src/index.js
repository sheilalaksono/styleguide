import { Elm } from './elm/Main.elm';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import hljs from 'highlight.js/lib/highlight';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github-gist.css';
import '@zalora/style/dist/style.min.css';
import './main.css';


const node = document.getElementById('root');

const app = Elm.Main.init({ node: node });


customElements.define('code-snippet', class extends HTMLElement {
    constructor() {
        super();
        this._innerCode = '';
    }

    get innerCode() {
        return this._innerCode;
    }

    set innerCode(code) {
        if (this._innerCode === code) return
        this._innerCode = code;
    }

    connectedCallback() {
        this.innerText = this._innerCode;
        hljs.registerLanguage('xml', xml);
        hljs.highlightBlock(this);
    }
});

customElements.define('code-editor', class extends HTMLElement {
    constructor() {
        super();
        this._editorValue = '';
    }

    get editorValue() {
        return this._editorValue;
    }

    set editorValue(value) {
        if (this._editorValue === value) return
        this._editorValue = value;
        if (!this._editor) return;
        this._editor.setValue(value);
    }

    connectedCallback() {
        this._editor = CodeMirror(this, {
            indentUnit: 4,
            mode: 'htmlmixed',
            lineNumbers: true,
            theme: 'eclipse',
            lineWrapping: true,
            value: this._editorValue
        })

        this._editor.on('changes', () => {
            this._editorValue = this._editor.getValue();
            const node = document.getElementById('playground__preview');
            node.innerHTML = this._editorValue;
            this.dispatchEvent(new CustomEvent('editorChanged'));
        })
    }
});

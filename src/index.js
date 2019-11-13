import WebCo from "./webco";
(function() {
  "use strict";

  /* Constants */
  const TRIGGER_KEYS = ["Enter", "Tab", ","];

  const ipView = `
    <style>
      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }

      input {
        width: 100%;
        height: 45px;
        padding: 0 1rem;
        margin-top: 1rem;
        box-sizing: border-box;
        font: inherit;
        border-radius: 0.2rem;
        border: 2px solid #d4d5d6;
        color: #565656;
        -webkit-appearance: none;
      }

      input:focus {
        border-color: cornflowerblue;
        outline: none;
      }

      input.has-error {
        border-color: tomato;
      }

      p {
        margin: 0;
        font-size: 90%;
        color: tomato;
      }

      li {
        background-color: #d4d5d6;
        display: inline-block;
        font-size: 14px;
        border-radius: 30px;
        height: 30px;
        padding: 0 4px 0 1rem;
        display: inline-flex;
        align-items: center;
        margin: 0 0.3rem 0.3rem 0;
      }

      li > button {
        background-color: white;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        font: inherit;
        margin-left: 10px;
        font-weight: bold;
        padding: 0;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>
    
    <ul></ul>
    <input id="ip" type="text" onkeypress="{{this.inputChanged}}" placeholder="Type or paste email addresses and press 'Enter'...">
    <p></p>
  `;

  /* Component */
  class BadgeInput extends WebCo {
    state = {
      list: ["test@g.com"]
    };
    html = `<div> 
  <div onclick="{{this.test}}" class="test"> Badges </div>
  <ul> {{this.renderListItem()}} </ul>
 </div>`;

    $onClick = e => {
      console.log(" input clicked ", e.currentTarget);
    };
    constructor() {
      super();
      console.log(" after super ");
    }

    componentDidMount() {
      console.log(" badge mounted ", this.getAttribute("items"));
    }

    disconnectedCallback() {
      console.log(" removed ");
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log("Custom square element attributes changed.");
    }

    handleKeyDown = evt => {
      if (TRIGGER_KEYS.includes(evt.key)) {
        evt.preventDefault();

        var value = evt.target.value.trim();
        this.setState({ list: [...this.state.list, value] });
      }
    };

    handlePaste = evt => {
      evt.preventDefault();

      var paste = evt.clipboardData.getData("text");
      var emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

      if (emails) {
        var toBeAdded = emails.filter(email => !this.isInList(email));
        debugger;
        this.setState({ list: [...this.state.list, toBeAdded] });
        // this.update();
      }
    };

    handleDelete = evt => {
      console.log(" deleting ", evt);
      // if (evt.target.tagName === "BUTTON") {
      //   this.setState({
      //     list: this.state.list.filter(i => i !== evt.target.dataset.value)
      //   });
      // }
    };

    renderListItem() {
      console.log(" updating ", this, this.state);
      if (!this.state.list || this.state.list.length === 0) {
        return `HELLO`;
      }
      return (this.state.list || [])
        .map(item => {
          console.log(" this is ", this);
          return `
           <badge-item title="${item}" ></badge-item>
          `;
        })
        .join("");
    }

    validate(email) {
      var error = null;

      if (this.isInList(email)) {
        error = `${email} has already been added.`;
      }

      if (!this.isEmail(email)) {
        error = `${email} is not a valid email address.`;
      }

      if (error) {
        this._error.textContent = error;
        this._error.removeAttribute("hidden");
        this._input.classList.add("has-error");

        return false;
      }

      return true;
    }

    isInList(email) {
      return this.state.list.includes(email);
    }

    isEmail(email) {
      return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    }

    test = () => {
      console.log(" this is test ");
    };

    inputChanged = e => {
      if (e.keyCode == 13) {
        this.setState({ list: [...this.state.list, e.target.value] });
      }
    };

    render() {
      return `<div>
      ${ipView}
      <div> 
        <div onclick="{{this.test}}"> Badges </div>
        <ul> 
        {{this.renderListItem()}} 
        </ul>
       </div>
       </div>`;
    }
  }

  class InputContainer extends WebCo {
    componentDidMount() {
      this.state = {
        list: [
          {
            name: "aadil"
          }
        ]
      };
      console.log(" ip connected ", this);
    }
    html = ipView;
    inputChanged = e => {
      console.log(" input cahnged ", e.target.value, e.keyCode, this.state);
      if (e.keyCode == 13) {
        this.state = {
          list: [
            {
              name: "aadil"
            }
          ]
        };
        this.setState({});
      }
    };
    render() {
      return ipView;
    }
  }

  class Badge extends WebCo {
    render() {
      return `
      <li>
      {{this.getAttribute('title')}}
          <button type="button" data-value="{{this.getAttribute('title')}}">&times;</button>
        </li>`;
    }
  }

  /* Registration */
  customElements.define("badge-input", BadgeInput);
  customElements.define("ip-container", InputContainer);
  customElements.define("badge-item", Badge);
})();

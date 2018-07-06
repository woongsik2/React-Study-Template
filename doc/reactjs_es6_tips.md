Reactjs + ES 6 Tips
=====
* Reactjs Class 내 `render` function으로 View 정의 시, 복수의 컴포넌트를 반환 할 수 없다.

```
// NO
render() {
   return (
     <div>title</div>
     <div>contents</div>
   );
}

// OK
render() {
  return (
    <div>
      <div>title</div>
      <div>contents</div>
    </div>
  );
}
```

* ECMA6 기반 map을 사용하여 처리

```
var items = this.props.items.map((item) => {
  return <div>{item.name}</div>;
});
```

Data Scope, 흐름
-----
#### prop
* Component 외부에서 값을 부여받아 처리, 내부에서 값은 불변함.

```
var Avatar = React.createClass({
  render() {
    var avatarImg = `/img/avatar_${this.props.user.id}.png`;

    return(
      <div>
        <span>{this.props.user.name}</span>
        <img src={avatarImg} />
      </div>
    );
  };
});

var user = {
  id: 10,
  name: "Hoge"
};

// <Avatar user={user} />
```

* `propTypes`를 통해 외부에서 들어오는 값 검증(**Validation**) 가능

```
var Avatar = React.createClass({
  propTypes: {
    name:   React.PropTypes.string.isRequired,
    id:     React.PropTypes.number.isRequired,
    width:  React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    alt:    React.PropTypes.string
  },
  render() {
    var src = `/img/avatar/${this.props.id}.png`;
    return (
      <div>
        <img src={src} width={this.props.width} height={this.props.height} alt={this.props.alt} />
        <span>{this.props.name}</span>
      </div>
    );
  }
});

<Avatar name="foo" id=1 width=100 height=100 />
```

* 요소 설명

```
React.PropTypes.array           // 배열
React.PropTypes.bool.isRequired // Boolean, 필수
React.PropTypes.func            // 함수
React.PropTypes.number          // 정수
React.PropTypes.object          // 객체
React.PropTypes.string          // 문자열
React.PropTypes.node            // Render가 가능한 객체
React.PropTypes.element         // React Element
React.PropTypes.instanceOf(XXX) // XXX의 instance
React.PropTypes.oneOf(['foo', 'bar']) // foo 또는 bar
React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]) // 문자열 또는 배열
React.PropTypes.arrayOf(React.PropTypes.string)  // 문자열을 원소로 가지는 배열
React.PropTypes.objectOf(React.PropTypes.string) // 문자열을 값으로 가지는 객체
React.PropTypes.shape({                          // 지정된 형식을 충족하는지
  color: React.PropTypes.string,
  fontSize: React.PropTypes.number
});
React.PropTypes.any.isRequired  // 어떤 타입이든 가능하지만 필수

// 커스텀 제약도 정의 가능
customPropType: function(props, propName, componentName) {
  if (!/^[0-9]/.test(props[propName])) {
    return new Error('Validation failed!');
  }
}
```

* 예제

```
var Avatar = React.createClass({
  propTypes: {
    user: React.PropTypes.shape({
      id:   React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired
    })
  },
  render() {
    var avatarImg = `/img/avatar_${this.props.user.id}.png`;
    return(
      <div>
        <span>{this.props.user.name}</span>
        <img src={avatarImg} />
      </div>
    );
  }
});
```

* ES6 내 사용 예제

```
class Avatar extends React.Component {
  render() {
    var avatarImg = `/img/avatar_${this.props.user.id}.png`;

    return(
      <div>
        <span>{this.props.user.name}</span>
        <img src={avatarImg} />
      </div>
    );
  }
}

Avatar.propTypes =  {
  user: React.PropTypes.shape({
    id:   React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired
  })
};

export default Avatar;
```

* React Component 내부에서 `getDefaultProps()`로 return 되는 Object 값을 **prop**로 사용 가능하나, 이는 Component의 인스턴스가 만들어 질 때가 아닌, 정의될 때 만 호출된다.
* 새로운 **prop**의 값을 재 적용하여 **재 렌더링** 해야 할 경우 `setProps()`와 `replaceProps()`를 사용한다. 이 또한, 외부에서 사용해야 한다.
	* `setProps()` : 해당 Key에 매칭되는 Value 만 변경
	* `replaceProps()` : Object 자체가 변경

```
var Test = React.createClass({
  getDefaultProps: function() {
    return {
      id: 1
    };
  },
  render: function() {
    return (
      <div>{this.props.id}:{this.props.name}</div>
    );
  }
});

var component = React.render(<Test name="bar" />, document.body);

component.setProps({ name: "foo" });      // <div>1:foo</div> Key에 매칭되어 Value가 변경
component.replaceProps({ name: "hoge" }); // <div>:hoge</div> Object 자체가 변경
```

#### state
* **변경이 가능**한 Component 내부 전용 오브젝트이며, `getInitialState()`의 **return Object**로 **초기값**을 셋팅한다.
* `setState()`로 내부에서 값 변경이 가능하다.

```
var Counter = React.createClass({
  getInitialState() {
    return {
      count: 0
    };
  },
  onClick() {
    this.setState({ count: this.state.count + 1});
  },
  render() {
    return (
      <div>
        <span>{this.state.count}</span>
        <button onClick={this.onClick}>click</button>
      </div>
    );
  }
});
```

* **state** 값은 내부에서 직접 접근하면 안되고, 변경과 동시에 UI 변경(**render**)되려면 `setState()` 통해서만 사용해야한다.

#### prop와 state
* 최상위 Component만 **state**를 사용하고, 하위 Component는 **prop**로 사용하는 것이 성능 최적화에 좋다.

```
// 자식 Component
var User = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    id:   React.PropTypes.number.isRequired
  },
  render() {
    return (
      <div>{this.props.id}:{this.props.name}</div>
    );
  }
});

var request = require('superagent');

// 부모 Component
var Users = React.createClass({
  getInitialState() {
    return {
      users: [ {id: 1, name: "foo"}, {id: 2, name: "bar"} ]
    }
  },
  componentDidMount() {
    request.get('http://example.com/users/', (res) => {
      this.setState({users: res.body.users});
    });
  },
  render() {
    var users = this.state.users.map((user) => {
      return <User id={user.id} name={user.name} key={user.id}/>
    });
    return (
      <div>
        <p>사용자 목록</p>
        {users}
      </div>
    );
  }
});
```

Event 처리
-----
* onClick 이벤트 처리 예시
	* Reactjs Component에서 `onClick`을 이용하여 내부 함수와 연동 가능.

```
var Counter = React.createClass({
  getInitialState() {
    return {
      count: 0
    };
  },
  onClick() {
    this.setState({count: this.state.count + 1});
  },
  render() {
    return (
      <div>
        <div>count:{this.state.count}</div>
        <button onClick={this.onClick}>click!</button>
      </div>
    );
  }
});
```

* 자식 Component에서 부모 Component 이벤트를 이관 시에는, 자식 Component에 **prop**로 부모 Component의 이벤트 콜백함수를 지정하면 된다.

```
var Todo = React.createClass({
  propTypes: {
    todo: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      text: React.PropTypes.string.isRequired
    }),
    // 삭제 처리를 I/F로 정의
    onDelete: React.PropTypes.func.isRequired
  },
  // 부모에게 이벤트 처리를 위임한다.
  _onDelete() {
    this.props.onDelete(this.props.todo.id);
  },
  render() {
    return (
      <div>
        <span>{this.props.todo.text}</span>
        <button onClick={this._onDelete}>delete</button>
      </div>
    );
  }
});

var TodoList = React.createClass({
  getInitialState() {
    return {
      todos: [
        {id:1, text:"advent calendar1"},
        {id:2, text:"advent calendar2"},
        {id:3, text:"advent calendar3"}
      ]
    };
  },
  // TodoList는 이 컴포넌트가 관리하고 있으므로 삭제 처리도 여기에 존재한다.
  deleteTodo(id) {
    this.setState({
      todos: this.state.todos.filter((todo) => {
        return todo.id !== id;
      })
    });
  },
  render() {
    var todos = this.state.todos.map((todo) => {
      return <li key={todo.id}><Todo onDelete={this.deleteTodo} todo={todo} /></li>;
    });
    return <ul>{todos}</ul>;
  }
});

React.render(<TodoList />, document.body);
```
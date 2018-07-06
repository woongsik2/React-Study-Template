Smart Admin 분석
====
Webpack 설정
-----
FrontEnd 개발 간 필수 불가결적으로 많은 라이브러리나 프레임워크를 쓰게된다. 이를 Client에서 일반적으로 사용한다면 모든 라이브러리를 다운받아야 할 것이다. 많은 라이브러리는 초기 로딩속도를 많이 늦쳐질 것이며, 이로 인해 서비스 품질은 떨어지게 될 것이다.
요즘은 라이브러리 자체 압축형태인 `.min.js` 형식으로 지원하나, 그래도 많은 수의 파일을 다운 받는 것은 매한가지이다.

Smart Admin을 통해 **React.js** 개발은 **ECMA6** 기반이기 때문에 **ECMA6**를 지원하지 않는 브라우저를 위해 **Compile** 작업을 해야만하며, Customize CSS는 **LESS**를 사용하기 때문에 이 또한 **Compile** 작업이 필요하다. **React.js**도 마찬가지로 이 작업이 필요하며, 이외에도 추가적으로 필요한 작업들이 존재한다.

이러한 작업들을 수정/배포 할 때 마다 개발자가 일일히 한다면, 이러한 라이브러리나 프레임워크를 쓰려고 하지 않고, 전통적인(?) **JQuery**만을 사용하여 개발하는 형태로 돌아설 것이다.

**Webpack**은 이러한 문제를 한번에 해결해 주는 마치 해결사와 같은 역할을 가진 솔루션이다. 개발자가 개발 진행 간, 소스를 **IDE** 또는 **Editor**를 통해 수정하여 저장만 하면, 자동으로 변경된 부분을 확인하여 변경된 부분만 컴파일 후, **브라우져**를 자동으로 **Refresh**를 시켜 개발자가 바로 확인할 수 있게 한다. 또한 배포를 위해 빌드 명령을 내릴 경우, 수많은 라이브러리를 난독화/압축 하여 한개 혹은 수개의 파일로 만들며, 각각의 라이브러리는 **require**를 통해 접근할 수 있게 한다.

물론, 몇몇 버그가 존재하여, 컴파일이 간혹 되지 않는 경우가 있니, 자신의 코드를 믿도록(?) 한다.

#### Custom Library 추가
Smart Admin 프로젝트 설치 시, 많은 라이브러리가 설치되겠지만, 기존의 자신이 가진 것이거나 자신에 입맛에 맞는 라이브러리를 적용해야 할 수 있다. 이 경우, **Webpack**에 등록하여 추가된 라이브러리 또한 관리될 수 있게 해야 한다.

* 추가할 라이브러리를 준비한다.
	* 즉시 실행 함수로 구성 후, **Module**로 **Export**해야 한다.
	* 대부분 js 라이브러리는 Module 형태로 구성되어 있다. (없으면 직접 구성해야 함.)

```javascript
//모듈 구성 예제
var sdenv = (function(){
	...
});
module.exports = sdenv;
```

* `webpack\scripts.js`
	* **aliases** 항목에 다른 라이브러리와 동일하게 등록한다. alias 명과 라이브러리 경로를 지정하는 것이다.
		* **alias**된 명칭은 차후, **require**를 통해 프로젝트 내부에서 사용할 수 있다.
	* **chunks** 항목에 **alias** 된 명칭을 다른 라이브러리와 동일하게 추가하여, Compile 등록한다.

추가한 라이브러리는 **React** 내에서는 **import**로 **alias**된 명칭으로 가져와 사용가능하다. 전체 범위에서 사용하는 라이브러리로 등록하고 싶은 경우 `예> lodash : _.clone(), jQuery : $.('#TEST')`, `src\app\main.jsx` 내에서 **require**와 함께 특정 키워드로 등록하면 된다.

```javascript
//키워드로 특정 라이브러리 등록 예제
window.jQuery = window.$ =  require("jquery");
window._ =  require("lodash");
window.sd = require("sdesk-lib");
```

#### Proxy 설정
Webpack을 Front-End 개발 용 웹 서버로 사용 할 경우, API 접근 시 **CrossDomain** 문제가 발생 된다. 이를 우회하기 위해서 Proxy 적용해야 한다.
* `webpack\webpack.dev.config.js` 내부의 `devServer` 부분에 Proxy 정보를 입력
* 예제

```
devServer: {
        contentBase: 'web',
        devtool: 'eval',
        port: 14602,
        hot: true,
        inline: true,
        proxy:{
        	'/rfapi/*':'http://devsdesk.lguplus.co.kr',
            '/images/*':'http://devsdesk.lguplus.co.kr',
            '/image/*':'http://devsdesk.lguplus.co.kr',
            '/websquare/*':'http://devsdesk.lguplus.co.kr'
        }
    }
```

* `proxy` 항목에 접근 할 디렉토리를 설정하고 설정한 디렉토리로 접근할 경우 프록시로 사용할 위치를 지정한다.
	* `'/rfapi/*'` : rfapi 디렉토리 및 하위 접근 시, `'http://devsdesk.lguplus.co.kr'`로 조회한다.
	* 예 : `/rfapi/test.wsd` --> `'http://devsdesk.lguplus.co.kr/rfapi/test.wsd'`

**Reactjs** 공통
-----
* **props** : 상위에서 받은 인자 값이며, **고정**된 값이다.
	* ex : `<ToggleMenu className="btn-header pull-right"  /* collapse menu button */ />`에서 **className**으로 하위 **render**부분에 `{this.props.className}`로 사용 가능
* **state**	: React Component 내 `getInitialState()` 함수 정의로 `return` 받은 오브젝트. 변경 가능한 데이터.

React Template
-----
1. `.jsx` 기본
```javascript
import React from 'react'
let UiGeneral = React.createClass({
    render: function () {
        return (
			// TODO .jsx 형태의 렌더링 될 HMTL 스타일 셋 입력 부분
		)
    }
});
export default UiGeneral
```

Route
-----
**SPA**에서 특정 **Section** 내에 메뉴나 특정 이벤트로 인하여 페이지를 변경하고 싶다면, 직접 동적으로 생성하여 넣어도 되나, **React-Route**를 사용하면, 주소 기반으로 각각의 기능을 페이지 형식으로 구성이 가능하다. **Smart Admin**은 기본적으로 각 기능을 구성하는 페이지 접근은 **React-Route** 기능을 사용한여 구현되어져 있다.
* React 각 페이지 위치를 정의해야 한다.
	* React에서 각 위치는 URL상에서 `/#/ ` 뒤에 정의된다.
		* 예 : `http://localhost:8080/#/svc/ProductMain`
* Route 위치 정의하기
	* `app\Routes.jsx` 에서 정의된 메뉴 별 Path를 생성할 React Componet과 연결한다.
	* Component는 `.jsx` 방식의 해당 파일 상단에 **import**로 정의
	* **Redirect** : 특정 위치 접근 시, 다른 위치로 이동
		* 예 : `<Redirect from="/" to="/svc/SDeskMain"/>`
	* **Route** : 메뉴  Path와 대응
		* Path 앞의 `/` 를 제거하고 대응 정의한다.
			* 예 : `<Route path="dashboard" component={Dashboard}/>`
		* Route는 Depth로 다중 구성 가능하며, 자동으로 하위 레벨로 정의된다.
			* 예 : `<Route path="svc"><Route path="SDeskMain" component={SDeskMain}/></Route>` --> `/svc/SDeskMain`

Header
-----
서비스 내 상단 메뉴를 구성한다.
* `app\pages\layout\Header.jsx` : Header 부분을 정의하는 Component

#### Language
* `components\i18n\LanguageSelector.jsx` : 언어 선택 Component
* `web\api\langs\languages.json` : 기본 언어 정보 셋
* `components\i18n\LanguageStore.js` : 선택한 언어 정보 저장소

Navigation Menu
-----
서비스 내 좌측 메뉴를 구성한다.
#### Menu Object
* `app\config\menu-items.json` : JSON 형태로 메뉴를 구성하는 Component
	* title : 메뉴 명칭, 차후 다국어 사용 시 이 값이 ID가 되어 기준으로 변경 된다.
	* icon : 메뉴의 대표 아이콘.
	* route : 메뉴의 대응할 페이지가 위치 할 Path

#### 구성
* `app\pages\layout\Navigation.jsx` : Data 와 Binding 되어 좌측 Component

#### Router
* `app\routes.jsx`, `app\router.jsx` 를 통해 **React** Component와 `.jsx` 파일을 연계

Reflux 기본
-----
**React.js**는 View만 그리는 라이브러리이며, 실제 동적으로 구동하기 위해서는 Model 기반의 구현체를 직접 개발해야 한다. 데이터의 흐름에 따라 View를 그리는 경우, 활용할 만한 라이브러리가 여러개 존재한다. 그 중 **flux**는 페이스 북에서 구현한 데이터 흐름 관련 라이브러리이며, Smart Admin에서는 이를 기반으로 뺄건 빼고, 좀 더 단순하게 구성한 **reflux**를 사용한다.
**reflux**는 데이터 흐름의 기본이 **단방향**으로 흐르는 형태이며, 크게 3단계로 구성된다.
1. Action : 이벤트가 발생하거나, 로직 실행 시 사용
2. Store : 이벤트에 따라 데이터 변경
3. View : 변경된 데이터를 뷰에 반영

이 3단계는 View에서 다시 Action을 이벤트나 직접 호출하게 되어, 단방향으로 계속 데이터를 흐르게 한다.

이러한 규칙을 기준으로 **Smart Admin**은 구현되어 있으며, 아래의 순서를 요령으로 각 컴포넌트 혹은 페이지를 구성하면 된다.

#### 컴포넌트 및 페이지 생성 순서 - 가이드
1. 각 프로젝트의 디렉토리 체계에 맞춰 생성할 컴포넌트의 위치에 `[컴포넌트명].jsx` 파일을 생성한다.
	* **Reflux**를 Import 해야 한다.
2. 해당 컴포넌트와 연결되는 **Reflux** 구현체인 Action과 Store 파일을 생성한다.
	* 각각 **Reflux**를 Import 해야 한다.
	* Store에서는 Action을 Import해야 한다.
1. 컴포넌트 내에 Action을 import하며, `Mixin`기능으로 연결한다.
	* `예> mixins: [Reflux.connect(SDeskStore)]`
3. 생성한 Action과 Store를 컴포넌트 안에 **import**한다.
4. Store 내에 `init()` 함수를 만들고, 컴포넌트가 `this.state`로 사용할 초기 값을 정의 한다.
5. 컴포넌트에서 데이터 기반으로 View를 구성한다.
6. 데이터 변경요소(이벤트, 서버 조회 등)는 Action에서 처리해야 하므로, Action에서 데이터 변경 요소를 등록한다.
7. 서버로 조회하는 경우 Action에서 서버 조회 로직을 구현한다. (Ajax 등)
8. 등록한 Action에 따라, Store에서 Completed(혹은 Failed) 로직을 구성한다.
9. Store 데이터 변경 및 가공이 종료되면, `this.trigger()`를 통해 컴포넌트의 `this.state`로 보낼 데이터를 전달한다.

#### Action 작성 요령
```javascript
//import로 필요한 라이브러리들을 가져온다. 이때, webpack으로 alias된 라이브러리들도 가져올 수 있다.
import Reflux from 'reflux'
import SDEnv from 'sdesk-consts'
import AjaxActions from '../../../../../../components/actions/AjaxActions'

//사용될 Action들을 등록한다.
let SDeskAclMgtDetailAction = Reflux.createActions({
    init:{},
    loadAclData: {asyncResult: true}, //서버로 조회하여 Callback이 필요한 경우 asyncResult 옵션을 넣어준다.
    changeIpt:{},
    insert:{asyncResult: true},
    modify:{},
    modifyConfirm:{asyncResult: true},
    modifyCancel:{},
    cancel:{},
    stop:{asyncResult: true},
    selectCodeGrp:{}
});

...

//Action 중 서버 조회와 같이 특정한 로직은 Action에서 구현한다. (구현하지 않고, Store에서 처리해도 됨.)
SDeskAclMgtDetailAction.loadAclData.listen(function (authId){
    let url = '/rfapi/utils.wsq';
    let reqData = {
        data:{
            action:'retrieveAllAcl',
            authId:authId
        }
    };
    AjaxActions.sdeskComm(url, reqData,(data)=>{
    	//completed는 Store로 Action 결과를 전달 시, Completed로 전달하게 된다.
        this.completed(data);
    });
});

...

//만들어진 Aciton 모듈은 export로 외부에서 사용 가능하게 등록 해야한다.
export default SDeskAclMgtDetailAction;
```

#### Store 작성 요령
```javascript
import Reflux from 'reflux'
import SDEnv from 'sdesk-consts'
//데이터 흐름 간 연결되는 Action을 import로 가져온다.
import SDeskActions from './../actions/SDeskAclMgtDetailAction.jsx'

let SDeskAclMgtDetailStore = Reflux.createStore({
	//Action과 연동을 등록한다. Action 내 Listen과 연결된다.
    listenables: SDeskActions,
    init: function(){
        this.data={
            aclData:{
            },
            BACKUP:{},
            STATUS:SDEnv.STATUS.PREPARE,
            isLoading: true
        }
        this.trigger(this.data);
    },
    ...
    //Action의 loadAclData에서 Completed로 호출되면 자동으로 아래와 같은 이름의 함수로 연결된다.
    onLoadAclDataCompleted: function(data){
        if(!data){
            this.data.aclData = {};
        }else{
            //TODO: 서버 조회 데이터 가공
        }
        this.data.isLoading = false;
        //컴포넌트의 this.setState를 호출하면서 데이터를 등록한다.
        this.trigger(this.data);
    },
    ...
});

export default SDeskAclMgtDetailStore;
```

기타
-----
#### `import` 요령
* `import`는 해당 `.jsx` 에서 특정 **라이브러리**나 **React Component**를 가져올 때 사용한다.
* `import` 경로는 해당 `.jsx` **파일 위치**를 **기준**으로 설정한다.
* `import` 시, 해당 `.jsx` 내에서 사용할 변수 명을 지정해야 한다. Java의 Class 명 처럼 첫 음절을 대문자로 사용한다.
	* 예 : `import CKEditorDemo from './pages/misc/CKEditorDemo.jsx'`
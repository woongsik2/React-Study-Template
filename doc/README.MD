Smart Admin 분석
====
Webpack 설정
-----
#### Proxy 설정
Webpack을 Front-End 개발 용 웹 서버로 사용 할 경우, API 접근 시 CrossDomain 문제가 발생 된다. 이를 우회하기 위해서 Proxy 적용해야 한다.
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
* React 각 페이지 위치를 정의해야 한다.
	* React에서 각 위치는 URL상에서 `/#/ ` 뒤에 정의된다.
		* 예 : `http://localhost:8080/#/svc/ProductMain`
* **Route**를 정의 할 경우, 가장 먼저 메뉴 구조를 `app\config\menu-items.json`에서 정의해야 한다.
	* title : 메뉴 명칭, 차후 다국어 사용 시 이 값이 ID가 되어 기준으로 변경 된다.
	* icon : 메뉴의 대표 아이콘.
	* route : 메뉴의 대응할 페이지가 위치 할 Path
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
* `app\pages\layout\Header.jsx` : Header 부분을 정의하는 Component

#### Language
* `components\i18n\LanguageSelector.jsx` : 언어 선택 Component
* `web\api\langs\languages.json` : 기본 언어 정보 셋
* `components\i18n\LanguageStore.js` : 선택한 언어 정보 저장소

Navigation Menu
-----
#### Menu Object
* `app\config\menu-items.json` : JSON 형태로 메뉴를 구성하는 Component

#### 구성
* `app\pages\layout\Navigation.jsx` : Data 와 Binding 되어 좌측 Component

#### Router
* `app\routes.jsx`, `app\router.jsx` 를 통해 **React** Component와 `.jsx` 파일을 연계

기타
-----
#### `import` 요령
* `import`는 해당 `.jsx` 에서 특정 **라이브러리**나 **React Component**를 가져올 때 사용한다.
* `import` 경로는 해당 `.jsx` 파일 위치를 기준으로 설정한다.
* `import` 시, 해당 `.jsx` 내에서 사용할 변수 명을 지정해야 한다. Java의 Class 명 처럼 첫 음절을 대문자로 사용한다.
	* 예 : `import CKEditorDemo from './pages/misc/CKEditorDemo.jsx'`
import React from 'react'
import Reflux from 'reflux'
import classnames from 'classnames'
import LanguageActions from './LanguageActions'
import LanguageStore from './LanguageStore'

let LanguageSelector = React.createClass({
    getInitialState: function(){
        return LanguageStore.getData()
    },
    mixins: [Reflux.connect(LanguageStore)],
    componentWillMount: function(){
        LanguageActions.init();
    },
    componentDidMount:function(){
        console.log('[JG][LanguageSelector.jsx] DidMount...');
        // 기본 설정 언어로 변경
        LanguageActions.select(LanguageStore.getData().language);
    },
    render: function () {
        let languages = this.state.languages;
        let language = this.state.language;
        //console.log('[JG][LanguageSelector.jsx] languages...',languages);
        //console.log('[JG][LanguageSelector.jsx] language...',language);
        return (
            <ul className="header-dropdown-list hidden-xs ng-cloak">
                <li className="dropdown">
                    <a className="dropdown-toggle" href="#"  data-toggle="dropdown">
                        <img src="styles/img/blank.gif"
                             className={classnames(['flag', 'flag-'+language.key])} alt={language.alt} />
                        <span>&nbsp;{language.title}&nbsp;</span>
                        <i className="fa fa-angle-down" /></a>
                    <ul className="dropdown-menu pull-right">
                        {languages.map(function(_lang, idx){
                            return (
                                <li key={idx} className={classnames({
                                    active: _lang.key == language.key
                                })}>
                                    <a href="#" onClick={this._selectLanguage.bind(this, _lang)} >
                                        <img src="styles/img/blank.gif"
                                             className={classnames(['flag', 'flag-'+_lang.key])} alt={_lang.alt} />
                                        <span>&nbsp;{_lang.title}</span>
                                    </a>
                                </li>
                            )
                        }.bind(this))}
                    </ul>
                </li>
            </ul>
        )
    },
    _selectLanguage: function(language){
        // language는 선택된 언어를 의미한다.
        LanguageStore.setLanguage(language)
        LanguageActions.select(language)
    }
});

export default LanguageSelector
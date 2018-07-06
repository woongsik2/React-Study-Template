import React from 'react'

let LoadingDiv = React.createClass({
    render: function () {
        return(
            <div id="content">
            <div className="row vertical-align left-gap">
                <div className="col col-2"><h4>페이지 로딩중...</h4></div>
                <div className="col col-2"><i className="fa fa-gear fa-2x fa-spin"></i></div>
            </div>
            </div>
        )
    }
});

export default LoadingDiv
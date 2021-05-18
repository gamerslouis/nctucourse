import React from 'react'

class Mobile extends React.Component {
    componentDidMount() {
        window.alert("學分模擬器目前僅提供電腦版，手機板敬請期待。")
        window.location.href = '/'
    }

    render() {
        return <></>
    }
}

export default Mobile;
import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            // 你可以 render 任何客製化的 fallback UI
            return <h1 style={{ marginLeft: 24 }}>哇，好像某些東西壞掉了! 請重新整理頁面。<br />如果錯誤持續發生，請至右下角"意見回饋"回報。</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
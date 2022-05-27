import { Button } from '@material-ui/core';
import { ErrorOutline } from '@material-ui/icons';
import React from 'react';

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
            return (
                <div style={{
                    width: "100%", height: "calc(100vh - 130px)",
                    display: "flex", flexDirection: "column",
                    justifyContent: "center", alignItems: "center"
                }}>
                    <ErrorOutline style={{
                        width: 80, height: "auto",
                        color: "rgba(0, 0, 0, .6)"
                    }} />
                    <span style={{ marginBottom: 14 }}>發生意外的錯誤</span>
                    <span>
                        <Button variant="contained" color="primary"
                            component="a" href="https://forms.gle/Jp6f3rxkjZe7X5Pt5"
                            target="_blank" rel="noreferrer noopener">回報錯誤</Button>
                    </span>
                    <p style={{ textAlign: "center" }}>
                        您可以按下在「回報錯誤」按鈕的表單中<wbr />說明發生錯誤前的操作，<br />
                        來協助我們改善，謝謝！
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
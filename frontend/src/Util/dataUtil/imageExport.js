import html2canvas from "html2canvas";

export const DownloadAsImage = (element, onFinish, onWindowFail) => {
    window.scrollTo(0, 0);
    setTimeout(() => {
        html2canvas(element, { scale: 2 })
            .then((canvas) => {
                function iOS() {
                    return (
                        [
                            "iPad Simulator",
                            "iPhone Simulator",
                            "iPod Simulator",
                            "iPad",
                            "iPhone",
                            "iPod",
                        ].includes(navigator.platform) ||
                        // iPad on iOS 13 detection
                        (navigator.userAgent.includes("Mac") &&
                            "ontouchend" in document)
                    );
                }
                if (iOS()) {
                    let image = new Image();
                    image.src = canvas.toDataURL();
                    let w = window.open();
                    if (!w) {
                        onWindowFail();
                    } else {
                        w.opener = null;
                        w.document.write(image.outerHTML);
                    }
                } else {
                    let a = document.createElement("a");
                    a.href = canvas.toDataURL("image/png");
                    a.download = "課表.png";
                    a.click();
                }
            })
            .finally(onFinish);
    }, 100);
};

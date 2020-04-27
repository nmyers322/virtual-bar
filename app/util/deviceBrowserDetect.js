import platform from 'platform';

const deviceBrowserDetect = {
    checkGetUserMediaExists: () => {
        if(!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            return new Promise((resolve, reject) => reject("getUserMedia does not exist"));
        } else {
            return new Promise((resolve, reject) => {
                navigator.mediaDevices.getUserMedia({video: true, audio: true})
                    .then(stream => {
                        stream.getTracks().forEach(track => track.stop());
                        resolve(true);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }        
    },
    isChrome: () => /^chrome/.test(platform.name.toString().toLowerCase()),
    isFirefox: () => /^firefox/.test(platform.name.toString().toLowerCase()),
    isIOS: () => /^ios/.test(platform.os.toString().toLowerCase()),
    isSafari: () => /^safari/.test(platform.name.toString().toLowerCase()),
    getPlatform: () => 'name: ' + platform.name.toString() + ',  os: ' + platform.os.toString()
};

export default deviceBrowserDetect;
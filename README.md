# VirtualBar
A React Video Chat app using Twilio Video - cloned from video-chat-react

[Link to Full Article](https://www.twilio.com/blog/2018/03/video-chat-react.html)

# Local Setup

```
$ git clone git@github.com:nmyers322/virtual-bar.git
$ npm install
$ npm run start
```

# Production Setup
```
$ git clone git@github.com:nmyers322/virtual-bar.git
$ npm install
$ npm run build
$ pm2 start server
```

# Demo

https://gehenna.club

# Issues
* After visibility change kicks you out, tracks could still be attached. check getUserMedia and see what's happening
* Call API to get participants, show on tables, restrict access if table full
* Need to check if video/audio is mounted and retry if not
* Video/Audio not working? Remount components button
* Needs oAuth, identity management, JWT verification, etc
* Private tables
* Clean up components, extract classes
* Handle devices that do not support DeviceOrientationEvent
* Handle user clicks deny on DeviceOrientationEvent
* favicons
* Upgrade to babel 7 / webpack 4
* Switch cameras
* If directly linked to table or lobby, do entry checks and kick if not satisfied
* Rearrange lobby, add tables
* Move table event log on mobile
* Draw on someone, take a pic, send to them
* Remove drink if exiting bar
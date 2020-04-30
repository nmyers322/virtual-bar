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
* After kicked out, tracks could still be attached. check getUserMedia and see what's happening
* Need to check if video/audio is mounted and auto retry if not
* Video/Audio not working? Remount components button
* Needs oAuth, identity management, JWT verification, etc
* Private tables - invite only or grant requests
* Handle devices that do not support DeviceOrientationEvent
* Handle user clicks deny on DeviceOrientationEvent
* favicons
* Upgrade to babel 7 / webpack 4
* Switch cameras button
* If directly linked to table or lobby, do entry checks and kick if not satisfied
* Move table event log on mobile
* Draw on someone, take a pic, send to them
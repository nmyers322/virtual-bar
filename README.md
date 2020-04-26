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
* Works on iPhone 8+ and X, Safarai
* Works on Chrome on Windows
* Need to check if video/audio is mounted and retry if not
* Needs oAuth, identity management, JWT verification, etc
* Call API to get participants, show on tables, restrict access if table full
* Ability to get drinks
* Self-cam in bottom corner
* Private tables
* Clean up components, extract classes
* Handle devices that do not support DeviceOrientationEvent
* Handle user clicks deny on DeviceOrientationEvent
* favicons
* Upgrade to babel 7 / webpack 4
* Switch cameras
* Show that a seat is taken when there is not yet audio or video
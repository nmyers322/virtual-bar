import React from 'react';
import { withTheme } from '@material-ui/core/styles';
import { Grid, Link, Typography } from '@material-ui/core';

const CompatibilityInstructions = ({err}) => {

    const isPermissionsError = (err) => {
        return err.toString().includes('NotAllowedError');
    }

    const userFriendlyInstructions = (err) => {
        if (err && isPermissionsError(err)) {
            return <Typography color="textPrimary" style={{marginTop: '5vh'}}>
                Welcome to the Virtual Bar video chat app. 
                It looks like you have not enabled permissions to grant this browser access to the microphone or camera.
                Go into your device settings and enable video and microphone permissions, then refresh this page.
            </Typography>
        } else if (deviceBrowserDetect.iOS()) {
            if (!deviceBrowserDetect.isSafari()) {
                return <Typography color="textPrimary" style={{marginTop: '5vh'}}>
                    Welcome to the Virtual Bar video chat app. 
                    It looks like you are on a device running 
                    <Link color="secondary" style={{marginLeft: '1vh', marginRight: '1vh'}} href="https://www.apple.com/ios/ios-13/" target="new">iOS</Link> 
                    but you are not using 
                    <Link color="secondary" style={{marginLeft: '1vh', marginRight: '1vh'}} href="https://www.apple.com/safari/" target="new">Safari</Link>. 
                    You must use Safari to access the camera and microphone. Open the Safari app from your home screen.
                </Typography>
            } else {
                return <Typography color="textPrimary" style={{marginTop: '5vh'}}>
                    Welcome to the Virtual Bar video chat app. 
                    It looks like you are on a device running 
                    <Link color="secondary" style={{marginLeft: '1vh', marginRight: '1vh'}} href="https://www.apple.com/ios/ios-13/" target="new">iOS</Link> 
                    but there was a problem initializing the microphone or camera. Try using another device.
                </Typography>
            }
        } else {
            return <Typography color="textPrimary" style={{marginTop: '5vh'}}>
                Welcome to the Virtual Bar video chat app. 
                It looks like you are using a browser that does not support video and audio chat, or there was an error initiaizing the microphone or camera.
                It's highly suggested that you use 
                <Link color="secondary" style={{marginLeft: '1vh', marginRight: '1vh'}} href="https://www.google.com/chrome/" target="new">Chrome</Link>.
                If you are already on Chrome, try using another device.
            </Typography>
        }
    }

    return <Grid item xs={10} sm={9} lg={6} style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'top'
        }}>
        { userFriendlyInstructions(err) }
        { err &&
            <Typography color="textPrimary" style={{marginTop: '5vh'}}>
                Error message for debugging purposes: <br />
                <code>{ err.toString() }</code>
            </Typography>
        }
    </Grid>;
}

export default withTheme(CompatibilityInstructions);
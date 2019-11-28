/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import YouTube from 'react-native-youtube';
import channelData from './src/data/channels';
import ApiKeys from './api_keys';

const VIDEO_STATES = {
  ended: 'ended',
  stopped: 'stopped',
};

const App = () => {
  const [currentChannel, setCurrentChannel] = useState({});
  const [channels, setChannels] = useState([]);
  const [currentVideo, setCurrentVideo] = useState('');
  const [currentVideoState, setCurrentVideoState] = useState(
    VIDEO_STATES.stopped,
  );
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setChannels(channelData);
    setCurrentChannel(channelData[0]);
    setCurrentVideo(channelData[0].playlist[0]);
  }, []);

  useEffect(() => {
    if (currentVideoState === VIDEO_STATES.ended) {
      let updateChannel = currentChannel;
      let updatePlaylist = updateChannel.playlist;
      let previousVideo = updatePlaylist.shift();

      updatePlaylist = updatePlaylist.concat(previousVideo);
      updateChannel.playlist = updatePlaylist;

      setHidden(true);
      setCurrentChannel(updateChannel);
      setCurrentVideoState(VIDEO_STATES.stopped);
    }
  }, [currentVideoState, currentChannel]);

  useEffect(() => {
    if (hidden) {
      setCurrentVideo(currentChannel.playlist[0]);
      setHidden(false);
    }
  }, [hidden, currentChannel]);

  return (
    <>
      {hidden ? null : (
        <YouTube
          apiKey={ApiKeys.YOUTUBE_API_KEY}
          videoId={currentVideo}
          play={true}
          onChangeState={e => setCurrentVideoState(e.state)}
          style={{alignSelf: 'stretch', height: 300}}
        />
      )}
    </>
  );
};

export default App;

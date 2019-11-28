/* eslint-disable react-hooks/exhaustive-deps */
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
import {
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  DrawerLayoutAndroid,
} from 'react-native';

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

  const updateChannelsFor = channel => {
    let updateChannels = channels;

    let newChannelIndex = updateChannels.findIndex(updateChannel => updateChannel.id === channel.id);

    updateChannels[newChannelIndex] = channel;
    setChannels(updateChannels);
  };

  const changeChannel = channel => {
    setHidden(true);
    setCurrentChannel(channel);
    setCurrentVideoState(VIDEO_STATES.stopped);
    updateChannelsFor(channel);
  };

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

      changeChannel(updateChannel);
    }
  }, [currentVideoState]);

  useEffect(() => {
    if (hidden) {
      setCurrentVideo(currentChannel.playlist[0]);
      setHidden(false);
    }
  }, [hidden]);

  return (
    <DrawerLayoutAndroid
      drawerWidth={300}
      drawerPosition={'left'}
      renderNavigationView={() => (
        <FlatList
          data={channels}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={styles.button}
                onPress={() => changeChannel(item)}>
                <Text style={styles.item}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => `${item.id}`}
        />
      )}>
      {hidden ? null : (
        <YouTube
          apiKey={ApiKeys.YOUTUBE_API_KEY}
          videoId={currentVideo}
          play
          onChangeState={e => setCurrentVideoState(e.state)}
          style={{alignSelf: 'stretch', height: 300}}
        />
      )}
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
});

export default App;

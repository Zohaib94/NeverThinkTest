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
  View,
  Image,
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

    let newChannelIndex = updateChannels.findIndex(
      updateChannel => updateChannel.id === channel.id,
    );

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
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {hidden ? null : (
          <YouTube
            apiKey={ApiKeys.YOUTUBE_API_KEY}
            videoId={currentVideo}
            play
            onChangeState={e => setCurrentVideoState(e.state)}
            style={styles.videoPlayer}
          />
        )}
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={channels}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={styles.button}
                onPress={() => changeChannel(item)}>
                <Image style={styles.image} source={{uri: item.icon}} />
                <Text style={styles.item}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => `${item.id}`}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 22,
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
    flexDirection: 'row',
  },
  videoContainer: {
    flex: 0.6,
  },
  listContainer: {
    flex: 0.4,
    backgroundColor: 'white',
  },
  videoPlayer: {
    alignSelf: 'stretch',
    height: 300,
  },
  image: {
    width: 75,
    height: 75,
  },
});

export default App;

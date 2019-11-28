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
  Platform,
} from 'react-native';

const VIDEO_STATES = {
  ended: 'ended',
  stopped: 'stopped',
};

const isAndroid = Platform.OS === 'android';

const App = () => {
  const [currentChannel, setCurrentChannel] = useState({});
  const [channels, setChannels] = useState([]);
  const [currentVideo, setCurrentVideo] = useState('');
  const [currentVideoState, setCurrentVideoState] = useState(
    VIDEO_STATES.stopped,
  );
  const [hidden, setHidden] = useState(false);

  const updateChannelsFor = channel => {
    // In case if the order of videos in a channel is changed, that change has also got to be recorded
    // in the channels array so we can play first unwatched video for every channel whenever user changes
    // the channel. This method has been written for that purpose.

    let updateChannels = channels;

    let newChannelIndex = updateChannels.findIndex(
      updateChannel => updateChannel.id === channel.id,
    );

    updateChannels[newChannelIndex] = channel;
    setChannels(updateChannels);
  };

  const changeChannel = channel => {
    // When a video ends or a channel is changed, we update both the state of currentChannel and channels,
    // For this purpose, this method has been written.
    setHidden(true);
    setCurrentChannel(channel);
    setCurrentVideoState(VIDEO_STATES.stopped);
    updateChannelsFor(channel);
  };

  useEffect(() => {
    // This will behave similar to componentDidMount as this effect will run only once.

    setChannels(channelData);
    setCurrentChannel(channelData[0]);
    setCurrentVideo(channelData[0].playlist[0]);
  }, []);

  useEffect(() => {
    // When the video ends, move the current video to the end of the playlist
    // Then update the state of that channel
    // And the state of the channels will also be updated to make sure that
    // the first unwatched video is played whenever user changes the channel.

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
    // In order to change videoId in react-native-youtube, we have to first unmount the component,
    // and then remount the component with the new videoId. For this purpose, I am using hidden state.
    // hidden state will become true when a channel is changed or video ends, so we can unmount the
    // YouTube Player by not rendering it and then set state for currentVideo and then set hidden to false
    // so we can re-render the YouTube component.

    if (hidden) {
      setCurrentVideo(currentChannel.playlist[0]);
      setHidden(false);
    }
  }, [hidden]);

  return (
    <View style={styles.container}>
      {isAndroid ? (
        <>
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
        </>
      ) : (
        <View>
          <Text>
            Sorry, this application is only available for Android at the moment
          </Text>
        </View>
      )}
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

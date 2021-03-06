// @flow

import React, { Component } from 'react';
import { Navigator, StyleSheet, BackAndroid } from 'react-native';

import Carousel from './components/Carousel';

const HARDWARE_BACK_PRESS_EVENT: string = 'hardwareBackPress';

const styles = StyleSheet.create({
  navigator: {
    flex: 1,
    backgroundColor: 'black',
  },
});

type Props = {
  onShow?: () => void;
  onDismiss?: () => void;
  dismissOnHardwareBackPress?: boolean;
  show?: boolean;
  navigatorStyle?: any;
  carouselStyle?: any;
  children: any;
}

const defaultProps = {
  onShow: () => {},
  onDismiss: () => {},
  dismissOnHardwareBackPress: true,
  navigatorStyle: null,
  carouselStyle: null,
  show: null,
};

class CarouselComponent extends Component {
  props: Props

  static defaultProps = defaultProps

  constructor(props: Props) {
    super(props);

    this.state = {
      show: false,
    };

    (this: any).renderScene = this.renderScene.bind(this);
    (this: any).show = this.show.bind(this);
    (this: any).dismiss = this.dismiss.bind(this);
    (this: any).hardwareBackPressHandler = this.hardwareBackPressHandler.bind(this);
  }

  componentDidMount() {
    const { show } = this.props;

    if (show) {
      this.show();
    }

    BackAndroid.addEventListener(HARDWARE_BACK_PRESS_EVENT, this.hardwareBackPressHandler);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.show !== nextProps.show) {
      if (nextProps.show) {
        this.show();
        return;
      }
      this.dismiss();
    }
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener(HARDWARE_BACK_PRESS_EVENT);
  }

  hardwareBackPressHandler(): boolean {
    const { dismissOnHardwareBackPress } = this.props;

    if (dismissOnHardwareBackPress && this.state.show) {
      this.dismiss();
      return true;
    }

    return false;
  }

  show(callback?: Function = () => {}): void {
    this.navigator.push({ show: true });
    this.setState({ show: true });
    callback();
    this.props.onShow();
  }

  dismiss(callback?: Function = () => {}): void {
    this.navigator.pop();
    this.setState({ show: false });
    callback();
    this.props.onDismiss();
  }

  configureScene() {
    return Navigator.SceneConfigs.FloatFromBottom;
  }

  renderScene(route, navigator) {
    if (route.show) {
      return (
        <Carousel
          {...this.props}
          style={this.props.carouselStyle}
          navigator={navigator}
        />
      );
    }
    return this.props.children;
  }

  render() {
    const { navigatorStyle } = this.props;

    return (
      <Navigator
        ref={(navigator) => { this.navigator = navigator; }}
        initialRoute={{ show: null }}
        configureScene={this.configureScene}
        renderScene={this.renderScene}
        style={[styles.navigator, navigatorStyle]}
      />
    );
  }
}

export default CarouselComponent;

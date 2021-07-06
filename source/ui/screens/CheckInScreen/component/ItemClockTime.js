import React, { Component } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native';
import { commonsConfigs as configs } from '../../../../commons'

export default class ItemClockTime extends Component {
    constructor() {
        super();

        this.state = { currentTime: null, currentDay: null }

        this.daysArray = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    }

    componentWillMount() {
        this.getCurrentTime();
    }

    getCurrentTime = () => {
        let hour = new Date().getHours();
        let minutes = new Date().getMinutes();
        let seconds = new Date().getSeconds();
        let am_pm = 'pm';

        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        // if (hour > 12) {
        //     hour = hour - 12;
        // }

        if (hour == 0) {
            hour = 12;
        }

        // if (new Date().getHours() < 12) {
        //     am_pm = 'am';
        // }

        // this.setState({ currentTime: hour + ':' + minutes + ':' + seconds + ' ' + am_pm });
        this.setState({ currentTime: hour + ':' + minutes + ':' + seconds });

        this.daysArray.map((item, key) => {
            if (key == new Date().getDay()) {
                this.setState({ currentDay: item });
            }
        })
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.getCurrentTime();
        }, 1000);
    }

    render() {
        let { styleTimeText, style } = this.props
        return (
            <View style={[style]}>
                {/* <Text style={styles.daysText}>{this.state.currentDay}</Text> */}
                <Text style={[styles.timeText, styleTimeText]}>{this.state.currentTime + ' - ' + configs.dateTimeNowFormat(configs.FORMAT_DATE_VN)}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        container:
        {
            paddingTop: (Platform.OS == 'ios') ? 20 : 0
        },

        timeText:
        {
            fontSize: 30,
            color: 'black',
            textAlign: 'center',
        },

        daysText:
        {
            color: 'black',
            fontSize: 16,
            paddingBottom: 0
        }
    });
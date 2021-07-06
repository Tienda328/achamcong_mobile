import React, { Component } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native';
import { commonsConfigs as configs } from '../../../../commons'

export default class ItemClockCountTime extends Component {
    constructor(props) {
        super(props);

        this.state = { time: {}, seconds: 0, timeStart: '', tongThoiGian: null };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }

    componentDidMount() {
        let date = new Date(1620891378069);
        console.log(date.getHours())
    }

    startTimer() {
        if (this.timer == 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.timeStart && this.props.timeStart !== configs.timeHide && (this.props.timeStart !== prevProps.timeStart || this.props.timeEnd !== prevProps.timeEnd || this.props.timeTongGio !== prevProps.timeTongGio)) {
            let { timeStart, timeEnd, timeTongGio } = this.props
            if (timeEnd === configs.timeHide) {
                var timeGiay = 0
                if (timeStart && timeStart !== configs.timeHide) {
                    let endDate = parseInt(new Date().getTime() / 1000)
                    timeGiay = this.subtractHour(timeStart, endDate)
                }

                this.setState({ seconds: timeGiay }, () => {
                    let timeLeftVar = this.secondsToTime(this.state.seconds);
                    this.setState({ time: timeLeftVar });
                    this.startTimer()
                })
            } else {
                this.setState({ tongThoiGian: timeTongGio })
            }

        }
        // this.setState({timeStart: newProps.timeStart});
    }

    subtractHour(startTime, endTime) {
        let end = endTime;
        let start = startTime;

        let elapsedMs = end - start;

        return elapsedMs;

    }

    countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds + 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });

        // Check if we're at zero.
        if (this.state.tongThoiGian) {
            clearInterval(this.timer);
        }
    }

    render() {
        let { styleTimeText, style, timeStart, timeEnd } = this.props
        return (
            <View style={[style]}>
                {/* <Text style={styles.daysText}>{this.state.currentDay}</Text> */}
                {this.state.tongThoiGian ? <Text style={[styles.timeText, styleTimeText]}>{this.state.tongThoiGian}</Text> :
                    <Text style={[styles.timeText, styleTimeText]}>{this.state.time.h ? this.state.time.h : '00'}h:{this.state.time.m ? this.state.time.m : ' 00'}p:{this.state.time.s ? this.state.time.s : ' 00'}s</Text>}
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
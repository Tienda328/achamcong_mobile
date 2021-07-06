import { delay } from 'redux-saga';
import { call, all } from 'redux-saga/effects'

// import { watchHomeSaga } from '../../ui/screens/homeScreen/HomeScreenSaga'

export default function* rootSaga() {
    // console.log('Hello Sagas!')
    yield all([
        // call(watchHomeSaga),
    ])
}
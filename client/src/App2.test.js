/**
 * Created by a_wav on 2016/12/5.
 */

import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

it('renders welcome message', () => {
    const wrapper = shallow(<App />);
    const welcome = <h2>Welcome to React</h2>;
    // expect(wrapper.contains(welcome)).to.equal(true);
    expect(wrapper.contains(welcome)).toEqual(true);
});

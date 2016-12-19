/**
 * Created by a_wav on 2016/12/6.
 */

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

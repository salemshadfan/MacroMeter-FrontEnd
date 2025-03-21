import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';

import {
  authenticateUser,
  signupUser,
  getToken,
  validateToken,
  logoutUser
} from '../controllers/authController.js';

process.env.REACT_APP_API_BASE_URL = 'http://localhost:5001/api';

describe('AuthController Functions', () => {
  let axiosPostStub, axiosGetStub;
  const fakeToken = 'mocked-jwt-token';

  beforeEach(() => {
    axiosPostStub = sinon.stub(axios, 'post');
    axiosGetStub = sinon.stub(axios, 'get');

    global.sessionStorage = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
      removeItem: sinon.stub()
    };

    global.window = { location: { href: '' } };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('authenticateUser should store token on success', async () => {
    const mockResponse = { data: { token: fakeToken, user: {} } };
    axiosPostStub.resolves(mockResponse);

    const result = await authenticateUser('test@example.com', 'pass123');
    expect(result).to.deep.equal(mockResponse.data);
    expect(axiosPostStub.calledOnce).to.be.true;
    expect(global.sessionStorage.setItem.calledWith('token', fakeToken)).to.be.true;
  });

  it('authenticateUser should return error object on failure', async () => {
    axiosPostStub.rejects({ response: { data: { error: "Invalid login" } } });

    const result = await authenticateUser('fail@example.com', 'wrong');
    expect(result).to.deep.equal({ error: "Invalid login" });
  });

  it('signupUser should call signup endpoint with correct data', async () => {
    const mockResponse = { data: { success: true } };
    axiosPostStub.resolves(mockResponse);

    const result = await signupUser('newUser', 'user@site.com', 'secure123');
    expect(result).to.deep.equal(mockResponse.data);
    expect(axiosPostStub.firstCall.args[0]).to.equal('http://localhost:5001/api/signup');
    expect(axiosPostStub.firstCall.args[1]).to.deep.equal({
      username: 'newUser',
      email: 'user@site.com',
      password: 'secure123'
    });
  });

  it('getToken should return token from sessionStorage', () => {
    global.sessionStorage.getItem.returns(fakeToken);
    const token = getToken();
    expect(token).to.equal(fakeToken);
  });

  it('validateToken should return true if status 200', async () => {
    global.sessionStorage.getItem.returns(fakeToken);
    axiosGetStub.resolves({ status: 200 });

    const valid = await validateToken();
    expect(valid).to.be.true;
  });

  it('validateToken should return false and call logoutUser on failure', async () => {
    global.sessionStorage.getItem.returns(fakeToken);
    axiosGetStub.rejects(new Error('Invalid token'));

    const valid = await validateToken();
    expect(valid).to.be.false;
    expect(global.sessionStorage.removeItem.calledWith('token')).to.be.true;
    expect(global.window.location.href).to.equal('/login');
  });

  it('logoutUser should remove token and redirect to login', () => {
    logoutUser();
    expect(global.sessionStorage.removeItem.calledWith('token')).to.be.true;
    expect(global.window.location.href).to.equal('/login');
  });
});

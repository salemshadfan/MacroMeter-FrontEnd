import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';

import { sendResetLink } from '../controllers/passwordResetController.js';

process.env.REACT_APP_API_BASE_URL = 'http://localhost:5001/api';

describe('sendResetLink', () => {
  let axiosPostStub;

  beforeEach(() => {
    axiosPostStub = sinon.stub(axios, 'post');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call axios.post with correct URL and email payload', async () => {
    const testEmail = 'user@example.com';
    axiosPostStub.resolves({ status: 200 });

    await sendResetLink(testEmail);

    expect(axiosPostStub.calledOnce).to.be.true;
    const [url, body] = axiosPostStub.firstCall.args;

    expect(url).to.equal('http://localhost:5001/api/reset-link');
    expect(body).to.deep.equal({ email: testEmail });
  });

  it('should handle errors gracefully without throwing', async () => {
    const consoleStub = sinon.stub(console, 'error');
    axiosPostStub.rejects(new Error('Request failed'));

    await sendResetLink('fail@example.com');

    expect(consoleStub.calledOnce).to.be.true;
    expect(consoleStub.firstCall.args[0].message).to.equal('Request failed');
  });
});

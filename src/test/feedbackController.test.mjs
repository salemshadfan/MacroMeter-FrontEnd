process.env.REACT_APP_API_BASE_URL = 'http://localhost:5001/api';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import { submitFeedback } from '../controllers/feedbackController.js';


describe('submitFeedback (ESM-compatible test)', () => {
  let axiosPostStub;

  beforeEach(() => {
    global.sessionStorage = {
      getItem: sinon.stub().returns('test-token')
    };

    axiosPostStub = sinon.stub(axios, 'post');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call axios.post and return response data', async () => {
    const mockResponse = { data: { message: "Feedback submitted!" } };
    axiosPostStub.resolves(mockResponse);

    const result = await submitFeedback(5, "Great app");

    expect(axiosPostStub.calledOnce).to.be.true;
    expect(axiosPostStub.firstCall.args[0]).to.equal('http://localhost:5001/api/feedback');
    expect(axiosPostStub.firstCall.args[1]).to.deep.equal({
      stars: 5,
      feedback: "Great app"
    });

    expect(result).to.deep.equal(mockResponse.data);
  });

  it('should not call axios if no token is found', async () => {
    global.sessionStorage.getItem.returns(null);
    const result = await submitFeedback(3, "No token test");

    expect(axiosPostStub.notCalled).to.be.true;
    expect(result).to.be.undefined;
  });

  it('should return undefined if axios throws an error', async () => {
    axiosPostStub.rejects(new Error("Server error"));

    const result = await submitFeedback(2, "Server crash");

    expect(result).to.be.undefined;
  });
});

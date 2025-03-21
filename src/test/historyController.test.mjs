import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';

import {
  getUserHistory,
  addUserHistory,
  resetUserHistory
} from '../controllers/historyController.js';

process.env.REACT_APP_API_BASE_URL = 'http://localhost:5001/api';

describe('HistoryController Functions', () => {
  let axiosGetStub, axiosPostStub;

  beforeEach(() => {
    axiosGetStub = sinon.stub(axios, 'get');
    axiosPostStub = sinon.stub(axios, 'post');

    global.sessionStorage = {
      getItem: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('getUserHistory should return user history when token is present', async () => {
    const mockHistory = [{ meal: 'Salad', calories: 200 }];
    global.sessionStorage.getItem.returns('mocked-token');
    axiosGetStub.resolves({ data: { history: mockHistory } });

    const result = await getUserHistory();
    expect(result).to.deep.equal(mockHistory);
    expect(axiosGetStub.calledOnce).to.be.true;
    expect(axiosGetStub.firstCall.args[0]).to.equal('http://localhost:5001/api/history');
  });

  it('getUserHistory should not throw error if token is missing', async () => {
    global.sessionStorage.getItem.returns(null);
    axiosGetStub.resolves({ data: { history: [] } });

    const result = await getUserHistory();
    expect(result).to.deep.equal([]);
  });

  it('addUserHistory should post new entry when token is present', async () => {
    const entry = { meal: 'Chicken Bowl', calories: 600 };
    global.sessionStorage.getItem.returns('mocked-token');
    axiosPostStub.resolves({ data: { success: true } });

    const result = await addUserHistory(entry);
    expect(result).to.deep.equal({ success: true });
    expect(axiosPostStub.calledOnce).to.be.true;
    expect(axiosPostStub.firstCall.args[0]).to.equal('http://localhost:5001/api/history');
    expect(axiosPostStub.firstCall.args[1]).to.deep.equal({ history_entry: entry });
  });

  it('addUserHistory should return undefined if token is missing', async () => {
    global.sessionStorage.getItem.returns(null);

    const result = await addUserHistory({ meal: 'Burger', calories: 800 });
    expect(result).to.be.undefined;
    expect(axiosPostStub.notCalled).to.be.true;
  });

  it('resetUserHistory should call /wipe and return data', async () => {
    global.sessionStorage.getItem.returns('mocked-token');
    const mockResponse = { data: { success: true } };
    axiosGetStub.resolves(mockResponse);

    const result = await resetUserHistory();
    expect(result).to.deep.equal({ success: true });
    expect(axiosGetStub.calledOnce).to.be.true;
    expect(axiosGetStub.firstCall.args[0]).to.equal('http://localhost:5001/api/wipe');
  });

  it('resetUserHistory should still work gracefully without token', async () => {
    global.sessionStorage.getItem.returns(null);
    axiosGetStub.resolves({ data: {} });

    const result = await resetUserHistory();
    expect(result).to.deep.equal({});
  });
});

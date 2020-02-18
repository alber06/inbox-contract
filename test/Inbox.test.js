const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const defaultMessage = 'Heyyyy!!';

beforeEach(async () => {
    // Get a list of all accounts
  accounts = await web3.eth.getAccounts()
   
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [defaultMessage] })
    .send({ from: accounts[0], gas: '1000000' })

   inbox.setProvider(provider);
  //Use one of those accounts to deploy a contract
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a a default message', async () => {
    const message = await inbox.methods.message().call()

    assert.equal(message, defaultMessage);
  });

  it('changes the message', async () => {
    const newMessage = 'New message';
    await inbox.methods.setMessage(newMessage).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();

     assert.equal(message, newMessage);
   });
})
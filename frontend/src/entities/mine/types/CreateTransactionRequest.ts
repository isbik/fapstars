import Transaction from './Transaction';

interface CreateTransactionRequest {
  cnt: number;
  type: Transaction['type'];
}

export default CreateTransactionRequest;

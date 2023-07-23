import { useContext } from 'react';
import { TonConnectContext } from '@/providers/ton-connect-provider/index';

const useTonConnectContext = () => useContext(TonConnectContext);

export default useTonConnectContext;

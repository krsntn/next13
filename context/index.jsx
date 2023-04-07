import { SportContextProvider } from './sport';
import { UserContextProvider } from './user';

const Stores = ({ children }) => {
  return (
    <UserContextProvider>
      <SportContextProvider>{children}</SportContextProvider>
    </UserContextProvider>
  );
};

export default Stores;

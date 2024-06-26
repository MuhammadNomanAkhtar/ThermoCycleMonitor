import * as React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Main from "./src";
// import { Provider } from "react-redux";
// import { store } from './src/shared'
// import { FirebaseProvider } from './src/shared/context/FirebaseProvider';

const App: React.FC = () => {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <IconRegistry icons={EvaIconsPack} />
      {/* <Provider store={store}> */}
        {/* <FirebaseProvider> */}

        <GestureHandlerRootView>
          <Main />
        </GestureHandlerRootView>
        {/* </FirebaseProvider> */}
      {/* </Provider> */}
    </ApplicationProvider>


  );
};
export default App;
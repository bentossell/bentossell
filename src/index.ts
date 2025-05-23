import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div>
      <Header />
      {/* rest of app */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
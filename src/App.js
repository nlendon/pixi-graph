import React from 'react';
import data from './data/data.json';
import { ForceGraph } from "./components/forceGraph";
import './App.css';

function App() {
  const nodeHoverTooltip = React.useCallback((node) => {
    return `<div>     
      <b>${node.name}</b>
    </div>`;
  }, []);

  return (
    <div>
      <section className="Main">
        <ForceGraph linksData={data.links} nodesData={data.nodes} nodeHoverTooltip={nodeHoverTooltip} />
      </section>
    </div>
  );
}

export default App;

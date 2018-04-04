import 'babel-polyfill'
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import { render } from 'react-dom';
import jss from 'jss';
import preset from 'jss-preset-default';
import normalize from 'normalize-jss';
import App from './App.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

injectTapEventPlugin();

jss.setup(preset());
jss.createStyleSheet(normalize).attach();
jss.createStyleSheet({
  '@global': {
    '*': { margin: 0, padding: 0 },
    '#app, body, html': { height: '100%', fontFamily: 'sans-serif' },
    body: { overflow: 'auto' },
    html: { overflow: 'hidden' }
  }
}).attach();

render((
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
), document.getElementById('app'));

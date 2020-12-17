import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import path from 'path';
import classNames from 'classnames';
import { Table } from 'reactstrap';
import { listFiles } from '../files';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Alert
} from 'reactstrap';

// Used below, these need to be registered
import MarkdownEditor from '../MarkdownEditor';
import PlaintextEditor from '../components/PlaintextEditor';

import IconPlaintextSVG from '../public/icon-plaintext.svg';
import IconMarkdownSVG from '../public/icon-markdown.svg';
import IconJavaScriptSVG from '../public/icon-javascript.svg';
import IconJSONSVG from '../public/icon-json.svg';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import css from './style.module.css';
import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';

const { SearchBar } = Search;
import classnames from 'classnames';

const TYPE_TO_ICON = {
  'text/plain': IconPlaintextSVG,
  'text/markdown': IconMarkdownSVG,
  'text/javascript': IconJavaScriptSVG,
  'application/json': IconJSONSVG
};

function DataTable({ todos }) {
  return (
    <ToolkitProvider
      keyField="id"
      data={todos}
      columns={['id', 'completed']}
      search
    >
      {props => (
        <div>
          <h3>Input something at below input field:</h3>
          <SearchBar {...props.searchProps} />
          <hr />
          <Table borderless {...props.baseProps}>
            <thead>
              <tr>
                <th>#</th>
                <th>id</th>
                <th>title</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {todos &&
                todos.map((todo, index) => (
                  <tr key={`todo-${index + 1}`}>
                    <td scope="row">{index + 1}</td>
                    <td>{todo.id}</td>
                    <td>{todo.title}</td>
                    <td>{todo.completed ? 'Completed' : 'Pending'}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      )}
    </ToolkitProvider>
  );
}

function ShortURL(props) {
  return (
    <div>
      <Form onSubmit={props.onFormSubmit}>
        <FormGroup>
          <Label for="exampleText">URL</Label>
          <Input type="textarea" name="text" id="exampleText" />
        </FormGroup>
        <Button type="submit">Submit</Button>
      </Form>
      <div style={{ paddingTop: '10px' }}>
        <Alert color="primary">
          Shortened URL: {props.shortURL && props.shortURL}
        </Alert>
      </div>
    </div>
  );
}

DataTable.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.object)
  // activeFile: PropTypes.object,
  // setActiveFile: PropTypes.func
};

function FilesTable({ files, activeFile, setActiveFile }) {
  return (
    <div className={css.files}>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr
              key={file.name}
              className={classNames(
                css.row,
                activeFile && activeFile.name === file.name ? css.active : ''
              )}
              onClick={() => setActiveFile(file)}
            >
              <td className={css.file}>
                <div
                  className={css.icon}
                  dangerouslySetInnerHTML={{
                    __html: TYPE_TO_ICON[file.type]
                  }}
                ></div>
                {path.basename(file.name)}
              </td>

              <td>
                {new Date(file.lastModified).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

FilesTable.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  activeFile: PropTypes.object,
  setActiveFile: PropTypes.func
};

function Previewer({ file }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  return (
    <div className={css.preview}>
      <div className={css.title}>{path.basename(file.name)}</div>
      <div className={css.content}>{value}</div>
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object
};

// Uncomment keys to register editors for media types
const REGISTERED_EDITORS = {
  // "text/plain": PlaintextEditor,
  // "text/markdown": MarkdownEditor,
};

function PlaintextFilesChallenge() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [todos, setTodos] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [shortURL, setShortURL] = useState(null);

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    const files = listFiles();
    setFiles(files);
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(json => setTodos(json));
  }, []);

  const write = file => {
    console.log('Writing soon... ', file.name);

    // TODO: Write the file to the `files` array
  };

  const Editor = activeFile ? REGISTERED_EDITORS[activeFile.type] : null;

  const getShortURL = async e => {
    let short = await geturl(e.target.exampleText.value);
    setShortURL(short.shortURL);
  };

  function geturl(val) {
    fetch('https://api.short.cm/links/public', {
      method: 'post',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'PUBLIC_API_KEY'
      },
      body: JSON.stringify(data)
    }).then(function(response) {
      return response.json();
    });
  }

  return (
    <div className={css.page}>
      <Head>
        <title>Rethink Engineering Challenge</title>
      </Head>
      <aside>
        <header>
          <div className={css.tagline}>Rethink Engineering Challenge</div>
          <h1>Fun With Plaintext</h1>
          <div className={css.description}>
            Let{"'"}s explore files in JavaScript. What could be more fun than
            rendering and editing plaintext? Not much, as it turns out.
          </div>
        </header>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => {
                toggle('1');
              }}
            >
              Files
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => {
                toggle('2');
              }}
            >
              Table
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '3' })}
              onClick={() => {
                toggle('3');
              }}
            >
              URL
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <FilesTable
              files={files}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
            />
          </TabPane>
          <TabPane tabId="2">
            <DataTable todos={todos} />
          </TabPane>
          <TabPane tabId="3">
            <ShortURL onFormSubmit={getShortURL} shortURL={shortURL} />
          </TabPane>
        </TabContent>

        <div style={{ flex: 1 }}></div>

        <footer>
          <div className={css.link}>
            <a href="https://v3.rethink.software/jobs">Rethink Software</a>
            &nbsp;—&nbsp;Frontend Engineering Challenge
          </div>
          <div className={css.link}>
            Questions? Feedback? Email us at jobs@rethink.software
          </div>
        </footer>
      </aside>

      <main className={css.editorWindow}>
        {activeFile && (
          <>
            {Editor && <Editor file={activeFile} write={write} />}
            {!Editor && <Previewer file={activeFile} />}
          </>
        )}

        {!activeFile && (
          <div className={css.empty}>Select a file to view or edit</div>
        )}
      </main>
    </div>
  );
}

export default PlaintextFilesChallenge;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import LanguageSwitcher from './components/LanguageSwitcher';
import AuthButtons from './components/AuthButtons';
import DragDropContext from './components/DragDropContext';
import DraggableItem from './components/DraggableItem';
import DropZone from './components/DropZone';
import StripeCheckout from './components/StripeCheckout';
import client from './apollo-client';

const HELLO_QUERY = gql`
  query GetHello {
    hello
  }
`;

const ADD_USER_MUTATION = gql`
  mutation AddUser($name: String!) {
    addUser(name: $name)
  }
`;

const TRANSLATE_QUERY = gql`
  query Translate($text: String!, $targetLang: String!) {
    translate(text: $text, targetLang: $targetLang)
  }
`;

const GENERATE_CONTENT_QUERY = gql`
  query GenerateContent($prompt: String!) {
    generateContent(prompt: $prompt)
  }
`;

function App() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth0();
  const { loading, error, data } = useQuery(HELLO_QUERY);
  const [addUser] = useMutation(ADD_USER_MUTATION);
  const [userName, setUserName] = useState('');
  const [droppedItems, setDroppedItems] = useState([]);
  const [translation, setTranslation] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  const handleDrop = (item) => {
    setDroppedItems((prev) => [...prev, item.id]);
  };

  const handleAddUser = async () => {
    if (!isAuthenticated) {
      alert('Please log in to add a user.');
      return;
    }
    try {
      const { data } = await addUser({ variables: { name: userName } });
      alert(data.addUser);
      setUserName('');
    } catch (err) {
      console.error(err);
      alert('Error adding user.');
    }
  };

  const handleTranslate = async () => {
    try {
      const { data } = await client.query({
        query: TRANSLATE_QUERY,
        variables: { text: 'Hello, world!', targetLang: 'es' },
      });
      setTranslation(data.translate);
    } catch (err) {
      console.error(err);
      alert('Translation failed.');
    }
  };

  const handleGenerateContent = async () => {
    try {
      const { data } = await client.query({
        query: GENERATE_CONTENT_QUERY,
        variables: { prompt: 'Write a catchy tagline for a global website builder.' },
      });
      setGeneratedContent(data.generateContent);
    } catch (err) {
      console.error(err);
      alert('Content generation failed.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data.</p>;

  return (
    <DragDropContext>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <LanguageSwitcher />
          <AuthButtons />
        </div>
        <h1 className="text-4xl font-bold mt-4">{t('welcome')}</h1>
        <p className="mt-2">{t('description')}</p>
        <p className="mt-2">{data.hello}</p>

        <div className="flex space-x-4 mt-8">
          <DraggableItem id="item1" type="BOX">
            Item 1
          </DraggableItem>
          <DraggableItem id="item2" type="BOX">
            Item 2
          </DraggableItem>
        </div>

        <DropZone onDrop={handleDrop} acceptTypes={['BOX']} />

        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Dropped Items:</h2>
          <ul>
            {droppedItems.map((item, index) => (
              <li key={index} className="mt-2 p-2 bg-green-200 rounded">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Add User:</h2>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter user name"
            className="border p-2 rounded mt-2"
          />
          <button
            onClick={handleAddUser}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold">AI Features:</h2>
          
          <div className="mt-4">
            <button
              onClick={handleTranslate}
              className="px-4 py-2 bg-purple-500 text-white rounded"
            >
              Translate "Hello, world!" to Spanish
            </button>
            {translation && <p className="mt-2">Translation: {translation}</p>}
          </div>

          <div className="mt-4">
            <button
              onClick={handleGenerateContent}
              className="px-4 py-2 bg-purple-500 text-white rounded"
            >
              Generate Tagline
            </button>
            {generatedContent && <p className="mt-2">Generated Content: {generatedContent}</p>}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Payment:</h2>
          <StripeCheckout />
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;

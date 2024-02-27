import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Navbar from './components/Navbar';

function App() {
  const [answers, setAnswers] = useState({});
  const [myPersona, setMyPersona] = useState({});
  const [greeting, setGreeting] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [questions, setQuestions] = useState([]);
  
  useEffect(() => {
    // Check for token in local storage or any other authentication checks on component mount
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
      setIsAuthenticated(true);
    }
  }, []);

  const resetAnswers = async () => {
    try {
      const response = await axios.post('/api/survey/reset');
      console.log(response);
      setQuestions(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUnansweredQuestions = async () => {
    try {
      const response = await axios.get('/api/survey/questions/unanswered');
      await setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchAnsweredQuestions = async () => {
    try {
      const response = await axios.get('/api/survey/questions/answered');
      // Prepare the answers state
      const answersState = {};
      const questionsState = [];
      response.data.forEach(item => {
        answersState[item.question._id] = item.answer.answer;
        questionsState.push(item.question);
      });

      setAnswers(answersState);
      setQuestions(questionsState);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Update local answer state
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
    console.log(answers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(answers);

      await axios.post('/api/survey/answers', answers);
      console.log('Answers submitted successfully');
      // Optionally reset answers state or navigate the user to a different page
    } catch (error) {
      console.error('Failed to submit answers:', error);
    }
  };

  const fetchGreeting = async () => {
    try {
      const response = await axios.get('/api/', { withCredentials: true });
      setGreeting(response.data);
    } catch (error) {
      console.error('Error fetching greeting:', error);
      setGreeting(error.message);
    }
  };

  const sendTokenToBackend = async (token) => {
    try {
      const response = await axios.post('/api/auth/google', { token });
      console.log(response.data);
      // Assume the JWT is in response.data.token
      const jwt = response.data.token;
      localStorage.setItem('jwt', jwt); // Store the JWT for later use
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };

  const handleLoginSuccess = (response) => {
    console.log('Success:', response);
    // Extract token from response, send to backend
    const token = response?.credential;
    // Example function to send token to backend
    sendTokenToBackend(token);
  };

  const handleLoginFailure = (response) => {
    console.log('Failed:', response);
  };

  const logout = () => {
    // Remove the token
    localStorage.removeItem('jwt');
    axios.defaults.headers.common['Authorization'] = '';
    setIsAuthenticated(false);
    // Redirect or perform any additional cleanup
  };

  const fetchMe = async () => {
    try {
      const response = await axios.get('/api/survey/me/', { withCredentials: true });
      console.log(response.data);
      setMyPersona(response.data);
    } catch (error) {
      console.error('Error fetching persona:', error);
      setMyPersona(error.message);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} onLogout={logout}/>
        <h1>Sign in with Google</h1>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <div>
        {greeting ? <p>{greeting}</p> : <p>Loading greeting...</p>}
        </div>
        <button onClick={fetchAnsweredQuestions}>Fetch Answered Questions</button>
        <button onClick={fetchUnansweredQuestions}>Fetch Unanswered Questions</button>
        <button onClick={resetAnswers}>Reset All Answers</button>
        <button onClick={fetchMe}>Who am I?</button>
        <div>
        {myPersona ? <p>{myPersona.zodiac}</p> : <p>No Persona Loaded</p>}
        </div>
        <div>
        {questions && Object.keys(questions).length > 0 ? <div>
          <h1>Survey Questions</h1>
      <form onSubmit={handleSubmit}>
        {questions.map(question => (
          <div key={question._id}>
            <label htmlFor={`question-${question._id}`}>{question.text}</label>
            {question.answerType === 'multipleChoice' ? (
              <select
                id={`question-${question._id}`}
                value={answers[question._id] || ''}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              >
                <option value="">Select an option</option>
                {question.choices.map((choice, index) => (
                  <option key={index} value={choice.text}>
                    {choice.text}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`question-${question._id}`}
                type="text"
                value={answers[question._id] || ''}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              />
            )}
          </div>
        ))}
        <button type="submit">Submit Answers</button>
      </form>
        </div> :
        <p>No Questions Loaded</p>}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
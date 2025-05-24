import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

const Quiz = () => {
  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("planets");
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  
  // User and admin state
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Results view state
  const [showResults, setShowResults] = useState(false);
  const [allResults, setAllResults] = useState([]);
  
  // Quiz management state
  const [quizManagement, setQuizManagement] = useState({
    mode: null, // 'add', 'edit', or null
    currentQuestion: null
  });
  
  const [newQuestion, setNewQuestion] = useState({
    category: "planets",
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "a"
  });

  const navigate = useNavigate();

  // Fetch data on component mount and category change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check authentication and get user data
        const authResponse = await axios.get("http://localhost:5000/check-auth", {
          withCredentials: true,
        });
        
        if (authResponse.data.authenticated) {
          setUserData(authResponse.data.user);
          setIsAdmin(authResponse.data.user.role === 'admin');
          localStorage.setItem("user", JSON.stringify(authResponse.data.user));
        } else {
          navigate("/");
          return;
        }

        // Fetch questions for current category
        const questionsResponse = await axios.get(
          `http://localhost:5000/quiz/${category}`
        );
        setQuestions(questionsResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, [category, navigate]);

  // Handle answer selection
  const handleAnswerClick = async (selectedOptionKey) => {
    // Don't allow changing answer after selection
    if (showAnswerFeedback) return;
    
    setSelectedOption(selectedOptionKey);
    setShowAnswerFeedback(true);
    
    const isCorrect = selectedOptionKey === questions[currentQuestion].correct_answer;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Store the user's answer for this question
    const updatedAnswers = {
      ...userAnswers,
      [questions[currentQuestion].id]: selectedOptionKey
    };
    setUserAnswers(updatedAnswers);
    
    // Move to next question after a delay
    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedOption(null);
        setShowAnswerFeedback(false);
      } else {
        try {
          // Submit USER'S answers to backend, not correct answers
          axios.post(
            "http://localhost:5000/quiz/submit",
            {
              category,
              answers: updatedAnswers // Send what the user actually answered
            },
            { withCredentials: true }
          ).then(() => {
            setShowScore(true);
          });
        } catch (err) {
          setError("Failed to submit quiz results");
        }
      }
    }, 1500); // 1.5 second delay to show feedback
  };

  // Get button style based on answer state
  const getOptionButtonStyle = (optionKey) => {
    if (!showAnswerFeedback) {
      return "bg-gray-700 hover:bg-gray-600";
    }
    
    const isCorrect = optionKey === questions[currentQuestion].correct_answer;
    const isSelected = optionKey === selectedOption;
    
    if (isCorrect) {
      return "bg-green-600 border-2 border-green-400";
    }
    
    if (isSelected && !isCorrect) {
      return "bg-red-600 border-2 border-red-400";
    }
    
    return "bg-gray-700";
  };

  // Fetch all quiz results (admin only)
  const fetchAllResults = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/quiz-results",
        { withCredentials: true }
      );
      setAllResults(response.data);
    } catch (err) {
      setError("Failed to fetch results");
    }
  };

  // Quiz question management (admin only)
  const handleAddQuestion = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/quiz",
        {
          category: newQuestion.category,
          question: newQuestion.question,
          option_a: newQuestion.option_a,
          option_b: newQuestion.option_b,
          option_c: newQuestion.option_c,
          option_d: newQuestion.option_d,
          correct_answer: newQuestion.correct_answer
        },
        { withCredentials: true }
      );
      
      // Add the new question to state with the returned ID
      setQuestions([...questions, {
        id: response.data.id,
        category: newQuestion.category,
        question: newQuestion.question,
        options: {
          a: newQuestion.option_a,
          b: newQuestion.option_b,
          c: newQuestion.option_c,
          d: newQuestion.option_d
        },
        correct_answer: newQuestion.correct_answer
      }]);
      
      setQuizManagement({ mode: null, currentQuestion: null });
      setNewQuestion({
        category: "planets",
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "a"
      });
    } catch (err) {
      setError("Failed to add question: " + err.response?.data?.error);
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      await axios.put(
        `http://localhost:5000/quiz/${quizManagement.currentQuestion.id}`,
        {
          category: quizManagement.currentQuestion.category,
          question: quizManagement.currentQuestion.question,
          option_a: quizManagement.currentQuestion.option_a,
          option_b: quizManagement.currentQuestion.option_b,
          option_c: quizManagement.currentQuestion.option_c,
          option_d: quizManagement.currentQuestion.option_d,
          correct_answer: quizManagement.currentQuestion.correct_answer
        },
        { withCredentials: true }
      );
      
      // Update the question in state
      setQuestions(questions.map(q => 
        q.id === quizManagement.currentQuestion.id ? {
          ...q,
          category: quizManagement.currentQuestion.category,
          question: quizManagement.currentQuestion.question,
          options: {
            a: quizManagement.currentQuestion.option_a,
            b: quizManagement.currentQuestion.option_b,
            c: quizManagement.currentQuestion.option_c,
            d: quizManagement.currentQuestion.option_d
          },
          correct_answer: quizManagement.currentQuestion.correct_answer
        } : q
      ));
      
      setQuizManagement({ mode: null, currentQuestion: null });
    } catch (err) {
      setError("Failed to update question: " + err.response?.data?.error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/quiz/${id}`, {
        withCredentials: true
      });
      setQuestions(questions.filter(q => q.id !== id));
      
      // Reset to first question if we deleted the current question
      if (currentQuestion >= questions.length - 1) {
        setCurrentQuestion(Math.max(0, questions.length - 2));
      }
    } catch (err) {
      setError("Failed to delete question: " + err.response?.data?.error);
    }
  };

  // Quiz navigation
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers({});
    setShowScore(false);
    setSelectedOption(null);
    setShowAnswerFeedback(false);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setLoading(true);
    setQuizManagement({ mode: null, currentQuestion: null });
    setSelectedOption(null);
    setShowAnswerFeedback(false);
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="text-xl">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="text-xl text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[950px] bg-slate-900 text-white">
      <Header />
      <div className="flex justify-center items-start h-[calc(100vh-4rem)] pt-8">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center w-full max-w-4xl">
          {/* Category and Admin Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {["planets", "asteroids", "comets"].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded ${
                  category === cat
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
            
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    setShowResults(!showResults);
                    if (!showResults) fetchAllResults();
                  }}
                  className={`px-4 py-2 rounded ${
                    showResults ? "bg-purple-700" : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {showResults ? "Hide Results" : "View Results"}
                </button>
                {!quizManagement.mode && (
                  <button
                    onClick={() => setQuizManagement({ 
                      mode: 'add', 
                      currentQuestion: null 
                    })}
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                  >
                    Add Question
                  </button>
                )}
              </>
            )}
          </div>

          {/* Admin Results View */}
          {showResults && isAdmin && (
            <div className="mt-6 mb-8 w-full overflow-x-auto">
              <h3 className="text-xl font-bold mb-4">All Quiz Results</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-2 border">User</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Score</th>
                    <th className="p-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allResults.map((result, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}>
                      <td className="p-2 border">{result.username}</td>
                      <td className="p-2 border">{result.email}</td>
                      <td className="p-2 border">{result.category}</td>
                      <td className="p-2 border">{result.score}/{result.total}</td>
                      <td className="p-2 border">
                        {new Date(result.taken_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Quiz Question Management (Admin) */}
          {quizManagement.mode && (
            <div className="mt-6 mb-8 bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-4">
                {quizManagement.mode === 'add' ? 'Add New Question' : 'Edit Question'}
              </h3>
              <div className="space-y-4 text-left">
                <div>
                  <label className="block mb-1">Category</label>
                  <select
                    value={
                      quizManagement.currentQuestion?.category || newQuestion.category
                    }
                    onChange={(e) => 
                      quizManagement.mode === 'edit'
                        ? setQuizManagement({
                            ...quizManagement,
                            currentQuestion: {
                              ...quizManagement.currentQuestion,
                              category: e.target.value,
                              option_a: "",
                              option_b: "",
                              option_c: "",
                              option_d: ""
                            }
                          })
                        : setNewQuestion({
                            ...newQuestion,
                            category: e.target.value,
                            option_a: "",
                            option_b: "",
                            option_c: "",
                            option_d: ""
                          })
                    }
                    className="w-full p-2 rounded bg-gray-800"
                  >
                    <option value="planets">Planets</option>
                    <option value="asteroids">Asteroids</option>
                    <option value="comets">Comets</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1">Question</label>
                  <textarea
                    value={
                      quizManagement.currentQuestion?.question || newQuestion.question
                    }
                    onChange={(e) => 
                      quizManagement.mode === 'edit'
                        ? setQuizManagement({
                            ...quizManagement,
                            currentQuestion: {
                              ...quizManagement.currentQuestion,
                              question: e.target.value
                            }
                          })
                        : setNewQuestion({
                            ...newQuestion,
                            question: e.target.value
                          })
                    }
                    className="w-full p-2 rounded bg-gray-800"
                    rows="3"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {['a', 'b', 'c', 'd'].map((option) => (
                    <div key={option}>
                      <label className="block mb-1">Option {option.toUpperCase()}</label>
                      <input
                        type="text"
                        value={
                          quizManagement.currentQuestion?.[`option_${option}`] || 
                          newQuestion[`option_${option}`]
                        }
                        onChange={(e) => 
                          quizManagement.mode === 'edit'
                            ? setQuizManagement({
                                ...quizManagement,
                                currentQuestion: {
                                  ...quizManagement.currentQuestion,
                                  [`option_${option}`]: e.target.value
                                }
                              })
                            : setNewQuestion({
                                ...newQuestion,
                                [`option_${option}`]: e.target.value
                              })
                        }
                        className="w-full p-2 rounded bg-gray-800"
                      />
                    </div>
                  ))}
                </div>
                
                <div>
                  <label className="block mb-1">Correct Answer</label>
                  <select
                    value={
                      quizManagement.currentQuestion?.correct_answer || 
                      newQuestion.correct_answer
                    }
                    onChange={(e) => 
                      quizManagement.mode === 'edit'
                        ? setQuizManagement({
                            ...quizManagement,
                            currentQuestion: {
                              ...quizManagement.currentQuestion,
                              correct_answer: e.target.value
                            }
                          })
                        : setNewQuestion({
                            ...newQuestion,
                            correct_answer: e.target.value
                          })
                    }
                    className="w-full p-2 rounded bg-gray-800"
                  >
                    <option value="a">Option A</option>
                    <option value="b">Option B</option>
                    <option value="c">Option C</option>
                    <option value="d">Option D</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => 
                      quizManagement.mode === 'add' 
                        ? handleAddQuestion() 
                        : handleUpdateQuestion()
                    }
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    {quizManagement.mode === 'add' ? 'Add Question' : 'Update Question'}
                  </button>
                  <button
                    onClick={() => setQuizManagement({ mode: null, currentQuestion: null })}
                    className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Display */}
          {!quizManagement.mode && !showResults && (
            <>
              <h1 className="text-3xl font-bold mb-6">
                {category.charAt(0).toUpperCase() + category.slice(1)} Quiz
              </h1>

              {showScore ? (
                <div>
                  {userData && (
                    <div className="mb-6">
                      <h2 className="text-xl">Player: {userData.username}</h2>
                      <p className="text-gray-400">{userData.email}</p>
                    </div>
                  )}
                  <div className="mb-8">
                    <div
                      className="radial-progress text-blue-500 mx-auto"
                      style={{
                        "--value": (score / questions.length) * 100,
                        "--size": "8rem",
                      }}
                    >
                      {Math.round((score / questions.length) * 100)}%
                    </div>
                    <h2 className="text-2xl mt-4">
                      You scored {score} out of {questions.length}
                    </h2>
                  </div>
                  <button
                    onClick={restartQuiz}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Restart Quiz
                  </button>
                </div>
              ) : questions.length > 0 ? (
                <div>
                  <div className="flex justify-between mb-4">
                    <span>
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span>Score: {score}</span>
                  </div>
                  <p className="text-xl mb-6">{questions[currentQuestion].question}</p>
                  <ul className="space-y-4">
                    {Object.entries(questions[currentQuestion].options).map(([optionKey, optionText]) => (
                      <li key={optionKey}>
                        <button
                          onClick={() => handleAnswerClick(optionKey)}
                          disabled={showAnswerFeedback}
                          className={`text-white px-6 py-3 rounded-lg w-full transition text-left ${getOptionButtonStyle(optionKey)}`}
                        >
                          {optionText}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {isAdmin && (
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => setQuizManagement({ 
                          mode: 'edit', 
                          currentQuestion: {
                            id: questions[currentQuestion].id,
                            category: questions[currentQuestion].category,
                            question: questions[currentQuestion].question,
                            option_a: questions[currentQuestion].options.a,
                            option_b: questions[currentQuestion].options.b,
                            option_c: questions[currentQuestion].options.c,
                            option_d: questions[currentQuestion].options.d,
                            correct_answer: questions[currentQuestion].correct_answer
                          } 
                        })}
                        className="px-3 py-1 bg-yellow-600 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(questions[currentQuestion].id)}
                        className="px-3 py-1 bg-red-600 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xl">No questions available for this category.</p>
                  {isAdmin && (
                    <button
                      onClick={() => setQuizManagement({ mode: 'add', currentQuestion: null })}
                      className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                    >
                      Add First Question
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;






// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Header from "../components/header";

// const Quiz = () => {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [score, setScore] = useState(0);
//   const [showScore, setShowScore] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [category, setCategory] = useState("planets"); 
//   const navigate = useNavigate();

//   // Fetch questions from backend
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/quiz/${category}`
//         );
//         setQuestions(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load questions");
//         setLoading(false);
//       }
//     };

//     // Fetch user data
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/check-auth", {
//           withCredentials: true,
//         });
//         if (response.data.authenticated) {
//           setUserData(response.data.user);
//         } else {
//           navigate("/");
//         }
//       } catch (err) {
//         navigate("/");
//       }
//     };

//     fetchUserData();
//     fetchQuestions();
//   }, [category, navigate]);

//   const handleAnswerClick = async (selectedAnswer) => {
//     const isCorrect =
//       selectedAnswer ===
//       questions[currentQuestion][`option_${questions[currentQuestion].correct_answer}`];

//     if (isCorrect) {
//       setScore(score + 1);
//     }

//     const nextQuestion = currentQuestion + 1;
//     if (nextQuestion < questions.length) {
//       setCurrentQuestion(nextQuestion);
//     } else {
//       try {
//         // Submit final score to backend
//         await axios.post(
//           "http://localhost:5000/quiz/submit",
//           {
//             category,
//             answers: questions.reduce((acc, q, idx) => {
//               acc[q.id] = q.correct_answer;
//               return acc;
//             }, {}),
//           },
//           { withCredentials: true }
//         );
//         setShowScore(true);
//       } catch (err) {
//         setError("Failed to submit quiz results");
//       }
//     }
//   };

//   const restartQuiz = () => {
//     setCurrentQuestion(0);
//     setScore(0);
//     setShowScore(false);
//   };

//   const handleCategoryChange = (newCategory) => {
//     setCategory(newCategory);
//     setCurrentQuestion(0);
//     setScore(0);
//     setShowScore(false);
//     setLoading(true);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-900 text-white">
//         <Header />
//         <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
//           <div className="text-xl">Loading questions...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-slate-900 text-white">
//         <Header />
//         <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
//           <div className="text-xl text-red-500">{error}</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-900 text-white">
//       <Header />
//       <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
//         <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center w-full max-w-2xl">
//           <div className="flex justify-center space-x-4 mb-6">
//             {["planets", "asteroids", "comets"].map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => handleCategoryChange(cat)}
//                 className={`px-4 py-2 rounded ${
//                   category === cat
//                     ? "bg-blue-600"
//                     : "bg-gray-700 hover:bg-gray-600"
//                 }`}
//               >
//                 {cat.charAt(0).toUpperCase() + cat.slice(1)}
//               </button>
//             ))}
//           </div>

//           <h1 className="text-3xl font-bold mb-6">
//             {category.charAt(0).toUpperCase() + category.slice(1)} Quiz
//           </h1>

//           {showScore ? (
//             <div>
//               {userData && (
//                 <div className="mb-6">
//                   <h2 className="text-xl">Player: {userData.username}</h2>
//                   <p className="text-gray-400">{userData.email}</p>
//                 </div>
//               )}
//               <div className="mb-8">
//                 <div
//                   className="radial-progress text-blue-500 mx-auto"
//                   style={{
//                     "--value": (score / questions.length) * 100,
//                     "--size": "8rem",
//                   }}
//                 >
//                   {Math.round((score / questions.length) * 100)}%
//                 </div>
//                 <h2 className="text-2xl mt-4">
//                   You scored {score} out of {questions.length}
//                 </h2>
//               </div>
//               <button
//                 onClick={restartQuiz}
//                 className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
//               >
//                 Restart Quiz
//               </button>
//             </div>
//           ) : (
//             <div>
//               <div className="flex justify-between mb-4">
//                 <span>
//                   Question {currentQuestion + 1} of {questions.length}
//                 </span>
//                 <span>Score: {score}</span>
//               </div>
//               <p className="text-xl mb-6">{questions[currentQuestion].question}</p>
//               <ul className="space-y-4">
//                 {["a", "b", "c", "d"].map((option) => (
//                   <li key={option}>
//                     <button
//                       onClick={() =>
//                         handleAnswerClick(
//                           questions[currentQuestion][`option_${option}`]
//                         )
//                       }
//                       className="bg-gray-700 text-white px-6 py-3 rounded-lg w-full hover:bg-gray-600 transition text-left"
//                     >
//                       {questions[currentQuestion][`option_${option}`]}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Quiz;
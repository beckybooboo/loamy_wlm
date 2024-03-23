import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestions,
  updateAnswer,
  submitAnswers,
  clearError,
} from "../features/survey/surveySlice";
import Outcomes from "./Outcomes";
import Steps from "./Steps";
import { logout, acceptDisclaimer } from "../features/auth/authSlice";
import Question from "./Question";
import Disclaimer from "./static/Disclaimer";
import { useModal } from "../contexts/ModalContext";
import FullscreenLoader from "./FullscreenLoader";

function Survey() {
  const { showModal } = useModal();
  const dispatch = useDispatch();
  const { questions, loading, answers, error, surveyCompleted } = useSelector(
    (state) => state.survey
  );
  const { isAuthenticated, disclaimerAccepted } = useSelector(
    (state) => state.auth
  );

  // Manage selectedOption and currentQuestionIndex state locally since they're not necessary as global state
  const [selectedOption, setSelectedOption] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // This commented out code always shows the disclaimer for testing purposes
  // useEffect(() => {
  //   showModal({ content: <Disclaimer/>, buttonText: "Accept"});
  // }, [dispatch]);

  useEffect(() => {
    if (!disclaimerAccepted) {
      showModal({
        content: <Disclaimer />,
        onClose: () => dispatch(acceptDisclaimer()),
        buttonText: "Accept",
      });
    }
  }, [dispatch, showModal, disclaimerAccepted]);

  useEffect(() => {
    // Start the survey over whenever the surveyCompleted flag changes.
    setCurrentQuestionIndex(0);
  }, [dispatch, surveyCompleted]);

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchQuestions())
      .unwrap()
      .catch((error) => {
        console.error("Session expired. Redirecting to login...", error);
        dispatch(logout());
      });
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    // This will set the user's answer as the selected option whenever the question index changes
    const id = questions[currentQuestionIndex]?._id;
    let userAnswer = answers[id];
    setSelectedOption(userAnswer ? userAnswer : "");
  }, [answers, questions, currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];

  const handlePreviousQuestion = () => {
    const nextQuestionIndex = currentQuestionIndex - 1;
    if (selectedOption) {
      dispatch(
        updateAnswer({
          questionId: currentQuestion._id,
          answer: selectedOption,
        })
      );
    }

    if (nextQuestionIndex >= 0) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      //this should be unreachable
      showModal({ text: "Can't go back", title: "Alert" });
    }
  };

  const handleNextQuestion = () => {
    const answer = selectedOption || currentQuestion.defaultValue
    if (answer == null) {
      showModal({
          title: "Whoa there",
          text: "Please provide an answer before proceeding.",
        });
        return;
    }

    if (currentQuestion.expectedDataType === "numeric") {
      const { minValue, maxValue } = currentQuestion;
      // Convert answer to a number in case it's a string, and check if it's within range
      const numericAnswer = +answer; // Unary plus to ensure answer is treated as a number
    
      // Check if the minValue or maxValue is defined and if the answer is outside the range
      if ((minValue !== undefined && numericAnswer < minValue) ||
          (maxValue !== undefined && numericAnswer > maxValue)) {
        showModal({
          title: "Hang on!",
          text: `Your answer should be between ${minValue} and ${maxValue}`,
        });
        return;
      }
    }

    dispatch(
      updateAnswer({ questionId: currentQuestion._id, answer: answer })
    );
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      dispatch(submitAnswers());
    }
  };

  if (surveyCompleted) {
    return <Outcomes />;
  }

  if (loading) {
    return <FullscreenLoader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!questions || questions.length === 0) {
    return <div>Error: No questions to display</div>;
  }

  const speedRun = () => {
    // setIsSurveyCompleted(true);
  };

  // const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  // const sidebarItems = ["Home", "Profile", "Settings"];

  return (
    <div className="flex flex-col items-center justify-between min-h-90 overflow-auto p-4">
      {/* <button
        type="button"
        onClick={speedRun}
        className="mt-4 mb-8 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition duration-150 ease-in-out"
      >
        Go Fast
      </button> */}
      {/* <div className="overflow-auto mb-4 w-full flex flex-col items-center" style={{ maxHeight: '80vh' }}> */}
      {currentQuestion && (
        <Question
          question={currentQuestion}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      )}

      {/* </div> */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-base-100 border-t z-10">
        <div className="flex justify-center mt-4 mb-8">
          <div className="join grid grid-cols-2 gap-0 max-w-xs">
            <button
              onClick={handlePreviousQuestion}
              className="join-item btn btn-outline btn-neutral"
              disabled={currentQuestionIndex <= 0}
            >
              Back
            </button>
            <button
              onClick={handleNextQuestion}
              className="join-item btn btn-outline btn-neutral"
            >
              {currentQuestionIndex < questions.length - 1
                ? "Next"
                : "See Results"}
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-4 mb-8">
          <Steps
            currentStep={currentQuestionIndex + 1}
            totalSteps={questions.length}
          />
        </div>
      </div>
    </div>
  );
}

export default Survey;

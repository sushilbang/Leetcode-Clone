// components/Solution.jsx
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

const API_BASE_URL = 'http://localhost:5000';

const languageOptions = [
  { id: 54, name: "C++" },
  { id: 71, name: "Python" },
];

const Solution = ({ problemid }) => {
  const [solution, setSolution] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmission = async (event) => {
    event.preventDefault();
    
    if (!selectedLanguage) {
      setError("Please select a programming language.");
      return;
    }

    if (solution.trim() === "" && !selectedFile) {
      setError("Please enter a solution or upload a file.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("problemId", problemid);
    formData.append("languageId", selectedLanguage.id);
    
    if (selectedFile) {
      formData.append("codeFile", selectedFile);
    } else {
      formData.append("code", solution);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions/submit`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Submission failed: ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      setSubmissionResult(data);
      
      setSolution("");
      setSelectedFile(null);
      setSelectedLanguage(null);
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) setSolution("");
  };

  return (
    <div className="text-gray-700 p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Submit Your Solution</h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Language</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {selectedLanguage?.name || "Choose Programming Language"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {languageOptions.map((lang) => (
              <DropdownMenuItem
                key={lang.id}
                onSelect={() => setSelectedLanguage(lang)}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Your Solution</label>
        <textarea
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="10"
          placeholder="Enter your solution here..."
          value={solution}
          onChange={(e) => {
            setSolution(e.target.value);
            if (selectedFile) setSelectedFile(null);
          }}
          disabled={!!selectedFile}
        />
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <input
          type="file"
          id="codeFileUpload"
          className="hidden"
          onChange={handleFileChange}
          accept=".cpp,.py"
        />
        <label 
          htmlFor="codeFileUpload" 
          className="cursor-pointer bg-blue-50 text-blue-700 px-4 py-2 rounded-md border border-blue-300 hover:bg-blue-100"
        >
          Upload Code File
        </label>
        {selectedFile && (
          <span className="text-sm text-gray-600">{selectedFile.name}</span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmission}
        disabled={isSubmitting}
        className={`w-full py-3 rounded-md text-white font-bold ${
          isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Solution'}
      </button>

      {submissionResult && (
        <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-md">
          <h3 className="font-bold text-green-800 mb-2">Submission Results</h3>
          <div className="mb-2">
            <span className="font-semibold">Summary:</span> {submissionResult.summary}
          </div>
          
          {submissionResult.details?.map((testCase, index) => (
            <div key={index} className="mb-3 p-2 bg-white rounded border">
              <div className="font-medium">Test Case {index + 1}:</div>
              <div className={`text-sm ${testCase.passed ? 'text-green-600' : 'text-red-600'}`}>
                Status: {testCase.passed ? 'Passed' : 'Failed'}
              </div>
              {!testCase.passed && (
                <>
                  <div className="mt-1">
                    <span className="font-medium">Expected:</span>
                    <pre className="whitespace-pre-wrap">{testCase.expected_output}</pre>
                  </div>
                  <div className="mt-1">
                    <span className="font-medium">Received:</span>
                    <pre className="whitespace-pre-wrap">{testCase.actual_output}</pre>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Solution;
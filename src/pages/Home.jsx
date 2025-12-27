import React from "react";
import { useState } from "react";
import "./Home.css";
function HomePage() {
  const [formData, setformData] = useState({
    companyName: '',
    applyingAsA: "Fresher",
    coverLetterTone: "Formal",
    jobDescription: "",
    currentResume: ""
  })
  const [geminiResponse, setGeminiResponse] = useState("");
  async function handleGenerateData() {

    console.log("FormDATA:", formData)
    const prompt = ` You are a professional career coach and resume optimization expert. 
Your task is to generate a personalized cover letter, improve the resume content, 
and provide an ATS (Applicant Tracking System) analysis.

Inputs:
Company Name: ${formData.companyName}
Experience Level: ${formData.applyingAsA}  (Fresher / Experienced)
Job Description: ${formData.jobDescription}
Current Resume: ${formData.currentResume} (If empty, assume no resume exists and create a draft)
Preferred Tone: ${formData.coverLetterTone}

Output (format clearly in sections):

1. Tailored Cover Letter  
Write a professional cover letter addressed to ${formData.companyName}.  
Use the specified tone: ${formData.coverLetterTone}.  
Highlight relevant skills and experiences based on the job description.  

2. Updated Resume Content  
Suggest optimized resume summary, bullet points, and skills tailored to ${formData.jobDescription}.  
Ensure the content is concise, achievement-focused, and ATS-friendly.  

3. Keyword Match Analysis  
Extract the most important keywords from the job description.  
Check if they exist in the provided resume (if given).  
List missing keywords that should be added.  

4. ATS Score Estimate (0–100)  
Provide a rough ATS match score for the current resume against the job description.  
Explain the reasoning briefly (e.g., missing keywords, formatting issues, irrelevant content).  

Ensure the response is structured, clear, and easy to display in a React app.`;
  

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("Generated Gemini Data:", data.candidates[0].content.parts[0].text);
      setGeminiResponse(data.candidates[0].content.parts[0].text)
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h1 className="page-title">AI Resume Builder</h1>
        <p className="page-subtitle">Create a professional cover letter and optimize your resume in minutes</p>

        <form className="form-container">
          <div className="input-group">
            <label htmlFor="companyName" className="input-label">Company Name</label>
            <input
              type="text"
              id="companyName"
              className="input-field"
              value={formData.companyName}
              onChange={(e) => setformData({ ...formData, companyName: e.target.value })}
            />
            <div className="help-text">Enter the company you're applying to</div>
          </div>

          <div className="input-group">
            <label htmlFor="applyingAsA" className="input-label">Experience Level</label>
            <select
              id="applyingAsA"
              className="input-field"
              value={formData.applyingAsA}
              onChange={(e) => setformData({ ...formData, applyingAsA: e.target.value })}
            >
              <option value="Fresher">Fresher</option>
              <option value="Experienced">Experienced</option>
            </select>
            <div className="help-text">Select your experience level</div>
          </div>

          <div className="input-group">
            <label htmlFor="coverLetterTone" className="input-label">Cover Letter Tone</label>
            <select
              id="coverLetterTone"
              className="input-field"
              value={formData.coverLetterTone}
              onChange={(e) => setformData({ ...formData, coverLetterTone: e.target.value })}
            >
              <option value="Formal">Formal</option>
              <option value="Informal">Informal</option>
              <option value="casual">Casual</option>
            </select>
            <div className="help-text">Choose the writing style for your cover letter</div>
          </div>

          <div className="input-group">
            <label htmlFor="jobDescription" className="input-label">Job Description</label>
            <textarea
              id="jobDescription"
              className="input-field textarea-field"
              value={formData.jobDescription}
              onChange={(e) => setformData({ ...formData, jobDescription: e.target.value })}
            />
            <div className="help-text">Paste the job description here</div>
          </div>

          <div className="input-group">
            <label htmlFor="currentResume" className="input-label">Current Resume</label>
            <textarea
              id="currentResume"
              className="input-field textarea-field"
              value={formData.currentResume}
              onChange={(e) => setformData({ ...formData, currentResume: e.target.value })}
            />
            <div className="help-text">Paste your current resume content here</div>
          </div>

          <button type="button" className="submit-button" onClick={handleGenerateData}>
            Generate Cover Letter
          </button>
        </form>
        <h1>Response from Gemini:</h1>
        {geminiResponse && (
          <div className="response-section">
            <h2 className="response-title">Generated Content</h2>
            <div className="response-content">
              {(() => {
                const sectionRegex = /\n?\s*(\d+\.)\s+([A-Za-z ]+?)\s*\n/gs;
                const parts = [];
                let lastIndex = 0;
                let match;
                let idx = 0;

                while ((match = sectionRegex.exec(geminiResponse)) !== null) {
                  if (match.index > lastIndex) {
                    const intro = geminiResponse.slice(lastIndex, match.index).trim();
                    if (intro) parts.push(<div key={"intro-" + idx} className="section-content">{intro}</div>);
                  }

                  const sectionTitle = match[2].trim();
                  const nextMatch = sectionRegex.exec(geminiResponse);
                  let sectionContent;

                  if (nextMatch) {
                    sectionContent = geminiResponse.slice(match.index + match[0].length, nextMatch.index).trim();
                    sectionRegex.lastIndex = nextMatch.index;
                  } else {
                    sectionContent = geminiResponse.slice(match.index + match[0].length).trim();
                  }

                  parts.push(
                    <div key={sectionTitle + idx} className="section-card">
                      <h3 className="section-title">{match[1]} {sectionTitle}</h3>
                      <div className="section-content">
                        {sectionContent.split(/\n{2,}/).map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </div>
                  );

                  idx++;
                  if (!nextMatch) break;
                }

                if (parts.length === 0) {
                  return <pre className="section-content">{geminiResponse}</pre>;
                }

                return parts;
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default HomePage

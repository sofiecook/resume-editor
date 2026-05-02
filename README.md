# Resume Editor

A small Next.js application for AI-powered resume tailoring. Upload a `.docx` resume, paste the job description, and the app uses a configured AI model to generate a job-specific version of your resume.

## What this app does

- Accepts a resume file in `.docx` format
- Lets you paste a target job description or posting
- Supports optional extra details like skills, projects, and bio
- Sends the resume and job data to the backend API
- Streams back a tailored resume in markdown format
- Lets you preview, copy, or download the generated resume

## How to use it

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app in your browser:

```text
http://localhost:3000
```

4. In the app:

- Upload your resume file (`.docx` only)
- Paste the job description into the text area
- Optionally add extra skills, projects, or a bio
- Click **Generate Tailored Resume**
- Review the generated markdown output
- Copy the content or download it as `tailored-resume.md`

## Notes

- The app is built with Next.js, React, Tailwind CSS, and AI model integration
- The generated output is shown as formatted markdown and plain markdown
- If the resume upload or job description is missing, the app will show an error message

## Available scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm start` - run the production build
- `npm run lint` - run ESLint checks


